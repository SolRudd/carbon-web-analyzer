'use strict';
require('dotenv').config();

const path       = require('path');
const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const axios      = require('axios');
const http       = require('http');
const https      = require('https');
const dns        = require('dns').promises;
const net        = require('net');
const crypto     = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// ── App Initialization ─────────────────────────────
const app   = express();
const PORT  = Number(process.env.PORT) || 8080;
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Shared axios client (keep-alive + sensible defaults)
const httpClient = axios.create({
  timeout: 15000,
  httpAgent:  new http.Agent({ keepAlive: true, maxSockets: 50 }),
  httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 50 }),
  headers: { 'User-Agent': 'GreenTrace/1.1 (+https://greentracer.org)' },
  validateStatus: s => s >= 200 && s < 500
});

// ── Middleware & Security ───────────────────────────
app.set('trust proxy', 1);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin' }
}));
app.use(express.json({ limit: '256kb' }));

// ── Rate Limiters ───────────────────────────────────
const limiterCheck         = rateLimit({ windowMs: 24*60*60*1000, max: 20 });
const limiterBadge         = rateLimit({ windowMs:    60*1000,   max: 60 });
const limiterTraceOrCheck  = rateLimit({ windowMs:    60*1000,   max: 12 });

// ── CORS Rules ──────────────────────────────────────
// Badge can be fetched from anywhere:
const badgeCors = cors({ origin:'*', methods:['GET'] });

// API: keep your current permissive setting (safe for now)
// If you want to tighten later, set origin to an allowlist array.
app.use(cors({
  origin: true,   // echoes Origin automatically
  methods: ['GET','POST'],
  allowedHeaders: ['Content-Type','X-API-Key']
}));

// ── Small helpers (security, url, cache) ───────────
const TTL = process.env.DEBUG_TTL_ZERO ? 0 : 24*60*60*1000;
const API_KEY = process.env.API_KEY || ''; // optional

function requireApiKey(req, res, next) {
  if (!API_KEY) return next(); // not enforced if unset
  const k = req.get('X-API-Key');
  if (k && crypto.timingSafeEqual(Buffer.from(k), Buffer.from(API_KEY))) return next();
  return res.status(401).json({ error: 'Unauthorized', code: 'NO_API_KEY' });
}

function normalizeUrl(input) {
  if (!input || typeof input !== 'string') throw new Error('EMPTY_URL');
  let s = input.trim();
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  const u = new URL(s);
  u.hash = ''; // drop fragments
  // collapse multiple trailing slashes in path
  u.pathname = u.pathname.replace(/\/+$/,'').replace(/\/{2,}/g,'/');
  return u.toString();
}

async function assertPublicHttp(urlStr) {
  const u = new URL(urlStr);
  if (!['http:', 'https:'].includes(u.protocol)) throw Object.assign(new Error('BAD_SCHEME'), { code:'BAD_SCHEME' });
  if (u.username || u.password) throw Object.assign(new Error('AUTH_IN_URL'), { code:'AUTH_IN_URL' });
  if (u.href.length > 2048) throw Object.assign(new Error('URL_TOO_LONG'), { code:'URL_TOO_LONG' });

  const records = await dns.lookup(u.hostname, { all: true, verbatim: true });
  for (const { address } of records) {
    if (isPrivate(address)) throw Object.assign(new Error('PRIVATE_ADDRESS_BLOCKED'), { code:'SSRF_BLOCKED' });
  }
}

function isPrivate(ip) {
  // IPv4
  if (net.isIPv4(ip)) {
    return ip.startsWith('10.') ||
           ip.startsWith('127.') ||
           ip.startsWith('172.16.') || ip.startsWith('172.17.') || ip.startsWith('172.18.') || ip.startsWith('172.19.') ||
           ip.startsWith('172.2') ||  // covers 172.20.0.0–172.29.255.255
           ip.startsWith('172.30.') || ip.startsWith('172.31.') ||
           ip.startsWith('192.168.') ||
           ip === '0.0.0.0';
  }
  // IPv6
  return ip === '::1' || ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80');
}

function slugify(site) {
  try {
    const u = new URL(site);
    const cleaned = u.origin + u.pathname.replace(/\/+$/,'');
    return (new URL(cleaned).hostname + new URL(cleaned).pathname)
      .replace(/[^a-z0-9]/gi,'-').toLowerCase().replace(/-+$/,'');
  } catch {
    return site.toLowerCase().replace(/[^a-z0-9]/gi,'-').replace(/-+$/,'');
  }
}

async function getCached(slug) {
  const s = slug.toLowerCase().replace(/-+$/,'');
  const { data: row, error } = await supabase
    .from('results').select('*').eq('slug', s).single();
  if (error || !row) return null;
  if (TTL!==0 && Date.now() - new Date(row.created_at).getTime() > TTL) return null;
  return rowToPublic(row);
}

// returns cached even if stale, plus a flag
async function getCachedAny(slug) {
  const s = slug.toLowerCase().replace(/-+$/,'');
  const { data: row, error } = await supabase
    .from('results').select('*').eq('slug', s).single();
  if (error || !row) return { row:null, stale:false };
  const stale = TTL!==0 && (Date.now() - new Date(row.created_at).getTime() > TTL);
  return { row, stale };
}

function rowToPublic(row) {
  return {
    slug:           row.slug,
    url:            row.url,
    greenHost:      !!row.green_host,
    carbonEstimate: +row.carbon_estimate,
    percentile:     +row.percentile,
    reductionPct:   +row.reduction_pct,
    grade:          row.grade,
    timestamp:      new Date(row.created_at).getTime()
  };
}

// ── Badge & Static File Routes ──────────────────────
app.get('/greentrace-badge.js', badgeCors, limiterBadge, (req,res) => {
  res.type('application/javascript');
  res.set('Cache-Control','public,max-age=3600, stale-while-revalidate=86400');
  res.sendFile(path.join(__dirname,'public','greentrace-badge.js'));
});

// Truly static SVG badge with better caching (ETag + SWR)
app.get('/api/badge.svg', badgeCors, limiterBadge, async (req, res) => {
  const theme = (req.query.theme||'auto').toLowerCase();
  const site  = req.query.url;
  res.set('Content-Type','image/svg+xml');

  if (!site) {
    return res.status(400).send(`<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fill="red">Missing url</text></svg>`);
  }

  let data;
  try {
    const r = await httpClient.get(
      `https://${req.get('host')}/api/trace-or-check?site=${encodeURIComponent(site)}`,
      { timeout:5000 }
    );
    if (r.status >= 400) throw new Error('TRACE_ERROR');
    data = r.data;
  } catch (e) {
    return res.status(500).send(`<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fill="red">Error</text></svg>`);
  }

  const light = { fg:'#0F172A', bg:'#fff', border:'#16A34A', sub:'#475569' };
  const dark  = { fg:'#e5e7eb', bg:'#1f2937', border:'#16A34A', sub:'#94a3b8' };
  const pick = theme==='dark'
    ? dark
    : theme==='light'
      ? light
      : (req.get('sec-ch-prefers-color-scheme')==='dark' ? dark : light);

  const co2 = Number(data.carbonEstimate||0).toFixed(2);
  const pct = data.percentile!=null ? data.percentile : '--';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="40">
  <rect width="120" height="40" fill="${pick.bg}" rx="4"/>
  <rect x="120" width="120" height="40" fill="${pick.border}" rx="4"/>
  <text x="8" y="25" fill="${pick.fg}" font-family="Inter,system-ui" font-size="14" font-weight="600">
    ${co2}g CO₂/view
  </text>
  <text x="132" y="25" fill="#fff" font-family="Inter,system-ui" font-size="14" font-weight="600">
    Cleaner ${pct}%
  </text>
</svg>`.trim();

  const etag = crypto.createHash('sha1').update(`${theme}.${co2}.${pct}`).digest('hex');
  if (req.get('If-None-Match') === etag) return res.status(304).end();

  res.set({
    'ETag': etag,
    'Cache-Control':'public,max-age=3600, stale-while-revalidate=86400'
  });
  res.send(svg);
});

app.use(express.static(path.join(__dirname,'public')));
app.get('/healthz', async (_req,res) => {
  // tiny Supabase ping
  try {
    await supabase.from('results').select('slug').limit(1);
    res.send('OK');
  } catch {
    res.status(500).send('DB_ERROR');
  }
});

// ── “Trace” endpoint: only return cached ───────────
app.get('/api/trace', badgeCors, limiterBadge, async (req,res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Missing site.', code:'MISSING_SITE' });
  const row = await getCached(slugify(site));
  if (!row) return res.status(404).json({ error:'No data—run a check first.', code:'NOT_FOUND' });
  res.json(row);
});

// ── New SWR endpoint: serve cached fast, refresh if stale ─────────
app.get('/api/trace-or-refresh', badgeCors, limiterTraceOrCheck, async (req, res) => {
  const q = req.query.site;
  if (!q) return res.status(400).json({ error: 'Missing site.', code: 'MISSING_SITE' });

  let norm;
  try {
    norm = normalizeUrl(q);
    await assertPublicHttp(norm);
  } catch (e) {
    return res.status(400).json({ error:'Bad URL.', code: e.code || 'BAD_URL' });
  }

  const { row, stale } = await getCachedAny(slugify(norm));
  if (row) {
    res.json({ ...rowToPublic(row), stale });
    if (stale) {
      // Fire and forget refresh
      performCarbonCheck(norm, new URL(norm).hostname).catch(err =>
        console.error('[refresh job] failed:', err.message)
      );
    }
    return;
  }

  // No cache? compute once
  try {
    const fresh = await performCarbonCheck(norm, new URL(norm).hostname);
    res.json(fresh);
  } catch (e) {
    console.error('[trace-or-refresh] failed:', e.message);
    res.status(500).json({ error:'Trace failed', code:'TRACE_FAILED' });
  }
});

// ── “Trace or Check” endpoint (kept for compatibility) ───────────
app.get('/api/trace-or-check', badgeCors, limiterTraceOrCheck, async (req,res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Missing site.', code:'MISSING_SITE' });

  let norm, host;
  try {
    norm = normalizeUrl(site);
    await assertPublicHttp(norm);
    host = new URL(norm).hostname;
  } catch {
    return res.status(400).json({ error:'Bad URL.', code:'BAD_URL' });
  }

  const cached = await getCached(slugify(norm));
  if (cached) return res.json(cached);

  try {
    const data = await performCarbonCheck(norm, host);
    res.json(data);
  } catch (e) {
    console.error('[trace-or-check] failed:', e.message);
    res.status(500).json({ error:'Trace failed', code:'TRACE_FAILED' });
  }
});

// ── Alias GET for /api/check-carbon ────────────────
app.get('/api/check-carbon', limiterCheck, async (req,res) => {
  const input = req.query.url;
  if (!input) return res.status(400).json({ error:'Missing url query param.', code:'MISSING_URL' });

  let site, host;
  try {
    site = normalizeUrl(input);
    await assertPublicHttp(site);
    host = new URL(site).hostname;
  } catch (e) {
    return res.status(400).json({ error:'Bad URL.', code: e.code || 'BAD_URL' });
  }

  try {
    const data = await performCarbonCheck(site, host);
    res.json(data);
  } catch (err) {
    console.error('[/api/check-carbon GET] failed:', err.message);
    res.status(500).json({ error:'Failed to perform carbon check.', code:'CHECK_FAILED' });
  }
});

// ── POST /api/check-carbon (now supports optional API Key) ───────
app.post('/api/check-carbon', requireApiKey, limiterCheck, async (req,res) => {
  const input = req.body?.url;
  if (!input) return res.status(400).json({ error:'Missing URL.', code:'MISSING_URL' });

  let site, host;
  try {
    site = normalizeUrl(input);
    await assertPublicHttp(site);
    host = new URL(site).hostname;
  } catch (e) {
    return res.status(400).json({ error:'Bad URL.', code: e.code || 'BAD_URL' });
  }

  try {
    const data = await performCarbonCheck(site, host);
    res.json(data);
  } catch (err) {
    console.error('[/api/check-carbon POST] failed:', err.message);
    res.status(500).json({ error:'Failed to perform carbon check.', code:'CHECK_FAILED' });
  }
});

// ── Core logic (unchanged maths; safer HTTP) ─────────────────────
async function performCarbonCheck(norm, host) {
  const [ green, sizeInfo ] = await Promise.all([ checkGreen(host), fetchSize(norm) ]);
  const sizeMB        = (sizeInfo.bytes||0)/(1024*1024);
  const carbon        = calcCO2(sizeMB, green);
  const percentile    = percentileFromCarbon(carbon);
  const reductionPct  = green ? totalGreenReductionPct() : 0;
  const slug          = slugify(sizeInfo.finalUrl||norm);
  const grade         = gradeFor(carbon);

  const { data: row, error } = await supabase
    .from('results')
    .upsert({
      slug,
      url:             sizeInfo.finalUrl||norm,
      green_host:      green,
      carbon_estimate: carbon,
      percentile,
      reduction_pct:   reductionPct,
      grade,
      result_data:     { sizeInfo, carbon, percentile, reductionPct, grade }
    }, { onConflict:['slug'] })
    .select().single();

  if (error) throw error;
  return {
    slug:           row.slug,
    url:            row.url,
    greenHost:      !!row.green_host,
    carbonEstimate: +row.carbon_estimate,
    percentile:     +row.percentile,
    reductionPct:   +row.reduction_pct,
    grade:          row.grade,
    timestamp:      new Date(row.created_at).getTime()
  };
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

function percentileFromCarbon(carbon) {
  const max = 0.846;
  return Math.round(Math.max(0,Math.min(100,((max-Math.min(carbon,max))/max)*100)));
}

function totalGreenReductionPct() {
  const D=0.06,N=0.014,U=0.123;
  return Math.round((D/(D+N+U))*25);
}

function calcCO2(sizeMB, isGreen) {
  const D=0.06,N=0.014,U=0.123,I=442;
  const gb=sizeMB/1024;
  let dc=gb*D*(isGreen?0.75:1);
  const kwh=dc+gb*N+gb*U;
  const g=kwh*I;
  return g<0.01?+g.toPrecision(2):g<1?+g.toFixed(3):+g.toFixed(2);
}

// PSI via Google API (desktop+mobile); safe HTTP client
async function runPSI(url, strat, key) {
  const api=`https://www.googleapis.com/pagespeedonline/v5/runPagespeed`
    +`?url=${encodeURIComponent(url)}&strategy=${strat}&category=performance&key=${key}`;
  const r = await httpClient.get(api, { timeout: 30000 });
  if (r.status >= 400) throw new Error(`PSI_${r.status}`);
  const lr = r.data?.lighthouseResult || {};
  const b  = lr.audits?.['total-byte-weight']?.numericValue || 0;
  const items = lr.audits?.['resource-summary']?.details?.items || [];
  const sum = items.reduce((s,i)=>s+(i.transferSize||0),0);
  return { bytes:Math.max(b,sum), finalUrl:lr.finalDisplayedUrl || url };
}

// Fallback HTML-only estimate
async function htmlOnlyEstimateMB(url) {
  try {
    const r = await httpClient.get(url, { timeout: 12000, headers:{'User-Agent':'Mozilla/5.0'} });
    const b = Buffer.byteLength(r.data||'','utf8');
    const e = Math.max(b*7, b+80*1024);
    return e/(1024*1024);
  } catch {
    return 1.7;
  }
}

// Size fetcher (desktop+mobile, pick larger)
async function fetchSize(url) {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) {
    const mb = await htmlOnlyEstimateMB(url);
    return { bytes:mb*1024*1024, finalUrl:url };
  }
  try {
    const [d,m] = await Promise.allSettled([
      runPSI(url,'desktop',key),
      runPSI(url,'mobile', key)
    ]);
    let best = d.status==='fulfilled' ? d.value : null;
    if (m.status==='fulfilled' && (!best || m.value.bytes > best.bytes)) best = m.value;
    if (best) return best;
    throw new Error('PSI both failed');
  } catch {
    const mb = await htmlOnlyEstimateMB(url);
    return { bytes:mb*1024*1024, finalUrl:url };
  }
}

async function checkGreen(host) {
  try {
    const r = await httpClient.get(`https://api.thegreenwebfoundation.org/greencheck/${host}`, { timeout:8000 });
    if (r.status >= 400) return false;
    return !!r.data?.green;
  } catch {
    return false;
  }
}

// ── Start Server ────────────────────────────────────
app.listen(PORT,'0.0.0.0',()=> {
  console.log(`🚀 GreenTrace API listening on port ${PORT}`);
});
