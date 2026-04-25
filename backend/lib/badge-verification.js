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
  const allTags = markup.match(/<[^>]+>/g) || [];
  const badgeTags = allTags.filter((tag) => {
    const attrs = parseAttributes(tag);
    return hasClassName(attrs.class, 'greentrace-badge');
  });

  const containerDetected = badgeTags.length > 0;
  const dataUrlDetected = badgeTags.some((tag) => {
    const attrs = parseAttributes(tag);
    return Boolean(String(attrs['data-url'] || '').trim());
  });

  const detectedTypes = new Set();
  badgeTags.forEach((tag) => {
    const attrs = parseAttributes(tag);
    const badgeType = String(attrs['data-badge-type'] || 'carbon').toLowerCase();
    if (['carbon', 'hosting', 'member'].includes(badgeType)) {
      detectedTypes.add(badgeType);
    }
  });

  const detectedBadgeTypes = Array.from(detectedTypes);
  const hasExpectedType = expectedBadgeType ? detectedBadgeTypes.includes(expectedBadgeType) : true;

  const issues = [];
  if (containerDetected && !scriptDetected) issues.push('missing_script');
  if (scriptDetected && !containerDetected) issues.push('missing_badge_container');
  if (containerDetected && !dataUrlDetected) issues.push('missing_data_url');
  if (expectedBadgeType && containerDetected && !hasExpectedType) issues.push('expected_badge_type_mismatch');

  let state = 'connected';
  if (!scriptDetected && !containerDetected) {
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
    },
    detectedBadgeTypes,
    issues,
  };
}

module.exports = {
  inspectBadgeHtml,
};
