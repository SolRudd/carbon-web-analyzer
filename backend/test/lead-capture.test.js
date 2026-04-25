'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { parseLeadCapturePayload } = require('../lib/lead-capture');

test('lead capture is skipped when no email was supplied', () => {
  assert.deepEqual(parseLeadCapturePayload({}), {
    shouldCapture: false,
    email: null,
    consent: false,
    source: 'homepage_hero',
  });
});

test('lead capture can require email for homepage scans', () => {
  assert.throws(
    () => parseLeadCapturePayload({}, { requireEmail: true }),
    /email address is required/i
  );
});

test('lead capture requires explicit consent for contactable emails', () => {
  assert.throws(
    () => parseLeadCapturePayload({ contactEmail: 'team@example.com', contactConsent: false }),
    /confirm contact permission/i
  );
});

test('lead capture normalizes valid email input', () => {
  assert.deepEqual(
    parseLeadCapturePayload({
      contactEmail: ' Team@Example.com ',
      contactConsent: true,
      contactSource: 'homepage_hero',
    }),
    {
      shouldCapture: true,
      email: 'team@example.com',
      consent: true,
      source: 'homepage_hero',
    }
  );
});
