'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { formatCo2PerPage, normalizeBadgeType } = require('../lib/badges/formatters');
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
  assert.equal(mapped.publicStatus, 'active');
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

  assert.equal(data.publicStatus, 'licence_inactive');
  assert.equal(data.label, 'Verified Not Active');
  assert.equal(data.metricText, null);
  assert.doesNotMatch(JSON.stringify(toPublicBadgeJson(data)), /suspended|LICENSE|SUBSCRIPTION|API_KEY/i);
});

test('manual community licence types can activate verified badges when explicitly active', () => {
  const mapped = mapPublicBadgeStatus({
    badgeEnabled: true,
    publicVerificationEnabled: true,
    verificationStatus: 'verified',
    licenseStatus: 'active',
    licenseType: 'non_profit',
    metric: null,
  });

  assert.equal(mapped.publicStatus, 'active');
  assert.equal(mapped.internalReason, 'verified');
});

test('CO2 formatter produces compact badge metric text', () => {
  assert.equal(formatCo2PerPage(0.214), '0.21g CO₂/page');
  assert.equal(formatCo2PerPage(null), null);
});

test('badge SVG renders small verified results badge without raw internals', () => {
  const svg = renderBadgeSvg({
    publicStatus: 'active',
    badgeType: 'greentracer_verified',
    label: 'GreenTracer Verified',
    domain: 'example.com',
    metricText: '0.21g CO₂/page',
    showMetric: true,
  });

  assert.match(svg, /width="240"/);
  assert.match(svg, /height="44"/);
  assert.match(svg, /GreenTracer Verified/);
  assert.doesNotMatch(svg, /0\.21g CO₂\/page/);
  assert.match(svg, /viewBox="60 112 205 226"/);
  assert.doesNotMatch(svg, /LICENSE_UNAVAILABLE|TOKEN_INVALID|SITE_NOT_FOUND|API_KEY_INVALID|SUBSCRIPTION_EXPIRED|DOMAIN_MISMATCH/);
});

test('green hosting fallback badge stays neutral and styled when hosting is unknown', () => {
  const svg = renderBadgeSvg({
    publicStatus: 'green_hosting_not_detected',
    badgeType: 'green_hosting',
    domain: 'example.com',
  }, {
    colors: {
      backgroundColor: '#ffffff',
      accentColor: '#111827',
    },
  });

  assert.match(svg, /Green Hosting/);
  assert.match(svg, /fill="#ffffff"/);
  assert.match(svg, /fill="#111827"/);
  assert.doesNotMatch(svg, /Badge not active|Domain mismatch|not detected/i);
});

test('badge token validation accepts public tokens and rejects unsafe input', () => {
  assert.equal(normalizeBadgeToken('gtb_abc123_PUBLIC-token'), 'gtb_abc123_PUBLIC-token');
  assert.equal(normalizeBadgeToken('abc123_PUBLIC-token'), 'abc123_PUBLIC-token');
  assert.equal(normalizeBadgeToken('../secret'), null);
  assert.equal(normalizeBadgeToken('short'), null);
});

test('legacy green-hosting badge type aliases normalize to the public hosting badge', () => {
  assert.equal(normalizeBadgeType('carbon'), 'carbon_tested');
  assert.equal(normalizeBadgeType('hosting'), 'green_hosting');
  assert.equal(normalizeBadgeType('green-hosting'), 'green_hosting');
  assert.equal(normalizeBadgeType('verified'), 'greentracer_verified');
  assert.equal(normalizeBadgeType('member'), 'greentracer_verified');
});
