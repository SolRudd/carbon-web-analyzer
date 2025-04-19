const express = require("express");
const cors = require("cors");
const axios = require("axios");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

// ✅ Green Web Foundation check
async function isGreenHosted(domain) {
  try {
    const res = await axios.get(`https://api.thegreenwebfoundation.org/greencheck/${domain}`);
    return res.data.green; // true or false
  } catch (err) {
    console.error("Failed to fetch green host status:", err.message);
    return false; // fallback if API fails
  }
}

// ✅ Puppeteer-based page size calculation
async function getPageSizeInMB(url) {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });
    const performance = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.getEntries()))
    );

    await browser.close();

    const totalBytes = performance.reduce((sum, item) => sum + (item.transferSize || 0), 0);
    return totalBytes / (1024 * 1024); // Convert to MB
  } catch (error) {
    console.error("Puppeteer error:", error.message);
    return 2; // fallback to default if it fails
  }
}

// ✅ Carbon rating logic
function getCarbonGrade(grams) {
  if (grams <= 0.2) return "A+";
  if (grams <= 0.4) return "A";
  if (grams <= 0.8) return "B";
  if (grams <= 1.5) return "C";
  if (grams <= 2.5) return "D";
  return "F";
}

// ✅ Base route
app.get("/", (req, res) => {
  res.send("GreenTrace API is live ✅");
});

// ✅ Main POST route
app.post("/api/check-carbon", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "No URL provided" });

  try {
    const domain = new URL(url).hostname;
    const greenHost = await isGreenHosted(domain);
    const pageSizeInMB = await getPageSizeInMB(url);

    // CO2 calculation logic
    const energyPerGB = 0.81;
    const carbonIntensity = 442;
    const sizeInGB = pageSizeInMB / 1024;
    const energyUsed = sizeInGB * energyPerGB;
    const carbonEstimate = energyUsed * carbonIntensity;

    const grade = getCarbonGrade(carbonEstimate);

    res.json({
      url,
      carbonEstimate: `${carbonEstimate.toFixed(2)}g CO₂ per view`,
      greenHost,
      grade,
    });
  } catch (error) {
    console.error("Carbon check failed:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
