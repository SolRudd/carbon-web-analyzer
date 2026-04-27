'use strict';

function getLeadCaptureErrorMessage(error) {
  const code = String(error?.code || '').trim();
  const message = String(error?.message || '').trim();
  const status = Number(error?.status || error?.statusCode || 0);

  if (code === '42P01' || status === 404) {
    return 'Lead capture table is missing or unavailable. Apply backend/sql/006_scan_privacy_model.sql in Supabase, then refresh the PostgREST schema cache if needed.';
  }

  if (code === '42501') {
    return 'Lead capture insert is not permitted. Check SUPABASE_SERVICE_ROLE_KEY and contact_leads table policies.';
  }

  if (!message) {
    return 'Lead capture failed for an unknown reason.';
  }

  return message;
}

module.exports = {
  getLeadCaptureErrorMessage,
};
