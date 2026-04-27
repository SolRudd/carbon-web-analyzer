'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildBadgeEmbedCode,
  generateBadgePublicToken,
  isActiveLicense,
  mapBadgeEntitlementState,
} = require('../lib/badges/entitlement');

test('badge public tokens are generated as safe public identifiers', () => {
  const token = generateBadgePublicToken();
  assert.match(token, /^gtb_[A-Za-z0-9_-]{20,}$/);
  assert.doesNotMatch(token, /sk_|secret|key/i);
});

test('entitlement mapping returns launch product states only', () => {
  assert.equal(mapBadgeEntitlementState([]).state, 'setup_required');

  const locked = mapBadgeEntitlementState([{ domain: 'example.com', hasLicense: false }]);
  assert.equal(locked.state, 'locked');
  assert.equal(locked.reason, 'free_plan');

  const setup = mapBadgeEntitlementState([{
    domain: 'example.com',
    hasLicense: true,
    activeLicense: true,
    verifiedDomain: false,
  }]);
  assert.equal(setup.state, 'setup_required');
  assert.equal(setup.reason, 'pending_verification');

  const inactive = mapBadgeEntitlementState([{
    domain: 'example.com',
    hasLicense: true,
    activeLicense: false,
    verifiedDomain: true,
  }]);
  assert.equal(inactive.state, 'inactive');

  const active = mapBadgeEntitlementState([{
    domain: 'example.com',
    hasLicense: true,
    activeLicense: true,
    verifiedDomain: true,
  }]);
  assert.equal(active.state, 'active_candidate');
});

test('active license logic is backend-confirmed status based', () => {
  assert.equal(isActiveLicense({ status: 'active' }), true);
  assert.equal(isActiveLicense({ status: 'trial' }), true);
  assert.equal(isActiveLicense({ status: 'active', license_type: 'manual_lifetime' }), true);
  assert.equal(isActiveLicense({ status: 'active', license_type: 'community' }), true);
  assert.equal(isActiveLicense({ status: 'inactive' }), false);
  assert.equal(isActiveLicense({ status: 'inactive', license_type: 'community' }), false);
  assert.equal(isActiveLicense({ status: 'active', end_date: '2000-01-01T00:00:00.000Z' }), false);
});

test('embed code uses the official loader without exposing a standalone secret field', () => {
  const code = buildBadgeEmbedCode({
    token: 'gtb_public123',
    domain: 'example.com',
    apiBase: 'https://api.example.test',
    siteBase: 'https://site.example.test',
  });

  assert.match(code, /greentrace-badge/);
  assert.match(code, /data-public-token="gtb_public123"/);
  assert.match(code, /data-domain="example.com"/);
  assert.match(code, /data-badge-type="greentracer_verified"/);
  assert.match(code, /greentrace-badge\.js/);
  assert.doesNotMatch(code, /PUBLIC_TOKEN|API_KEY|SECRET/i);
});
