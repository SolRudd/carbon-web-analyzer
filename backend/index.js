require("dotenv").config();

const path       = require("path");
const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");
const axios      = require("axios");
const puppeteer  = require("puppeteer"); // ✅ Full version
const Database   = require("better-sqlite3");

const app        = express();
app.set("trust proxy", 1); // ✅ Enables accurate rate limiting behind proxy (e.g., DigitalOcean)

const PORT       = process.env.PORT || 5050;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN.split(","),
  optionsSuccessStatus: 200
}));
app.use(rateLimit({
  windowMs: 60_000,
  max: 30,
  message: { error: "Too many requests, slow down." }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // ✅ Serves badge JS & SVG assets

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

const ENERGY_PER_GB = 0.81;
const CARBON_FACTOR = 442;
const GREEN_HOST_REDUCTION = 0.09;
const THRESHOLDS = {
  "A+": 0.095,
  A:    0.186,
  B:    0.341,
  C:    0.493,
  D:    0.656,
  E:    0.846
};

async function retry(fn, retries = 3, delay = 1000) {
  let lastErr;
  for (let i = 1; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < retries) await new Promise(r => setTimeout(r, delay * i));
    }
  }
  throw lastErr;
}

async function isGreenHosted(domain) {
  try {
    const { data } = await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${domain}`);
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
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 60000
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
    const totalBytes = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] || {};
      const res = performance.getEntriesByType("resource") || [];
      const navB = nav.encodedBodySize ?? nav.transferSize ?? 0;
      const resB = res.reduce((sum, r) =>
        sum + (r.encodedBodySize ?? r.transferSize ?? 0), 0
      );
      return navB + resB;
    });
    return totalBytes / (1024 * 1024);
  } finally {
    if (browser) await browser.close();
  }
}

function calculateCarbon(sizeMB, greenHost) {
  const sizeGB = sizeMB / 1024;
  const base = sizeGB * ENERGY_PER_GB * CARBON_FACTOR;
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
  return Math.max(0, Math.min(100, Math.round(((avg - Math.min(g, avg)) / avg) * 100)));
}

// ────── API ROUTES ───────────────────────────────────────────────────────────

app.get("/api/trace", async (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error: "Missing site query." });

  try { new URL(site); }
  catch { return res.status(400).json({ error: "Invalid site URL." }); }

  try {
    const hostname = new URL(site).hostname;
    const [greenHost, sizeMB] = await Promise.all([
      retry(() => isGreenHosted(hostname)),
      retry(() => getPageSizeInMB(site))
    ]);
    const ce = calculateCarbon(sizeMB, greenHost);
    res.json({
      url: site,
      greenHost,
      sizeMB: +sizeMB.toFixed(2),
      carbonEstimate: +ce.toFixed(2),
      grade: getCarbonGrade(ce),
      percentile: getPercentile(ce),
      timestamp: Date.now()
    });
  } catch (err) {
    console.error("Trace error:", err);
    res.status(500).json({ error: "Unable to trace site." });
  }
});

app.post("/api/check-carbon", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required." });

  try { new URL(url); }
  catch { return res.status(400).json({ error: "Invalid URL." }); }

  const parsed = new URL(url);
  const slug = (parsed.hostname + parsed.pathname.replace(/\/$/, "")).replace(/[^a-z0-9]/gi, "-").toLowerCase();

  const existing = db.prepare("SELECT * FROM results WHERE slug = ?").get(slug);
  if (existing && (Date.now() - existing.timestamp) < SEVEN_DAYS) {
    return res.json({ ...existing, cached: true });
  }

  try {
    const [greenHost, sizeMB] = await Promise.all([
      retry(() => isGreenHosted(parsed.hostname)),
      retry(() => getPageSizeInMB(url))
    ]);
    const ce           = calculateCarbon(sizeMB, greenHost);
    const reductionPct = greenHost ? GREEN_HOST_REDUCTION : 0;
    const grade        = getCarbonGrade(ce);
    const percentile   = getPercentile(ce);

    db.prepare(`
      INSERT OR REPLACE INTO results
        (slug,url,greenHost,sizeMB,carbonEstimate,reductionPct,grade,percentile,timestamp)
      VALUES (?,?,?,?,?,?,?,?,?)
    `).run(
      slug, url,
      greenHost ? 1 : 0,
      +sizeMB.toFixed(2),
      +ce.toFixed(2),
      reductionPct,
      grade,
      percentile,
      Date.now()
    );

    return res.json({
      slug,
      url,
      greenHost,
      sizeMB,
      carbonEstimate: +ce.toFixed(2),
      reductionPct,
      grade,
      percentile,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error("Check-carbon error:", err);
    res.status(500).json({ error: "Unable to check carbon." });
  }
});

app.get("/api/results/:slug", (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM results WHERE slug = ?").get(req.params.slug);
    if (!row) return res.status(404).json({ error: "Result not found." });
    res.json(row);
  } catch (dbErr) {
    console.error("DB read error:", dbErr);
    res.status(500).json({ error: "Database error." });
  }
});

app.get("/badge.svg", async (req, res) => {
  const { url, theme = "light" } = req.query;
  if (!url) return res.status(400).send("Missing url");
  let record;
  try { record = db.prepare("SELECT * FROM results WHERE url = ?").get(url); }
  catch {}

  if (!record) {
    try {
      const hostname = new URL(url).hostname;
      const [gh, sz] = await Promise.all([
        retry(() => isGreenHosted(hostname)),
        retry(() => getPageSizeInMB(url))
      ]);
      const ce = calculateCarbon(sz, gh);
      record = {
        url,
        carbonEstimate: ce,
        grade: getCarbonGrade(ce),
        percentile: getPercentile(ce)
      };
    } catch {
      return res.status(500).send("Error generating badge");
    }
  }

  const colors = {
    "A+": "#2ECC71", A: "#2ECC71",
    B:   "#F1C40F", C: "#F1C40F",
    D:   "#E67E22", E: "#E67E22",
    F:   "#E74C3C"
  };
  const barColor = colors[record.grade] || "#888";
  const bg = theme === "dark" ? "#1F2937" : "#FFF";
  const fg = theme === "dark" ? "#FFF" : "#111827";

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="220" height="40">
  <rect width="220" height="40" rx="4" fill="${bg}" />
  <rect x="2" y="2" width="96" height="36" rx="4" fill="${barColor}" />
  <text x="50" y="24" fill="${fg}" font-family="system-ui" font-size="11" text-anchor="middle">
    ${record.carbonEstimate.toFixed(2)} g CO₂/view
  </text>
  <text x="160" y="24" fill="${fg}" font-family="system-ui" font-size="11" text-anchor="middle">
    ${record.percentile}% cleaner
  </text>
</svg>`;

  res.set("Content-Type", "image/svg+xml").set("Cache-Control", "public, max-age=604800").send(svg);
});

app.listen(PORT, () => {
  console.log(`🚀 API ready at http://localhost:${PORT}`);
});
