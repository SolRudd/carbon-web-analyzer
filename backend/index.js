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

// ─── Helper functions ──────────────────────────────────────────
const waitFor = ms => new Promise(r => setTimeout(r, ms));

async function getPageSizeMB(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--memory-pressure-off',
        '--max_old_space_size=400'
      ],
      ignoreHTTPSErrors: true
    });
    
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log(`🔍 Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await waitFor(2000);
    
    const bytes = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const res = performance.getEntriesByType('resource') || [];
      const navSize = nav.transferSize || nav.encodedBodySize || 0;
      const resSize = res.reduce((sum, r) => sum + (r.transferSize||r.encodedBodySize||0), 0);
      return navSize + resSize;
    });
    
    return bytes / (1024 * 1024);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// ─── Simple carbon math & green check ─────────────────────────
function calcCarbon(mb, green) {
  const CO2_PER_MB = 0.81 * 442 / 1024;
  const c = mb * CO2_PER_MB;
  return +(green ? c * 0.91 : c).toFixed(2);
}

async function isGreen(host) {
  try {
    const { data } = await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${host}`, {
      timeout: 10000
    });
    return !!data.green;
  } catch (e) {
    console.warn(`Green check failed for ${host}:`, e.message);
    return false;
  }
}

// ─── Badge Script Route ────────────────────────────────────────
app.get('/greentrace-badge.js', limiterBadge, (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  const badgeScript = `
(function() {
  const site = document.currentScript.getAttribute('data-site');
  if (!site) {
    console.error('GreenTrace Badge: data-site attribute is required');
    return;
  }
  
  const apiUrl = 'https://api.greentracer.org/api/trace?site=' + encodeURIComponent(site);
  
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('No data available. Run a carbon check first at greentracer.org');
      }
      return response.json();
    })
    .then(data => {
      const badge = document.createElement('div');
      badge.style.cssText = \`
        display: inline-block;
        padding: 8px 12px;
        background: \${data.percentile > 70 ? '#22c55e' : data.percentile > 40 ? '#f59e0b' : '#ef4444'};
        color: white;
        border-radius: 6px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: 500;
        text-decoration: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        cursor: pointer;
        transition: all 0.2s ease;
      \`;
      
      badge.innerHTML = \`🌱 Carbon: \${data.carbonEstimate}g CO2 (\${data.percentile}%)\`;
      badge.title = \`Page size: \${data.sizeMB.toFixed(2)}MB | Green hosting: \${data.greenHost ? 'Yes' : 'No'}\`;
      
      badge.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-1px)';
        this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
      });
      
      badge.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      });
      
      badge.addEventListener('click', function() {
        window.open('https://greentracer.org', '_blank');
      });
      
      document.currentScript.parentNode.insertBefore(badge, document.currentScript.nextSibling);
    })
    .catch(error => {
      console.error('GreenTrace Badge Error:', error.message);
      const errorBadge = document.createElement('div');
      errorBadge.style.cssText = \`
        display: inline-block;
        padding: 8px 12px;
        background: #6b7280;
        color: white;
        border-radius: 6px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
      \`;
      errorBadge.innerHTML = '🌱 Test at greentracer.org';
      errorBadge.title = 'Click to test your site carbon footprint';
      errorBadge.addEventListener('click', function() {
        window.open('https://greentracer.org', '_blank');
      });
      document.currentScript.parentNode.insertBefore(errorBadge, document.currentScript.nextSibling);
    });
})();
  `;
  
  res.send(badgeScript);
});

// ─── Routes ────────────────────────────────────────────────────
// 1) Full check + cache
app.post('/api/check-carbon', limiterCheck, async (req, res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error:'Missing URL.' });
  
  let host;
  try {
    const urlObj = new URL(site.startsWith('http') ? site : `https://${site}`);
    host = urlObj.hostname;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format.' });
  }
  
  try {
    console.log(`Starting carbon check for: ${site}`);
    
    const [ green, sizeMB ] = await Promise.all([
      isGreen(host),
      getPageSizeMB(site.startsWith('http') ? site : `https://${site}`)
    ]);
    
    const carbon = calcCarbon(sizeMB, green);
    const pct    = Math.round(Math.max(0, Math.min(100, (1 - carbon/0.846)*100)));
    const slug   = host.replace(/[^a-z0-9]/gi,'-').toLowerCase();
    
    // Store in database
    db.prepare(`
      INSERT OR REPLACE INTO results
      (slug,url,greenHost,sizeMB,carbonEstimate,percentile,timestamp)
      VALUES(?,?,?,?,?,?,?)
    `).run(slug, site, green?1:0, sizeMB, carbon, pct, Date.now());
    
    console.log(`✅ Carbon check completed for ${site}: ${carbon}g CO2`);
    
    return res.json({ 
      slug, 
      url: site, 
      greenHost: green, 
      sizeMB: +sizeMB.toFixed(2), 
      carbonEstimate: carbon, 
      percentile: pct 
    });
  } catch (e) {
    console.error('check-carbon error', e);
    return res.status(500).json({ 
      error: 'Carbon check failed.', 
      details: e.message 
    });
  }
});

// 2) Badge loader (cache only)
app.get('/api/trace', limiterBadge, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Missing site parameter.' });
  
  let slug;
  try { 
    const urlObj = new URL(site.startsWith('http') ? site : `https://${site}`);
    slug = urlObj.hostname.replace(/[^a-z0-9]/gi,'-').toLowerCase(); 
  } catch { 
    return res.status(400).json({ error:'Invalid URL.' }); 
  }
  
  const row = getCached(slug);
  if (row) {
    return res.json(row);
  }
  
  return res.status(404).json({ 
    error: 'No recent data found. Please run a carbon check first at greentracer.org' 
  });
});

// 3) Lookup by slug
app.get('/api/results/:slug', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const row = getCached(req.params.slug);
  if (!row) {
    return res.status(404).json({ error:'Results not found.' });
  }
  
  return res.json(row);
});

// 4) Health check with more info
app.get('/api/health', (req, res) => {
  const dbStats = db.prepare('SELECT COUNT(*) as count FROM results').get();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    totalResults: dbStats.count,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// ─── Error Handlers ────────────────────────────────────────────
// Handle 404s
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// ─── Graceful shutdown ─────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  db.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  db.close();
  process.exit(0);
});

// ─── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 GreenTrace API listening on port ${PORT}`);
  console.log(`📊 Database: ${DB_FILE}`);
  console.log(`🌱 Badge endpoint: /greentrace-badge.js`);
});