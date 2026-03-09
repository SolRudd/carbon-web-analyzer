'use strict';
require('dotenv').config();

const path       = require('path');
const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const axios      = require('axios');
const { createClient } = require('@supabase/supabase-js');

// ── App Initialization ─────────────────────────────
const app   = express();
const PORT  = Number(process.env.PORT) || 8080;
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Middleware & Security ───────────────────────────
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json());

// ── Rate Limiters ───────────────────────────────────
const limiterCheck       = rateLimit({ windowMs: 24*60*60*1000, max: 20 });
const limiterBadge       = rateLimit({ windowMs:    60*1000, max: 60 });
const limiterTraceOrCheck= rateLimit({ windowMs:    60*1000, max: 12 });

// ── CORS Rules ──────────────────────────────────────
// allow badge endpoints from anywhere:
const badgeCors = cors({ origin:'*', methods:['GET'] });

// allow API calls from your frontends (and any badge user)
app.use(cors({
  origin: true,   // echo back whatever Origin header the client sent
  methods: ['GET','POST'],
  allowedHeaders: ['Content-Type','X-API-Key']
}));

// ── Badge & Static File Routes ──────────────────────
app.get('/greentrace-badge.js', badgeCors, limiterBadge, (req,res) => {
  res.type('application/javascript');
  res.set('Cache-Control','public,max-age=3600');
  res.sendFile(path.join(__dirname,'public','greentrace-badge.js'));
});

// Helper: Validate hex colour
function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

// ⬇︎ New: truly static SVG badge
app.get('/api/badge.svg', badgeCors, limiterBadge, async (req, res) => {
  const theme = (req.query.theme||'auto').toLowerCase();
  const site  = req.query.url;
  const customBgColor = req.query.bgColor;
  const customAccentColor = req.query.accentColor;
  
  if (!site) {
    res.set('Content-Type','image/svg+xml');
    return res.status(400).send(`<svg><text x="0" y="15" fill="red">Missing url</text></svg>`);
  }

  let data;
  try {
    const r = await axios.get(
      `https://${req.get('host')}/api/trace?site=${encodeURIComponent(site)}`,
      { timeout:5000 }
    );
    data = r.data;
  } catch (e) {
    if (e.response && e.response.status === 404) {
      res.set('Content-Type','image/svg+xml');
      return res.status(200).send(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="40">
        <rect width="240" height="40" fill="#f3f4f6" rx="4"/>
        <text x="10" y="25" fill="#374151" font-family="Inter,system-ui" font-size="12" font-weight="500">
          No data - run a scan first
        </text>
      </svg>`);
    }
    res.set('Content-Type','image/svg+xml');
    return res.status(500).send(`<svg><text x="0" y="15" fill="red">Error</text></svg>`);
  }

  const light = { fg:'#0F172A', bg:'#fff', border:'#16A34A', sub:'#475569' };
  const dark  = { fg:'#e5e7eb', bg:'#1f2937', border:'#16A34A', sub:'#94a3b8' };
  let pick = theme==='dark'
    ? dark
    : theme==='light'
      ? light
      : (req.get('sec-ch-prefers-color-scheme')==='dark' ? dark : light);

  // Apply custom colours if provided and valid
  if (customBgColor && isValidHex(customBgColor)) {
    pick.bg = customBgColor;
  }
  if (customAccentColor && isValidHex(customAccentColor)) {
    pick.border = customAccentColor;
  }

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
</svg>`;
  res.set({
    'Content-Type':'image/svg+xml',
    'Cache-Control':'public,max-age=3600'
  });
  res.send(svg);
});
// ⬆︎ End static SVG badge

app.use(express.static(path.join(__dirname,'public')));
app.get('/healthz', (_req,res) => res.send('OK'));

// ── “Trace” endpoint: only return cached ───────────
app.get('/api/trace', badgeCors, limiterBadge, async (req,res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Missing site.' });
  const row = await getCached(slugify(site));
  if (!row) return res.status(404).json({ error:'No data—run a check first.' });
  res.json(row);
});

// ── “Trace or Check” endpoint ──────────────────────
app.get('/api/trace-or-check', badgeCors, limiterTraceOrCheck, async (req,res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error:'Missing site.' });

  const norm = site.startsWith('http') ? site : `https://${site}`;
  let host;
  try { host = new URL(norm).hostname; }
  catch { return res.status(400).json({ error:'Bad URL.' }); }

  const cached = await getCached(slugify(norm));
  if (cached) return res.json(cached);

  try {
    const data = await performCarbonCheck(norm, host);
    res.json(data);
  } catch (e) {
    console.error('[trace-or-check] failed:', e.message);
    res.status(500).json({ error:'Trace failed' });
  }
});

// ── Alias GET for /api/check-carbon ────────────────
app.get('/api/check-carbon', limiterCheck, async (req,res) => {
  const site = req.query.url;
  if (!site) return res.status(400).json({ error:'Missing url query param.' });
  let host;
  try { host = new URL(site).hostname; }
  catch { return res.status(400).json({ error:'Bad URL.' }); }

  try {
    const data = await performCarbonCheck(site, host);
    res.json(data);
  } catch (err) {
    console.error('[/api/check-carbon GET] failed:', err.message);
    res.status(500).json({ error:'Failed to perform carbon check.' });
  }
});

// ── POST /api/check-carbon ─────────────────────────
app.post('/api/check-carbon', limiterCheck, async (req,res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error:'Missing URL.' });
  let host;
  try { host = new URL(site).hostname; }
  catch { return res.status(400).json({ error:'Bad URL.' }); }

  try {
    const data = await performCarbonCheck(site, host);
    res.json(data);
  } catch (err) {
    console.error('[/api/check-carbon POST] failed:', err.message);
    res.status(500).json({ error:'Failed to perform carbon check.' });
  }
});

// ── Helpers ─────────────────────────────────────────
const TTL = process.env.DEBUG_TTL_ZERO ? 0 : 24*60*60*1000;

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
  const info = row.result_data || {};
  const lighthouseScores = info.lighthouseScores || null;
  return {
    slug:           row.slug,
    url:            row.url,
    greenHost:      !!row.green_host,
    carbonEstimate: +row.carbon_estimate,
    percentile:     +row.percentile,
    reductionPct:   +row.reduction_pct,
    grade:          row.grade,
    lighthouseScores,
    timestamp:      new Date(row.created_at).getTime()
  };
}

async function performCarbonCheck(norm, host) {
  const [ green, sizeInfo ] = await Promise.all([ checkGreen(host), fetchSize(norm) ]);
  const sizeMB       = (sizeInfo.bytes||0)/(1024*1024);
  const carbon        = calcCO2(sizeMB, green);
  const percentile    = percentileFromCarbon(carbon);
  const reductionPct  = green ? totalGreenReductionPct() : 0;
  const slug          = slugify(sizeInfo.finalUrl||norm);
  const grade         = gradeFor(carbon);
  const lighthouseScores = sizeInfo.lighthouseScores || null;

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
      result_data:     { sizeInfo, carbon, percentile, reductionPct, grade, lighthouseScores }
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
    lighthouseScores,
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

async function runPSI(url, strat, key) {
  const api=`https://www.googleapis.com/pagespeedonline/v5/runPagespeed`
    +`?url=${encodeURIComponent(url)}`
    +`&strategy=${strat}`
    +`&category=performance`
    +`&category=accessibility`
    +`&category=best-practices`
    +`&category=seo`
    +`&key=${key}`;
  const r=await axios.get(api,{timeout:30000});
  const lr=r.data.lighthouseResult;
  const b=lr?.audits?.['total-byte-weight']?.numericValue||0;
  const items=lr?.audits?.['resource-summary']?.details?.items||[];
  const sum=items.reduce((s,i)=>s+(i.transferSize||0),0);
  const categories = lr?.categories || {};
  const toPct = (score) =>
    typeof score === 'number' && Number.isFinite(score)
      ? Math.max(0, Math.min(100, Math.round(score * 100)))
      : null;
  return {
    bytes:Math.max(b,sum),
    finalUrl:lr.finalDisplayedUrl||url,
    lighthouseScores: {
      performance:   toPct(categories.performance?.score),
      accessibility: toPct(categories.accessibility?.score),
      bestPractices: toPct(categories['best-practices']?.score),
      seo:           toPct(categories.seo?.score)
    }
  };
}

async function htmlOnlyEstimateMB(url) {
  try {
    const r = await axios.get(url,{timeout:12000,headers:{'User-Agent':'Mozilla/5.0'}});
    const b = Buffer.byteLength(r.data||'','utf8');
    const e = Math.max(b*7, b+80*1024);
    return e/(1024*1024);
  } catch {
    return 1.7;
  }
}

async function fetchSize(url) {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) {
    const mb=await htmlOnlyEstimateMB(url);
    return { bytes:mb*1024*1024, finalUrl:url };
  }
  try {
    const [d,m]=await Promise.allSettled([
      runPSI(url,'desktop',key),
      runPSI(url,'mobile', key)
    ]);
    let best=d.status==='fulfilled'?d.value:null;
    if(m.status==='fulfilled'&&(!best||m.value.bytes>best.bytes))best=m.value;
    if(best)return best;
    throw new Error('PSI both failed');
  } catch {
    const mb=await htmlOnlyEstimateMB(url);
    return { bytes:mb*1024*1024, finalUrl:url };
  }
}

async function checkGreen(host) {
  try {
    const { data } = await axios.get(
      `https://api.thegreenwebfoundation.org/greencheck/${host}`,
      { timeout:8000 }
    );
    return !!data.green;
  } catch {
    return false;
  }
}

// ── Start Server ────────────────────────────────────
app.listen(PORT,'0.0.0.0',()=> {
  console.log(`🚀 GreenTrace API listening on port ${PORT}`);
});
