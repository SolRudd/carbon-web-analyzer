'use strict';

const PUBLIC_STATUSES = Object.freeze(['verified', 'pending', 'inactive', 'unavailable']);

const STATUS_LABELS = Object.freeze({
  verified: 'GreenTracer Verified',
  pending: 'GreenTracer Pending',
  inactive: 'GreenTracer Inactive',
  unavailable: 'GreenTracer Unavailable',
});

const VARIANTS = Object.freeze({
  compact: Object.freeze({
    width: 248,
    widthWithoutMetric: 220,
    height: 40,
    radius: 20,
    iconSize: 18,
    iconX: 15,
    iconY: 11,
    textX: 40,
    textY: 25,
    labelSize: 12.5,
    dividerX: 164,
    metricX: 176,
    metricY: 25,
    metricSize: 11,
  }),
  standard: Object.freeze({
    width: 310,
    widthWithoutMetric: 268,
    height: 50,
    radius: 24,
    iconSize: 22,
    iconX: 17,
    iconY: 14,
    textX: 48,
    textY: 31,
    labelSize: 14,
    dividerX: 204,
    metricX: 220,
    metricY: 31,
    metricSize: 12.5,
  }),
});

function normalizePublicStatus(status) {
  const value = String(status || '').toLowerCase();
  return PUBLIC_STATUSES.includes(value) ? value : 'unavailable';
}

function getPublicStatusLabel(status) {
  return STATUS_LABELS[normalizePublicStatus(status)];
}

function normalizeVariant(variant) {
  return Object.prototype.hasOwnProperty.call(VARIANTS, variant) ? variant : 'compact';
}

function getVariantConfig(variant, showMetric) {
  const config = VARIANTS[normalizeVariant(variant)];
  return {
    ...config,
    width: showMetric ? config.width : config.widthWithoutMetric,
  };
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
  const value = String(domain || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .toLowerCase();
  return value || null;
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
  PUBLIC_STATUSES,
  STATUS_LABELS,
  formatCo2PerPage,
  getPublicStatusLabel,
  getVariantConfig,
  normalizeMetricValue,
  normalizePublicStatus,
  normalizeVariant,
  sanitizeDomain,
  escapeXml,
  booleanFromQuery,
};
