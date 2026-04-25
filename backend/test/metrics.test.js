'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calcCO2,
  gradeFor,
  percentileFromCarbon,
  totalGreenReductionPct,
} = require('../lib/metrics');

test('calcCO2 keeps the existing non-green and green math outputs stable', () => {
  assert.equal(calcCO2(1, false), 0.085);
  assert.equal(calcCO2(1, true), 0.079);
  assert.equal(calcCO2(10, false), 0.85);
  assert.equal(calcCO2(10, true), 0.786);
});

test('grade thresholds remain aligned to the published bands', () => {
  assert.equal(gradeFor(0.095), 'A+');
  assert.equal(gradeFor(0.096), 'A');
  assert.equal(gradeFor(0.846), 'E');
  assert.equal(gradeFor(0.847), 'F');
});

test('percentile and green reduction outputs stay bounded and consistent', () => {
  assert.equal(percentileFromCarbon(0), 100);
  assert.equal(percentileFromCarbon(0.846), 0);
  assert.equal(percentileFromCarbon(1.2), 0);
  assert.equal(totalGreenReductionPct(), 8);
});
