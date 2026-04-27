'use strict';

const crypto = require('crypto');
const { sanitizeDomain } = require('./formatters');

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
const VERIFIED_DOMAIN_STATUSES = new Set(['verified', 'active', 'approved']);

const BADGE_SIZE = Object.freeze({ width: 240, height: 44 });

function trimBaseUrl(value, fallback) {
  const raw = String(value || '').trim();
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, '');
  return fallback;
}

function hasExpired(endDate) {
  if (!endDate) return false;
  const parsed = new Date(endDate);
  return Number.isFinite(parsed.getTime()) && parsed < new Date();
}

function isActiveLicense(license = {}) {
  const status = String(license.status || '').trim().toLowerCase();
  const licenseType = String(license.license_type || license.licenseType || '').trim().toLowerCase();
  const activeStatus = ACTIVE_LICENSE_STATUSES.has(status) || (status === 'active' && ACTIVE_MANUAL_LICENSE_TYPES.has(licenseType));
  return activeStatus && !hasExpired(license.end_date || license.endDate);
}

function isVerifiedDomain(accountDomain = {}, license = {}) {
  const status = String(
    accountDomain.verification_status ||
    license.verification_status ||
    license.verificationStatus ||
    ''
  ).trim().toLowerCase();
  return VERIFIED_DOMAIN_STATUSES.has(status);
}

function generateBadgePublicToken() {
  return `gtb_${crypto.randomBytes(18).toString('base64url')}`;
}

function buildBadgeImageUrl({ token, apiBase }) {
  const base = trimBaseUrl(apiBase, 'https://api.greentracer.org');
  return `${base}/api/badge/${encodeURIComponent(token)}`;
}

function buildVerificationUrl({ token, domain = '', siteBase }) {
  const base = trimBaseUrl(siteBase, 'https://www.greentracer.org');
  const normalizedDomain = sanitizeDomain(domain);
  if (normalizedDomain) return `${base}/verified/${encodeURIComponent(normalizedDomain)}`;
  return `${base}/verify/${encodeURIComponent(token)}`;
}

function escapeHtmlAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildBadgeEmbedCode({ token, domain = '', apiBase }) {
  const api = trimBaseUrl(apiBase, 'https://api.greentracer.org');
  return `<div
  class="greentrace-badge"
  data-public-token="${escapeHtmlAttr(token)}"
  data-domain="${escapeHtmlAttr(domain)}"
  data-badge-type="greentracer_verified"
></div>
<script src="${api}/greentrace-badge.js" async></script>`;
}

function toLockedState({ reason = 'free_plan', domain = null } = {}) {
  return {
    state: 'locked',
    reason,
    canUseVerifiedBadge: false,
    domain,
    statusLabel: 'Locked',
  };
}

function toSetupRequiredState({ reason = 'no_domain', domain = null } = {}) {
  return {
    state: 'setup_required',
    reason,
    canUseVerifiedBadge: false,
    domain,
    statusLabel: 'Setup required',
  };
}

function toInactiveState({ reason = 'inactive_subscription', domain = null } = {}) {
  return {
    state: 'inactive',
    reason,
    canUseVerifiedBadge: false,
    domain,
    statusLabel: 'Inactive',
  };
}

function toActiveState({ domain, token, apiBase, siteBase }) {
  const badgeImageUrl = buildBadgeImageUrl({ token, apiBase });
  const verificationUrl = buildVerificationUrl({ token, domain, siteBase });
  return {
    state: 'active',
    reason: 'active',
    canUseVerifiedBadge: true,
    domain,
    token,
    statusLabel: 'Active',
    badge: {
      publicStatus: 'active',
      badgeType: 'greentracer_verified',
      label: 'GreenTracer Verified',
      domain,
      verificationUrl,
      showMetric: false,
    },
    badgeImageUrl,
    verificationUrl,
    embedCode: buildBadgeEmbedCode({ token, domain, apiBase, siteBase }),
    width: BADGE_SIZE.width,
    height: BADGE_SIZE.height,
  };
}

function mapBadgeEntitlementState(domainStates = []) {
  if (!Array.isArray(domainStates) || domainStates.length === 0) {
    return toSetupRequiredState({ reason: 'no_domain' });
  }

  const activeVerified = domainStates.find((entry) => entry.activeLicense && entry.verifiedDomain);
  if (activeVerified) {
    return {
      state: 'active_candidate',
      reason: 'active',
      domainState: activeVerified,
    };
  }

  const activePending = domainStates.find((entry) => entry.activeLicense);
  if (activePending) {
    return toSetupRequiredState({
      reason: 'pending_verification',
      domain: activePending.domain,
    });
  }

  const inactiveLicense = domainStates.find((entry) => entry.hasLicense);
  if (inactiveLicense) {
    return toInactiveState({
      reason: 'inactive_subscription',
      domain: inactiveLicense.domain,
    });
  }

  return toLockedState({
    reason: 'free_plan',
    domain: domainStates[0]?.domain || null,
  });
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

async function ensureDomainBadgeToken(supabase, accountDomain) {
  if (!supabase || !accountDomain?.id) return accountDomain?.badge_public_token || null;

  const existing = String(accountDomain.badge_public_token || '').trim();
  if (existing) {
    const updates = {
      badge_enabled: true,
      public_verification_enabled: true,
      verification_status: 'verified',
      updated_at: new Date().toISOString(),
    };
    if (!accountDomain.verified_at) updates.verified_at = new Date().toISOString();
    await supabase.from('account_domains').update(updates).eq('id', accountDomain.id);
    return existing;
  }

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const token = generateBadgePublicToken();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('account_domains')
      .update({
        badge_public_token: token,
        badge_enabled: true,
        public_verification_enabled: true,
        verification_status: 'verified',
        verified_at: accountDomain.verified_at || now,
        updated_at: now,
      })
      .eq('id', accountDomain.id)
      .select('*')
      .single();

    if (!error) return data?.badge_public_token || token;
    if (!String(error.code || '').includes('23505')) throw error;
  }

  throw new Error('Could not generate a unique badge token.');
}

async function getUserBadgeEntitlement(supabase, userId, options = {}) {
  const siteBase = trimBaseUrl(options.siteBase, 'https://www.greentracer.org');
  const apiBase = trimBaseUrl(options.apiBase, 'https://api.greentracer.org');

  if (!supabase || !userId) return toLockedState({ reason: 'unauthenticated' });

  const { data, error } = await supabase
    .from('account_domains')
    .select('*')
    .eq('user_id', userId)
    .order('domain', { ascending: true });

  if (error) throw error;

  const domainStates = await Promise.all((data || []).map(async (accountDomain) => {
    const domain = sanitizeDomain(accountDomain.domain);
    const license = await getLicenseForDomain(supabase, domain).catch(() => null);
    return {
      accountDomain,
      domain,
      license,
      hasLicense: Boolean(license),
      activeLicense: isActiveLicense(license || {}),
      verifiedDomain: isVerifiedDomain(accountDomain, license || {}),
    };
  }));

  const mapped = mapBadgeEntitlementState(domainStates);
  if (mapped.state !== 'active_candidate') return mapped;

  const { accountDomain, domain } = mapped.domainState;
  const token = await ensureDomainBadgeToken(supabase, accountDomain);
  if (!token) return toSetupRequiredState({ reason: 'token_unavailable', domain });

  return toActiveState({
    domain,
    token,
    apiBase,
    siteBase,
  });
}

module.exports = {
  ACTIVE_LICENSE_STATUSES,
  BADGE_SIZE,
  buildBadgeEmbedCode,
  buildBadgeImageUrl,
  buildVerificationUrl,
  generateBadgePublicToken,
  getUserBadgeEntitlement,
  isActiveLicense,
  isVerifiedDomain,
  mapBadgeEntitlementState,
};
