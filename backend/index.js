const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5050;


// ✅ CORS MUST be set here + OPTIONS handled
app.use(cors({
  origin: "http://localhost:5173",
}));
app.options("*", cors()); // <— handle preflight requests

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working!");
});

app.post("/api/check-carbon", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  const pageSizeInMB = 2;
  const energyPerGB = 0.81;
  const carbonIntensity = 442;

  const sizeInGB = pageSizeInMB / 1024;
  const energyUsed = sizeInGB * energyPerGB;
  const carbonEstimate = energyUsed * carbonIntensity;

  res.json({
    url,
    carbonEstimate: `${carbonEstimate.toFixed(2)}g CO₂ per view`,
    greenHost: true,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
