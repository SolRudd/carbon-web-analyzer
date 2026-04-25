'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { inspectBadgeHtml } = require('../lib/badge-verification');

test('badge verification accepts badge markup regardless of attribute order', () => {
  const html = `
    <script defer src="https://api.greentracer.org/greentrace-badge.js"></script>
    <div data-badge-type="hosting" data-theme="auto" class="greentrace-badge card" data-url="https://example.com"></div>
  `;

  const result = inspectBadgeHtml(html, 'hosting');
  assert.equal(result.state, 'connected');
  assert.deepEqual(result.checks, {
    scriptDetected: true,
    containerDetected: true,
    dataUrlDetected: true,
  });
  assert.deepEqual(result.detectedBadgeTypes, ['hosting']);
  assert.deepEqual(result.issues, []);
});

test('badge verification falls back to carbon when badge type is omitted', () => {
  const html = `
    <div class="greentrace-badge" data-url="https://example.com"></div>
    <script src="https://api.greentracer.org/greentrace-badge.js?v=2"></script>
  `;

  const result = inspectBadgeHtml(html, 'carbon');
  assert.equal(result.state, 'connected');
  assert.deepEqual(result.detectedBadgeTypes, ['carbon']);
});

test('badge verification flags missing script and data-url problems', () => {
  const html = `<div class="greentrace-badge" data-badge-type="member"></div>`;
  const result = inspectBadgeHtml(html, 'member');

  assert.equal(result.state, 'needs_review');
  assert.deepEqual(result.issues, ['missing_script', 'missing_data_url']);
});
