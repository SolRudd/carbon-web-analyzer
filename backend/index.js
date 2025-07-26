// backend/index.js
'use strict';
require('dotenv').config();

const fs        = require('fs');
const path      = require('path');
const express   = require('express');
const helmet    = require('helmet');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const axios     = require('axios');
const puppeteer = require('puppeteer');
const Database  = require('better-sqlite3');

const app  = express();
const PORT = Number(process.env.PORT) || 8080;

// ─── Trust proxy ─────────────────────────────────────────────
app.set('trust proxy', 1);

// ─── Security & CORS ──────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/healthz', (_req, res) => res.send('OK'));

// ─── Rate limiters ─────────────────────────────────────────────
const limiterCheck = rateLimit({
  windowMs: 60_000, max: 5,
  message: { error: 'Too many checks, please wait a minute.' }
});
const limiterBadge = rateLimit({
  windowMs: 60_000, max: 30,
  message: { error: 'Too many badge loads, please wait a minute.' }
});

// ─── SQLite + 7‑day cache ──────────────────────────────────────
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
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
function getCached(slug) {
  const row = db.prepare('SELECT * FROM results WHERE slug = ?').get(slug);
  if (!row || Date.now() - row.timestamp > CACHE_TTL) return null;
  row.greenHost = !!row.greenHost;
  ['sizeMB','carbonEstimate','percentile','timestamp']
    .forEach(k => row[k] = +row[k]);
  return row;
}

// ─── Puppeteer helper ──────────────────────────────────────────
const browserPromise = puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox','--disable-setuid-sandbox'],
  ignoreHTTPSErrors: true
});
const waitFor = ms => new Promise(r => setTimeout(r, ms));

async function getPageSizeMB(url) {
  const browser = await browserPromise;
  const page    = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1280, height: 720 });
  await page.setUserAgent(navigator.userAgent || 'Mozilla/5.0');
  console.log(`🔍 Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 120_000 });
  await waitFor(2000);
  const bytes = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const res = performance.getEntriesByType('resource') || [];
    const navSize = nav.transferSize || nav.encodedBodySize || 0;
    const resSize = res.reduce((sum, r) => sum + (r.transferSize||r.encodedBodySize||0), 0);
    return navSize + resSize;
  });
  await page.close();
  return bytes / (1024 * 1024);
}

// ─── Simple carbon math & green check ─────────────────────────
function calcCarbon(mb, green) {
  const CO2_PER_MB = 0.81 * 442 / 1024;
  const c = mb * CO2_PER_MB;
  return +(green ? c * 0.91 : c).toFixed(2);
}
async function isGreen(host) {
  try {
    const { data } = await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${host}`);
    return !!data.green;
  } catch {
    return false;
  }
}

// ─── Routes ────────────────────────────────────────────────────
// 1) Full check + cache
app.post('/api/check-carbon', limiterCheck, async (req, res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error:'Missing URL.' });
  try {
    const host = new URL(site).hostname;
    const [ green, sizeMB ] = await Promise.all([
      isGreen(host),
      getPageSizeMB(site)
    ]);
    const carbon = calcCarbon(sizeMB, green);
    const pct    = Math.round(Math.max(0, Math.min(100, (1 - carbon/0.846)*100)));
    const slug   = host.replace(/[^a-z0-9]/gi,'-').toLowerCase();
    db.prepare(`
      INSERT OR REPLACE INTO results
      (slug,url,greenHost,sizeMB,carbonEstimate,percentile,timestamp)
      VALUES(?,?,?,?,?,?,?)
    `).run(slug, site, green?1:0, sizeMB, carbon, pct, Date.now());
    return res.json({ slug, url: site, greenHost: green, sizeMB, carbonEstimate: carbon, percentile: pct });
  } catch (e) {
    console.error('check-carbon error', e);
    return res.status(500).json({ error:'Carbon check failed.', details:e.message });
  }
});

// 2) Badge loader (cache only)
app.get('/api/trace', limiterBadge, (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Missing site.' });
  let slug;
  try { slug = new URL(site).hostname.replace(/[^a-z0-9]/gi,'-').toLowerCase(); }
  catch { return res.status(400).json({ error:'Invalid URL.' }); }
  const row = getCached(slug);
  if (row) return res.json(row);
  return res.status(404).json({ error:'No recent trace. POST /api/check-carbon first.' });
});

// 3) Lookup
app.get('/api/results/:slug', (_req, res) => {
  const row = getCached(_req.params.slug);
  if (!row) return res.status(404).json({ error:'Not found.' });
  return res.json(row);
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ error:'Internal server error.' });
});

// Start
app.listen(PORT, () => console.log(`🚀 API listening on ${PORT}`));
