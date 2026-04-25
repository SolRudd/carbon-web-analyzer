'use strict';

const {
  formatCo2PerPage,
  getPublicStatusLabel,
  normalizeMetricValue,
  normalizePublicStatus,
} = require('./formatters');

const ACTIVE_LICENSE_STATUSES = new Set(['active', 'trial', 'charity', 'partner', 'internal']);
const VERIFIED_STATUSES = new Set(['verified', 'active', 'approved']);
const PENDING_STATUSES = new Set(['pending', 'needs_review', 'review', 'unverified', 'not_verified', 'none', '']);
const INACTIVE_VERIFICATION_STATUSES = new Set(['inactive', 'disabled', 'rejected', 'failed', 'expired']);

function normalizeRawStatus(value) {
  return String(value || '').trim().toLowerCase();
}

function hasExpired(endDate) {
  if (!endDate) return false;
  const parsed = new Date(endDate);
  return Number.isFinite(parsed.getTime()) && parsed < new Date();
}

function isLicenseActive(raw) {
  const status = normalizeRawStatus(raw.licenseStatus);
  if (!ACTIVE_LICENSE_STATUSES.has(status)) return false;
  return !hasExpired(raw.licenseEndDate);
}

function mapPublicBadgeStatus(raw = {}) {
  if (raw.recordMissing) {
    return {
      publicStatus: 'unavailable',
      label: getPublicStatusLabel('unavailable'),
      shouldShowMetric: false,
      isClickable: false,
      internalReason: 'record_missing',
    };
  }

  if (raw.publicVerificationEnabled === false) {
    return {
      publicStatus: 'inactive',
      label: getPublicStatusLabel('inactive'),
      shouldShowMetric: false,
      isClickable: false,
      internalReason: 'public_verification_disabled',
    };
  }

  if (raw.badgeEnabled === false) {
    return {
      publicStatus: 'inactive',
      label: getPublicStatusLabel('inactive'),
      shouldShowMetric: false,
      isClickable: false,
      internalReason: 'badge_disabled',
    };
  }

  if (!isLicenseActive(raw)) {
    return {
      publicStatus: 'inactive',
      label: getPublicStatusLabel('inactive'),
      shouldShowMetric: false,
      isClickable: false,
      internalReason: 'license_inactive',
    };
  }

  const verificationStatus = normalizeRawStatus(raw.verificationStatus || 'pending');
  if (VERIFIED_STATUSES.has(verificationStatus)) {
    const metric = normalizeMetricValue(raw.metric);
    return {
      publicStatus: 'verified',
      label: getPublicStatusLabel('verified'),
      shouldShowMetric: metric !== null,
      isClickable: true,
      internalReason: 'verified',
    };
  }

  if (INACTIVE_VERIFICATION_STATUSES.has(verificationStatus)) {
    return {
      publicStatus: 'inactive',
      label: getPublicStatusLabel('inactive'),
      shouldShowMetric: false,
      isClickable: true,
      internalReason: 'verification_inactive',
    };
  }

  if (PENDING_STATUSES.has(verificationStatus)) {
    return {
      publicStatus: 'pending',
      label: getPublicStatusLabel('pending'),
      shouldShowMetric: false,
      isClickable: true,
      internalReason: 'verification_pending',
    };
  }

  return {
    publicStatus: 'pending',
    label: getPublicStatusLabel('pending'),
    shouldShowMetric: false,
    isClickable: true,
    internalReason: 'verification_unknown',
  };
}

function toPublicBadgeData(input = {}) {
  const metric = normalizeMetricValue(input.metric);
  const publicStatus = normalizePublicStatus(input.publicStatus);
  const showMetric = Boolean(input.showMetric && metric !== null && publicStatus === 'verified');

  return {
    publicStatus,
    label: input.label || getPublicStatusLabel(publicStatus),
    domain: input.domain || null,
    metric: showMetric ? metric : null,
    metricText: showMetric ? formatCo2PerPage(metric) : null,
    showMetric,
    latestScanAt: input.latestScanAt || null,
    verifiedAt: input.verifiedAt || null,
    verificationUrl: input.verificationUrl || null,
    isClickable: input.isClickable !== false,
  };
}

module.exports = {
  ACTIVE_LICENSE_STATUSES,
  mapPublicBadgeStatus,
  toPublicBadgeData,
};
