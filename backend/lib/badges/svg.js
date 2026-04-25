'use strict';

const {
  escapeXml,
  getPublicStatusLabel,
  getVariantConfig,
  normalizePublicStatus,
  normalizeVariant,
} = require('./formatters');

const STATUS_VISUALS = Object.freeze({
  verified: Object.freeze({
    accent: '#22c55e',
    iconBg: '#16a34a',
    iconFg: '#ecfdf5',
  }),
  pending: Object.freeze({
    accent: '#f59e0b',
    iconBg: '#d97706',
    iconFg: '#fffbeb',
  }),
  inactive: Object.freeze({
    accent: '#94a3b8',
    iconBg: '#475569',
    iconFg: '#f8fafc',
  }),
  unavailable: Object.freeze({
    accent: '#64748b',
    iconBg: '#334155',
    iconFg: '#e2e8f0',
  }),
});

function renderStatusIcon(status, config, visuals) {
  const cx = config.iconX + config.iconSize / 2;
  const cy = config.iconY + config.iconSize / 2;
  const radius = config.iconSize / 2;
  const strokeWidth = config.iconSize >= 20 ? 2 : 1.8;

  if (status === 'verified') {
    return `
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${visuals.iconBg}"/>
      <path d="M${cx - 4.8} ${cy + 0.2}L${cx - 1.5} ${cy + 3.5}L${cx + 5.4} ${cy - 4.5}"
        fill="none" stroke="${visuals.iconFg}" stroke-width="${strokeWidth}"
        stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  if (status === 'pending') {
    return `
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${visuals.iconBg}"/>
      <path d="M${cx} ${cy - 5}V${cy + 0.8}L${cx + 3.7} ${cy + 3.1}"
        fill="none" stroke="${visuals.iconFg}" stroke-width="${strokeWidth}"
        stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  return `
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${visuals.iconBg}"/>
    <path d="M${cx - 4.5} ${cy}H${cx + 4.5}"
      fill="none" stroke="${visuals.iconFg}" stroke-width="${strokeWidth}"
      stroke-linecap="round"/>`;
}

function renderBadgeSvg(data = {}, options = {}) {
  const publicStatus = normalizePublicStatus(data.publicStatus);
  const variant = normalizeVariant(options.variant || data.variant || 'compact');
  const includeMetric = options.showMetric !== false && data.showMetric !== false && Boolean(data.metricText);
  const config = getVariantConfig(variant, includeMetric);
  const visuals = STATUS_VISUALS[publicStatus] || STATUS_VISUALS.unavailable;
  const label = escapeXml(data.label || getPublicStatusLabel(publicStatus));
  const metric = includeMetric ? escapeXml(data.metricText) : '';
  const titleDomain = data.domain ? ` for ${data.domain}` : '';
  const title = escapeXml(`${data.label || getPublicStatusLabel(publicStatus)}${titleDomain}`);
  const border = publicStatus === 'verified'
    ? 'rgba(34,197,94,0.42)'
    : publicStatus === 'pending'
      ? 'rgba(245,158,11,0.38)'
      : 'rgba(100,116,139,0.34)';

  const divider = includeMetric
    ? `<line x1="${config.dividerX}" y1="${Math.round(config.height * 0.28)}" x2="${config.dividerX}" y2="${Math.round(config.height * 0.72)}" stroke="#334155" stroke-width="1"/>`
    : '';

  const metricText = includeMetric
    ? `<text x="${config.metricX}" y="${config.metricY}" fill="#b6c4d6" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="${config.metricSize}" font-weight="500" letter-spacing="0">${metric}</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}" role="img" aria-label="${title}">
  <title>${title}</title>
  <rect x="0.5" y="0.5" width="${config.width - 1}" height="${config.height - 1}" rx="${config.radius}" fill="#07111f" stroke="${border}"/>
  <rect x="1" y="1" width="${config.width - 2}" height="${config.height - 2}" rx="${config.radius - 1}" fill="url(#gtBadgeGlow)" opacity="0.86"/>
  ${renderStatusIcon(publicStatus, config, visuals)}
  <text x="${config.textX}" y="${config.textY}" fill="#f8fafc" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="${config.labelSize}" font-weight="650" letter-spacing="0">${label}</text>
  ${divider}
  ${metricText}
  <defs>
    <linearGradient id="gtBadgeGlow" x1="0" x2="${config.width}" y1="0" y2="${config.height}" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0d1b2e"/>
      <stop offset="0.58" stop-color="#07111f"/>
      <stop offset="1" stop-color="#081a18"/>
    </linearGradient>
  </defs>
</svg>`;
}

module.exports = {
  renderBadgeSvg,
};
