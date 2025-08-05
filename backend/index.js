'use strict';
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js'); // Use Supabase client

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// --- Supabase setup (replaces better-sqlite3) ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/* ───────────── Trust proxy / security ───────────── */
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json());

/* ───────────── Rate limits ───────────── */
const limiterCheck = rateLimit({ windowMs: 24 * 60 * 60 * 1000, max: 20 });
const limiterBadge = rateLimit({ windowMs: 60 * 1000, max: 60 });
const limiterTraceOrCheck = rateLimit({ windowMs: 60 * 1000, max: 12 });

/* ───────────── Badge endpoints (open CORS) ───────────── */
const badgeCors = cors({ origin: '*', methods: ['GET'] });

app.get('/greentrace-badge.js', badgeCors, limiterBadge, (req, res) => {
  res.type('application/javascript');
  res.set('Cache-Control', 'public,max-age=3600');
  res.sendFile(path.join(__dirname, 'public', 'greentrace-badge.js'));
});

app.get('/api/trace', badgeCors, limiterBadge, async (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error: 'Missing site.' });
  const row = await getCached(slugify(site));
  if (!row) return res.status(404).json({ error: 'No data—run a check first.' });
  res.json(row);
});

app.get('/api/trace-or-check', badgeCors, limiterTraceOrCheck, async (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error: 'Missing site.' });
  
  const norm = site.startsWith('http') ? site : `https://${site}`;
  let host;
  try { host = new URL(norm).hostname; } 
  catch { return res.status(400).json({ error: 'Bad URL.' }); }

  const cached = await getCached(slugify(norm));
  if (cached) return res.json(cached);

  try {
    const [green, sizeInfo] = await Promise.all([checkGreen(host), fetchSize(norm)]);
    const sizeMB = (sizeInfo.bytes || 0) / (1024 * 1024);
    const measuredUrl = sizeInfo.finalUrl || norm;
    const carbon = calcCO2(sizeMB, green);
    const pct = percentileFromCarbon(carbon);
    const reductionPct = green ? totalGreenReductionPct() : 0;
    const slug = slugify(measuredUrl);
    const grade = gradeFor(carbon);

    // Use Supabase to save the data
    const { error } = await supabase.from('results').upsert({
      slug: slug,
      url: measuredUrl,
      green_host: green, // Supabase columns use snake_case
      size_mb: sizeMB,
      carbon_estimate: carbon,
      percentile: pct,
      reduction_pct: reductionPct,
      grade: grade,
      // Supabase handles the timestamp automatically with `created_at`
    });

    if (error) throw new Error(`Supabase save error: ${error.message}`);

    // Return the data in the consistent format
    return res.json({ slug, url: measuredUrl, greenHost: green, sizeMB, carbonEstimate: carbon, percentile: pct, reductionPct, grade });
  } catch (e) {
    console.error('[trace-or-check] failed:', e.message);
    return res.status(500).json({ error: 'Trace failed' });
  }
});

/* ───────────── Global CORS for the rest ───────────── */
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
app.use(cors({ origin: dynamicCORS, methods: ['GET', 'POST'] }));

/* ───────────── Static + health ───────────── */
app.use(express.static(path.join(__dirname, 'public')));
app.get('/healthz', (_req, res) => res.send('OK'));

/* ───────────── DB setup is now handled by Supabase, so the old code is removed ───────────── */
const TTL = process.env.DEBUG_TTL_ZERO ? 0 : 24 * 60 * 60 * 1000;

/* ───────────── Helpers (Your trusted logic is unchanged) ───────────── */
function slugify(site) {
    // ... your trusted slugify logic ...
    try {
        const u = new URL(site.startsWith('http') ? site : `https://${site}`);
        const originAndPath = u.origin + u.pathname.replace(/\/+$/, '');
        const out = new URL(originAndPath);
        return (out.hostname + out.pathname).replace(/[^a-z0-9]/gi,'-').toLowerCase().replace(/-+$/,'');
    } catch {
        return String(site).toLowerCase().replace(/[^a-z0-9]/gi,'-').replace(/-+$/,'');
    }
}

async function getCached(slug) {
  const s = String(slug || '').toLowerCase().replace(/-+$/, '');
  
  // Use Supabase to get the data
  const { data: row, error } = await supabase.from('results').select('*').eq('slug', s).single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means "not found", which is okay
    console.error('Get cached error:', error.message);
    return null;
  }
  if (!row) return null;

  // Your TTL logic is the same
  const timestamp = new Date(row.created_at).getTime(); // Use Supabase's 'created_at'
  if (TTL !== 0 && Date.now() - timestamp > TTL) return null;

  // Return data in the consistent format the frontend expects
  return {
    slug: row.slug,
    url: row.url,
    greenHost: !!row.green_host,
    sizeMB: +row.size_mb,
    carbonEstimate: +row.carbon_estimate,
    percentile: +row.percentile,
    reductionPct: +row.reduction_pct,
    grade: row.grade,
    timestamp: timestamp,
  };
}

function gradeFor(c) { /* ... your trusted logic ... */ return c <= 0.095 ? 'A+' : c <= 0.186 ? 'A' : c <= 0.341 ? 'B' : c <= 0.493 ? 'C' : c <= 0.656 ? 'D' : c <= 0.846 ? 'E' : 'F'; }
function percentileFromCarbon(carbon) { /* ... your trusted logic ... */ const max=0.846;return Math.round(Math.max(0,Math.min(100,(max-Math.min(carbon,max))/max*100))) }
function totalGreenReductionPct() { /* ... your trusted logic ... */ const D=0.06,N=0.014,U=0.123;const s=D/(D+N+U);return Math.round(s*25) }
function calcCO2(sizeMB, isGreenDC) { /* ... your trusted logic ... */ const D=0.06,N=0.014,U=0.123,I=442;const G=sizeMB/1024;let d=G*D;if(isGreenDC)d*=0.75;const k=d+G*N+G*U;const g=k*I;return g<0.01?+g.toPrecision(2):g<1?+g.toFixed(3):+g.toFixed(2) }

async function runPSI(url, strategy, apiKey) { /* ... your trusted logic ... */ const a=`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&key=${apiKey}`;const r=await axios.get(a,{timeout:30000});const l=r.data.lighthouseResult;const b=l?.audits?.['total-byte-weight']?.numericValue??0;const i=l?.audits?.['resource-summary']?.details?.items||[];const t=i.reduce((s,it)=>s+(it.transferSize||0),0);const B=Math.max(b,t);const f=l?.finalDisplayedUrl||l?.finalUrl||url;return{bytes:B,finalUrl:f} }
async function htmlOnlyEstimateMB(url) { /* ... your trusted logic ... */ try{const r=await axios.get(url,{timeout:12000,headers:{'User-Agent':'Mozilla/5.0'}});const b=Buffer.byteLength(r.data||'','utf8');const e=Math.max(b*7,b+80*1024);return e/(1024*1024)}catch{return 1.7} }

async function fetchSize(url) {
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    console.error('[ERROR] PAGESPEED_API_KEY not set; using fallback 1.7 MB.');
    return { bytes: 1.7 * 1024 * 1024, finalUrl: url };
  }
  try {
    const [desk, mobi] = await Promise.allSettled([
      runPSI(url, 'desktop', apiKey),
      runPSI(url, 'mobile', apiKey),
    ]);
    let best = null;
    if (desk.status === 'fulfilled') best = desk.value;
    if (mobi.status === 'fulfilled' && (!best || mobi.value.bytes > best.bytes)) {
      best = mobi.value;
    }
    if (best) return best;
    throw new Error('Both PSI strategies failed');
  } catch (err) {
    console.error('[fetchSize] PSI FAILED for', url, '-', err.response?.data?.error?.message || err.message);
    const estMB = await htmlOnlyEstimateMB(url);
    console.warn(`[fetchSize] using HTML-only estimate: ${estMB.toFixed(3)} MB`);
    return { bytes: estMB * 1024 * 1024, finalUrl: url };
  }
}

async function checkGreen(host) { /* ... your trusted logic ... */ try{const{data}=await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${host}`,{timeout:8000});return!!data.green}catch{return false} }

/* ───────────── Main: full check (manual) ───────────── */
app.post('/api/check-carbon', limiterCheck, async (req, res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error:'Missing URL.' });

  const norm = site.startsWith('http') ? site : `https://${site}`;
  let host; try { host = new URL(norm).hostname; } catch { return res.status(400).json({ error:'Bad URL.' }); }

  try {
    const [ green, sizeInfo ] = await Promise.all([ checkGreen(host), fetchSize(norm) ]);
    const sizeMB = (sizeInfo.bytes || 0) / (1024*1024);
    const measuredUrl = sizeInfo.finalUrl || norm;
    const carbon = calcCO2(sizeMB, green);
    const pct = percentileFromCarbon(carbon);
    const reductionPct = green ? totalGreenReductionPct() : 0;
    const slug = slugify(measuredUrl);
    const grade = gradeFor(carbon);
    
    // Use Supabase to save the data
    const { error } = await supabase.from('results').upsert({
      slug: slug, url: measuredUrl, green_host: green, size_mb: sizeMB, carbon_estimate: carbon, percentile: pct, reduction_pct: reductionPct, grade: grade
    });

    if (error) throw new Error(`Supabase save error: ${error.message}`);
    
    res.json({ slug, url: measuredUrl, greenHost: green, sizeMB, carbonEstimate: carbon, percentile: pct, reductionPct, grade });
  } catch (err) {
    console.error('[/api/check-carbon] failed:', err.message);
    res.status(500).json({ error: 'Failed to perform carbon check.' });
  }
});

/* ───────────── Results by slug ───────────── */
app.get('/api/results/:slug', async (req, res) => {
  const s = String(req.params.slug || '').toLowerCase().replace(/-+$/,'');
  const row = await getCached(s);
  if (!row) return res.status(404).json({ error:'Results not found' });
  res.json(row);
});

/* ───────────── 404 & errors ───────────── */
app.use((_,res) => res.status(404).json({ error:'Endpoint not found' }));
app.use((err, _,res,__) => {
  console.error(err);
  res.status(500).json({ error:'Server error' });
});

/* ───────────── Start ───────────── */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GreenTrace API listening on port ${PORT}`);
});