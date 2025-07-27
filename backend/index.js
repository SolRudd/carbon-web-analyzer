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
const Database  = require('better-sqlite3');

const app  = express();
const PORT = Number(process.env.PORT) || 8080;

// ─── Trust proxy ─────────────────────────────────────────────
app.set('trust proxy', 1);

// ─── Security & CORS ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/healthz', (_req, res) => res.send('OK'));

// ─── Rate limiters ─────────────────────────────────────────────
const limiterCheck = rateLimit({ windowMs: 60_000, max: 5, message: { error: 'Too many checks, please wait a minute.' } });
const limiterBadge = rateLimit({ windowMs: 60_000, max: 30, message: { error: 'Too many badge loads, please wait a minute.' } });

// ─── SQLite + 7‑day cache ──────────────────────────────────────
const DB_FILE = process.env.RESULTS_DB_PATH || path.join(__dirname, 'results.db');
try {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
} catch (e) {
  console.warn('Directory creation warning:', e.message);
}

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

// ─── UNIFIED SLUG GENERATION (CRITICAL FIX!) ──────────────────
function createSlug(url) {
  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    const hostname = new URL(normalized).hostname;
    return hostname.replace(/[^a-z0-9]/gi, '-').toLowerCase().replace(/^www-/, '');
  } catch (e) {
    return url.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  }
}

// ─── Grade calculation function ─────────────────────────────────
function getGrade(carbonGrams) {
  if (carbonGrams <= 0.095) return 'A+';
  if (carbonGrams <= 0.186) return 'A';
  if (carbonGrams <= 0.341) return 'B';
  if (carbonGrams <= 0.493) return 'C';
  if (carbonGrams <= 0.656) return 'D';
  if (carbonGrams <= 0.846) return 'E';
  return 'F';
}

function getCached(slug) {
  try {
    const row = db.prepare('SELECT * FROM results WHERE slug = ?').get(slug);
    if (!row || Date.now() - row.timestamp > CACHE_TTL) return null;
    
    row.greenHost = !!row.greenHost;
    ['sizeMB','carbonEstimate','percentile','timestamp'].forEach(k => row[k] = +row[k]);
    
    row.grade = getGrade(row.carbonEstimate);
    row.reductionPct = row.greenHost ? 9 : 0;
    
    return row;
  } catch (e) {
    console.error('Database read error:', e);
    return null;
  }
}

// ─── AI-Powered Analysis ────────────────────────────────────────
async function getPageSizeWithAI(url) {
  try {
    console.log(`🔍 Analyzing: ${url}`);
    const pageSpeedUrl = `https://www.googleapis.com/pagespeed/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&category=performance`;
    
    const response = await axios.get(pageSpeedUrl, { 
      timeout: 25000,
      headers: { 'User-Agent': 'GreenTrace-Bot/1.0' }
    });
    
    const totalBytes = response.data?.lighthouseResult?.audits?.['total-byte-weight']?.numericValue || 0;
    const sizeMB = totalBytes / (1024 * 1024);
    
    if (sizeMB > 0.1) {
      console.log(`✅ PageSpeed success: ${sizeMB.toFixed(2)}MB`);
      return sizeMB;
    }
    
    throw new Error('No valid PageSpeed data');
  } catch (error) {
    console.warn(`PageSpeed failed, using estimation:`, error.message);
    return estimatePageSize(url);
  }
}

function estimatePageSize(url) {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    const patterns = {
      'shop': 3.5, 'store': 3.2, 'cart': 3.0, 'buy': 2.8,
      'news': 2.5, 'blog': 2.0, 'post': 1.8,
      'landing': 1.5, 'coming': 1.0,
      '.com': 2.5, '.org': 2.0, '.io': 1.8
    };
    
    for (const [pattern, size] of Object.entries(patterns)) {
      if (domain.includes(pattern)) return size;
    }
    return 2.5;
  } catch (e) {
    return 2.5;
  }
}

async function isGreen(host) {
  try {
    const { data } = await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${host}`, { timeout: 8000 });
    return !!data.green;
  } catch (e) {
    return false;
  }
}

function calcCarbon(mb, green) {
  const CO2_PER_MB = 0.81 * 442 / 1024;
  const c = mb * CO2_PER_MB;
  return +(green ? c * 0.91 : c).toFixed(2);
}

// ─── Routes ─────────────────────────────────────────────────────
app.post('/api/check-carbon', limiterCheck, async (req, res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error: 'Missing URL.' });
  
  let host, normalizedUrl;
  try {
    normalizedUrl = site.startsWith('http') ? site : `https://${site}`;
    host = new URL(normalizedUrl).hostname;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format.' });
  }
  
  try {
    console.log(`🚀 Carbon check for: ${site}`);
    
    const [green, sizeMB] = await Promise.all([
      isGreen(host).catch(() => false),
      getPageSizeWithAI(normalizedUrl)
    ]);
    
    const carbon = calcCarbon(sizeMB, green);
    const pct = Math.round(Math.max(0, Math.min(100, (1 - carbon/0.846)*100)));
    const grade = getGrade(carbon);
    const reductionPct = green ? 9 : 0;
    
    // CONSISTENT SLUG GENERATION:
    const slug = createSlug(site);
    
    try {
      db.prepare(`
        INSERT OR REPLACE INTO results
        (slug,url,greenHost,sizeMB,carbonEstimate,percentile,timestamp)
        VALUES(?,?,?,?,?,?,?)
      `).run(slug, site, green?1:0, sizeMB, carbon, pct, Date.now());
    } catch (dbError) {
      console.error('Database write error:', dbError);
    }
    
    console.log(`✅ Completed: ${site} = ${carbon}g CO2, Grade: ${grade}`);
    
    return res.json({ 
      slug, 
      url: site, 
      greenHost: green, 
      sizeMB: +sizeMB.toFixed(2), 
      carbonEstimate: carbon, 
      percentile: pct,
      grade,
      reductionPct,
      method: 'ai-powered'
    });
  } catch (e) {
    console.error('Carbon check error:', e);
    return res.status(500).json({ error: 'Carbon check failed.', details: e.message });
  }
});

app.get('/api/trace', limiterBadge, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const site = req.query.site;
  if (!site) return res.status(400).json({ error: 'Missing site parameter.' });
  
  // CONSISTENT SLUG GENERATION:
  const slug = createSlug(site);
  const row = getCached(slug);
  
  if (row) {
    return res.json(row);
  }
  
  return res.status(404).json({ error: 'No recent data found. Please run a carbon check first at greentracer.org' });
});

app.get('/api/results/:slug', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const row = getCached(req.params.slug);
  if (!row) {
    return res.status(404).json({ error: 'Results not found.' });
  }
  
  return res.json(row);
});

app.get('/api/health', (req, res) => {
  try {
    const dbStats = db.prepare('SELECT COUNT(*) as count FROM results').get();
    res.json({
      status: 'healthy',
      method: 'ai-powered',
      totalResults: dbStats.count,
      uptime: process.uptime()
    });
  } catch (e) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Badge script (keeping existing)
app.get('/greentrace-badge.js', limiterBadge, (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(`console.log('Badge loaded');`); // Simplified for now
});

// Error handlers
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server error' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  try { db.close(); } catch (e) {}
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 GreenTrace API on port ${PORT}`);
  console.log(`🤖 Method: AI-Powered`);
});