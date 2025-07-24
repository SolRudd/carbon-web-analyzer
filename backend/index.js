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
const puppeteer  = require('puppeteer');
const Database   = require('better-sqlite3');

const app  = express();
const PORT = Number(process.env.PORT) || 8080;

// ─── Trust proxy for correct IP parsing (X‑Forwarded‑For) ───────────────────────
app.set('trust proxy', 1);

// ─── Security & CORS ─────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/healthz', (_req, res) => res.send('OK'));

// ─── Rate‑limiters ────────────────────────────────────────────────────────────
// Full carbon checks (heavy): 5/minute
const limiterCheck = rateLimit({
  windowMs: 60_000, max: 5,
  message: { error: 'Too many carbon checks, please wait a minute.' }
});
// Badge loads (cache only): 30/minute
const limiterBadge = rateLimit({
  windowMs: 60_000, max: 30,
  message: { error: 'Too many badge requests, please wait a minute.' }
});

// ─── Database & 7‑day Cache Helper ─────────────────────────────────────────────
const DB_FILE = process.env.RESULTS_DB_PATH || path.join(__dirname, 'results.db');
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
const db = new Database(DB_FILE);
db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    slug            TEXT PRIMARY KEY,
    url             TEXT NOT NULL,
    greenHost       INTEGER NOT NULL,
    sizeMB          REAL NOT NULL,
    carbonEstimate  REAL NOT NULL,
    reductionPct    REAL NOT NULL,
    grade           TEXT NOT NULL,
    percentile      INTEGER NOT NULL,
    timestamp       INTEGER NOT NULL
  );
`);

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
function getCachedResult(slug) {
  const row = db.prepare('SELECT * FROM results WHERE slug = ?').get(slug);
  if (!row) return null;
  if (Date.now() - row.timestamp > CACHE_TTL_MS) return null;
  row.greenHost = !!row.greenHost;
  ['sizeMB','carbonEstimate','reductionPct','percentile','timestamp']
    .forEach(k => row[k] = +row[k]);
  return row;
}

// ─── Carbon Math & Helpers ────────────────────────────────────────────────────
const ENERGY_PER_GB   = 0.81;
const CARBON_FACTOR   = 442;
const GREEN_REDUCTION = 0.09;
const THRESHOLDS      = { 'A+':0.095, A:0.186, B:0.341, C:0.493, D:0.656, E:0.846 };

function calcCarbon(mb, green) {
  const base = (mb/1024) * ENERGY_PER_GB * CARBON_FACTOR;
  return green ? base * (1 - GREEN_REDUCTION) : base;
}
function gradeFor(g) {
  return Object.entries(THRESHOLDS).find(([_, t]) => g <= t)?.[0] ?? 'F';
}
function percentileFor(g) {
  const pct = ((THRESHOLDS.E - Math.min(g, THRESHOLDS.E)) / THRESHOLDS.E) * 100;
  return Math.round(Math.max(0, Math.min(100, pct)));
}

async function retry(fn, tries = 3, delay = 1000) {
  let err;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); }
    catch (e) { err = e; await new Promise(r => setTimeout(r, delay * (i+1))); }
  }
  throw err;
}
function isGreen(host) {
  return axios
    .get(`https://api.thegreenwebfoundation.org/greencheck/${host}`)
    .then(r => !!r.data.green)
    .catch(() => false);
}

// ─── Puppeteer singleton ───────────────────────────────────────────────────────
const browserPromise = puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'],
  ignoreHTTPSErrors: true,
  timeout: 60000
});
async function getPageSizeInMB(url) {
  const browser = await browserPromise;
  const page    = await browser.newPage();
  try {
    await page.setCacheEnabled(false);
    await page.setViewport({ width:1280, height:720 });
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');
    console.log(`🔍 Navigating to: ${url}`);
    await page.goto(url, { waitUntil:'networkidle2', timeout:30000 });
    const bytes = await page.evaluate(() => {
      const nav  = performance.getEntriesByType('navigation')[0] || {};
      const res  = performance.getEntriesByType('resource')   || [];
      const navB = nav.encodedBodySize ?? nav.transferSize ?? 0;
      const resB = res.reduce((sum, r) => sum + (r.encodedBodySize ?? r.transferSize ?? 0), 0);
      return navB + resB;
    });
    return bytes / (1024 * 1024);
  } finally {
    await page.close();
  }
}

// ─── Routes ────────────────────────────────────────────────────────────────────

// 1) Full carbon check → Puppeteer + store result
app.post('/api/check-carbon', limiterCheck, async (req, res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error:'Missing URL.' });
  try {
    const host       = new URL(site).hostname;
    const [green, sizeMB] = await Promise.all([
      retry(() => isGreen(host)),
      retry(() => getPageSizeInMB(site))
    ]);
    const carbonEstimate = calcCarbon(sizeMB, green);
    const slug           = host.replace(/[^a-z0-9]/gi,'-').toLowerCase();

    db.prepare(`
      INSERT OR REPLACE INTO results
      (slug,url,greenHost,sizeMB,carbonEstimate,reductionPct,grade,percentile,timestamp)
      VALUES(?,?,?,?,?,?,?,?,?)
    `).run(
      slug, site, green?1:0, sizeMB, carbonEstimate,
      GREEN_REDUCTION, gradeFor(carbonEstimate),
      percentileFor(carbonEstimate), Date.now()
    );

    const row = db.prepare('SELECT * FROM results WHERE slug = ?').get(slug);
    row.greenHost = !!row.greenHost;
    ['sizeMB','carbonEstimate','reductionPct','percentile','timestamp']
      .forEach(k => row[k] = +row[k]);

    res.json(row);
  } catch (e) {
    console.error('❌ check-carbon error:', e);
    res.status(500).json({ error:'Carbon check failed.', details:e.message });
  }
});

// 2) Badge loader → only SQLite cache (<7 days old)
app.get('/api/trace', limiterBadge, (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Missing site query.' });
  let url; try { url = new URL(site).toString(); } catch {
    return res.status(400).json({ error:'Invalid site URL.' });
  }
  const slug   = new URL(url).hostname.replace(/[^a-z0-9]/gi,'-').toLowerCase();
  const cached = getCachedResult(slug);
  if (cached) return res.json(cached);
  return res.status(404).json({
    error: 'No recent trace found. Please run a carbon check first.'
  });
});

// 3) Lookup last stored result (any age)
app.get('/api/results/:slug', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM results WHERE slug = ?').get(req.params.slug);
    if (!row) return res.status(404).json({ error:'Not found.' });
    row.greenHost = !!row.greenHost;
    ['sizeMB','carbonEstimate','reductionPct','percentile','timestamp']
      .forEach(k => row[k] = +row[k]);
    res.json(row);
  } catch (e) {
    console.error('❌ results lookup error:', e);
    res.status(500).json({ error:'Server error.' });
  }
});

// global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error:'Internal server error.' });
});

// start
app.listen(PORT, () => {
  console.log(`🚀 API listening on port ${PORT}`);
});
