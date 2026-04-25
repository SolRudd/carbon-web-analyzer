'use strict';

function getLeadCaptureErrorMessage(error) {
  const code = String(error?.code || '').trim();
  const message = String(error?.message || '').trim();

  if (code === '42P01') {
    return 'Lead capture table is missing. Apply backend/sql/003_create_contact_leads.sql in Supabase.';
  }

  if (code === '42501') {
    return 'Lead capture insert is not permitted. Check SUPABASE_SERVICE_KEY and contact_leads table policies.';
  }

  if (!message) {
    return 'Lead capture failed for an unknown reason.';
  }

  return message;
}

module.exports = {
  getLeadCaptureErrorMessage,
};
