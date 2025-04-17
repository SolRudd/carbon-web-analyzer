const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5050; // 💡 default to 5050 but allow override

// ✅ Proper CORS setup — handles preflight requests correctly
app.use(cors({
  origin: "http://localhost:5173", // Vite dev server
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// ✅ Base route
app.get("/", (req, res) => {
  res.send("API is working!");
});

// ✅ Carbon check route
app.post("/api/check-carbon", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  // ⏳ Simulate processing delay like WebsiteCarbon.com
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const pageSizeInMB = 2;
  const energyPerGB = 0.81;
  const carbonIntensity = 442;

  const sizeInGB = pageSizeInMB / 1024;
  const energyUsed = sizeInGB * energyPerGB;
  const carbonEstimate = energyUsed * carbonIntensity;

  res.json({
    url,
    carbonEstimate: `${carbonEstimate.toFixed(2)}g CO₂ per view`,
    greenHost: true, // mocked for now
  });
});


// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
