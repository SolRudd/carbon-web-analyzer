'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { formatCo2PerPage } = require('../lib/badges/formatters');
const { mapPublicBadgeStatus, toPublicBadgeData } = require('../lib/badges/status-map');
const { renderBadgeSvg } = require('../lib/badges/svg');
const { normalizeBadgeToken, toPublicBadgeJson } = require('../lib/badges/get-public-badge-data');

test('public badge status maps verified backend facts to safe public output', () => {
  const mapped = mapPublicBadgeStatus({
    badgeEnabled: true,
    publicVerificationEnabled: true,
    verificationStatus: 'verified',
    licenseStatus: 'active',
    metric: 0.214,
  });
  assert.equal(mapped.publicStatus, 'verified');
  assert.equal(mapped.label, 'GreenTracer Verified');
  assert.equal(mapped.shouldShowMetric, true);
});

test('public badge status never exposes raw license states', () => {
  const mapped = mapPublicBadgeStatus({
    badgeEnabled: true,
    publicVerificationEnabled: true,
    verificationStatus: 'verified',
    licenseStatus: 'suspended',
    metric: 0.214,
  });
  const data = toPublicBadgeData({
    publicStatus: mapped.publicStatus,
    label: mapped.label,
    showMetric: mapped.shouldShowMetric,
    metric: 0.214,
  });

  assert.equal(data.publicStatus, 'inactive');
  assert.equal(data.label, 'GreenTracer Inactive');
  assert.equal(data.metricText, null);
  assert.doesNotMatch(JSON.stringify(toPublicBadgeJson(data)), /suspended|LICENSE|SUBSCRIPTION|API_KEY/i);
});

test('CO2 formatter produces compact badge metric text', () => {
  assert.equal(formatCo2PerPage(0.214), '0.21g CO₂/page');
  assert.equal(formatCo2PerPage(null), null);
});

test('badge SVG renders compact verified badge without raw internals', () => {
  const svg = renderBadgeSvg({
    publicStatus: 'verified',
    label: 'GreenTracer Verified',
    domain: 'example.com',
    metricText: '0.21g CO₂/page',
    showMetric: true,
  });

  assert.match(svg, /width="248"/);
  assert.match(svg, /GreenTracer Verified/);
  assert.match(svg, /0\.21g CO₂\/page/);
  assert.doesNotMatch(svg, /LICENSE_UNAVAILABLE|TOKEN_INVALID|SITE_NOT_FOUND|API_KEY_INVALID|SUBSCRIPTION_EXPIRED|DOMAIN_MISMATCH/);
});

test('badge token validation accepts public tokens and rejects unsafe input', () => {
  assert.equal(normalizeBadgeToken('abc123_PUBLIC-token'), 'abc123_PUBLIC-token');
  assert.equal(normalizeBadgeToken('../secret'), null);
  assert.equal(normalizeBadgeToken('short'), null);
});
