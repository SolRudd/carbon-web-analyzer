'use strict';

function payloadKeys(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return [];
  return Object.keys(payload).sort();
}

function logSupabaseError({
  route,
  table,
  operation,
  error,
  payload,
  status,
  statusText,
}) {
  console.error('[supabase-error]', {
    route,
    table,
    operation,
    status: status ?? null,
    statusText: statusText || null,
    code: error?.code || null,
    message: error?.message || null,
    details: error?.details || null,
    hint: error?.hint || null,
    payloadKeys: payloadKeys(payload),
  });
}

module.exports = {
  logSupabaseError,
  payloadKeys,
};
