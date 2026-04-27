'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { getLeadCaptureErrorMessage } = require('../lib/lead-capture-error');

test('lead capture error maps missing table to migration guidance', () => {
  assert.equal(
    getLeadCaptureErrorMessage({ code: '42P01', message: 'relation "contact_leads" does not exist' }),
    'Lead capture table is missing or unavailable. Apply backend/sql/006_scan_privacy_model.sql in Supabase, then refresh the PostgREST schema cache if needed.'
  );
});

test('lead capture error maps empty PostgREST not-found responses to migration guidance', () => {
  assert.equal(
    getLeadCaptureErrorMessage({ status: 404 }),
    'Lead capture table is missing or unavailable. Apply backend/sql/006_scan_privacy_model.sql in Supabase, then refresh the PostgREST schema cache if needed.'
  );
});

test('lead capture error maps permission failures to config guidance', () => {
  assert.equal(
    getLeadCaptureErrorMessage({ code: '42501', message: 'new row violates row-level security policy' }),
    'Lead capture insert is not permitted. Check SUPABASE_SERVICE_ROLE_KEY and contact_leads table policies.'
  );
});

test('lead capture error falls back to original message when code is unknown', () => {
  assert.equal(
    getLeadCaptureErrorMessage({ code: 'XX000', message: 'unexpected database failure' }),
    'unexpected database failure'
  );
});
