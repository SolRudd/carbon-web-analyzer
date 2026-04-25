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
    svgBadgeImageDetected: false,
    verificationLinkDetected: false,
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

test('badge verification accepts tokenized SVG badge embed', () => {
  const html = `
    <a href="https://www.greentracer.org/verify/publictoken123" target="_blank" rel="noopener">
      <img src="https://api.greentracer.org/api/badge/publictoken123" alt="GreenTracer Verified" width="240" height="40" />
    </a>
  `;

  const result = inspectBadgeHtml(html);
  assert.equal(result.state, 'connected');
  assert.equal(result.checks.svgBadgeImageDetected, true);
  assert.equal(result.checks.verificationLinkDetected, true);
  assert.deepEqual(result.detectedBadgeTypes, ['verification']);
  assert.deepEqual(result.issues, []);
});
