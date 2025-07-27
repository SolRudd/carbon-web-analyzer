// backend/index.js
'use strict';
require('dotenv').config();

const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const RateLimit  = require('express-rate-limit');
const Database   = require('better-sqlite3');
const axios      = require('axios');
const path       = require('path');
const fs         = require('fs');

const app  = express();
const PORT = process.env.PORT||8080;

// ─────── Healthcheck ───────
// super‑fast, no DB or HTTP calls
app.get('/healthz', (_req, res) => res.send('OK'));

// ─────── Security + JSON + CORS ───────
app.use(helmet({ frameguard:false }));
app.use(cors());
app.use(express.json());

// ─────── Rate‑limits ───────
const checkerLimiter = RateLimit({
  windowMs:60_000, max:5,
  message:{ error:'Too many checks, wait 1m.' }
});
const badgeLimiter = RateLimit({
  windowMs:60_000, max:30,
  message:{ error:'Too many badges, wait 1m.' }
});

// ─────── DB & Cache ───────
const DB_PATH = process.env.RESULTS_DB_PATH||path.join(__dirname,'results.db');
fs.mkdirSync(path.dirname(DB_PATH),{recursive:true});
const db = new Database(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS results(
    slug TEXT PRIMARY KEY,
    url  TEXT,
    co2  REAL,
    pct  INTEGER,
    ts   INTEGER
  );
`);
const TTL = 7*24*3600*1000;

function slugify(u){
  try{ return new URL(u).hostname.replace(/[^a-z0-9]/gi,'-').toLowerCase(); }
  catch{return u.replace(/[^a-z0-9]/gi,'-').toLowerCase();}
}
function readCache(slug){
  const row = db.prepare(`SELECT * FROM results WHERE slug=?`).get(slug);
  if(!row||Date.now()-row.ts>TTL) return null;
  return row;
}

// ─────── Helpers ───────
async function fetchPageSpeed(url){
  const api = `https://www.googleapis.com/pagespeed/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop`;
  const { data } = await axios.get(api,{ timeout:5000 });
  return (data.lighthouseResult.audits['total-byte-weight'].numericValue||0) / (1024*1024);
}
async function fetchGreen(host){
  const { data } = await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${host}`,{timeout:3000});
  return !!data.green;
}
function calcCO2(mb,green){
  const base = mb * (0.81*442/1024);
  return +(green?base*0.91:base).toFixed(2);
}
function grade(co2){
  if(co2<=0.095) return 'A+'; if(co2<=0.186) return 'A';
  if(co2<=0.341) return 'B'; if(co2<=0.493) return 'C';
  if(co2<=0.656) return 'D'; if(co2<=0.846) return 'E';
  return 'F';
}

// ─────── Full check endpoint ───────
app.post('/api/check-carbon', checkerLimiter, async (req,res) => {
  const { url } = req.body;
  if(!url) return res.status(400).json({ error:'Missing URL.' });
  let host; try{ host=new URL(url).hostname; } catch{ return res.status(400).json({ error:'Bad URL.' }); }

  // Check cache first
  const slug = slugify(url);
  const hit  = readCache(slug);
  if(hit) return res.json({ slug,url, co2:hit.co2, pct:hit.pct, grade:grade(hit.co2) });

  // Otherwise run fresh
  try {
    const [ sizeMB, green ] = await Promise.all([
      fetchPageSpeed(url).catch(()=>0),
      fetchGreen(host).catch(()=>false)
    ]);
    const co2 = calcCO2(sizeMB,green);
    const pct = Math.round(Math.max(0,Math.min(100,(1 - co2/0.846)*100)));
    // Store
    db.prepare(`
      INSERT OR REPLACE INTO results(slug,url,co2,pct,ts)
      VALUES(?,?,?,?,?)
    `).run(slug,url,co2,pct,Date.now());
    return res.json({ slug,url, co2, pct, grade:grade(co2) });
  } catch(e){
    console.error('CHECK ERROR',e);
    return res.status(500).json({ error:'Carbon check failed.' });
  }
});

// ─────── Badge (cache only) ───────
app.get('/api/trace', badgeLimiter, (req,res) => {
  const { site } = req.query;
  if(!site) return res.status(400).json({ error:'Missing site.' });
  const slug = slugify(site);
  const row  = readCache(slug);
  if(!row) return res.status(404).json({ error:'No data; run check first.' });
  return res.json({ slug, url:row.url, carbonEstimate:row.co2, percentile:row.pct, grade:grade(row.co2) });
});

// ─────── Lookup endpoint ───────
app.get('/api/results/:slug', (req,res) => {
  const row = readCache(req.params.slug);
  if(!row) return res.status(404).json({ error:'Not found.' });
  return res.json({ slug:req.params.slug, url:row.url, carbonEstimate:row.co2, percentile:row.pct, grade:grade(row.co2) });
});

// ─────── Start ───────
app.listen(PORT, ()=>console.log(`🚀 GreenTrace API on port ${PORT}`));
