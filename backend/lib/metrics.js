'use strict';

function gradeFor(carbon) {
  if (carbon <= 0.095) return 'A+';
  if (carbon <= 0.186) return 'A';
  if (carbon <= 0.341) return 'B';
  if (carbon <= 0.493) return 'C';
  if (carbon <= 0.656) return 'D';
  if (carbon <= 0.846) return 'E';
  return 'F';
}

function percentileFromCarbon(carbon) {
  const max = 0.846;
  return Math.round(Math.max(0, Math.min(100, ((max - Math.min(carbon, max)) / max) * 100)));
}

function totalGreenReductionPct() {
  const dataCenter = 0.06;
  const network = 0.014;
  const userDevice = 0.123;
  return Math.round((dataCenter / (dataCenter + network + userDevice)) * 25);
}

function calcCO2(sizeMB, isGreen) {
  const dataCenter = 0.06;
  const network = 0.014;
  const userDevice = 0.123;
  const carbonIntensity = 442;
  const gigabytes = sizeMB / 1024;
  const dataCenterEnergy = gigabytes * dataCenter * (isGreen ? 0.75 : 1);
  const kwh = dataCenterEnergy + gigabytes * network + gigabytes * userDevice;
  const grams = kwh * carbonIntensity;

  if (grams < 0.01) return +grams.toPrecision(2);
  if (grams < 1) return +grams.toFixed(3);
  return +grams.toFixed(2);
}

module.exports = {
  calcCO2,
  gradeFor,
  percentileFromCarbon,
  totalGreenReductionPct,
};
