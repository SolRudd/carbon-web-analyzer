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

// ─── Trust Proxy ──────────────────────────────────────────────────────────────
app.set('trust proxy', 1);

// ─── Security & CORS ─────────────────────────────────────────────────────────

// Collect all valid origins
const ALLOWED = [
  'http://localhost:5173',
  'https://greentracer.org',
  'https://www.greentracer.org',
  'https://greentracer-frontend.vercel.app',
];

// Allow ALL Vercel Preview deployments, e.g. https://greentracer-frontend-xyz123.vercel.app
function dynamicCORS(origin, cb) {
  if (!origin) return cb(null, true);
  if (ALLOWED.includes(origin)) return cb(null, true);
  // Match any Vercel preview deploy for your app
  if (/^https:\/\/greentracer-frontend-[\w-]+\.vercel\.app$/.test(origin)) return cb(null, true);
  cb(new Error(`Blocked CORS origin: ${origin}`));
}

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: dynamicCORS,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// ─── Rate Limiters ───────────────────────────────────────────────────────────
const limiterCheck = rateLimit({
  windowMs: 24*60*60*1000,
  max: 20,
  message: { error: 'Daily check limit reached.' }
});
const limiterBadge = rateLimit({
  windowMs: 60*1000,
  max: 60,
  message: { error: 'Too many badge loads.' }
});

// ─── Badge Script ────────────────────────────────────────────────────────────
app.get('/greentrace-badge.js', limiterBadge, (req, res) => {
  res.type('application/javascript');
  res.set('Access-Control-Allow-Origin','*');
  res.set('Cross-Origin-Resource-Policy','cross-origin');
  res.set('Cache-Control','public,max-age=3600');
  res.sendFile(path.join(__dirname,'public','greentrace-badge.js'));
});

// ─── Static + Health ─────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname,'public')));
app.get('/healthz', (_req,res)=>res.send('OK'));

// ─── SQLite & Cache ─────────────────────────────────────────────────────────
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
const TTL = 24*60*60*1000;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function slugify(site) {
  try {
    // Always remove trailing slash for URLs
    let u = site.startsWith('http') ? site : `https://${site}`;
    u = u.replace(/\/+$/, ''); // Remove trailing slashes
    return new URL(u).hostname.replace(/[^a-z0-9]/gi,'-').toLowerCase().replace(/-+$/, '');
  } catch {
    return site.replace(/[^a-z0-9]/gi,'-').toLowerCase().replace(/-+$/, '');
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
function getCached(slug) {
  const row = db.prepare('SELECT * FROM results WHERE slug = ?').get(slug);
  if (!row || Date.now() - row.timestamp > TTL) return null;
  row.greenHost      = !!row.greenHost;
  row.sizeMB         = +row.sizeMB;
  row.carbonEstimate = +row.carbonEstimate;
  row.percentile     = +row.percentile;
  row.reductionPct   = +row.reductionPct;
  row.grade          = gradeFor(row.carbonEstimate);
  return row;
}
async function fetchSize(url) {
  try {
    const api = `https://www.googleapis.com/pagespeed/v5/runPagespeed?url=${encodeURIComponent(url)}`;
    const r   = await axios.get(api, { timeout:15000 });
    const bytes = r.data.lighthouseResult.audits['total-byte-weight'].numericValue || 0;
    return bytes / (1024*1024);
  } catch {
    return 1.5;
  }
}
async function checkGreen(host) {
  try {
    const { data } = await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${host}`, { timeout:5000 });
    return !!data.green;
  } catch {
    return false;
  }
}
function calcCO2(mb, green) {
  const rate = 0.81 * 442 / 1024;
  const base = mb * rate;
  return +(green ? base * 0.91 : base).toFixed(2);
}

// ─── ROUTES ─────────────────────────────────────────────────────────────────

// 1) Full carbon check
app.post('/api/check-carbon', limiterCheck, async (req, res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error:'Missing URL.' });
  const norm = site.startsWith('http') ? site : `https://${site}`;
  let host;
  try { host = new URL(norm).hostname; }
  catch { return res.status(400).json({ error:'Bad URL.' }); }

  const [ green, sizeMB ] = await Promise.all([ checkGreen(host), fetchSize(norm) ]);
  const carbon       = calcCO2(sizeMB, green);
  const pct          = Math.round(Math.max(0, Math.min(100, (0.846 - Math.min(carbon,0.846)) / 0.846 * 100)));
  const grade        = gradeFor(carbon);
  const reductionPct = green ? 9 : 0;
  const slug         = slugify(site);

  // Insert or replace
  db.prepare(`
    INSERT OR REPLACE INTO results
      (slug, url, greenHost, sizeMB, carbonEstimate, percentile, reductionPct, grade, timestamp)
    VALUES (?,    ?,   ?,         ?,      ?,               ?,         ?,            ?,     ?)
  `).run(
    slug,
    site,
    green ? 1 : 0,
    sizeMB,
    carbon,
    pct,
    reductionPct,
    grade,
    Date.now()
  );

  // Debug: print all slugs
  const allSlugs = db.prepare('SELECT slug FROM results').all();
  console.log('Inserted slug:', slug, 'Known slugs now:', allSlugs.map(r => r.slug));

  res.json({ slug, url: site, greenHost: green, sizeMB, carbonEstimate: carbon, percentile: pct, reductionPct, grade });
});

// 2) Badge loader (cache‑only)
app.get('/api/trace', limiterBadge, (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Missing site.' });
  const slug = slugify(site);
  const row = getCached(slug);
  if (!row) {
    console.log('[TRACE] No result for slug:', slug);
    return res.status(404).json({ error:'No data—run a check first.' });
  }
  res.json(row);
});

// 3) Lookup last result by slug
app.get('/api/results/:slug', (req, res) => {
  const slug = req.params.slug;
  console.log('[RESULTS] Fetching result for slug:', slug);
  const row = getCached(slug);
  if (!row) {
    const all = db.prepare('SELECT slug FROM results').all();
    console.log('404. Known slugs:', all.map(r => r.slug));
    return res.status(404).json({ error: 'Results not found.' });
  }
  res.json(row);
});

// 4) DEBUG ONLY: Clean DB (danger!)
//    Call: GET /api/clean-db?secret=YOUR_SECRET_KEY
//    Set YOUR_SECRET_KEY in your .env file for basic safety.
app.get('/api/clean-db', (req, res) => {
  const ok = process.env.CLEAN_DB_SECRET;
  if (!ok || req.query.secret !== ok) return res.status(401).json({ error: 'Unauthorized.' });
  db.exec('DELETE FROM results; VACUUM;');
  res.json({ ok: true, message: 'Database wiped.' });
});

// 404 & error handlers
app.use((_, res) => res.status(404).json({ error:'Endpoint not found' }));
app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ error:'Server error' });
});

// Graceful shutdown
process.on('SIGTERM', ()=>{ db.close(); process.exit(0) });
process.on('SIGINT',  ()=>{ db.close(); process.exit(0) });

// Start
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 GreenTrace API listening on port ${PORT}`));
