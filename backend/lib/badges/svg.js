'use strict';

const {
  escapeXml,
  getBadgeColors,
  getBadgeConfig,
  getBadgeDisplay,
  getPublicStatusLabel,
  normalizePublicStatus,
} = require('./formatters');

function renderLogoMark(config, colors) {
  const x = config.logoX;
  const y = config.logoY;
  const size = config.logoSize;
  const cx = x + size / 2;
  const cy = y + size / 2;

  return `
    <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="7" fill="${colors.accent}"/>
    <path d="M${cx} ${y + 5.2}l6 2.4v4.5c0 4-2.4 6.7-6 8.1-3.6-1.4-6-4.1-6-8.1V${y + 7.6}l6-2.4z" fill="${colors.markText}" opacity="0.18"/>
    <text x="${cx}" y="${cy + 3.5}" text-anchor="middle" fill="${colors.markText}"
      font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
      font-size="8.5" font-weight="800" letter-spacing="0">GT</text>`;
}

function renderBadgeSvg(data = {}, options = {}) {
  const publicStatus = normalizePublicStatus(data.publicStatus);
  const badgeType = data.badgeType || data.type || 'greentracer_verified';
  const colors = getBadgeColors(publicStatus, options.colors || options, badgeType);
  const display = getBadgeDisplay({
    status: publicStatus,
    type: badgeType,
    valueText: data.valueText || data.gradeText || '',
  });
  const config = getBadgeConfig();
  const brand = escapeXml(display.brand || 'GreenTracer');
  const displayLabel = display.value ? `${display.label} - ${display.value}` : display.label;
  const label = escapeXml(displayLabel || data.label || getPublicStatusLabel(publicStatus, badgeType));
  const titleDomain = data.domain ? ` for ${data.domain}` : '';
  const title = escapeXml(`${display.fullLabel || data.label || getPublicStatusLabel(publicStatus, badgeType)}${titleDomain}`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}" role="img" aria-label="${title}">
  <title>${title}</title>
  <rect x="0.5" y="0.5" width="${config.width - 1}" height="${config.height - 1}" rx="${config.radius}" fill="${colors.background}" stroke="${colors.border}"/>
  ${renderLogoMark(config, colors)}
  <text x="${config.brandX}" y="${config.brandY}" fill="${colors.mutedText}" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="${config.brandSize}" font-weight="700" letter-spacing="0">${brand}</text>
  <text x="${config.textX}" y="${config.textY}" fill="${colors.text}" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="${config.labelSize}" font-weight="700" letter-spacing="0">${label}</text>
</svg>`;
}

module.exports = {
  renderBadgeSvg,
};
