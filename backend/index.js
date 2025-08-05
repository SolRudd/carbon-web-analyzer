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
const app  = express();
const PORT = Number(process.env.PORT) || 8080;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// --- MIDDLEWARE & SECURITY ---
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json());

// --- RATE LIMITS ---
const limiterCheck = rateLimit({ windowMs: 24 * 60 * 60 * 1000, max: 20, message: { error: 'Daily check limit reached.' } });
const limiterBadge = rateLimit({ windowMs: 60 * 1000, max: 60, message: { error: 'Too many badge loads.' } });
const limiterTraceOrCheck = rateLimit({ windowMs: 60 * 1000, max: 12, message: { error: 'Too many requests.' } });

// --- CORS ---
const badgeCors = cors({ origin: '*', methods: ['GET'], allowedHeaders: ['Content-Type'] });
const ALLOWED = [
  'http://localhost:5173', 'https://greentracer.org', 'https://www.greentracer.org',
  'https://greentracer-frontend.vercel.app', /^https:\/\/greentracer-frontend-.*\.vercel\.app$/,
  'https://buzzboost.co.uk', /^https:\/\/.*\.buzzboost\.co\.uk$/
];
function dynamicCORS(origin, cb) {
  if (!origin || ALLOWED.some(rule => typeof rule === 'string' ? rule === origin : rule.test(origin))) {
    return cb(null, true);
  }
  cb(new Error(`Blocked CORS origin: ${origin}`));
}

// --- TTL FOR CACHE ---
const TTL = process.env.DEBUG_TTL_ZERO ? 0 : 24 * 60 * 60 * 1000;

// --- HELPER FUNCTIONS ---
function slugify(site) {
  try {
    const u = new URL(site.startsWith('http') ? site : `https://${site}`);
    const originAndPath = u.origin + u.pathname.replace(/\/+$/, '');
    const out = new URL(originAndPath);
    return (out.hostname + out.pathname)
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .replace(/-+$/, '');
  } catch {
    return String(site)
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+$/, '');
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
  return Math.round(
    Math.max(0, Math.min(100, (max - Math.min(carbon, max)) / max * 100))
  );
}
function totalGreenReductionPct() {
  const KWH_PER_GB_DATACENTER = 0.060, KWH_PER_GB_NETWORK = 0.014, KWH_PER_GB_USER = 0.123;
  const total = KWH_PER_GB_DATACENTER + KWH_PER_GB_NETWORK + KWH_PER_GB_USER;
  const dcShare = KWH_PER_GB_DATACENTER / total;
  return Math.round(0.25 * dcShare * 100);
}
function calcCO2(sizeMB, isGreenDC) {
  const KWH_PER_GB_DATACENTER = 0.060, KWH_PER_GB_NETWORK = 0.014, KWH_PER_GB_USER = 0.123;
  const GRID_INTENSITY = 442;
  const sizeGB = sizeMB / 1024;
  let dc = sizeGB * KWH_PER_GB_DATACENTER;
  if (isGreenDC) dc *= 0.75;
  const kWh = dc + sizeGB * KWH_PER_GB_NETWORK + sizeGB * KWH_PER_GB_USER;
  const grams = kWh * GRID_INTENSITY;
  if (grams < 0.01) return +grams.toPrecision(2);
  if (grams < 1) return +grams.toFixed(3);
  return +grams.toFixed(2);
}
async function runPSI(url, strategy, apiKey) {
  const api =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&strategy=${strategy}&category=performance&key=${apiKey}`;
  const r = await axios.get(api, { timeout: 30000 });
  const lr = r.data.lighthouseResult;
  const bytesAudit = lr?.audits?.['total-byte-weight']?.numericValue || 0;
  const items = lr?.audits?.['resource-summary']?.details?.items || [];
  const sumTransfers = items.reduce((s, it) => s + (it.transferSize || 0), 0);
  const totalBytes = Math.max(bytesAudit, sumTransfers);
  const finalUrl = lr.finalDisplayedUrl || lr.finalUrl || lr.requestedUrl || url;
  console.log(`[fetchSize] ${strategy} OK: ${totalBytes} bytes | final=${finalUrl}`);
  return { bytes: totalBytes, finalUrl };
}
async function fetchSize(url) {
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    console.error(
      '[ERROR] PAGESPEED_API_KEY not set; using fallback 1.7 MB.'
    );
    return { bytes: 1.7 * 1024 * 1024, finalUrl: url };
  }
  try {
    const [desk, mobi] = await Promise.allSettled([
      runPSI(url, 'desktop', apiKey),
      runPSI(url, 'mobile', apiKey),
    ]);
    let best = desk.status === 'fulfilled' ? desk.value : null;
    if (mobi.status === 'fulfilled' && (!best || mobi.value.bytes > best.bytes)) {
      best = mobi.value;
    }
    if (best) return best;
    throw new Error('Both PSI strategies failed');
  } catch (err) {
    console.error('[fetchSize] PSI FAILED for', url, '-', err.message);
    const estMB = await htmlOnlyEstimateMB(url);
    console.warn(`[fetchSize] using HTML-only estimate: ${estMB.toFixed(3)} MB`);
    return { bytes: estMB * 1024 * 1024, finalUrl: url };
  }
}
async function checkGreen(host) {
  try {
    const { data } = await axios.get(
      `https://api.thegreenwebfoundation.org/greencheck/${host}`
    );
    return !!data.green;
  } catch {
    return false;
  }
}

// DATABASE FUNCTIONS
async function getCached(slug) {
  const s = slug.toLowerCase().replace(/-+$/, '');
  const { data: row, error } = await supabase
    .from('results')
    .select('*')
    .eq('slug', s)
    .single();
  if (error || !row) return null;
  if (TTL !== 0 && Date.now() - new Date(row.created_at) > TTL) return null;
  return { ...row, greenHost: !!row.green_host };
}
async function performCarbonCheck(url) {
  const norm = url.startsWith('http') ? url : `https://${url}`;
  const host = new URL(norm).hostname;
  const [green, sizeInfo] = await Promise.all([checkGreen(host), fetchSize(norm)]);
  const sizeMB = (sizeInfo.bytes || 0) / (1024 * 1024);
  const measuredUrl = sizeInfo.finalUrl || norm;
  console.log(`[check-carbon] green=${green} sizeMB=${sizeMB.toFixed(3)} url=${measuredUrl}`);
  const carbon = calcCO2(sizeMB, green);
  const pct = percentileFromCarbon(carbon);
  const reductionPct = green ? totalGreenReductionPct() : 0;
  const slug = slugify(measuredUrl);
  const grade = gradeFor(carbon);
  // Upsert into Supabase
  const { data: row, error } = await supabase
    .from('results')
    .upsert({
      slug: slug,
      url: measuredUrl,
      green_host: green,
      carbon_estimate: carbon,
      grade: grade,
      percentile: pct,
      reduction_pct: reductionPct,
      result_data: { sizeInfo }
    }, { onConflict: 'slug' })
    .select()
    .single();
  if (error) throw error;
  // Return camelCase keys for the frontend
  return {
    slug: row.slug,
    url: row.url,
    greenHost: !!row.green_host,
    sizeMB: +row.carbon_estimate, // optional, if you want to surface
    carbonEstimate: +row.carbon_estimate,
    grade: row.grade,
    percentile: +row.percentile,
    reductionPct: +row.reduction_pct,
    resultData: row.result_data,
    timestamp: new Date(row.created_at).getTime()
  };
}
    )
    .select()
    .single();
  if (error) throw error;
  return { ...data, greenHost: !!data.green_host };
}

// --- Badge and Public API Routes ---
app.use(
  '/greentrace-badge.js',
  badgeCors,
  limiterBadge,
  express.static(path.join(__dirname, 'public', 'greentrace-badge.js'))
);

app.get(
  '/api/trace-or-check',
  badgeCors,
  limiterTraceOrCheck,
  async (req, res) => {
    const site = req.query.site;
    if (!site) return res.status(400).json({ error: 'Missing site.' });
    try {
      const cached = await getCached(slugify(site));
      if (cached) return res.json(cached);
      const freshResult = await performCarbonCheck(site);
      res.json(freshResult);
    } catch (e) {
      console.error('[trace-or-check] failed:', e.message);
      res.status(500).json({ error: 'Trace failed' });
    }
  }
);

// --- Main App Routes (with global CORS) ---
app.use(
  cors({ origin: dynamicCORS, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'X-API-Key'] })
);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/healthz', (_req, res) => res.send('OK'));

app.post(
  '/api/check-carbon',
  limiterCheck,
  async (req, res) => {
    try {
      const result = await performCarbonCheck(req.body.url);
      res.json(result);
    } catch (err) {
      console.error('[/api/check-carbon] failed:', err.message);
      res.status(500).json({ error: 'Failed to perform carbon check.' });
    }
  }
);

app.get('/api/results/:slug', async (req, res) => {
  const row = await getCached(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Results not found' });
  res.json(row);
});

// --- 404 & Global Error Handler ---
app.use((_, res) => res.status(404).json({ error: 'Endpoint not found' }));
app.use((err, _, res) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// --- Start Server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GreenTrace API listening on port ${PORT}`);
  if (TTL === 0) console.log('🧪 TTL=0 (no cache) for testing');
});
