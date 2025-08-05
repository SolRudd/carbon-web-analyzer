'use strict';
require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// ——— Supabase client ———
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ——— Middleware & Security ———
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json());

// ——— Rate-limits ———
const limiterCheck       = rateLimit({ windowMs: 24*60*60*1000, max: 20 });
const limiterBadge       = rateLimit({ windowMs:    60*1000, max: 60 });
const limiterTraceOrCheck= rateLimit({ windowMs:    60*1000, max: 12 });

// ——— CORS for badge endpoints ———
const badgeCors = cors({ origin:'*', methods:['GET'] });

app.get('/greentrace-badge.js', badgeCors, limiterBadge, (req,res)=>{
  res.type('application/javascript');
  res.set('Cache-Control','public,max-age=3600');
  res.sendFile(path.join(__dirname,'public','greentrace-badge.js'));
});

// ——— “Trace” endpoint (just returns cached) ———
app.get('/api/trace', badgeCors, limiterBadge, async (req,res)=>{
  const site = req.query.site;
  if(!site) return res.status(400).json({ error:'Missing site.' });
  const row = await getCached(slugify(site));
  if(!row) return res.status(404).json({ error:'No data—run a check first.' });
  res.json(row);
});

// ——— “Trace or Check” endpoint ———
app.get('/api/trace-or-check', badgeCors, limiterTraceOrCheck, async (req,res)=>{
  const site = req.query.site;
  if(!site) return res.status(400).json({ error:'Missing site.' });

  const norm = site.startsWith('http') ? site : `https://${site}`;
  let host;
  try { host = new URL(norm).hostname; }
  catch { return res.status(400).json({ error:'Bad URL.' }); }

  const cached = await getCached(slugify(norm));
  if(cached) return res.json(cached);

  try {
    const [green, sizeInfo] = await Promise.all([ checkGreen(host), fetchSize(norm) ]);
    const sizeMB = (sizeInfo.bytes||0)/(1024*1024);
    const carbon = calcCO2(sizeMB, green);
    const percentile   = percentileFromCarbon(carbon);
    const reductionPct = green ? totalGreenReductionPct() : 0;
    const slug         = slugify(sizeInfo.finalUrl||norm);
    const grade        = gradeFor(carbon);

    // — Upsert with ON CONFLICT on slug ——
    const { data: row, error } = await supabase
      .from('results')
      .upsert(
        {
          slug,
          url:          sizeInfo.finalUrl||norm,
          green_host:   green,
          carbon_estimate: carbon,
          percentile,
          reduction_pct:  reductionPct,
          grade,
          result_data:   { sizeInfo, carbon, percentile, reductionPct, grade }
        },
        { onConflict: ['slug'] }
      )
      .select()
      .single();

    if(error) throw error;

    // — Return exactly what the frontend expects ——
    return res.json({
      slug:           row.slug,
      url:            row.url,
      greenHost:      !!row.green_host,
      sizeMB:         +row.result_data.sizeInfo.bytes/(1024*1024),
      carbonEstimate: +row.carbon_estimate,
      percentile:     +row.percentile,
      reductionPct:   +row.reduction_pct,
      grade:          row.grade,
      timestamp:      new Date(row.created_at).getTime()
    });
  } catch(e) {
    console.error('[trace-or-check] failed:', e.message);
    return res.status(500).json({ error:'Trace failed' });
  }
});

// ——— Global CORS for the rest ———
const ALLOWED = [
  'http://localhost:5173',
  'https://greentracer.org',
  'https://www.greentracer.org',
  /^https?:\/\/.*\.vercel\.app$/,
  'https://buzzboost.co.uk'
];
function dynamicCORS(origin,cb){
  if(!origin||ALLOWED.some(r=>typeof r==='string'?r===origin:r.test(origin))){
    cb(null,true);
  } else cb(new Error(`Blocked CORS origin: ${origin}`));
}
app.use(cors({ origin: dynamicCORS, methods:['GET','POST'], allowedHeaders:['Content-Type','X-API-Key'] }));

// ——— Static + Health ———
app.use(express.static(path.join(__dirname,'public')));
app.get('/healthz', (_q,r)=>r.send('OK'));

// ——— Helpers ———
const TTL = process.env.DEBUG_TTL_ZERO ? 0 : 24*60*60*1000;

function slugify(site){
  try {
    const u = new URL(site.startsWith('http')?site:`https://${site}`);
    const clean = u.origin + u.pathname.replace(/\/+$/,'');
    const out = new URL(clean);
    return (out.hostname + out.pathname)
      .replace(/[^a-z0-9]/gi,'-').toLowerCase().replace(/-+$/,'');
  } catch {
    return String(site).toLowerCase().replace(/[^a-z0-9]/gi,'-').replace(/-+$/,'');
  }
}

async function getCached(slug){
  const s = String(slug||'').toLowerCase().replace(/-+$/,'');
  const { data: row, error } = await supabase
    .from('results')
    .select('*')
    .eq('slug', s)
    .single();
  if(error || !row) return null;
  if(TTL!==0 && Date.now()-new Date(row.created_at).getTime()>TTL) return null;
  // unpack JSON
  const info = row.result_data || {};
  return {
    slug:           row.slug,
    url:            row.url,
    greenHost:      !!row.green_host,
    sizeMB:         +(info.sizeInfo?.bytes||0)/(1024*1024),
    carbonEstimate: +row.carbon_estimate,
    percentile:     +row.percentile,
    reductionPct:   +row.reduction_pct,
    grade:          row.grade,
    timestamp:      new Date(row.created_at).getTime()
  };
}

function gradeFor(c){
  if(c<=0.095) return 'A+'; if(c<=0.186) return 'A';
  if(c<=0.341) return 'B'; if(c<=0.493) return 'C';
  if(c<=0.656) return 'D'; if(c<=0.846) return 'E';
  return 'F';
}
function percentileFromCarbon(carbon){
  const max=0.846;
  return Math.round(Math.max(0,Math.min(100,(max-Math.min(carbon,max))/max*100)));
}
function totalGreenReductionPct(){
  const D=0.06,N=0.014,U=0.123;
  return Math.round((D/(D+N+U))*25);
}
function calcCO2(sizeMB,isGreen){
  const D=0.06,N=0.014,U=0.123,I=442;
  const gb=sizeMB/1024;
  let dc=gb*D*(isGreen?0.75:1);
  const kwh=dc+gb*N+gb*U;
  const grams=kwh*I;
  if(grams<0.01) return +grams.toPrecision(2);
  if(grams<1)    return +grams.toFixed(3);
  return +grams.toFixed(2);
}

async function runPSI(url,strat,key){
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`
    + `?url=${encodeURIComponent(url)}`
    + `&strategy=${strat}&category=performance`
    + `&key=${key}`;
  const r = await axios.get(api,{timeout:30000});
  const lr = r.data.lighthouseResult;
  const b  = lr?.audits?.['total-byte-weight']?.numericValue||0;
  const items = lr?.audits?.['resource-summary']?.details?.items||[];
  const sum = items.reduce((s,i)=>s+(i.transferSize||0),0);
  const finalBytes = Math.max(b,sum);
  const finalUrl   = lr.finalDisplayedUrl||lr.finalUrl||url;
  return { bytes: finalBytes, finalUrl };
}

async function htmlOnlyEstimateMB(url){
  try {
    const r = await axios.get(url,{timeout:12000,headers:{'User-Agent':'Mozilla/5.0'}});
    const bytes = Buffer.byteLength(r.data||'','utf8');
    const est = Math.max(bytes*7, bytes+80*1024);
    return est/(1024*1024);
  } catch { return 1.7; }
}

async function fetchSize(url){
  const key = process.env.PAGESPEED_API_KEY;
  if(!key){
    console.warn('No PSI key, falling back to HTML estimate');
    const mb = await htmlOnlyEstimateMB(url);
    return { bytes:mb*1024*1024, finalUrl:url };
  }
  try {
    const [d,m] = await Promise.allSettled([
      runPSI(url,'desktop',key),
      runPSI(url,'mobile', key)
    ]);
    let best = d.status==='fulfilled'?d.value:null;
    if(m.status==='fulfilled' && (!best||m.value.bytes>best.bytes)) best=m.value;
    if(best) return best;
    throw new Error('PSI both failed');
  } catch {
    const mb = await htmlOnlyEstimateMB(url);
    return { bytes:mb*1024*1024, finalUrl:url };
  }
}

async function checkGreen(host){
  try {
    const { data } = await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${host}`,{timeout:8000});
    return !!data.green;
  } catch {
    return false;
  }
}

// ——— Start listening ———
app.listen(PORT,'0.0.0.0',()=>{
  console.log(`🚀 GreenTrace API listening on port ${PORT}`);
});
