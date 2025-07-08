require("dotenv").config();
const path      = require("path");
const express   = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const rateLimit = require("express-rate-limit");
const axios     = require("axios");
const puppeteer = require("puppeteer");
const Database  = require("better-sqlite3");

const app  = express();
const PORT = process.env.PORT || 8080;
app.set("trust proxy", 1);

/* ──────── Middle-ware ──────── */
app.use(helmet());
app.use(
  cors({ origin: process.env.CORS_ORIGIN.split(","), optionsSuccessStatus: 200 })
);
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 30,
    message: { error: "Too many requests, slow down." }
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.get("/healthz", (_req, res) => res.status(200).send("OK"));

/* ──────── SQLite ──────── */
const db = new Database(path.join(__dirname, "results.db"));
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

/* ──────── Carbon maths ──────── */
const ENERGY_PER_GB = 0.81;
const CARBON_FACTOR = 442;
const GREEN_HOST_REDUCTION = 0.09;
const THRESHOLDS = { "A+":0.095, A:0.186, B:0.341, C:0.493, D:0.656, E:0.846 };

const calcCarbon = (mb, green) => {
  const base = (mb/1024) * ENERGY_PER_GB * CARBON_FACTOR;
  return green ? base * (1 - GREEN_HOST_REDUCTION) : base;
};
const gradeFor = g => Object.entries(THRESHOLDS).find(([_,t])=>g<=t)?.[0] ?? "F";
const percentileFor = g =>
  Math.max(0, Math.min(100, Math.round(((THRESHOLDS.E - Math.min(g,THRESHOLDS.E))/THRESHOLDS.E)*100)));

/* ──────── Helpers ──────── */
const retry = async (fn, tries=3, delay=1e3) => {
  let err;
  for (let i=0;i<tries;i++){
    try { return await fn(); } catch(e){ err=e; await new Promise(r=>setTimeout(r, delay*(i+1))); }
  }
  throw err;
};
const isGreen = d => axios.get(`https://api.thegreenwebfoundation.org/greencheck/${d}`)
  .then(r=>!!r.data.green).catch(()=>false);

/* ─── Puppeteer page-weight ─── */
async function getPageSizeInMB(url){
  let browser;
  try{
    browser = await puppeteer.launch({
      headless: 'new',                 // <── modern headless
      args:[
        '--no-sandbox','--disable-setuid-sandbox',
        '--disable-dev-shm-usage','--disable-gpu','--single-process'
      ],
      ignoreHTTPSErrors:true,
      timeout:60000
    });
    const page = await browser.newPage();
    await page.goto(url,{waitUntil:'networkidle2',timeout:45000});
    const bytes = await page.evaluate(()=>{
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const res = performance.getEntriesByType('resource')  || [];
      const navB = nav.encodedBodySize ?? nav.transferSize ?? 0;
      const resB = res.reduce((s,r)=>s+(r.encodedBodySize ?? r.transferSize ?? 0),0);
      return navB + resB;
    });
    return bytes / (1024*1024);
  }finally{ if(browser) await browser.close(); }
}

/* ──────── Routes ──────── */
app.post("/api/check-carbon", async (req,res)=>{
  const site = req.body.url;
  if(!site) return res.status(400).json({error:"Missing URL."});
  try{
    const host = new URL(site).hostname;
    const [green, size] = await Promise.all([
      retry(()=>isGreen(host)), retry(()=>getPageSizeInMB(site))
    ]);
    const ce    = calcCarbon(size, green);
    const slug  = host.replace(/[^a-z0-9]/gi,"-").toLowerCase();
    db.prepare(`
      INSERT OR REPLACE INTO results
      (slug,url,greenHost,sizeMB,carbonEstimate,reductionPct,grade,percentile,timestamp)
      VALUES(?,?,?,?,?,?,?,?,?)
    `).run(
      slug, site, green?1:0, size, ce, GREEN_HOST_REDUCTION,
      gradeFor(ce), percentileFor(ce), Date.now()
    );
    res.json({ slug });
  }catch(e){
    console.error("check-carbon error:",e);
    res.status(500).json({error:"Carbon check failed.",details:e.message});
  }
});

app.get("/api/trace", async (req,res)=>{
  const site = req.query.site;
  if(!site) return res.status(400).json({error:"Missing site query."});
  try{ new URL(site); } catch{ return res.status(400).json({error:"Invalid site URL."}); }
  try{
    const host = new URL(site).hostname;
    const [green,size] = await Promise.all([
      retry(()=>isGreen(host)), retry(()=>getPageSizeInMB(site))
    ]);
    const ce = calcCarbon(size, green);
    res.json({
      url:site, greenHost:green, sizeMB:+size.toFixed(2),
      carbonEstimate:+ce.toFixed(2), grade:gradeFor(ce),
      percentile:percentileFor(ce), timestamp:Date.now()
    });
  }catch(e){
    console.error(`❌ Trace error for ${site}:`,e);
    res.status(500).json({error:"Unable to trace site.",details:e.message});
  }
});

app.get("/api/results/:slug",(req,res)=>{
  try{
    const r = db.prepare("SELECT * FROM results WHERE slug=?").get(req.params.slug);
    if(!r) return res.status(404).json({error:"Not found."});
    r.greenHost = !!r.greenHost;
    ["sizeMB","carbonEstimate","reductionPct","percentile","timestamp"]
      .forEach(k=>r[k]=+r[k]);
    res.json(r);
  }catch(e){
    console.error("results lookup error:",e);
    res.status(500).json({error:"Server error."});
  }
});

/* ──────── Start ──────── */
app.listen(PORT,()=>console.log(`🚀 API ready on port ${PORT}`));
