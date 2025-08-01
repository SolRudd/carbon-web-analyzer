// server.js (or index.js)
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

// ─── Trust Proxy ──────────────────────────────────────────────
app.set('trust proxy', 1);

// ─── Security Headers ────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json());

// ─── Rate Limiters ───────────────────────────────────────────
const limiterCheck = rateLimit({
  windowMs: 24*60*60*1000, // 24h
  max: 20,
  message: { error: 'Daily check limit reached.' }
});
const limiterBadge = rateLimit({
  windowMs: 60*1000,       // 1m
  max: 60,
  message: { error: 'Too many badge loads.' }
});

// ─── PUBLIC BADGE ENDPOINTS (Open to *all* origins) ───────────
const badgeCors = cors({ origin: '*', methods: ['GET'], allowedHeaders: ['Content-Type'] });

app.get('/greentrace-badge.js', badgeCors, limiterBadge, (req, res) => {
  res.type('application/javascript');
  res.set('Cross-Origin-Resource-Policy','cross-origin');
  res.set('Cache-Control','public,max-age=3600');
  res.sendFile(path.join(__dirname,'public','greentrace-badge.js'));
});

app.get('/api/trace', badgeCors, limiterBadge, (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Missing site.' });
  const slug = slugify(site);
  const row  = getCached(slug);
  if (!row) return res.status(404).json({ error:'No data—run a check first.' });
  res.json(row);
});

// ─── GLOBAL CORS FOR THE REMAINING ROUTES ────────────────────
const ALLOWED = [
  'http://localhost:5173',
  'https://greentracer.org',
  'https://www.greentracer.org',
  'https://greentracer-frontend.vercel.app',
  'https://buzzboost.co.uk',               // Buzzboost domain
  /^https:\/\/.*\.buzzboost\.co\.uk$/ // any subdomain
];

function dynamicCORS(origin, cb) {
  if (!origin) return cb(null, true);
  if (ALLOWED.some(rule => typeof rule === 'string' ? rule === origin : rule.test(origin)))
    return cb(null, true);
  cb(new Error(`Blocked CORS origin: ${origin}`));
}

app.use(cors({ origin: dynamicCORS, methods: ['GET','POST'], allowedHeaders: ['Content-Type'] }));

// ─── Static + Healthz ────────────────────────────────────────
app.use(express.static(path.join(__dirname,'public')));
app.get('/healthz', (_req,res)=>res.send('OK'));

// ─── SQLite & Cache Setup ────────────────────────────────────
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
const TTL = 24*60*60*1000; // 24h

// ─── Helper Functions ────────────────────────────────────────
function slugify(site) {
  try {
    let u = site.startsWith('http') ? site : `https://${site}`;
    u = new URL(u).origin + new URL(u).pathname.replace(/\/+$/, '');
    return new URL(u).hostname.replace(/[^a-z0-9]/gi,'-').toLowerCase();
  } catch {
    return site.replace(/[^a-z0-9]/gi,'-').toLowerCase();
  }
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

function gradeFor(c) {
  if (c <= 0.095) return 'A+';
  if (c <= 0.186) return 'A';
  if (c <= 0.341) return 'B';
  if (c <= 0.493) return 'C';
  if (c <= 0.656) return 'D';
  if (c <= 0.846) return 'E';
  return 'F';
}

// Calculate page size in MB via PageSpeed API
async function fetchSize(url) {
  try {
    const api = `https://www.googleapis.com/pagespeed/v5/runPagespeed?url=${encodeURIComponent(url)}`;
    const r   = await axios.get(api, { timeout:15000 });
    const bytes = r.data.lighthouseResult.audits['total-byte-weight'].numericValue || 0;
    return bytes / (1024*1024);
  } catch {
    return 1.5; // fallback
  }
}

// Check Green Web Foundation
async function checkGreen(host) {
  try {
    const { data } = await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${host}`, { timeout:5000 });
    return !!data.green;
  } catch {
    return false;
  }
}

// Compute CO₂ (g) per view
function calcCO2(mb, green) {
  const rate = 0.81 /* kWh/GB */ * 442 /* gCO₂/kWh */ / 1024;
  const base = mb * rate;
  return +(green ? base * 0.91 : base).toFixed(2);
}

// ─── Full Carbon Check (POST) ───────────────────────────────
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
  const reductionPct = green ? 9 : 0;
  const slug         = slugify(site);

  db.prepare(`
    INSERT OR REPLACE INTO results
      (slug, url, greenHost, sizeMB, carbonEstimate, percentile, reductionPct, grade, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    slug, site, green ? 1 : 0, sizeMB, carbon, pct, reductionPct, gradeFor(carbon), Date.now()
  );

  res.json({ slug, url: site, greenHost: green, sizeMB, carbonEstimate: carbon, percentile: pct, reductionPct, grade: gradeFor(carbon) });
});

// ─── Results by Slug ────────────────────────────────────────
app.get('/api/results/:slug', (req, res) => {
  const row = getCached(req.params.slug);
  if (!row) return res.status(404).json({ error:'Results not found.' });
  res.json(row);
});

// ─── Clean DB (DEBUG) ───────────────────────────────────────
app.get('/api/clean-db', (req, res) => {
  if (!process.env.CLEAN_DB_SECRET || req.query.secret !== process.env.CLEAN_DB_SECRET) {
    return res.status(401).json({ error:'Unauthorized.' });
  }
  db.exec('DELETE FROM results; VACUUM;');
  res.json({ ok:true, message:'Database wiped.' });
});

// ─── 404 & Error Handlers ───────────────────────────────────
app.use((_,res) => res.status(404).json({ error:'Endpoint not found' }));
app.use((err, _,res,__) => {
  console.error(err);
  res.status(500).json({ error:'Server error' });
});

// ─── Start ───────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GreenTrace API listening on port ${PORT}`);
});
