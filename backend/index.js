// backend/index.js
const express   = require("express");
const cors      = require("cors");
const axios     = require("axios");
const puppeteer = require("puppeteer");

const app  = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// ——— Helpers ———

// 1) Green hosting check
async function isGreenHosted(domain) {
  try {
    const { data } = await axios.get(
      `https://api.thegreenwebfoundation.org/greencheck/${domain}`
    );
    return data.green;
  } catch {
    return false;
  }
}

// 2) Page-size (MB)
async function getPageSizeInMB(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox","--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    const totalBytes = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const res = performance.getEntriesByType("resource");
      const navBytes = nav?.encodedBodySize ?? nav?.transferSize ?? 0;
      const resBytes = res.reduce((sum, r) =>
        sum + (r.encodedBodySize ?? r.transferSize ?? 0)
      , 0);
      return navBytes + resBytes;
    });
    return totalBytes / (1024 * 1024);
  } catch {
    return 0;
  } finally {
    if (browser) await browser.close();
  }
}

// 3) Grade thresholds (g CO₂/view)
const THRESHOLDS = {
  "A+": 0.095,
  A:   0.186,
  B:   0.341,
  C:   0.493,
  D:   0.656,
  E:   0.846,
};

// 4) Map grams → letter grade
function getCarbonGrade(g) {
  if (g <= THRESHOLDS["A+"]) return "A+";
  if (g <= THRESHOLDS.A)   return "A";
  if (g <= THRESHOLDS.B)   return "B";
  if (g <= THRESHOLDS.C)   return "C";
  if (g <= THRESHOLDS.D)   return "D";
  if (g <= THRESHOLDS.E)   return "E";
  return "F";
}

// 5) Compute percentile vs. global E-grade threshold
function getPercentile(actualGrams) {
  const avg = THRESHOLDS.E;
  // cleaner than X% = (avg - g) / avg * 100, clamped [0–100]
  const raw = Math.round(((avg - actualGrams) / avg) * 100);
  return Math.max(0, Math.min(100, raw));
}

// ——— In-memory cache ———
const resultsStore = new Map();

// ——— LIVE TRACE — no slug ———
app.get("/api/trace", async (req, res) => {
  const site = req.query.site;
  if (!site) return res.status(400).json({ error: "Missing site query param" });

  try {
    const { hostname } = new URL(site);
    const [greenHost, sizeMB] = await Promise.all([
      isGreenHosted(hostname),
      getPageSizeInMB(site),
    ]);

    const sizeGB       = sizeMB / 1024;
    const energyPerGB  = 0.81;    // kWh/GB
    const carbonFactor = 442;     // gCO₂/kWh
    const baselineGrams = sizeGB * energyPerGB * carbonFactor;

    // 9% off for green hosting
    const reductionPct = 0.09;
    const actualGrams   = greenHost
      ? baselineGrams * (1 - reductionPct)
      : baselineGrams;

    const grade      = getCarbonGrade(actualGrams);
    const percentile = getPercentile(actualGrams);

    return res.json({
      url:            site,
      greenHost,
      sizeMB:         +sizeMB.toFixed(2),
      baselineGrams:  +baselineGrams.toFixed(2),
      carbonEstimate: +actualGrams.toFixed(2),
      reductionPct,
      grade,
      percentile,
      timestamp:      Date.now(),
    });
  } catch (err) {
    console.error("TRACE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ——— CACHED SLUG FLOW — POST + GET/:slug ———
app.post("/api/check-carbon", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const parsed = new URL(url);
    const slug   = (
      parsed.hostname +
      parsed.pathname.replace(/\/$/, "")
    )
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase();

    const [greenHost, sizeMB] = await Promise.all([
      isGreenHosted(parsed.hostname),
      getPageSizeInMB(url),
    ]);

    const sizeGB       = sizeMB / 1024;
    const energyPerGB  = 0.81;
    const carbonFactor = 442;
    const baselineGrams = sizeGB * energyPerGB * carbonFactor;
    const reductionPct = 0.09;
    const actualGrams   = greenHost
      ? baselineGrams * (1 - reductionPct)
      : baselineGrams;

    const grade      = getCarbonGrade(actualGrams);
    const percentile = getPercentile(actualGrams);

    const record = {
      slug,
      url,
      greenHost,
      sizeMB:         +sizeMB.toFixed(2),
      baselineGrams:  +baselineGrams.toFixed(2),
      carbonEstimate: +actualGrams.toFixed(2),
      reductionPct,
      grade,
      percentile,
      timestamp:      Date.now(),
    };

    resultsStore.set(slug, record);
    return res.json(record);
  } catch (err) {
    console.error("CHECK‐CARBON ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/result/:slug", (req, res) => {
  const rec = resultsStore.get(req.params.slug);
  if (!rec) return res.status(404).json({ error: "Not found" });
  return res.json(rec);
});

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
