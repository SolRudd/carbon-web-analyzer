'use strict';

const { sanitizeDomain, normalizeMetricValue } = require('./formatters');
const { mapPublicBadgeStatus, toPublicBadgeData } = require('./status-map');

function normalizeBadgeToken(input) {
  const token = String(input || '').trim();
  if (!token || token.length > 160) return null;
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{5,159}$/.test(token)) return null;
  return token;
}

function trimBaseUrl(value, fallback) {
  const raw = String(value || '').trim();
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, '');
  return fallback;
}

function unavailableBadgeData(siteBase, reason = 'unavailable') {
  return {
    ...toPublicBadgeData({
      publicStatus: 'unavailable',
      badgeType: 'greentracer_verified',
      label: 'Badge not active',
      showMetric: false,
      verificationUrl: siteBase ? `${siteBase}/verify/unavailable` : null,
      isClickable: false,
    }),
    internalReason: reason,
  };
}

async function getLatestResultForDomain(supabase, domain, latestResultSlug) {
  if (!supabase || !domain) return null;

  if (latestResultSlug) {
    const { data, error } = await supabase
      .from('results')
      .select('slug,url,carbon_estimate,created_at')
      .eq('slug', latestResultSlug)
      .limit(1);
    if (!error && Array.isArray(data) && data[0]) return data[0];
  }

  const { data, error } = await supabase
    .from('results')
    .select('slug,url,carbon_estimate,created_at')
    .ilike('url', `%${domain}%`)
    .order('created_at', { ascending: false })
    .limit(25);

  if (error || !Array.isArray(data)) return null;
  return data.find((row) => sanitizeDomain(row.url) === domain) || null;
}

async function markBadgeRequest(supabase, licenseId) {
  if (!supabase || !licenseId) return;
  try {
    await supabase
      .from('licenses')
      .update({ last_badge_request_at: new Date().toISOString() })
      .eq('id', licenseId);
  } catch {
    // Analytics freshness must not break public badge rendering.
  }
}

async function markAccountDomainBadgeRequest(supabase, accountDomainId) {
  if (!supabase || !accountDomainId) return;
  try {
    await supabase
      .from('account_domains')
      .update({ last_badge_request_at: new Date().toISOString() })
      .eq('id', accountDomainId);
  } catch {
    // Analytics freshness must not break public badge rendering.
  }
}

async function getLicenseForDomain(supabase, domain) {
  if (!supabase || !domain) return null;
  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('domain', domain)
    .order('updated_at', { ascending: false })
    .limit(1);
  if (error || !Array.isArray(data) || data.length === 0) return null;
  return data[0];
}

async function findAccountDomainBadgeRecord(supabase, token) {
  try {
    const { data, error } = await supabase
      .from('account_domains')
      .select('*')
      .eq('badge_public_token', token)
      .limit(1);

    if (error) return { row: null, error };
    return { row: Array.isArray(data) && data.length > 0 ? data[0] : null, error: null };
  } catch (error) {
    return { row: null, error };
  }
}

async function findLegacyLicenseBadgeRecord(supabase, token) {
  try {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('badge_public_token', token)
      .limit(1);

    if (error) return { row: null, error };
    return { row: Array.isArray(data) && data.length > 0 ? data[0] : null, error: null };
  } catch (error) {
    return { row: null, error };
  }
}

async function getPublicBadgeData(supabase, tokenInput, options = {}) {
  const siteBase = trimBaseUrl(options.siteBase, 'https://www.greentracer.org');
  const token = normalizeBadgeToken(tokenInput);
  if (!token) return unavailableBadgeData(siteBase, 'token_invalid');

  const accountDomainLookup = await findAccountDomainBadgeRecord(supabase, token);
  if (accountDomainLookup.row) {
    const row = accountDomainLookup.row;
    const domain = sanitizeDomain(row.domain);
    if (options.markRequest !== false) {
      await markAccountDomainBadgeRequest(supabase, row.id);
    }

    const license = await getLicenseForDomain(supabase, domain).catch(() => null);
    const result = await getLatestResultForDomain(supabase, domain, row.latest_result_slug || license?.latest_result_slug).catch(() => null);
    const metric = normalizeMetricValue(row.latest_co2_per_page ?? license?.latest_co2_per_page ?? result?.carbon_estimate);
    const latestScanAt = row.latest_scan_at || license?.latest_scan_at || result?.created_at || null;

    const mapped = mapPublicBadgeStatus({
      badgeEnabled: row.badge_enabled === true,
      publicVerificationEnabled: row.public_verification_enabled !== false,
      verificationStatus: row.verification_status || 'pending',
      licenseStatus: license?.status,
      licenseType: license?.license_type,
      licenseEndDate: license?.end_date,
      metric,
    });

    return {
      ...toPublicBadgeData({
        publicStatus: mapped.publicStatus,
        label: mapped.label,
        badgeType: 'greentracer_verified',
        domain,
        metric,
        showMetric: mapped.shouldShowMetric && options.showMetric !== false,
        latestScanAt,
        verifiedAt: row.verified_at || license?.verified_at || null,
        verificationUrl: domain ? `${siteBase}/verified/${encodeURIComponent(domain)}` : `${siteBase}/verify/${encodeURIComponent(token)}`,
        directoryUrl: domain ? `${siteBase}/verified/${encodeURIComponent(domain)}` : null,
        isClickable: mapped.isClickable,
      }),
      token,
      internalReason: mapped.internalReason,
    };
  }

  const legacyLookup = await findLegacyLicenseBadgeRecord(supabase, token);
  if (legacyLookup.error && !accountDomainLookup.error) {
    return unavailableBadgeData(siteBase, 'lookup_error');
  }
  if (!legacyLookup.row) return unavailableBadgeData(siteBase, 'record_missing');

  const row = legacyLookup.row;
  if (options.markRequest !== false) {
    await markBadgeRequest(supabase, row.id);
  }

  const domain = sanitizeDomain(row.domain);
  const result = await getLatestResultForDomain(supabase, domain, row.latest_result_slug).catch(() => null);
  const metric = normalizeMetricValue(row.latest_co2_per_page ?? result?.carbon_estimate);
  const latestScanAt = row.latest_scan_at || result?.created_at || null;

  const mapped = mapPublicBadgeStatus({
    badgeEnabled: row.badge_enabled !== false,
    publicVerificationEnabled: row.is_public_verification_enabled !== false,
    verificationStatus: row.verification_status || 'pending',
    licenseStatus: row.status,
    licenseType: row.license_type,
    licenseEndDate: row.end_date,
    metric,
  });

  return {
    ...toPublicBadgeData({
      publicStatus: mapped.publicStatus,
      label: mapped.label,
      badgeType: 'greentracer_verified',
      domain,
      metric,
      showMetric: mapped.shouldShowMetric && options.showMetric !== false,
      latestScanAt,
      verifiedAt: row.verified_at || null,
      verificationUrl: domain ? `${siteBase}/verified/${encodeURIComponent(domain)}` : `${siteBase}/verify/${encodeURIComponent(token)}`,
      directoryUrl: domain ? `${siteBase}/verified/${encodeURIComponent(domain)}` : null,
      isClickable: mapped.isClickable,
    }),
    token,
    internalReason: mapped.internalReason,
  };
}

function toPublicBadgeJson(data = {}) {
  return {
    publicStatus: data.publicStatus || 'unavailable',
    badgeType: data.badgeType || 'greentracer_verified',
    label: data.label || 'Badge not active',
    domain: data.domain || null,
    metric: data.metric ?? null,
    metricText: data.metricText || null,
    showMetric: Boolean(data.showMetric),
    latestScanAt: data.latestScanAt || null,
    verifiedAt: data.verifiedAt || null,
    verificationUrl: data.verificationUrl || null,
    directoryUrl: data.directoryUrl || null,
    reportUrl: data.reportUrl || null,
    resultSlug: data.resultSlug || null,
    valueText: data.valueText || data.gradeText || null,
    isClickable: data.isClickable !== false,
  };
}

module.exports = {
  getPublicBadgeData,
  normalizeBadgeToken,
  toPublicBadgeJson,
  unavailableBadgeData,
};
