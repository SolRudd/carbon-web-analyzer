'use strict';

const {
  escapeXml,
  getBadgeColors,
  getBadgeConfig,
  getBadgeDisplay,
  getPublicStatusLabel,
  normalizePublicStatus,
} = require('./formatters');

const GREEN_TRACER_MARK_PATH = 'M 251.546875 177.761719 C 231.953125 152.234375 216.277344 142.207031 187.519531 140.015625 C 142.855469 136.558594 104.1875 173.613281 104.1875 225.308594 C 104.1875 270.257812 136.285156 305.011719 170.171875 304.550781 C 202.273438 304.089844 219.273438 287.546875 227.800781 260.40625 L 228.378906 248.707031 L 207.285156 248.707031 C 192.648438 248.707031 187.75 265.476562 177.605469 287.546875 C 164.929688 261.328125 164.582031 250.839844 141.933594 231.359375 C 131.789062 222.425781 132.078125 196.894531 148.792969 196.894531 C 160.894531 196.894531 172.652344 216.664062 176.683594 234.703125 L 176.683594 251.875 L 178.527344 251.875 C 183.773438 230.726562 184.347656 225.597656 178.816406 208.191406 C 174.550781 193.898438 172.074219 179.894531 182.792969 179.605469 C 194.894531 179.320312 203.597656 190.097656 199.621094 202.542969 C 196.222656 213.898438 187.460938 223.695312 185.328125 233.492188 L 184.347656 241.15625 L 185.90625 240.234375 C 195.472656 228.304688 196.105469 226.863281 207.632812 216.03125 C 216.910156 207.386719 218.753906 188.539062 218.753906 188.539062 C 229.992188 188.539062 218.464844 219.082031 201.464844 231.648438 C 191.898438 238.734375 188.152344 245.476562 184.117188 255.96875 L 183.484375 258.789062 L 184.753906 258.789062 C 192.648438 246.804688 200.542969 236.832031 216.277344 236.832031 L 256.273438 236.832031 L 256.273438 325.007812 L 229.359375 325.007812 L 229.359375 304.894531 C 212.933594 323.453125 194.609375 331.175781 164.292969 330.253906 C 107.875 328.40625 69.203125 280.804688 69.203125 227.84375 C 69.203125 167.679688 119.34375 120.710938 167.695312 120.996094 L 173.574219 120.996094 C 212.933594 120.710938 237.425781 135.636719 255.0625 166.46875 Z M 251.546875 177.761719';

function renderLogoMark(config, colors) {
  const x = config.logoX;
  const y = config.logoY;
  const size = config.logoSize;

  return `
    <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="7" fill="${colors.accent}"/>
    <rect x="${x + 0.5}" y="${y + 0.5}" width="${size - 1}" height="${size - 1}" rx="6.5" fill="none" stroke="${colors.markText}" opacity="0.2"/>
    <svg x="${x + 3}" y="${y + 3}" width="${size - 6}" height="${size - 6}" viewBox="60 112 205 226" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <path d="${GREEN_TRACER_MARK_PATH}" fill="${colors.markText}"/>
    </svg>`;
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
