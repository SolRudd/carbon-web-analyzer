'use strict';
require('dotenv').config();

const fs         = require('fs');
const path       = require('path');
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const axios      = require('axios');
const puppeteer  = require('puppeteer');
const Database   = require('better-sqlite3');

const app  = express();
const PORT = Number(process.env.PORT) || 8080;
app.set('trust proxy', 1);

// ──────── Middleware ────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN.split(','),
  optionsSuccessStatus: 200
}));
app.use(rateLimit({
  windowMs:  60_000,
  max:       30,
  message:   { error: 'Too many requests, slow down.' }
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/healthz', (_req, res) => res.status(200).send('OK'));

// ──────── Persistent SQLite ────────
const DB_FILE = process.env.RESULTS_DB_PATH || path.join(__dirname, 'results.db');
// ensure mount-dir exists
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

// ──────── Carbon math ────────
const ENERGY_PER_GB        = 0.81;
const CARBON_FACTOR        = 442;
const GREEN_HOST_REDUCTION = 0.09;
const THRESHOLDS           = { 'A+':0.095, A:0.186, B:0.341, C:0.493, D:0.656, E:0.846 };

function calcCarbon(mb, green) {
  const base = (mb / 1024) * ENERGY_PER_GB * CARBON_FACTOR;
  return green ? base * (1 - GREEN_HOST_REDUCTION) : base;
}
function gradeFor(g) {
  return Object.entries(THRESHOLDS).find(([_, t]) => g <= t)?.[0] ?? 'F';
}
function percentileFor(g) {
  const pct = ((THRESHOLDS.E - Math.min(g, THRESHOLDS.E)) / THRESHOLDS.E) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

// ──────── Retry helper ────────
async function retry(fn, tries = 3, delay = 1000) {
  let err;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); }
    catch (e) { err = e; await new Promise(r => setTimeout(r, delay * (i + 1))); }
  }
  throw err;
}

// ──────── Green-host check ────────
function isGreen(host) {
  return axios
    .get(`https://api.thegreenwebfoundation.org/greencheck/${host}`)
    .then(r => !!r.data.green)
    .catch(() => false);
}

// ──────── Chrome launcher (once) ────────
const chromeLaunchOpts = {
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--single-process',
    '--no-zygote',
    '--disable-web-security',
    '--disable-features=VizDisplayCompositor',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-ipc-flooding-protection',
    '--disable-extensions',
    '--disable-default-apps',
    '--disable-sync',
    '--no-first-run',
    '--disable-plugins'
  ],
  ignoreHTTPSErrors: true,
  timeout: 60_000
};
const browserPromise = (async () => {
  // you can add custom Chrome-path logic here if needed…
  const b = await puppeteer.launch(chromeLaunchOpts);
  console.log('✅ Puppeteer launched once');
  return b;
})();

// ─── Puppeteer page-weight ───
async function getPageSizeInMB(url) {
  const browser = await browserPromise;
  const page    = await browser.newPage();

  await page.setViewport({ width: 1280, height: 720 });
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  console.log(`🔍 Navigating to: ${url}`);
  await page.goto(url, {
    waitUntil: 'domcontentloaded',  // much faster
    timeout:   20_000               // 20s
  });

  // sum up transfer sizes
  const bytes = await page.evaluate(() => {
    const nav = performance
      .getEntriesByType('navigation')[0] || {};
    const res = performance
      .getEntriesByType('resource') || [];
    const navB = nav.encodedBodySize ?? nav.transferSize ?? 0;
    const resB = res.reduce((sum, r) =>
      sum + (r.encodedBodySize ?? r.transferSize ?? 0)
    , 0);
    return navB + resB;
  });

  await page.close();
  const mb = bytes / (1024 * 1024);
  console.log(`📊 Page weight: ${mb.toFixed(2)} MB`);
  return mb;
}

// ──────── Routes ────────

// POST /api/check-carbon  → runs a check, writes to SQLite, returns the full row
app.post('/api/check-carbon', async (req, res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error: 'Missing URL.' });

  try {
    const host       = new URL(site).hostname;
    const [green, sizeMB] = await Promise.all([
      retry(() => isGreen(host)),
      retry(() => getPageSizeInMB(site))
    ]);

    const carbonEstimate = calcCarbon(sizeMB, green);
    const slug           = host.replace(/[^a-z0-9]/gi, '-').toLowerCase();

    db.prepare(`
      INSERT OR REPLACE INTO results
      (slug,url,greenHost,sizeMB,carbonEstimate,reductionPct,grade,percentile,timestamp)
      VALUES(?,?,?,?,?,?,?,?,?)
    `).run(
      slug,
      site,
      green ? 1 : 0,
      sizeMB,
      carbonEstimate,
      GREEN_HOST_REDUCTION,
      gradeFor(carbonEstimate),
      percentileFor(carbonEstimate),
      Date.now()
    );

    const row = db.prepare('SELECT * FROM results WHERE slug = ?').get(slug);
    row.greenHost = !!row.greenHost;
    ['sizeMB','carbonEstimate','reductionPct','percentile','timestamp']
      .forEach(k => row[k] = +row[k]);

    res.json(row);

  } catch (e) {
    console.error('❌ check-carbon error:', e);
    res.status(500).json({ error: 'Carbon check failed.', details: e.message });
  }
});

// GET /api/trace?site=…  → just returns a one-off trace
app.get('/api/trace', async (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error: 'Missing site query.' });
  try { new URL(site); }
  catch { return res.status(400).json({ error: 'Invalid site URL.' }); }

  try {
    const host       = new URL(site).hostname;
    const [green, sizeMB] = await Promise.all([
      retry(() => isGreen(host)),
      retry(() => getPageSizeInMB(site))
    ]);

    const ce = calcCarbon(sizeMB, green);
    res.json({
      url:            site,
      greenHost:      green,
      sizeMB:         +sizeMB.toFixed(2),
      carbonEstimate: +ce.toFixed(2),
      grade:          gradeFor(ce),
      percentile:     percentileFor(ce),
      timestamp:      Date.now()
    });

  } catch (e) {
    console.error(`❌ trace error for ${site}:`, e);
    res.status(500).json({ error: 'Unable to trace site.', details: e.message });
  }
});

// GET /api/results/:slug  → fetch last stored result
app.get('/api/results/:slug', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM results WHERE slug = ?')
                  .get(req.params.slug);
    if (!row) return res.status(404).json({ error: 'Not found.' });

    row.greenHost = !!row.greenHost;
    ['sizeMB','carbonEstimate','reductionPct','percentile','timestamp']
      .forEach(k => row[k] = +row[k]);

    res.json(row);

  } catch (e) {
    console.error('❌ results lookup error:', e);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ──────── Global error handler ────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ──────── Start server ────────
app.listen(PORT, () => {
  console.log(`🚀 API ready on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
