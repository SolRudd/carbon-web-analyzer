'use strict';

const BADGE_TYPES = Object.freeze([
  'carbon_tested',
  'green_hosting',
  'greentracer_verified',
]);

const BADGE_TYPE_ALIASES = Object.freeze({
  carbon: 'carbon_tested',
  carbon_tested: 'carbon_tested',
  tested: 'carbon_tested',
  hosting: 'green_hosting',
  'green-hosting': 'green_hosting',
  green_hosting: 'green_hosting',
  green_hosting_checked: 'green_hosting',
  member: 'greentracer_verified',
  verified: 'greentracer_verified',
  greentracer_verified: 'greentracer_verified',
});

const PUBLIC_STATUSES = Object.freeze([
  'active',
  'pending',
  'not_active',
  'green_hosting_not_detected',
  'licence_inactive',
  'domain_mismatch',
  'unavailable',
]);

const STATUS_LABELS = Object.freeze({
  pending: 'Verification pending',
  not_active: 'Badge not active',
  green_hosting_not_detected: 'Green hosting not detected',
  licence_inactive: 'Licence inactive',
  domain_mismatch: 'Domain mismatch',
  unavailable: 'Badge not active',
});

const BADGE_TYPE_LABELS = Object.freeze({
  carbon_tested: {
    active: 'Carbon Tested',
    fullActive: 'Carbon tested by GreenTracer',
  },
  green_hosting: {
    active: 'Green Hosting Detected',
    fullActive: 'Green hosting detected by GreenTracer',
  },
  greentracer_verified: {
    active: 'Verified Supporter',
    fullActive: 'GreenTracer Verified supporter',
  },
});

const OFFICIAL_BADGE_CONFIG = Object.freeze({
  width: 240,
  height: 44,
  radius: 10,
  logoSize: 24,
  logoX: 10,
  logoY: 10,
  brandX: 46,
  brandY: 18,
  textX: 46,
  textY: 32,
  brandSize: 9,
  labelSize: 12.5,
});

function normalizePublicStatus(status) {
  const value = String(status || '').toLowerCase();
  if (value === 'verified') return 'active';
  if (value === 'inactive') return 'licence_inactive';
  if (value === 'not-verified' || value === 'not verified' || value === 'not_verified') return 'not_active';
  if (value === 'green-hosting-not-detected' || value === 'green hosting not detected') return 'green_hosting_not_detected';
  return PUBLIC_STATUSES.includes(value) ? value : 'unavailable';
}

function normalizeBadgeType(type) {
  const raw = String(type || '').trim().toLowerCase();
  const value = raw.replace(/-/g, '_');
  return BADGE_TYPE_ALIASES[value] || 'greentracer_verified';
}

function getPublicStatusLabel(status, type = 'greentracer_verified') {
  const publicStatus = normalizePublicStatus(status);
  const badgeType = normalizeBadgeType(type);
  if (publicStatus === 'active') {
    return BADGE_TYPE_LABELS[badgeType]?.fullActive || BADGE_TYPE_LABELS.greentracer_verified.fullActive;
  }
  return STATUS_LABELS[publicStatus] || STATUS_LABELS.unavailable;
}

function getBadgeConfig() {
  return OFFICIAL_BADGE_CONFIG;
}

function getBadgeDisplay({ status = 'active', type = 'greentracer_verified', valueText = '' } = {}) {
  const publicStatus = normalizePublicStatus(status);
  const badgeType = normalizeBadgeType(type);
  const typeLabels = BADGE_TYPE_LABELS[badgeType] || BADGE_TYPE_LABELS.greentracer_verified;
  const activeLabel = typeLabels.active;
  const label = publicStatus === 'active'
    ? activeLabel
    : STATUS_LABELS[publicStatus] || STATUS_LABELS.unavailable;
  const value = publicStatus === 'active' ? String(valueText || '').trim() : '';

  return {
    brand: 'GreenTracer',
    label,
    fullLabel: getPublicStatusLabel(publicStatus, badgeType),
    value,
    type: badgeType,
  };
}

function normalizeHexColor(value) {
  const raw = String(value || '').trim();
  const short = raw.match(/^#?([0-9a-f]{3})$/i);
  if (short) {
    return `#${short[1].split('').map((char) => char + char).join('')}`.toLowerCase();
  }

  const long = raw.match(/^#?([0-9a-f]{6})$/i);
  return long ? `#${long[1].toLowerCase()}` : null;
}

function hexToRgb(hex) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return null;
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

function relativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const values = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * values[0]) + (0.7152 * values[1]) + (0.0722 * values[2]);
}

function contrastRatio(a, b) {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  if (first === null || second === null) return 0;
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

function mixHex(base, overlay, amount = 0.2) {
  const a = hexToRgb(base);
  const b = hexToRgb(overlay);
  if (!a || !b) return base;
  const mix = (from, to) => Math.round((from * (1 - amount)) + (to * amount));
  return `#${[mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b)]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
}

function getReadableTextColor(background) {
  const dark = '#07111f';
  const light = '#f8fafc';
  return contrastRatio(background, light) >= contrastRatio(background, dark) ? light : dark;
}

function applyBadgeColorOverrides(baseColors, overrides = {}) {
  const background = normalizeHexColor(
    overrides.backgroundColor ||
    overrides.bgColor ||
    overrides.bg ||
    overrides.background
  );
  const accent = normalizeHexColor(
    overrides.accentColor ||
    overrides.accent
  );

  const next = { ...baseColors };

  if (background) {
    const text = getReadableTextColor(background);
    if (contrastRatio(background, text) >= 4.5) {
      next.background = background;
      next.text = text;
      next.mutedText = text === '#f8fafc' ? '#a8b3c7' : '#475569';
      next.border = mixHex(background, text, text === '#f8fafc' ? 0.26 : 0.18);
    }
  }

  if (accent && contrastRatio(accent, next.background) >= 1.8) {
    next.accent = accent;
    next.markText = getReadableTextColor(accent);
  }

  return next;
}

function getBadgeColors(status = 'active', overrides = {}, type = 'greentracer_verified') {
  const publicStatus = normalizePublicStatus(status);
  const badgeType = normalizeBadgeType(type);
  let colors;
  if (publicStatus === 'active') {
    if (badgeType === 'carbon_tested') {
      colors = {
        background: '#07111f',
        text: '#f8fafc',
        mutedText: '#a8b3c7',
        accent: '#38bdf8',
        border: '#075985',
        markText: '#082f49',
      };
    } else if (badgeType === 'green_hosting') {
      colors = {
        background: '#07111f',
        text: '#f8fafc',
        mutedText: '#a8b3c7',
        accent: '#34d399',
        border: '#047857',
        markText: '#03251a',
      };
    } else {
      colors = {
        background: '#07111f',
        text: '#f8fafc',
        mutedText: '#a8b3c7',
        accent: '#22c55e',
        border: '#1f5f46',
        markText: '#03130d',
      };
    }
  } else if (publicStatus === 'pending') {
    colors = {
      background: '#07111f',
      text: '#f8fafc',
      mutedText: '#a8b3c7',
      accent: '#f59e0b',
      border: '#7c5f24',
      markText: '#111827',
    };
  } else if (publicStatus === 'domain_mismatch') {
    colors = {
      background: '#111827',
      text: '#f8fafc',
      mutedText: '#a8b3c7',
      accent: '#f97316',
      border: '#7c2d12',
      markText: '#111827',
    };
  } else if (publicStatus === 'licence_inactive' || publicStatus === 'green_hosting_not_detected') {
    colors = {
      background: '#111827',
      text: '#f8fafc',
      mutedText: '#a8b3c7',
      accent: '#94a3b8',
      border: '#475569',
      markText: '#0f172a',
    };
  } else {
    colors = {
      background: '#111827',
      text: '#e2e8f0',
      mutedText: '#94a3b8',
      accent: '#64748b',
      border: '#334155',
      markText: '#f8fafc',
    };
  }

  return applyBadgeColorOverrides(colors, overrides);
}

function normalizeMetricValue(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function formatCo2PerPage(value) {
  const metric = normalizeMetricValue(value);
  if (metric === null) return null;
  const decimals = metric >= 10 ? 1 : 2;
  return `${metric.toFixed(decimals)}g CO₂/page`;
}

function sanitizeDomain(domain) {
  const value = String(domain || '').trim();
  if (!value) return null;

  try {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const parsed = new URL(normalized);
    return parsed.hostname.replace(/^www\./i, '').toLowerCase() || null;
  } catch {
    const fallback = value
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0]
      .split(':')[0]
      .toLowerCase();
    return fallback || null;
  }
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function booleanFromQuery(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  return fallback;
}

module.exports = {
  BADGE_TYPES,
  BADGE_TYPE_ALIASES,
  OFFICIAL_BADGE_CONFIG,
  PUBLIC_STATUSES,
  STATUS_LABELS,
  formatCo2PerPage,
  getBadgeColors,
  getBadgeConfig,
  getBadgeDisplay,
  getPublicStatusLabel,
  normalizeBadgeType,
  normalizeHexColor,
  normalizeMetricValue,
  normalizePublicStatus,
  sanitizeDomain,
  escapeXml,
  booleanFromQuery,
};
