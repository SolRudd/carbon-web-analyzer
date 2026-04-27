'use strict';

const { createClient } = require('@supabase/supabase-js');

function readSupabaseAdminConfig(env = process.env) {
  const url = String(env.SUPABASE_URL || '').trim();
  const serviceRoleKey = String(env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const legacyServiceKey = String(env.SUPABASE_SERVICE_KEY || '').trim();
  const key = serviceRoleKey || legacyServiceKey;

  return {
    url,
    key,
    hasUrl: Boolean(url),
    hasServiceRoleKey: Boolean(serviceRoleKey),
    hasLegacyServiceKey: Boolean(legacyServiceKey),
    keySource: serviceRoleKey ? 'SUPABASE_SERVICE_ROLE_KEY' : legacyServiceKey ? 'SUPABASE_SERVICE_KEY' : 'none',
  };
}

function createSupabaseAdminClient(env = process.env) {
  const config = readSupabaseAdminConfig(env);

  if (!config.hasUrl || !config.key) {
    console.error('[supabase-admin] missing server-side Supabase admin config', {
      hasSupabaseUrl: config.hasUrl,
      hasSupabaseServiceRoleKey: config.hasServiceRoleKey,
      hasLegacySupabaseServiceKey: config.hasLegacyServiceKey,
    });
    throw new Error('Supabase admin client is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  if (!config.hasServiceRoleKey && config.hasLegacyServiceKey) {
    console.warn('[supabase-admin] using legacy SUPABASE_SERVICE_KEY. Prefer SUPABASE_SERVICE_ROLE_KEY for clarity.');
  }

  return createClient(config.url, config.key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

module.exports = {
  createSupabaseAdminClient,
  readSupabaseAdminConfig,
};
