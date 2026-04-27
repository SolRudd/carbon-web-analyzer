'use strict';

const { normalizeBadgeToken } = require('./get-public-badge-data');
const { normalizeBadgeType: normalizeCanonicalBadgeType, sanitizeDomain } = require('./formatters');

const ACTIVE_LICENSE_STATUSES = new Set([
  'active',
  'trial',
  'charity',
  'partner',
  'internal',
  'non_profit',
  'nonprofit',
  'community',
  'manual_lifetime',
]);
const ACTIVE_MANUAL_LICENSE_TYPES = new Set([
  'paid',
  'trial',
  'charity',
  'partner',
  'internal',
  'non_profit',
  'nonprofit',
  'community',
  'manual_lifetime',
]);
const VERIFIED_STATUSES = new Set(['verified', 'active', 'approved']);
const BADGE_PING_STATUSES = Object.freeze([
  'active',
  'pending',
  'badge_missing',
  'domain_mismatch',
  'licence_inactive',
  'unknown_domain',
  'unavailable',
]);
function normalizeBadgeType(value) {
  return normalizeCanonicalBadgeType(value);
}

function normalizeBadgeHost(value) {
  return sanitizeDomain(value);
}

function hasExpired(endDate) {
  if (!endDate) return false;
  const parsed = new Date(endDate);
  return Number.isFinite(parsed.getTime()) && parsed < new Date();
}

function isLicenseActive(license = {}) {
  const status = String(license.status || '').trim().toLowerCase();
  const licenseType = String(license.license_type || license.licenseType || '').trim().toLowerCase();
  const activeStatus = ACTIVE_LICENSE_STATUSES.has(status) || (status === 'active' && ACTIVE_MANUAL_LICENSE_TYPES.has(licenseType));
  return activeStatus && !hasExpired(license.end_date || license.endDate);
}

function isVerified(accountDomain = {}, license = {}) {
  const status = String(
    accountDomain.verification_status ||
    license.verification_status ||
    license.verificationStatus ||
    ''
  ).trim().toLowerCase();
  return VERIFIED_STATUSES.has(status);
}

function domainsMatch(expected, observed) {
  const expectedDomain = normalizeBadgeHost(expected);
  const observedDomain = normalizeBadgeHost(observed);
  return Boolean(expectedDomain && observedDomain && expectedDomain === observedDomain);
}

function firstRow(data) {
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function getLicenseForDomain(supabase, domain) {
  const normalized = normalizeBadgeHost(domain);
  if (!supabase || !normalized) return null;
  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('domain', normalized)
    .order('updated_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  return firstRow(data);
}

async function getAccountDomainForDomain(supabase, domain) {
  const normalized = normalizeBadgeHost(domain);
  if (!supabase || !normalized) return null;
  const { data, error } = await supabase
    .from('account_domains')
    .select('*')
    .eq('domain', normalized)
    .order('updated_at', { ascending: false, nullsFirst: false })
    .limit(1);
  if (error) throw error;
  return firstRow(data);
}

async function getAccountDomainForToken(supabase, token) {
  if (!supabase || !token) return null;
  const { data, error } = await supabase
    .from('account_domains')
    .select('*')
    .eq('badge_public_token', token)
    .limit(1);
  if (error) throw error;
  return firstRow(data);
}

async function getLicenseForToken(supabase, token) {
  if (!supabase || !token) return null;
  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('badge_public_token', token)
    .limit(1);
  if (error) throw error;
  return firstRow(data);
}

async function getResultForSlug(supabase, slug) {
  const normalized = String(slug || '').trim().toLowerCase().replace(/-+$/, '');
  if (!supabase || !/^[a-z0-9-]{3,220}$/.test(normalized)) return null;
  const { data, error } = await supabase
    .from('results')
    .select('slug,url,green_host,created_at')
    .eq('slug', normalized)
    .limit(1);
  if (error) throw error;
  return firstRow(data);
}

async function getLatestResultForDomain(supabase, domain) {
  const normalized = normalizeBadgeHost(domain);
  if (!supabase || !normalized) return null;
  const { data, error } = await supabase
    .from('results')
    .select('slug,url,green_host,created_at')
    .ilike('url', `%${normalized}%`)
    .order('created_at', { ascending: false })
    .limit(25);
  if (error) throw error;
  return (data || []).find((row) => normalizeBadgeHost(row.url) === normalized) || null;
}

async function resolveBadgePingContext(supabase, input = {}) {
  const token = normalizeBadgeToken(input.token || input.publicToken || input.public_token);
  const declaredDomain = normalizeBadgeHost(input.declaredDomain || input.declared_domain || input.site || input.url);
  const detectedHost = normalizeBadgeHost(input.detectedHost || input.detected_host || input.host);
  const badgeType = normalizeBadgeType(input.badgeType || input.badge_type || input.type);
  const resultSlug = String(input.resultSlug || input.result_slug || input.slug || '').trim().toLowerCase().replace(/-+$/, '');
  const sourceUrl = String(input.sourceUrl || input.source_url || input.referrer || '').trim().slice(0, 500);

  let accountDomain = null;
  let license = null;
  let authoritativeDomain = null;
  let result = null;

  if (badgeType === 'greentracer_verified' && token) {
    accountDomain = await getAccountDomainForToken(supabase, token);
    if (accountDomain) {
      authoritativeDomain = normalizeBadgeHost(accountDomain.domain);
      license = await getLicenseForDomain(supabase, authoritativeDomain);
    } else {
      license = await getLicenseForToken(supabase, token);
      authoritativeDomain = normalizeBadgeHost(license?.domain);
    }
  }

  if (badgeType !== 'greentracer_verified') {
    result = await getResultForSlug(supabase, resultSlug).catch(() => null);
    authoritativeDomain = normalizeBadgeHost(result?.url) || declaredDomain || detectedHost;
    if (!result && authoritativeDomain) {
      result = await getLatestResultForDomain(supabase, authoritativeDomain).catch(() => null);
      authoritativeDomain = normalizeBadgeHost(result?.url) || authoritativeDomain;
    }
  }

  if (!authoritativeDomain) {
    const candidateDomain = declaredDomain || detectedHost;
    authoritativeDomain = normalizeBadgeHost(candidateDomain);
    if (authoritativeDomain) {
      license = await getLicenseForDomain(supabase, authoritativeDomain);
      accountDomain = await getAccountDomainForDomain(supabase, authoritativeDomain).catch(() => null);
    }
  }

  return {
    token,
    declaredDomain,
    detectedHost,
    badgeType,
    resultSlug,
    sourceUrl,
    result,
    authoritativeDomain,
    accountDomain,
    license,
  };
}

function classifyBadgePing(context = {}) {
  const authoritativeDomain = normalizeBadgeHost(context.authoritativeDomain || context.accountDomain?.domain || context.license?.domain);
  const declaredDomain = normalizeBadgeHost(context.declaredDomain);
  const detectedHost = normalizeBadgeHost(context.detectedHost);
  const license = context.license || null;
  const accountDomain = context.accountDomain || null;
  const badgeType = normalizeBadgeType(context.badgeType);
  const result = context.result || null;

  if (declaredDomain && detectedHost && !domainsMatch(declaredDomain, detectedHost)) {
    return {
      status: 'domain_mismatch',
      reason: 'declared_detected_domain_mismatch',
      authoritativeDomain: authoritativeDomain || declaredDomain,
    };
  }

  if (badgeType !== 'greentracer_verified') {
    if (!authoritativeDomain || !result) {
      return {
        status: 'unknown_domain',
        reason: 'result_missing',
        authoritativeDomain: authoritativeDomain || declaredDomain || detectedHost || null,
      };
    }

    if (declaredDomain && !domainsMatch(authoritativeDomain, declaredDomain)) {
      return {
        status: 'domain_mismatch',
        reason: 'declared_domain_mismatch',
        authoritativeDomain,
      };
    }

    if (detectedHost && !domainsMatch(authoritativeDomain, detectedHost)) {
      return {
        status: 'domain_mismatch',
        reason: 'detected_host_mismatch',
        authoritativeDomain,
      };
    }

    if (badgeType === 'green_hosting' && result.green_host !== true) {
      return {
        status: 'unknown_domain',
        reason: 'green_hosting_not_detected',
        authoritativeDomain,
      };
    }

    return {
      status: 'active',
      reason: badgeType === 'carbon_tested' ? 'carbon_result_found' : 'green_hosting_detected',
      authoritativeDomain,
    };
  }

  if (!authoritativeDomain || (!license && !accountDomain)) {
    return {
      status: 'unknown_domain',
      reason: 'unknown_domain',
      authoritativeDomain: authoritativeDomain || declaredDomain || detectedHost || null,
    };
  }

  if (declaredDomain && !domainsMatch(authoritativeDomain, declaredDomain)) {
    return {
      status: 'domain_mismatch',
      reason: 'declared_domain_mismatch',
      authoritativeDomain,
    };
  }

  if (detectedHost && !domainsMatch(authoritativeDomain, detectedHost)) {
    return {
      status: 'domain_mismatch',
      reason: 'detected_host_mismatch',
      authoritativeDomain,
    };
  }

  if (!license || !isLicenseActive(license)) {
    return {
      status: 'licence_inactive',
      reason: 'licence_inactive',
      authoritativeDomain,
    };
  }

  if (accountDomain?.badge_enabled === false || license.badge_enabled === false) {
    return {
      status: 'pending',
      reason: 'badge_disabled',
      authoritativeDomain,
    };
  }

  if (accountDomain?.public_verification_enabled === false || license.is_public_verification_enabled === false) {
    return {
      status: 'pending',
      reason: 'public_verification_disabled',
      authoritativeDomain,
    };
  }

  if (!isVerified(accountDomain || {}, license || {})) {
    return {
      status: 'pending',
      reason: 'verification_pending',
      authoritativeDomain,
    };
  }

  return {
    status: 'active',
    reason: 'active_verified_badge',
    authoritativeDomain,
  };
}

async function classifyBadgePingInput(supabase, input = {}) {
  const context = await resolveBadgePingContext(supabase, input);
  const classification = classifyBadgePing(context);
  return {
    ...context,
    ...classification,
    status: BADGE_PING_STATUSES.includes(classification.status)
      ? classification.status
      : 'unavailable',
  };
}

async function recordBadgePing(supabase, classified = {}) {
  if (!supabase) return;
  const payload = {
    p_badge_public_token: classified.token || '',
    p_declared_domain: classified.declaredDomain || '',
    p_detected_host: classified.detectedHost || '',
    p_badge_type: normalizeBadgeType(classified.badgeType),
    p_status: BADGE_PING_STATUSES.includes(classified.status) ? classified.status : 'unavailable',
    p_licence_id: classified.license?.id || null,
    p_user_id: classified.accountDomain?.user_id || null,
  };

  const { error } = await supabase.rpc('record_badge_ping', payload);
  if (error) throw error;

  const sourceUrl = String(classified.sourceUrl || '').trim();
  if (sourceUrl) {
    try {
      await supabase
        .from('badge_pings')
        .update({ source_url: sourceUrl.slice(0, 500), updated_at: new Date().toISOString() })
        .eq('badge_public_token', payload.p_badge_public_token || 'no-token')
        .eq('declared_domain', payload.p_declared_domain || '')
        .eq('detected_host', payload.p_detected_host || '')
        .eq('badge_type', payload.p_badge_type);
    } catch {
      // Optional tracking metadata must not make badge installs fail.
    }
  }
}

function newestPing(rows = []) {
  return [...rows].sort((a, b) => {
    const first = new Date(a.last_seen_at || a.first_seen_at || 0).getTime();
    const second = new Date(b.last_seen_at || b.first_seen_at || 0).getTime();
    return second - first;
  })[0] || null;
}

function summarizeBadgeInstall(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      state: 'badge_missing',
      status: 'badge_missing',
      label: 'Badge not installed',
      lastSeenAt: null,
      loadCount: 0,
      detectedHost: null,
      declaredDomain: null,
      badgeType: null,
    };
  }

  const latest = newestPing(rows);
  const statuses = new Set(rows.map((row) => String(row.status || '').toLowerCase()));
  const state = statuses.has('domain_mismatch')
    ? 'domain_mismatch'
    : statuses.has('active')
      ? 'active'
      : String(latest.status || 'unknown_domain').toLowerCase();

  const labels = {
    active: 'Active badge',
    pending: 'Verification pending',
    badge_missing: 'Badge not installed',
    domain_mismatch: 'Domain mismatch',
    licence_inactive: 'Licence inactive',
    unknown_domain: 'Unknown domain',
    unavailable: 'Unavailable',
  };

  return {
    state: BADGE_PING_STATUSES.includes(state) ? state : 'unavailable',
    status: BADGE_PING_STATUSES.includes(state) ? state : 'unavailable',
    label: labels[state] || labels.unavailable,
    lastSeenAt: latest.last_seen_at || latest.first_seen_at || null,
    loadCount: rows.reduce((total, row) => total + Number(row.load_count || row.ping_count || 0), 0),
    detectedHost: latest.detected_host || latest.host_domain || null,
    declaredDomain: latest.declared_domain || latest.site_url || null,
    sourceUrl: latest.source_url || null,
    badgeType: latest.badge_type || null,
  };
}

async function getBadgeInstallSummaryForDomain(supabase, { domain, token, badgeType } = {}) {
  const normalizedDomain = normalizeBadgeHost(domain);
  const normalizedToken = normalizeBadgeToken(token) || '';
  const normalizedBadgeType = badgeType ? normalizeBadgeType(badgeType) : '';
  if (!supabase || (!normalizedDomain && !normalizedToken)) return summarizeBadgeInstall([]);

  const filters = [];
  if (normalizedDomain) {
    filters.push(`declared_domain.eq.${normalizedDomain}`);
    filters.push(`detected_host.eq.${normalizedDomain}`);
  }
  if (normalizedToken) filters.push(`badge_public_token.eq.${normalizedToken}`);

  let { data, error } = await supabase
    .from('badge_pings')
    .select('declared_domain,detected_host,badge_type,first_seen_at,last_seen_at,load_count,status,licence_id,user_id,badge_public_token,site_url,host_domain,ping_count,source_url')
    .or(filters.join(','))
    .order('last_seen_at', { ascending: false })
    .limit(50);

  if (error && /source_url/i.test(String(error.message || ''))) {
    const fallback = await supabase
      .from('badge_pings')
      .select('declared_domain,detected_host,badge_type,first_seen_at,last_seen_at,load_count,status,licence_id,user_id,badge_public_token,site_url,host_domain,ping_count')
      .or(filters.join(','))
      .order('last_seen_at', { ascending: false })
      .limit(50);
    data = fallback.data;
    error = fallback.error;
  }

  if (error) throw error;
  const rows = normalizedBadgeType
    ? (data || []).filter((row) => normalizeBadgeType(row.badge_type) === normalizedBadgeType)
    : (data || []);
  return summarizeBadgeInstall(rows);
}

module.exports = {
  BADGE_PING_STATUSES,
  classifyBadgePing,
  classifyBadgePingInput,
  domainsMatch,
  getBadgeInstallSummaryForDomain,
  isLicenseActive,
  isVerified,
  normalizeBadgeHost,
  normalizeBadgeType,
  recordBadgePing,
  resolveBadgePingContext,
  summarizeBadgeInstall,
};
