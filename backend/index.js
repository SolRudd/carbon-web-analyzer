'use strict';
require('dotenv').config();

const fs        = require('fs');
const path      = require('path');
const express   = require('express');
const helmet    = require('helmet');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const axios     = require('axios');
const Database  = require('better-sqlite3');

const app  = express();
const PORT = Number(process.env.PORT) || 8080;

/* ───────────── Trust proxy / security ───────────── */
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json());

/* ───────────── Rate limits ───────────── */
const limiterCheck = rateLimit({
  windowMs: 24*60*60*1000, max: 20,
  message: { error: 'Daily check limit reached.' }
});
const limiterBadge = rateLimit({
  windowMs: 60*1000, max: 60,
  message: { error: 'Too many badge loads.' }
});
const limiterTraceOrCheck = rateLimit({
  windowMs: 60*1000, max: 12,
  message: { error: 'Too many requests.' }
});

/* ───────────── Badge endpoints (open CORS) ───────────── */
const badgeCors = cors({ origin: '*', methods: ['GET'], allowedHeaders: ['Content-Type'] });

app.get('/greentrace-badge.js', badgeCors, limiterBadge, (req, res) => {
  res.type('application/javascript');
  res.set('Cross-Origin-Resource-Policy','cross-origin');
  res.set('Cache-Control','public,max-age=3600');
  res.sendFile(path.join(__dirname,'public','greentrace-badge.js'));
});

/* Cached lookup for embeds (404 if not checked yet) */
app.get('/api/trace', badgeCors, limiterBadge, (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Missing site.' });
  const slug = slugify(site);
  const row  = getCached(slug);
  if (!row) return res.status(404).json({ error:'No data—run a check first.' });
  res.json(row);
});

/* Auto-check if no cache (makes embeds “just work”) */
app.get('/api/trace-or-check', badgeCors, limiterTraceOrCheck, async (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error: 'Missing site.' });

  const norm = site.startsWith('http') ? site : `https://${site}`;
  let host;
  try { host = new URL(norm).hostname; }
  catch { return res.status(400).json({ error:'Bad URL.' }); }

  const cached = getCached(slugify(norm));
  if (cached) return res.json(cached);

  try {
    const [ green, sizeInfo ] = await Promise.all([ checkGreen(host), fetchSize(norm) ]);
    const sizeMB      = (sizeInfo.bytes || 0) / (1024*1024);
    const measuredUrl = sizeInfo.finalUrl || norm;

    const carbon       = calcCO2(sizeMB, green);
    const pct          = percentileFromCarbon(carbon);
    const reductionPct = green ? totalGreenReductionPct() : 0; // overall ≈ 8%
    const slug         = slugify(measuredUrl);
    const grade        = gradeFor(carbon);

    db.prepare(`
      INSERT OR REPLACE INTO results
        (slug, url, greenHost, sizeMB, carbonEstimate, percentile, reductionPct, grade, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      slug, measuredUrl, green ? 1 : 0, sizeMB, carbon, pct, reductionPct, grade, Date.now()
    );

    return res.json({ slug, url: measuredUrl, greenHost: green, sizeMB, carbonEstimate: carbon, percentile: pct, reductionPct, grade });
  } catch (e) {
    console.error('[trace-or-check] failed:', e.response?.data?.error?.message || e.message);
    return res.status(500).json({ error:'Trace failed' });
  }
});

/* ───────────── Global CORS for the rest ───────────── */
const ALLOWED = [
  'http://localhost:5173',
  'https://greentracer.org',
  'https://www.greentracer.org',
  'https://greentracer-frontend.vercel.app',
  'https://buzzboost.co.uk',
  /^https:\/\/.*\.buzzboost\.co\.uk$/
];
function dynamicCORS(origin, cb) {
  if (!origin) return cb(null, true);
  if (ALLOWED.some(rule => typeof rule === 'string' ? rule === origin : rule.test(origin)))
    return cb(null, true);
  cb(new Error(`Blocked CORS origin: ${origin}`));
}
app.use(cors({ origin: dynamicCORS, methods: ['GET','POST'], allowedHeaders: ['Content-Type'] }));

/* ───────────── Static + health ───────────── */
app.use(express.static(path.join(__dirname,'public')));
app.get('/healthz', (_req,res)=>res.send('OK'));

/* ───────────── DB setup ───────────── */
const DB_FILE = process.env.RESULTS_DB_PATH || path.join(__dirname,'results.db');
fs.mkdirSync(path.dirname(DB_FILE), { recursive:true });
const db = new Database(DB_FILE);
db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    slug            TEXT PRIMARY KEY,
    url             TEXT,
    greenHost       INTEGER,
    sizeMB          REAL,
    carbonEstimate  REAL,
    percentile      INTEGER,
    reductionPct    REAL,
    grade           TEXT,
    timestamp       INTEGER
  );
`);
/** Set DEBUG_TTL_ZERO=1 in .env for testing to always bypass expiry. */
const TTL = process.env.DEBUG_TTL_ZERO ? 0 : 24*60*60*1000;

/* ───────────── Helpers ───────────── */
function slugify(site) {
  try {
    const u = new URL(site.startsWith('http') ? site : `https://${site}`);
    const originAndPath = u.origin + u.pathname.replace(/\/+$/, '');
    const out = new URL(originAndPath);
    return (out.hostname + out.pathname)
      .replace(/[^a-z0-9]/gi,'-')
      .toLowerCase()
      .replace(/-+$/,'');
  } catch {
    return String(site).toLowerCase().replace(/[^a-z0-9]/gi,'-').replace(/-+$/,'');
  }
}
function getCached(slug) {
  const s = String(slug || '').toLowerCase().replace(/-+$/,'');
  const row = db.prepare('SELECT * FROM results WHERE slug = ?').get(s);
  if (!row) return null;
  // IMPORTANT: TTL=0 means “don’t expire”
  if (TTL !== 0 && Date.now() - row.timestamp > TTL) return null;

  row.greenHost      = !!row.greenHost;
  row.sizeMB         = +row.sizeMB;
  row.carbonEstimate = +row.carbonEstimate;
  row.percentile     = +row.percentile;
  row.reductionPct   = +row.reductionPct;
  row.grade          = gradeFor(row.carbonEstimate);
  return row;
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
  return Math.round(Math.max(0, Math.min(100, (max - Math.min(carbon, max)) / max * 100)));
}

/* Overall % reduction when data centre is 25% cleaner → overall ≈ 8% */
function totalGreenReductionPct() {
  const KWH_PER_GB_DATACENTER = 0.060;
  const KWH_PER_GB_NETWORK    = 0.014;
  const KWH_PER_GB_USER       = 0.123;
  const total = KWH_PER_GB_DATACENTER + KWH_PER_GB_NETWORK + KWH_PER_GB_USER; // 0.197
  const dcShare = KWH_PER_GB_DATACENTER / total;                               // ≈ 30.5%
  const overall = 0.25 * dcShare;                                              // ≈ 7.6%
  return Math.round(overall * 100);                                            // ~8
}

/* ───────────── PageSize (desktop+mobile; larger wins; HTML fallback) ───────────── */
async function runPSI(url, strategy, apiKey) {
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&key=${apiKey}`;
  const r = await axios.get(api, { timeout: 30000 });
  const lr = r.data.lighthouseResult;

  const bytesAudit = lr?.audits?.['total-byte-weight']?.numericValue ?? 0;
  const items = lr?.audits?.['resource-summary']?.details?.items || [];
  const sumTransfers = items.reduce((s, it) => s + (it.transferSize || 0), 0);
  const totalBytes = Math.max(bytesAudit, sumTransfers);

  const requestedUrl = lr?.requestedUrl;
  const finalUrl = lr?.finalDisplayedUrl || lr?.finalUrl || requestedUrl || url;
  console.log(`[fetchSize] ${strategy} OK: ${totalBytes} bytes | final=${finalUrl}`);
  return { bytes: totalBytes, finalUrl };
}

async function htmlOnlyEstimateMB(url) {
  try {
    const r = await axios.get(url, {
      timeout: 12000,
      headers: { 'User-Agent': 'Mozilla/5.0 (GreenTrace Estimator)' }
    });
    const htmlBytes = Buffer.byteLength(r.data || '', 'utf8');
    const estimatedTotal = Math.max(htmlBytes * 7, htmlBytes + 80*1024);
    return estimatedTotal / (1024 * 1024);
  } catch {
    return 1.7;
  }
}

async function fetchSize(url) {
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    console.error('[ERROR] PAGESPEED_API_KEY not set; using fallback 1.7 MB.');
    return { bytes: 1.7 * 1024 * 1024, finalUrl: url };
  }
  try {
    const [desk, mobi] = await Promise.allSettled([
      runPSI(url, 'desktop', apiKey),
      runPSI(url, 'mobile',  apiKey),
    ]);

    let best = null;
    if (desk.status === 'fulfilled') best = desk.value;
    if (mobi.status === 'fulfilled') {
      if (!best || mobi.value.bytes > best.bytes) best = mobi.value;
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

/* ───────────── Green Web Foundation ───────────── */
async function checkGreen(host) {
  try {
    const { data } = await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${host}`, { timeout:8000 });
    return !!data.green;
  } catch {
    return false;
  }
}

/* ───────────── CO₂ calc (SWDM split, 25% DC discount) ───────────── */
function calcCO2(sizeMB, isGreenDC) {
  const KWH_PER_GB_DATACENTER = 0.060;
  const KWH_PER_GB_NETWORK    = 0.014;
  const KWH_PER_GB_USER       = 0.123;
  const GRID_INTENSITY        = 442;  // gCO2/kWh

  const sizeGB = sizeMB / 1024;

  let dc = sizeGB * KWH_PER_GB_DATACENTER;
  if (isGreenDC) dc *= 0.75; // 25% saving on data-center part only
  const net  = sizeGB * KWH_PER_GB_NETWORK;
  const user = sizeGB * KWH_PER_GB_USER;

  const kWh = dc + net + user;
  const grams = kWh * GRID_INTENSITY;

  return grams < 0.01 ? +grams.toPrecision(2)
       : grams < 1    ? +grams.toFixed(3)
                      : +grams.toFixed(2);
}

/* ───────────── Main: full check (manual) ───────────── */
app.post('/api/check-carbon', limiterCheck, async (req, res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error:'Missing URL.' });

  const norm = site.startsWith('http') ? site : `https://${site}`;
  let host; try { host = new URL(norm).hostname; } catch { return res.status(400).json({ error:'Bad URL.' }); }

  const [ green, sizeInfo ] = await Promise.all([ checkGreen(host), fetchSize(norm) ]);
  const sizeMB = (sizeInfo.bytes || 0) / (1024*1024);
  const measuredUrl = sizeInfo.finalUrl || norm;

  console.log(`[check-carbon] green=${green} sizeMB=${sizeMB.toFixed(3)} url=${measuredUrl}`);

  const carbon       = calcCO2(sizeMB, green);
  const pct          = percentileFromCarbon(carbon);
  const reductionPct = green ? totalGreenReductionPct() : 0; // overall ≈ 8%
  const slug         = slugify(measuredUrl);
  const grade        = gradeFor(carbon);

  db.prepare(`
    INSERT OR REPLACE INTO results
      (slug, url, greenHost, sizeMB, carbonEstimate, percentile, reductionPct, grade, timestamp)
    VALUES (?,   ?,   ?,        ?,     ?,              ?,          ?,           ?,     ?)
  `).run(
    slug, measuredUrl, green ? 1 : 0, sizeMB, carbon, pct, reductionPct, grade, Date.now()
  );

  res.json({ slug, url: measuredUrl, greenHost: green, sizeMB, carbonEstimate: carbon, percentile: pct, reductionPct, grade });
});

/* ───────────── Results by slug ───────────── */
app.get('/api/results/:slug', (req, res) => {
  const s = String(req.params.slug || '').toLowerCase().replace(/-+$/,'');
  const row = getCached(s);
  if (!row) return res.status(404).json({ error:'Results not found' });
  res.json(row);
});

/* ───────────── Clean DB (debug) ───────────── */
app.get('/api/clean-db', (req, res) => {
  if (!process.env.CLEAN_DB_SECRET || req.query.secret !== process.env.CLEAN_DB_SECRET) {
    return res.status(401).json({ error:'Unauthorized.' });
  }
  db.exec('DELETE FROM results; VACUUM;');
  res.json({ ok:true, message:'Database wiped.' });
});

/* ───────────── Debug endpoint ───────────── */
app.get('/api/debug-pagesize', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'url query required' });
  const { bytes, finalUrl } = await fetchSize(url);
  res.json({ requested: url, finalUrl, bytes, sizeMB: +(bytes/(1024*1024)).toFixed(6) });
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
  if (TTL === 0) console.log('🧪 TTL=0 (no cache) for testing');
});
