'use strict';

function parseAttributes(tag) {
  const attributes = {};
  const attributeRegex = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;

  while ((match = attributeRegex.exec(tag)) !== null) {
    const key = String(match[1] || '').toLowerCase();
    if (!key || key === '<script' || key === '<div') continue;
    attributes[key] = match[2] ?? match[3] ?? match[4] ?? '';
  }

  return attributes;
}

function hasClassName(classValue, targetClassName) {
  return String(classValue || '')
    .split(/\s+/)
    .filter(Boolean)
    .some((entry) => entry.toLowerCase() === targetClassName.toLowerCase());
}

function inspectBadgeHtml(html, expectedBadgeType = null) {
  const markup = typeof html === 'string' ? html : '';
  const scriptDetected = /<script\b[^>]*\bsrc\s*=\s*["'][^"']*greentrace-badge\.js(?:\?[^"']*)?["'][^>]*>/i.test(markup);
  const svgBadgeImageDetected = /<img\b[^>]*\bsrc\s*=\s*["'][^"']*\/api\/badge\/[A-Za-z0-9_-]+(?:\?[^"']*)?["'][^>]*>/i.test(markup)
    || /<img\b[^>]*\bsrc\s*=\s*["'][^"']*\/api\/badge\.svg\?[^"']*\btoken=/i.test(markup);
  const verificationLinkDetected =
    /<a\b[^>]*\bhref\s*=\s*["'][^"']*\/verify\/[A-Za-z0-9_-]+(?:\?[^"']*)?["'][^>]*>/i.test(markup) ||
    /<a\b[^>]*\bhref\s*=\s*["'][^"']*\/verified\/[^"']+(?:\?[^"']*)?["'][^>]*>/i.test(markup);
  const allTags = markup.match(/<[^>]+>/g) || [];
  const badgeTags = allTags.filter((tag) => {
    const attrs = parseAttributes(tag);
    return hasClassName(attrs.class, 'greentrace-badge');
  });

  const containerDetected = badgeTags.length > 0;
  const dataUrlDetected = badgeTags.some((tag) => {
    const attrs = parseAttributes(tag);
    return Boolean(String(
      attrs['data-url'] ||
      attrs['data-domain'] ||
      attrs['data-site'] ||
      attrs['data-result-slug'] ||
      attrs['data-public-token'] ||
      attrs['data-badge-token'] ||
      attrs['data-token'] ||
      ''
    ).trim());
  });

  const aliases = {
    carbon: 'carbon_tested',
    carbon_tested: 'carbon_tested',
    tested: 'carbon_tested',
    hosting: 'green_hosting',
    green_hosting: 'green_hosting',
    green_hosting_checked: 'green_hosting',
    verified: 'greentracer_verified',
    member: 'greentracer_verified',
    greentracer_verified: 'greentracer_verified',
  };
  const normalizeBadgeType = (value) => {
    const raw = String(value || '').toLowerCase().replace(/-/g, '_');
    return aliases[raw] || null;
  };

  const detectedTypes = new Set();
  badgeTags.forEach((tag) => {
    const attrs = parseAttributes(tag);
    const badgeType = normalizeBadgeType(attrs['data-badge-type'] || attrs['data-type'] || 'carbon_tested');
    if (badgeType) {
      detectedTypes.add(badgeType);
    }
  });

  const detectedBadgeTypes = Array.from(detectedTypes);
  const normalizedExpectedType = normalizeBadgeType(expectedBadgeType);
  const hasExpectedType = normalizedExpectedType ? detectedBadgeTypes.includes(normalizedExpectedType) : true;

  const issues = [];
  if (containerDetected && !scriptDetected) issues.push('missing_script');
  if (scriptDetected && !containerDetected) issues.push('missing_badge_container');
  if (containerDetected && !dataUrlDetected) issues.push('missing_badge_identity');
  if (expectedBadgeType && containerDetected && !hasExpectedType) issues.push('expected_badge_type_mismatch');
  if (svgBadgeImageDetected && !verificationLinkDetected) issues.push('missing_verification_link');

  let state = 'connected';
  if (!scriptDetected && !containerDetected && !svgBadgeImageDetected) {
    state = 'not_detected';
  } else if (issues.length > 0) {
    state = 'needs_review';
  }

  return {
    state,
    checks: {
      scriptDetected,
      containerDetected,
      dataUrlDetected,
      badgeIdentityDetected: dataUrlDetected,
      svgBadgeImageDetected,
      verificationLinkDetected,
    },
    detectedBadgeTypes: svgBadgeImageDetected && detectedBadgeTypes.length === 0
      ? ['verification']
      : detectedBadgeTypes,
    issues,
  };
}

module.exports = {
  inspectBadgeHtml,
};
