'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { inspectBadgeHtml } = require('../lib/badge-verification');

test('badge verification accepts badge markup regardless of attribute order', () => {
  const html = `
    <script defer src="https://api.greentracer.org/greentrace-badge.js"></script>
    <div data-badge-type="green_hosting" data-theme="auto" class="greentrace-badge card" data-url="https://example.com"></div>
  `;

  const result = inspectBadgeHtml(html, 'green_hosting');
  assert.equal(result.state, 'connected');
  assert.deepEqual(result.checks, {
    scriptDetected: true,
    containerDetected: true,
    dataUrlDetected: true,
    badgeIdentityDetected: true,
    svgBadgeImageDetected: false,
    verificationLinkDetected: false,
  });
  assert.deepEqual(result.detectedBadgeTypes, ['green_hosting']);
  assert.deepEqual(result.issues, []);
});

test('badge verification falls back to carbon when badge type is omitted', () => {
  const html = `
    <div class="greentrace-badge" data-url="https://example.com"></div>
    <script src="https://api.greentracer.org/greentrace-badge.js?v=2"></script>
  `;

  const result = inspectBadgeHtml(html, 'carbon_tested');
  assert.equal(result.state, 'connected');
  assert.deepEqual(result.detectedBadgeTypes, ['carbon_tested']);
});

test('badge verification accepts legacy data-type aliases and result slugs', () => {
  const html = `
    <div class="greentrace-badge" data-result-slug="example-com" data-type="hosting"></div>
    <script src="https://api.greentracer.org/greentrace-badge.js"></script>
  `;

  const result = inspectBadgeHtml(html, 'green_hosting');
  assert.equal(result.state, 'connected');
  assert.equal(result.checks.badgeIdentityDetected, true);
  assert.deepEqual(result.detectedBadgeTypes, ['green_hosting']);
});

test('badge verification flags missing script and badge identity problems', () => {
  const html = `<div class="greentrace-badge" data-badge-type="member"></div>`;
  const result = inspectBadgeHtml(html, 'member');

  assert.equal(result.state, 'needs_review');
  assert.deepEqual(result.issues, ['missing_script', 'missing_badge_identity']);
});

test('badge verification accepts tokenized loader markup', () => {
  const html = `
    <div class="greentrace-badge" data-public-token="gtb_publictoken123" data-domain="example.com" data-badge-type="greentracer_verified"></div>
    <script async src="https://api.greentracer.org/greentrace-badge.js"></script>
  `;

  const result = inspectBadgeHtml(html, 'greentracer_verified');
  assert.equal(result.state, 'connected');
  assert.equal(result.checks.badgeIdentityDetected, true);
  assert.deepEqual(result.detectedBadgeTypes, ['greentracer_verified']);
});

test('badge verification accepts tokenized SVG badge embed', () => {
  const html = `
    <a href="https://www.greentracer.org/verified/example.com" target="_blank" rel="noopener">
      <img src="https://api.greentracer.org/api/badge/publictoken123" alt="GreenTracer Verified" width="240" height="44" />
    </a>
  `;

  const result = inspectBadgeHtml(html);
  assert.equal(result.state, 'connected');
  assert.equal(result.checks.svgBadgeImageDetected, true);
  assert.equal(result.checks.verificationLinkDetected, true);
  assert.deepEqual(result.detectedBadgeTypes, ['verification']);
  assert.deepEqual(result.issues, []);
});
