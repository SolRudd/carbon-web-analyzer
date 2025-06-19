// backend/index.js

require("dotenv").config();
const path      = require("path");
const express   = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const rateLimit = require("express-rate-limit");
const axios     = require("axios");
const puppeteer = require("puppeteer");
const Database  = require("better-sqlite3");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(helmet());
app.use(
  cors({ origin: process.env.CORS_ORIGIN.split(","), optionsSuccessStatus: 200 })
);
app.use(
  rateLimit({ windowMs: 60_000, max: 30, message: { error: "Too many requests, slow down." } })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Healthcheck
app.get("/healthz", (req, res) => res.status(200).send("OK"));

// SQLite & schema
const db = new Database(path.join(__dirname, "results.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    slug TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    greenHost INTEGER NOT NULL,
    sizeMB REAL NOT NULL,
    carbonEstimate REAL NOT NULL,
    reductionPct REAL NOT NULL,
    grade TEXT NOT NULL,
    percentile INTEGER NOT NULL,
    timestamp INTEGER NOT NULL
  );
`);

// Calculation constants
const ENERGY_PER_GB        = 0.81;
const CARBON_FACTOR        = 442;
const GREEN_HOST_REDUCTION = 0.09;
const THRESHOLDS = { "A+": 0.095, A: 0.186, B: 0.341, C: 0.493, D: 0.656, E: 0.846 };

function calculateCarbon(sizeMB, greenHost) {
  const sizeGB = sizeMB / 1024;
  const base   = sizeGB * ENERGY_PER_GB * CARBON_FACTOR;
  return greenHost ? base * (1 - GREEN_HOST_REDUCTION) : base;
}

function getCarbonGrade(g) {
  if (g <= THRESHOLDS["A+"]) return "A+";
  if (g <= THRESHOLDS.A)    return "A";
  if (g <= THRESHOLDS.B)    return "B";
  if (g <= THRESHOLDS.C)    return "C";
  if (g <= THRESHOLDS.D)    return "D";
  if (g <= THRESHOLDS.E)    return "E";
  return "F";
}

function getPercentile(g) {
  const avg = THRESHOLDS.E;
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(((avg - Math.min(g, avg)) / avg) * 100)
    )
  );
}

async function retry(fn, retries = 3, delay = 1000) {
  let lastErr;
  for (let i = 1; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < retries) await new Promise((r) => setTimeout(r, delay * i));
    }
  }
  throw lastErr;
}

async function isGreenHosted(domain) {
  try {
    const { data } = await axios.get(
      `https://api.thegreenwebfoundation.org/greencheck/${domain}`
    );
    return !!data.green;
  } catch {
    return false;
  }
}

async function getPageSizeInMB(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
      ],
      ignoreHTTPSErrors: true,
      timeout: 60000,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });

    const totalBytes = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] || {};
      const res = performance.getEntriesByType("resource") || [];
      const navB = nav.encodedBodySize ?? nav.transferSize ?? 0;
      const resB = res.reduce(
        (sum, r) => sum + (r.encodedBodySize ?? r.transferSize ?? 0),
        0
      );
      return navB + resB;
    });

    return totalBytes / (1024 * 1024);
  } finally {
    if (browser) await browser.close();
  }
}

// POST: create or update a result slug
app.post("/api/check-carbon", async (req, res) => {
  const site = req.body.url;
  if (!site) return res.status(400).json({ error: "Missing URL." });

  try {
    const hostname = new URL(site).hostname;
    const [greenHost, sizeMB] = await Promise.all([
      retry(() => isGreenHosted(hostname)),
      retry(() => getPageSizeInMB(site)),
    ]);

    const ce         = calculateCarbon(sizeMB, greenHost);
    const grade      = getCarbonGrade(ce);
    const percentile = getPercentile(ce);
    const slug       = hostname.replace(/[^a-z0-9]/gi, "-").toLowerCase();

    db.prepare(
      `INSERT OR REPLACE INTO results
      (slug,url,greenHost,sizeMB,carbonEstimate,reductionPct,grade,percentile,timestamp)
      VALUES(?,?,?,?,?,?,?,?,?)`
    ).run(
      slug,
      site,
      greenHost ? 1 : 0,
      sizeMB,
      ce,
      GREEN_HOST_REDUCTION,
      grade,
      percentile,
      Date.now()
    );

    res.json({ slug });
  } catch (err) {
    console.error("check-carbon error:", err);
    res.status(500).json({ error: "Carbon check failed.", details: err.message });
  }
});

// GET: live trace
app.get("/api/trace", async (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error: "Missing site query." });
  try { new URL(site); } catch {
    return res.status(400).json({ error: "Invalid site URL." });
  }

  try {
    const hostname = new URL(site).hostname;
    const [greenHost, sizeMB] = await Promise.all([
      retry(() => isGreenHosted(hostname)),
      retry(() => getPageSizeInMB(site)),
    ]);
    const ce = calculateCarbon(sizeMB, greenHost);

    res.json({
      url: site,
      greenHost,
      sizeMB: +sizeMB.toFixed(2),
      carbonEstimate: +ce.toFixed(2),
      grade: getCarbonGrade(ce),
      percentile: getPercentile(ce),
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error(`❌ Trace error for ${site}:`, err);
    res.status(500).json({ error: "Unable to trace site.", details: err.message });
  }
});

// GET: cached result by slug
app.get("/api/results/:slug", (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM results WHERE slug = ?").get(req.params.slug);
    if (!row) return res.status(404).json({ error: "Not found." });

    row.greenHost      = Boolean(row.greenHost);
    row.sizeMB         = +row.sizeMB;
    row.carbonEstimate = +row.carbonEstimate;
    row.reductionPct   = +row.reductionPct;
    row.percentile     = +row.percentile;
    row.timestamp      = +row.timestamp;

    res.json(row);
  } catch (err) {
    console.error("results lookup error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 API ready at http://localhost:${PORT}`));