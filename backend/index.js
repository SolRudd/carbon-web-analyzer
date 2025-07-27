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
app.use(cors({ origin: '*', methods: ['GET','POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Rate limiters ────────────────────────────────────────────────────────────
// 20 full checks per day per IP
const limiterCheck = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 20,
  message: { error: 'Daily check limit reached. Try again tomorrow.' }
});
// 60 badge loads per minute
const limiterBadge = rateLimit({
  windowMs: 60_000,
  max: 60,
  message: { error: 'Too many badge requests, wait a minute.' }
});

// ─── SQLite & Cache ───────────────────────────────────────────────────────────
const DB_FILE = process.env.RESULTS_DB_PATH || path.join(__dirname, 'results.db');
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
const db = new Database(DB_FILE);
db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    slug TEXT PRIMARY KEY,
    url TEXT,
    sizeMB REAL,
    carbonEstimate REAL,
    percentile INTEGER,
    grade TEXT,
    timestamp INTEGER
  );
`);

const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day

function slugify(site) {
  try {
    const h = new URL(site).hostname;
    return h.replace(/[^a-z0-9]/gi,'-').toLowerCase();
  } catch {
    return site.replace(/[^a-z0-9]/gi,'-').toLowerCase();
  }
}
function getCached(slug) {
  const row = db.prepare('SELECT * FROM results WHERE slug=?').get(slug);
  if (!row || Date.now() - row.timestamp > CACHE_TTL) return null;
  return row;
}

// ─── Carbon math helpers ───────────────────────────────────────────────────────
function gradeFor(g) {
  if (g <= 0.095) return 'A+';
  if (g <= 0.186) return 'A';
  if (g <= 0.341) return 'B';
  if (g <= 0.493) return 'C';
  if (g <= 0.656) return 'D';
  if (g <= 0.846) return 'E';
  return 'F';
}
function percentileFor(g) {
  const pct = Math.max(0, Math.min(100, Math.round((0.846 - Math.min(g,0.846)) / 0.846 * 100)));
  return pct;
}

// ─── “AI‑Powered” size via PageSpeed ──────────────────────────────────────────
async function fetchPageWeight(url) {
  try {
    const api = `https://www.googleapis.com/pagespeed/v5/runPagespeed?url=${encodeURIComponent(url)}`;
    const r = await axios.get(api, { timeout: 15_000 });
    const bytes = r.data.lighthouseResult.audits['total-byte-weight'].numericValue || 0;
    return bytes / (1024*1024);
  } catch {
    // fallback estimate
    return 1.5;
  }
}

// ─── Routes ────────────────────────────────────────────────────────────────────
// 1) Full carbon check
app.post('/api/check-carbon', limiterCheck, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL.' });

  const slug = slugify(url);
  try {
    const sizeMB = await fetchPageWeight(url);
    const carbon = +(sizeMB * 0.81 * 442 / 1024).toFixed(2);
    const pct    = percentileFor(carbon);
    const grade  = gradeFor(carbon);

    db.prepare(`
      INSERT OR REPLACE INTO results
      (slug,url,sizeMB,carbonEstimate,percentile,grade,timestamp)
      VALUES(?,?,?,?,?,?,?)
    `).run(slug, url, sizeMB, carbon, pct, grade, Date.now());

    return res.json({ slug, url, sizeMB, carbonEstimate: carbon, percentile: pct, grade });
  } catch (e) {
    console.error('Carbon check error:', e);
    return res.status(500).json({ error: 'Carbon check failed.' });
  }
});

// 2) Badge loader (cache‑only)
app.get('/api/trace', limiterBadge, (req, res) => {
  const { site } = req.query;
  if (!site) return res.status(400).json({ error: 'Missing site.' });

  const slug = slugify(site);
  const row  = getCached(slug);
  if (!row) return res.status(404).json({ error: 'No recent data. Run a check first.' });
  return res.json(row);
});

// 3) Lookup last result
app.get('/api/results/:slug', (req, res) => {
  const row = getCached(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Not found.' });
  return res.json(row);
});

// Badge script
app.get('/greentrace-badge.js', limiterBadge, (req, res) => {
  res.setHeader('Content-Type','application/javascript');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.sendFile(path.join(__dirname,'public','greentrace-badge.js'));
});

// Logo
app.get('/GreenTraceLogo.svg', (req, res) => {
  res.setHeader('Content-Type','image/svg+xml');
  res.setHeader('Cache-Control','public,max-age=86400');
  res.sendFile(path.join(__dirname,'public','GreenTraceLogo.svg'));
});

// Health & errors
app.get('/healthz', (_,_res)=>_res.send('OK'));
app.use((_,res) => res.status(404).json({ error:'Not found' }));
app.use((err,_,res,__) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error:'Internal error' });
});

app.listen(PORT, ()=>console.log(`🚀 GreenTrace API on port ${PORT}`));
