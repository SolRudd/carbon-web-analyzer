'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { getLeadCaptureErrorMessage } = require('../lib/lead-capture-error');

test('lead capture error maps missing table to migration guidance', () => {
  assert.equal(
    getLeadCaptureErrorMessage({ code: '42P01', message: 'relation "contact_leads" does not exist' }),
    'Lead capture table is missing. Apply backend/sql/003_create_contact_leads.sql in Supabase.'
  );
});

test('lead capture error maps permission failures to config guidance', () => {
  assert.equal(
    getLeadCaptureErrorMessage({ code: '42501', message: 'new row violates row-level security policy' }),
    'Lead capture insert is not permitted. Check SUPABASE_SERVICE_KEY and contact_leads table policies.'
  );
});

test('lead capture error falls back to original message when code is unknown', () => {
  assert.equal(
    getLeadCaptureErrorMessage({ code: 'XX000', message: 'unexpected database failure' }),
    'unexpected database failure'
  );
});
