;(function () {
  'use strict';

  var API_BASE = 'https://api.greentracer.org';
  var SITE_BASE = 'https://www.greentracer.org';

  function cleanToken(value) {
    var token = String(value || '').trim();
    return /^[A-Za-z0-9][A-Za-z0-9_-]{5,159}$/.test(token) ? token : '';
  }

  function normalizeDomain(value) {
    try {
      var raw = String(value || '').trim();
      if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
      var parsed = new URL(raw);
      return parsed.hostname.replace(/^www\./i, '').toLowerCase();
    } catch (e) {
      return String(value || '')
        .trim()
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .split('/')[0]
        .toLowerCase();
    }
  }

  function getVariant(el) {
    var variant = String(el.getAttribute('data-variant') || 'compact').toLowerCase();
    return variant === 'standard' ? 'standard' : 'compact';
  }

  function metricParam(el) {
    var value = String(el.getAttribute('data-metric') || 'true').toLowerCase();
    return value === 'false' || value === '0' || value === 'no' ? 'false' : 'true';
  }

  function imageSize(variant) {
    return variant === 'standard'
      ? { width: 300, height: 50 }
      : { width: 240, height: 40 };
  }

  function renderUnavailable(el) {
    var variant = getVariant(el);
    var size = imageSize(variant);
    var src = API_BASE + '/api/badge.svg?variant=' + encodeURIComponent(variant);
    el.innerHTML =
      '<img src="' + src + '" alt="GreenTracer Unavailable" width="' + size.width + '" height="' + size.height + '" style="display:block;max-width:100%;height:auto;" />';
  }

  function renderBadge(el, token) {
    var publicToken = cleanToken(token);
    if (!publicToken) {
      renderUnavailable(el);
      return;
    }

    var variant = getVariant(el);
    var metric = metricParam(el);
    var size = imageSize(variant);
    var params = [];
    if (variant !== 'compact') params.push('variant=' + encodeURIComponent(variant));
    if (metric === 'false') params.push('metric=false');
    var query = params.length ? '?' + params.join('&') : '';
    var href = SITE_BASE + '/verify/' + encodeURIComponent(publicToken);
    var src = API_BASE + '/api/badge/' + encodeURIComponent(publicToken) + query;

    el.innerHTML =
      '<a href="' + href + '" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;line-height:0;">' +
        '<img src="' + src + '" alt="GreenTracer Verified" width="' + size.width + '" height="' + size.height + '" style="display:block;max-width:100%;height:auto;border:0;" />' +
      '</a>';
  }

  function lookupTokenByDomain(el, domain) {
    if (!domain) {
      renderUnavailable(el);
      return;
    }

    fetch(API_BASE + '/api/license/check?domain=' + encodeURIComponent(domain), { mode: 'cors' })
      .then(function (res) {
        if (!res.ok) throw new Error('lookup failed');
        return res.json();
      })
      .then(function (data) {
        renderBadge(el, data && data.badgePublicToken);
      })
      .catch(function () {
        renderUnavailable(el);
      });
  }

  function initBadges() {
    document.querySelectorAll('.greentrace-badge').forEach(function (el) {
      var token = cleanToken(
        el.getAttribute('data-public-token') ||
        el.getAttribute('data-badge-token') ||
        el.getAttribute('data-token')
      );
      if (token) {
        renderBadge(el, token);
        return;
      }
      lookupTokenByDomain(el, normalizeDomain(el.getAttribute('data-url') || window.location.href));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBadges);
  } else {
    initBadges();
  }
})();
