// backend/index.js
'use strict';
require('dotenv').config();

const fs         = require('fs');
const path       = require('path');
const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const Database   = require('better-sqlite3');

const {
  getComprehensivePageSize,
  getDetailedGreenInfo,
  calculateAdvancedCarbon,
  getRealisticGrade
} = require('./carbon-utils');

const app  = express();
const PORT = process.env.PORT || 8080;

// Trust proxy so rate‑limit sees real client IPs
app.set('trust proxy', 1);

// Security + CORS + static
app.use(helmet({ frameguard: false }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/healthz', (_req, res) => res.send('OK'));

// Rate limiters
const limiterCheck = rateLimit({ windowMs: 60_000, max: 5, message: { error:'Too many checks, wait a minute.' }});
const limiterBadge = rateLimit({ windowMs: 60_000, max:30, message: { error:'Too many badge requests, wait a minute.' }});

// SQLite + 7‑day cache
const DB_FILE = process.env.RESULTS_DB_PATH || path.join(__dirname, 'results.db');
fs.mkdirSync(path.dirname(DB_FILE), { recursive:true });
const db = new Database(DB_FILE);
db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    slug TEXT PRIMARY KEY,
    url  TEXT,
    greenHost INTEGER,
    sizeMB REAL,
    carbonEstimate REAL,
    reductionPct REAL,
    grade TEXT,
    percentile INTEGER,
    timestamp INTEGER
  );
`);

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
function getCached(slug) {
  const row = db.prepare('SELECT * FROM results WHERE slug=?').get(slug);
  if (!row || Date.now() - row.timestamp > CACHE_TTL) return null;
  row.greenHost = !!row.greenHost;
  ['sizeMB','carbonEstimate','reductionPct','percentile','timestamp']
    .forEach(k => row[k] = +row[k]);
  return row;
}

// 1) Full carbon check
app.post('/api/check-carbon', limiterCheck, async (req, res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error:'URL missing.' });

  try {
    const host     = new URL(site).hostname;
    const sizeData = await getComprehensivePageSize(site);
    const green    = await getDetailedGreenInfo(host);
    const adv      = calculateAdvancedCarbon(sizeData, green);
    const gradeObj = getRealisticGrade(adv.carbonGrams, sizeData.totalMB);

    const slug = host.replace(/[^a-z0-9]/gi,'-').toLowerCase();
    const payload = {
      slug,
      url: site,
      greenHost: green.isGreen ? 1 : 0,
      sizeMB: sizeData.totalMB,
      carbonEstimate: adv.carbonGrams,
      reductionPct: green.reductionFactor,
      grade: gradeObj.grade,
      percentile: gradeObj.percentile,
      timestamp: Date.now()
    };

    db.prepare(`
      INSERT OR REPLACE INTO results
        (slug,url,greenHost,sizeMB,carbonEstimate,reductionPct,grade,percentile,timestamp)
      VALUES(?,?,?,?,?,?,?,?,?)
    `).run(...Object.values(payload));

    res.json(payload);

  } catch (e) {
    console.error('❌ check-carbon error:', e);
    res.status(500).json({ error:'Carbon check failed.', details:e.message });
  }
});

// 2) Badge loader (cache‑only)
app.get('/api/trace', limiterBadge, (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Site missing.' });

  let slug;
  try {
    slug = new URL(site).hostname.replace(/[^a-z0-9]/gi,'-').toLowerCase();
  } catch {
    return res.status(400).json({ error:'Invalid site URL.' });
  }

  const cached = getCached(slug);
  if (cached) return res.json(cached);
  res.status(404).json({ error:'No recent trace. Run a fresh check.' });
});

// 3) Lookup last stored result
app.get('/api/results/:slug', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM results WHERE slug=?').get(req.params.slug);
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

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error:'Internal server error.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API listening on port ${PORT}`);
});
