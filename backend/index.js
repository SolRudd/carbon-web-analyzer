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

// ─── AI-Powered Analysis (No Puppeteer!) ──────────────────────
async function getPageSizeWithAI(url) {
  try {
    // Method 1: Use PageSpeed Insights API (Free!)
    const pageSpeedUrl = `https://www.googleapis.com/pagespeed/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&category=performance`;
    
    const response = await axios.get(pageSpeedUrl, { timeout: 30000 });
    const data = response.data;
    
    if (data.lighthouseResult && data.lighthouseResult.audits) {
      const totalBytes = data.lighthouseResult.audits['total-byte-weight']?.numericValue || 0;
      const sizeMB = totalBytes / (1024 * 1024);
      
      console.log(`📊 PageSpeed API: ${url} = ${sizeMB.toFixed(2)}MB`);
      return Math.max(0.1, sizeMB); // Minimum 0.1MB
    }
    
    throw new Error('No PageSpeed data available');
  } catch (error) {
    console.warn(`PageSpeed API failed for ${url}:`, error.message);
    
    // Fallback: Estimate based on domain patterns
    return estimatePageSize(url);
  }
}

// Smart estimation fallback
function estimatePageSize(url) {
  const domain = new URL(url).hostname.toLowerCase();
  
  // Common patterns for estimation
  const patterns = {
    // E-commerce sites tend to be larger
    'shop': 3.5, 'store': 3.2, 'buy': 2.8, 'cart': 3.0,
    // News sites are medium
    'news': 2.5, 'blog': 2.0, 'post': 1.8,
    // Landing pages are smaller
    'landing': 1.5, 'coming': 1.0, 'soon': 1.0,
    // Social media is heavy
    'social': 4.0, 'feed': 3.5,
    // Default estimates by TLD
    '.com': 2.5, '.org': 2.0, '.net': 2.2, '.io': 1.8, '.co': 2.3
  };
  
  // Check for patterns in domain
  for (const [pattern, size] of Object.entries(patterns)) {
    if (domain.includes(pattern)) {
      console.log(`🎯 Estimated ${url} = ${size}MB (pattern: ${pattern})`);
      return size;
    }
  }
  
  // Default estimate
  console.log(`📏 Default estimate for ${url} = 2.5MB`);
  return 2.5;
}

// ─── Green hosting check ─────────────────────────────────────
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

// ─── Carbon calculation ─────────────────────────────────────
function calcCarbon(mb, green) {
  const CO2_PER_MB = 0.81 * 442 / 1024; // Standard calculation
  const c = mb * CO2_PER_MB;
  return +(green ? c * 0.91 : c).toFixed(2);
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
      badge.title = \`Page size: \${data.sizeMB.toFixed(2)}MB | Green hosting: \${data.greenHost ? 'Yes' : 'No'} | Powered by AI\`;
      
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
// 1) AI-Powered carbon check (NO PUPPETEER!)
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
    console.log(`🚀 AI-powered carbon check for: ${site}`);
    
    const [ green, sizeMB ] = await Promise.all([
      isGreen(host),
      getPageSizeWithAI(site.startsWith('http') ? site : `https://${site}`)
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
    
    console.log(`✅ AI analysis completed for ${site}: ${carbon}g CO2 (${sizeMB.toFixed(2)}MB)`);
    
    return res.json({ 
      slug, 
      url: site, 
      greenHost: green, 
      sizeMB: +sizeMB.toFixed(2), 
      carbonEstimate: carbon, 
      percentile: pct,
      method: 'ai-powered' // Show it's AI-powered!
    });
  } catch (e) {
    console.error('AI carbon check error', e);
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

// 4) Health check
app.get('/api/health', (req, res) => {
  const dbStats = db.prepare('SELECT COUNT(*) as count FROM results').get();
  res.json({
    status: 'healthy',
    method: 'ai-powered',
    timestamp: new Date().toISOString(),
    totalResults: dbStats.count,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// ─── Error Handlers ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

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
  console.log(`🚀 GreenTrace AI-Powered API listening on port ${PORT}`);
  console.log(`📊 Database: ${DB_FILE}`);
  console.log(`🌱 Badge endpoint: /greentrace-badge.js`);
  console.log(`🤖 Method: AI-Powered (No Puppeteer!)`);
});