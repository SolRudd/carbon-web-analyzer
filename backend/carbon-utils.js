// backend/carbon-utils.js
const axios     = require('axios');
const puppeteer = require('puppeteer');

const CONSTANTS = {
  ENERGY_PER_GB:   { mobile: 1.2, wifi: 0.81, datacenter: 0.5 },
  CARBON_INTENSITY:{ global: 442, us: 386, eu: 253, uk: 212, renewable: 50 },
  GREEN_HOSTING:   { partial: 0.3, certified: 0.7, carbon_neutral: 0.85, fully_green: 0.95 }
};

let browserPromise = null;
async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox','--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
      timeout: 60000
    });
  }
  return browserPromise;
}

async function getComprehensivePageSize(url) {
  const browser = await getBrowser();
  const page    = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width:1280, height:720 });
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  await page.goto(url, { waitUntil:'networkidle0', timeout:90000 });
  await page.waitForTimeout(2000);
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const res = performance.getEntriesByType('resource')   || [];
    let total = nav.transferSize || nav.encodedBodySize || 0;
    const breakdown = { document: total, script:0, stylesheet:0, image:0, font:0, other:0 };

    res.forEach(r => {
      const size = r.transferSize || r.encodedBodySize || 0;
      total += size;
      const name = r.name.toLowerCase();
      if (name.endsWith('.js'))          breakdown.script     += size;
      else if (name.endsWith('.css'))     breakdown.stylesheet += size;
      else if (name.match(/\.(jpg|png|gif|svg|webp)$/)) breakdown.image += size;
      else if (name.match(/\.(woff|woff2|ttf|otf)$/))   breakdown.font  += size;
      else                               breakdown.other      += size;
    });
    return { totalBytes: total, breakdown };
  });

  await page.close();
  const toMB = b => b / 1024 / 1024;
  return {
    totalMB: toMB(metrics.totalBytes),
    breakdown: Object.fromEntries(
      Object.entries(metrics.breakdown).map(([k,v]) => [k, toMB(v)])
    )
  };
}

async function getDetailedGreenInfo(hostname) {
  try {
    const { data } = await axios.get(
      `https://api.thegreenwebfoundation.org/greencheck/${hostname}`
    );
    return {
      isGreen: !!data.green,
      reductionFactor: data.green
        ? CONSTANTS.GREEN_HOSTING.certified
        : 0
    };
  } catch {
    return { isGreen: false, reductionFactor: 0 };
  }
}

function calculateAdvancedCarbon(sizeData, greenInfo, region = 'global') {
  const ci = CONSTANTS.CARBON_INTENSITY[region] || CONSTANTS.CARBON_INTENSITY.global;
  const energyFactors = { document:1, script:1.2, stylesheet:0.8, image:1.1, font:0.9, other:1 };
  let totalEnergyKWh = 0;

  for (let [type, mb] of Object.entries(sizeData.breakdown)) {
    const factor = energyFactors[type] || 1;
    totalEnergyKWh += (mb/1024) * CONSTANTS.ENERGY_PER_GB.wifi * factor;
  }

  const grams = totalEnergyKWh * ci * (1 - greenInfo.reductionFactor);
  return {
    carbonGrams: Math.round(grams * 100) / 100,
    energyKWh:   Math.round(totalEnergyKWh * 10000) / 10000
  };
}

function getRealisticGrade(carbonGrams, sizeMB) {
  const perMB = carbonGrams / (sizeMB || 0.1);
  const thresholds = { 'A+':50, A:100, B:200, C:350, D:500, E:700, F:Infinity };
  const grade = Object.entries(thresholds).find(([,t]) => perMB <= t)[0];
  const pct   = Math.max(0, Math.min(100, 100 - Math.round(perMB / 1000 * 100)));
  return { grade, percentile: pct };
}

module.exports = {
  getComprehensivePageSize,
  getDetailedGreenInfo,
  calculateAdvancedCarbon,
  getRealisticGrade
};
