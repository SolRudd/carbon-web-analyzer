'use strict';
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// --- INITIALIZATION ---
const app = express();
const PORT = Number(process.env.PORT) || 8080;
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// --- MIDDLEWARE & SECURITY ---
app.set('trust proxy', 1);
app.use(
  helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })
);
app.use(express.json());

// --- RATE LIMITS ---
const limiterCheck = rateLimit({ windowMs: 24 * 60 * 60 * 1000, max: 20 });
const limiterBadge = rateLimit({ windowMs: 60 * 1000, max: 60 });
const limiterTraceOrCheck = rateLimit({ windowMs: 60 * 1000, max: 12 });

// --- CORS ---
const badgeCors = cors({ origin: '*', methods: ['GET'] });
const ALLOWED = [
  'http://localhost:5173',
  'https://greentracer.org',
  'https://www.greentracer.org',
  /^https?:\/\/.*\.vercel\.app$/,
  'https://buzzboost.co.uk'
];
function dynamicCORS(origin, cb) {
  if (!origin || ALLOWED.some(r => (typeof r === 'string' ? r === origin : r.test(origin)))) {
    cb(null, true);
  } else {
    cb(new Error(`Blocked CORS origin: ${origin}`));
  }
}

// --- TTL FOR CACHE ---
const TTL = process.env.DEBUG_TTL_ZERO ? 0 : 24 * 60 * 60 * 1000;

// --- HELPER FUNCTIONS ---
function slugify(site) {
  try {
    const u = new URL(site.startsWith('http') ? site : `https://${site}`);
    const cleaned = u.origin + u.pathname.replace(/\/+$/, '');
    const full = new URL(cleaned);
    return (full.hostname + full.pathname)
      .replace(/[^a-z0-9]/gi, '-').toLowerCase().replace(/-+$/, '');
  } catch {
    return String(site).toLowerCase().replace(/[^a-z0-9]/gi, '-').replace(/-+$/, '');
  }
}
function gradeFor(c) {
  if (c <= 0.095) return 'A+';
  if (c <= 0.186) return 'A';
  if (c <= 0.341) return 'B';
  if (c <= 0.493) return 'C';
  if (c <= 0.656) return 'D';
  if (c <= 0.846) return 'E';
  return 'F';
}
function percentileFromCarbon(carbon) {
  const max = 0.846;
  return Math.round(Math.max(0, Math.min(100, ((max - Math.min(carbon, max)) / max) * 100)));
}
function totalGreenReductionPct() {
  const D = 0.06, N = 0.014, U = 0.123;
  const share = D / (D + N + U);
  return Math.round(share * 25);
}
function calcCO2(sizeMB, isGreen) {
  const D = 0.06, N = 0.014, U = 0.123, I = 442;
  const gb = sizeMB / 1024;
  let dc = gb * D * (isGreen ? 0.75 : 1);
  const kwh = dc + gb * N + gb * U;
  const grams = kwh * I;
  if (grams < 0.01) return +grams.toPrecision(2);
  if (grams < 1) return +grams.toFixed(3);
  return +grams.toFixed(2);
}
async function htmlOnlyEstimateMB(url) {
  try {
    const res = await axios.get(url, { timeout: 12000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const bytes = Buffer.byteLength(res.data || '', 'utf8');
    const est = Math.max(bytes * 7, bytes + 80 * 1024);
    return est / (1024 * 1024);
  } catch {
    return 1.7;
  }
}
async function runPSI(url, strat, key) {
  const api =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(url)}` +
    `&strategy=${strat}&category=performance&key=${key}`;
  const r = await axios.get(api, { timeout: 30000 });
  const lr = r.data.lighthouseResult;
  const byteAudit = lr.audits['total-byte-weight']?.numericValue || 0;
  const items = lr.audits['resource-summary']?.details?.items || [];
  const total = Math.max(byteAudit, items.reduce((s, i) => s + (i.transferSize || 0), 0));
  return { bytes: total, finalUrl: lr.finalDisplayedUrl || url };
}
async function fetchSize(url) {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) return { bytes: await htmlOnlyEstimateMB(url) * 1024 * 1024, finalUrl: url };
  try {
    const [d, m] = await Promise.allSettled([runPSI(url, 'desktop', key), runPSI(url, 'mobile', key)]);
    let best = d.status === 'fulfilled' ? d.value : null;
    if (m.status === 'fulfilled' && (!best || m.value.bytes > best.bytes)) best = m.value;
    return best;
  } catch {
    return { bytes: await htmlOnlyEstimateMB(url) * 1024 * 1024, finalUrl: url };
  }
}
async function checkGreen(h) {
  try {
    const { data } = await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${h}`, { timeout: 8000 });
    return !!data.green;
  } catch {
    return false;
  }
}

// --- DATABASE FUNCTIONS ---
async function getCached(slug) {
  const s = slug.toLowerCase().replace(/-+$/, '');
  const { data: row } = await supabase.from('results').select('*').eq('slug', s).single();
  if (!row) return null;
  if (TTL !== 0 && Date.now() - new Date(row.created_at).getTime() > TTL) return null;
  return { ...row, greenHost: !!row.green_host };
}
async function performCarbonCheck(url) {
  const norm = url.startsWith('http') ? url : `https://${url}`;
  const host = new URL(norm).hostname;
  const [green, size] = await Promise.all([checkGreen(host), fetchSize(norm)]);
  const mb = size.bytes / (1024 * 1024);
  const co2 = calcCO2(mb, green);
  const pct = percentileFromCarbon(co2);
  const red = green ? totalGreenReductionPct() : 0;
  const slug = slugify(size.finalUrl || norm);
  const grade = gradeFor(co2);
  const { data: row } = await supabase.from('results').upsert(
    { slug, url: size.finalUrl || norm, green_host: green, carbon_estimate: co2, grade, percentile: pct, reduction_pct: red, result_data: { size } },
    { onConflict: 'slug' }
  ).select().single();
  return {
    slug: row.slug,
    url: row.url,
    greenHost: !!row.green_host,
    carbonEstimate: +row.carbon_estimate,
    grade: row.grade,
    percentile: +row.percentile,
    reductionPct: +row.reduction_pct,
    timestamp: new Date(row.created_at).getTime(),
  };
}

// --- PUBLIC & BADGE ROUTES ---
app.use('/greentrace-badge.js', badgeCors, limiterBadge, express.static(path.join(__dirname, 'public', 'greentrace-badge.js')));
app.get('/api/trace', badgeCors, limiterBadge, async (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error: 'Missing site.' });
  const cached = await getCached(slugify(site));
  if (!cached) return res.status(404).json({ error: 'No data—run a check first.' });
  res.json(cached);
});
app.get('/api/trace-or-check', badgeCors, limiterTraceOrCheck, async (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error: 'Missing site.' });
  const cached = await getCached(slugify(site));
  if (cached) return res.json(cached);
  const fresh = await performCarbonCheck(site);
  res.json(fresh);
});

// --- MAIN API ROUTES ---
app.use(cors({ origin: dynamicCORS, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/healthz', (_, res) => res.send('OK'));
app.post('/api/check-carbon', limiterCheck, async (req, res) => {
  if (!req.body.url) return res.status(400).json({ error: 'Missing URL' });
  try {
    const result = await performCarbonCheck(req.body.url);
    res.json(result);
  } catch (err) {
    console.error('[/api/check-carbon] failed:', err.message);
    res.status(500).json({ error: 'Failed to perform carbon check.' });
  }
});
app.get('/api/results/:slug', async (req, res) => {
  const row = await getCached(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Results not found' });
  res.json(row);
});

// --- FALLBACKS & ERROR HANDLING ---
app.use((_, res) => res.status(404).json({ error: 'Endpoint not found' }));
app.use((err, _, res) => { console.error(err); res.status(500).json({ error: 'Server error' }); });

// --- START SERVER ---
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 GreenTrace API listening on port ${PORT}`));
