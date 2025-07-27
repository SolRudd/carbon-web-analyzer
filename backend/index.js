// backend/index.js

'use strict';
require('dotenv').config();

const fs         = require('fs');
const path       = require('path');
const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const axios      = require('axios');
const Database   = require('better-sqlite3');

const app  = express();
const PORT = Number(process.env.PORT) || 8080;

// ─── Trust proxy ──────────────────────────────────────────────────────────────
app.set('trust proxy', 1);

// ─── Security & CORS ─────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: '*',
  methods: ['GET','POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// ─── Rate limiters ────────────────────────────────────────────────────────────
const limiterCheck = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  max: 20,
  message: { error: 'Daily check limit reached. Try again tomorrow.' }
});
const limiterBadge = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: { error: 'Too many badge requests, please wait a minute.' }
});

// ─── Badge script (must come before static) ─────────────────────────────────
app.get('/greentrace-badge.js', limiterBadge, (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.join(__dirname, 'public', 'greentrace-badge.js'));
});

// ─── Static assets ───────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/healthz', (_req, res) => res.send('OK'));

// ─── SQLite & Cache ───────────────────────────────────────────────────────────
const DB_FILE = process.env.RESULTS_DB_PATH || path.join(__dirname, 'results.db');
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
const db = new Database(DB_FILE);
db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    slug TEXT PRIMARY KEY,
    url  TEXT,
    greenHost INTEGER,
    sizeMB REAL,
    carbonEstimate REAL,
    percentile INTEGER,
    timestamp INTEGER
  );
`);
const CACHE_TTL = 24 * 60 * 60 * 1000;

// ─── Utility functions ───────────────────────────────────────────────────────
function createSlug(site) {
  try {
    const u = site.startsWith('http') ? site : `https://${site}`;
    return new URL(u).hostname.replace(/[^a-z0-9]/gi,'-').toLowerCase();
  } catch {
    return site.replace(/[^a-z0-9]/gi,'-').toLowerCase();
  }
}

function getGrade(c) {
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
  if (!row || Date.now() - row.timestamp > CACHE_TTL) return null;
  row.greenHost = !!row.greenHost;
  ['sizeMB','carbonEstimate','percentile'].forEach(k => row[k] = +row[k]);
  row.grade = getGrade(row.carbonEstimate);
  row.reductionPct = row.greenHost ? 9 : 0;
  return row;
}

async function getPageSize(url) {
  try {
    const api = `https://www.googleapis.com/pagespeed/v5/runPagespeed?url=${encodeURIComponent(url)}`;
    const r = await axios.get(api, { timeout: 15000 });
    const bytes = r.data.lighthouseResult.audits['total-byte-weight'].numericValue || 0;
    return bytes / (1024 * 1024);
  } catch {
    return 1.5; // fallback
  }
}

async function isGreen(host) {
  try {
    const { data } = await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${host}`, { timeout: 5000 });
    return !!data.green;
  } catch {
    return false;
  }
}

function calcCarbon(mb, green) {
  const CO2_PER_MB = 0.81 * 442 / 1024;
  return +(mb * CO2_PER_MB * (green ? 0.91 : 1)).toFixed(2);
}

// ─── Routes ────────────────────────────────────────────────────────────────────

// 1) Full carbon check
app.post('/api/check-carbon', limiterCheck, async (req, res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error: 'Missing URL.' });

  const normalized = site.startsWith('http') ? site : `https://${site}`;
  let host;
  try { host = new URL(normalized).hostname; }
  catch { return res.status(400).json({ error: 'Invalid URL.' }); }

  const [green, sizeMB] = await Promise.all([ isGreen(host), getPageSize(normalized) ]);
  const carbon = calcCarbon(sizeMB, green);
  const pct    = Math.round(Math.max(0, Math.min(100, (0.846 - Math.min(carbon,0.846)) / 0.846 * 100)));
  const grade  = getGrade(carbon);
  const slug   = createSlug(site);

  db.prepare(`
    INSERT OR REPLACE INTO results
    (slug,url,greenHost,sizeMB,carbonEstimate,percentile,timestamp)
    VALUES (?,?,?,?,?,?,?)
  `).run(slug, site, green?1:0, sizeMB, carbon, pct, Date.now());

  res.json({ slug, url: site, greenHost: green, sizeMB, carbonEstimate: carbon, percentile: pct, grade });
});

// 2) Badge loader (cache‑only)
app.get('/api/trace', limiterBadge, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const site = req.query.site;
  if (!site) return res.status(400).json({ error: 'Missing site parameter.' });
  const row = getCached(createSlug(site));
  if (!row) return res.status(404).json({ error: 'No data—run a check first.' });
  res.json(row);
});

// 3) Lookup last result
app.get('/api/results/:slug', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const row = getCached(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Results not found.' });
  res.json(row);
});

// ─── 404 & Error handlers ─────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: 'Endpoint not found' }));
app.use((err, _, res, __) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Graceful shutdown ─────────────────────────────────────────────────────────
process.on('SIGTERM', () => { db.close(); process.exit(0); });
process.on('SIGINT',  () => { db.close(); process.exit(0); });

// ─── Start server ────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GreenTrace API listening on port ${PORT}`);
});
