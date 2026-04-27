'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  classifyBadgePing,
  domainsMatch,
  normalizeBadgeHost,
  summarizeBadgeInstall,
} = require('../lib/badges/install-tracking');

test('badge install tracking normalizes hosts consistently', () => {
  assert.equal(normalizeBadgeHost('https://www.Example.com/path?x=1'), 'example.com');
  assert.equal(normalizeBadgeHost('example.com:443'), 'example.com');
  assert.equal(domainsMatch('https://www.example.com', 'example.com'), true);
  assert.equal(domainsMatch('app.example.com', 'example.com'), false);
});

test('badge ping classifier distinguishes active, pending, mismatch, inactive, and unknown', () => {
  const base = {
    badgeType: 'greentracer_verified',
    authoritativeDomain: 'example.com',
    declaredDomain: 'example.com',
    detectedHost: 'www.example.com',
    accountDomain: { domain: 'example.com', verification_status: 'verified', badge_enabled: true },
    license: { id: 'lic_1', domain: 'example.com', status: 'active' },
  };

  assert.equal(classifyBadgePing(base).status, 'active');
  assert.equal(classifyBadgePing({ ...base, accountDomain: { ...base.accountDomain, verification_status: 'pending' } }).status, 'pending');
  assert.equal(classifyBadgePing({ ...base, detectedHost: 'other.example' }).status, 'domain_mismatch');
  assert.equal(classifyBadgePing({ ...base, license: { ...base.license, status: 'suspended' } }).status, 'licence_inactive');
  assert.equal(classifyBadgePing({ declaredDomain: 'unknown.example', detectedHost: 'unknown.example' }).status, 'unknown_domain');
});

test('badge ping classifier handles report-backed free badge families', () => {
  const result = { slug: 'example-com-20260425', url: 'https://example.com', green_host: true };

  assert.equal(classifyBadgePing({
    badgeType: 'carbon_tested',
    authoritativeDomain: 'example.com',
    declaredDomain: 'example.com',
    detectedHost: 'example.com',
    result,
  }).status, 'active');

  assert.equal(classifyBadgePing({
    badgeType: 'green_hosting',
    authoritativeDomain: 'example.com',
    declaredDomain: 'example.com',
    detectedHost: 'example.com',
    result,
  }).status, 'active');

  const missingHosting = classifyBadgePing({
    badgeType: 'green_hosting',
    authoritativeDomain: 'example.com',
    declaredDomain: 'example.com',
    detectedHost: 'example.com',
    result: { ...result, green_host: false },
  });
  assert.equal(missingHosting.status, 'unknown_domain');
  assert.equal(missingHosting.reason, 'green_hosting_not_detected');
});

test('badge install summary reports missing installs and aggregate load counts', () => {
  assert.equal(summarizeBadgeInstall([]).state, 'badge_missing');

  const summary = summarizeBadgeInstall([
    {
      status: 'pending',
      declared_domain: 'example.com',
      detected_host: 'example.com',
      load_count: 2,
      last_seen_at: '2026-04-24T10:00:00.000Z',
    },
    {
      status: 'active',
      declared_domain: 'example.com',
      detected_host: 'example.com',
      load_count: 3,
      last_seen_at: '2026-04-25T10:00:00.000Z',
    },
  ]);

  assert.equal(summary.state, 'active');
  assert.equal(summary.loadCount, 5);
  assert.equal(summary.lastSeenAt, '2026-04-25T10:00:00.000Z');
});
