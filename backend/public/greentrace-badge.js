;(function () {
  'use strict';

  function getScriptElement() {
    if (document.currentScript) return document.currentScript;
    var scripts = document.getElementsByTagName('script');
    for (var index = scripts.length - 1; index >= 0; index -= 1) {
      if (/greentrace-badge\.js/i.test(scripts[index].src || '')) return scripts[index];
    }
    return null;
  }

  function cleanBaseUrl(value, fallback) {
    var raw = String(value || '').trim();
    if (!raw) return fallback;
    try {
      var parsed = new URL(raw, window.location.href);
      return parsed.origin.replace(/\/+$/, '');
    } catch {
      return fallback;
    }
  }

  var SCRIPT_ELEMENT = getScriptElement();
  var API_BASE = cleanBaseUrl(
    (SCRIPT_ELEMENT && SCRIPT_ELEMENT.getAttribute('data-api-base')) ||
    (SCRIPT_ELEMENT && SCRIPT_ELEMENT.src),
    'https://api.greentracer.org'
  );
  var SITE_BASE = cleanBaseUrl(
    SCRIPT_ELEMENT && SCRIPT_ELEMENT.getAttribute('data-site-base'),
    'https://www.greentracer.org'
  );
  var SIZE = { width: 240, height: 44 };
  var TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{5,159}$/;
  var BADGE_TYPE_ALIASES = {
    carbon: 'carbon_tested',
    carbon_tested: 'carbon_tested',
    tested: 'carbon_tested',
    hosting: 'green_hosting',
    'green-hosting': 'green_hosting',
    green_hosting: 'green_hosting',
    green_hosting_checked: 'green_hosting',
    member: 'greentracer_verified',
    verified: 'greentracer_verified',
    greentracer_verified: 'greentracer_verified'
  };

  function cleanToken(value) {
    var token = String(value || '').trim();
    return TOKEN_PATTERN.test(token) ? token : '';
  }

  function cleanText(value, fallback) {
    return String(value || fallback || '').replace(/[<>&"]/g, '');
  }

  function ignoreError() {
    return false;
  }

  function normalizeHex(value) {
    var raw = String(value || '').trim();
    var short = raw.match(/^#?([0-9a-f]{3})$/i);
    if (short) {
      return '#' + short[1].split('').map(function (char) { return char + char; }).join('').toLowerCase();
    }
    var long = raw.match(/^#?([0-9a-f]{6})$/i);
    return long ? '#' + long[1].toLowerCase() : '';
  }

  function hexToRgb(hex) {
    var value = normalizeHex(hex);
    if (!value) return null;
    return {
      r: parseInt(value.slice(1, 3), 16),
      g: parseInt(value.slice(3, 5), 16),
      b: parseInt(value.slice(5, 7), 16)
    };
  }

  function luminance(hex) {
    var rgb = hexToRgb(hex);
    if (!rgb) return null;
    var channels = [rgb.r, rgb.g, rgb.b].map(function (channel) {
      var value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
  }

  function contrast(a, b) {
    var first = luminance(a);
    var second = luminance(b);
    if (first === null || second === null) return 0;
    var lighter = Math.max(first, second);
    var darker = Math.min(first, second);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function readableText(background) {
    return contrast(background, '#f8fafc') >= contrast(background, '#07111f') ? '#f8fafc' : '#07111f';
  }

  function getTheme(el) {
    var background = normalizeHex(
      el.getAttribute('data-bg-color') ||
      el.getAttribute('data-background-color') ||
      el.getAttribute('data-bg')
    );
    var accent = normalizeHex(
      el.getAttribute('data-accent-color') ||
      el.getAttribute('data-accent')
    );
    var theme = {};

    if (background) {
      var text = readableText(background);
      if (contrast(background, text) >= 4.5) theme.background = background;
    }
    if (accent) theme.accent = accent;
    return theme;
  }

  function appendBadgeParams(url, theme, el) {
    var params = [];
    if (theme.background) params.push('bg=' + encodeURIComponent(theme.background));
    if (theme.accent) params.push('accent=' + encodeURIComponent(theme.accent));
    if (getDetectedHost()) params.push('host=' + encodeURIComponent(getDetectedHost()));
    if (getDeclaredDomain(el)) params.push('declared_domain=' + encodeURIComponent(getDeclaredDomain(el)));
    return params.length ? url + (url.indexOf('?') === -1 ? '?' : '&') + params.join('&') : url;
  }

  function getPublicToken(el) {
    return cleanToken(
      el.getAttribute('data-public-token') ||
      el.getAttribute('data-badge-token') ||
      el.getAttribute('data-token')
    );
  }

  function getBadgeType(el) {
    var fallbackType = getPublicToken(el) ? 'greentracer_verified' : 'carbon_tested';
    var value = String(
      el.getAttribute('data-badge-type') ||
      el.getAttribute('data-type') ||
      fallbackType
    ).trim().toLowerCase().replace(/-/g, '_');
    return BADGE_TYPE_ALIASES[value] || fallbackType;
  }

  function getDeclaredDomain(el) {
    return String(
      el.getAttribute('data-domain') ||
      el.getAttribute('data-url') ||
      el.getAttribute('data-site') ||
      ''
    ).trim().slice(0, 255);
  }

  function getDetectedHost() {
    try {
      return String(window.location.hostname || '').trim().slice(0, 255);
    } catch {
      return '';
    }
  }

  function getResultSlug(el) {
    return String(
      el.getAttribute('data-result-slug') ||
      el.getAttribute('data-report-slug') ||
      el.getAttribute('data-slug') ||
      ''
    ).trim().replace(/-+$/, '').slice(0, 220);
  }

  function getGradeText(el) {
    var grade = String(el.getAttribute('data-grade') || '').trim().slice(0, 8);
    return grade ? 'Grade ' + grade : '';
  }

  function fallbackColors(status, theme) {
    var background = theme.background || '#111827';
    var accent = theme.accent || (status === 'pending' ? '#f59e0b' : status === 'green_hosting_not_detected' ? '#94a3b8' : '#64748b');
    var text = readableText(background);
    return {
      background: background,
      border: text === '#f8fafc' ? '#334155' : '#cbd5e1',
      accent: contrast(accent, background) >= 1.8 ? accent : '#64748b',
      text: text,
      muted: text === '#f8fafc' ? '#a8b3c7' : '#475569',
      markText: readableText(accent)
    };
  }

  function renderInlineBadge(el, status) {
    var theme = getTheme(el);
    var colors = fallbackColors(status || 'not_active', theme);
    var type = getBadgeType(el);
    var label = status === 'pending'
      ? 'Verification pending'
      : status === 'green_hosting_not_detected'
        ? 'Green hosting not detected'
        : status === 'licence_inactive'
          ? 'Licence inactive'
          : 'Badge not active';

    if (status === 'active' || (type === 'carbon_tested' && status === 'not_active')) {
      label = type === 'carbon_tested'
        ? 'Carbon Tested'
        : type === 'green_hosting'
          ? 'Green Hosting Detected'
          : 'Verified Supporter';
      if (type === 'carbon_tested' && getGradeText(el)) label += ' - ' + getGradeText(el);
    }

    el.innerHTML = '';
    el.style.display = 'inline-block';
    el.style.maxWidth = '100%';

    var badge = document.createElement('span');
    badge.setAttribute('role', 'img');
    badge.setAttribute('aria-label', 'GreenTracer ' + label);
    badge.style.cssText = [
      'box-sizing:border-box',
      'display:inline-flex',
      'align-items:center',
      'gap:12px',
      'width:min(' + SIZE.width + 'px,100%)',
      'height:' + SIZE.height + 'px',
      'max-width:100%',
      'padding:0 12px 0 10px',
      'border:1px solid ' + colors.border,
      'border-radius:10px',
      'background:' + colors.background,
      'color:' + colors.text,
      'font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',
      'letter-spacing:0',
      'box-shadow:0 12px 28px -24px rgba(2,6,23,.95)',
      'overflow:hidden'
    ].join(';');

    var mark = document.createElement('span');
    mark.textContent = 'GT';
    mark.style.cssText = [
      'display:inline-flex',
      'align-items:center',
      'justify-content:center',
      'flex:0 0 24px',
      'width:24px',
      'height:24px',
      'border-radius:7px',
      'background:' + colors.accent,
      'color:' + colors.markText,
      'font-size:8.5px',
      'font-weight:800',
      'line-height:1'
    ].join(';');

    var copy = document.createElement('span');
    copy.style.cssText = 'display:flex;min-width:0;flex-direction:column;justify-content:center;line-height:1';

    var brand = document.createElement('span');
    brand.textContent = 'GreenTracer';
    brand.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:' + colors.muted + ';font-size:9px;font-weight:700;letter-spacing:0';

    var state = document.createElement('span');
    state.textContent = label;
    state.style.cssText = 'margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:' + colors.text + ';font-size:12.5px;font-weight:700;letter-spacing:0';

    copy.appendChild(brand);
    copy.appendChild(state);
    badge.appendChild(mark);
    badge.appendChild(copy);
    el.appendChild(badge);
  }

  function pingInstall(token, el) {
    var payload = {
      public_token: token || '',
      declared_domain: getDeclaredDomain(el),
      detected_host: getDetectedHost(),
      badge_type: getBadgeType(el),
      result_slug: getResultSlug(el),
      source_url: (function () {
        try {
          var url = new URL(window.location.href);
          url.search = '';
          url.hash = '';
          return url.toString().slice(0, 500);
        } catch {
          return '';
        }
      })()
    };
    var body = JSON.stringify(payload);
    var url = API_BASE + '/api/badge/ping';

    try {
      window.fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: body
      }).catch(ignoreError);
    } catch {
      ignoreError();
    }
  }

  function renderBadge(el) {
    var badgeType = getBadgeType(el);
    var publicToken = getPublicToken(el);
    var resultSlug = getResultSlug(el);
    var declaredDomain = getDeclaredDomain(el);
    var theme = getTheme(el);

    pingInstall(publicToken, el);

    if (badgeType === 'greentracer_verified' && !publicToken) {
      renderInlineBadge(el, 'not_active');
      return;
    }

    if (badgeType !== 'greentracer_verified' && !resultSlug && !declaredDomain) {
      renderInlineBadge(el, badgeType === 'green_hosting' ? 'green_hosting_not_detected' : 'active');
      return;
    }

    var href;
    var src;
    var latestDataUrl = '';
    if (badgeType === 'greentracer_verified') {
      var domain = declaredDomain;
      href = domain ? SITE_BASE + '/verified/' + encodeURIComponent(domain.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0]) : SITE_BASE + '/verify/' + encodeURIComponent(publicToken);
      src = appendBadgeParams(API_BASE + '/api/badge/' + encodeURIComponent(publicToken), theme, el);
    } else if (!resultSlug && declaredDomain) {
      href = SITE_BASE + '/badge?type=' + encodeURIComponent(badgeType) + '&domain=' + encodeURIComponent(declaredDomain);
      src = appendBadgeParams(API_BASE + '/api/badge/result/latest?type=' + encodeURIComponent(badgeType) + '&domain=' + encodeURIComponent(declaredDomain), theme, el);
      latestDataUrl = appendBadgeParams(API_BASE + '/api/badge/result/latest/data?type=' + encodeURIComponent(badgeType) + '&domain=' + encodeURIComponent(declaredDomain), theme, el);
    } else {
      href = SITE_BASE + '/result/' + encodeURIComponent(resultSlug);
      src = appendBadgeParams(API_BASE + '/api/badge/result/' + encodeURIComponent(resultSlug) + '?type=' + encodeURIComponent(badgeType), theme, el);
    }

    el.innerHTML = '';
    el.style.display = 'inline-block';
    el.style.maxWidth = '100%';

    var anchor = document.createElement('a');
    anchor.href = href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.cssText = 'display:inline-block;max-width:100%;text-decoration:none;line-height:0';

    var image = document.createElement('img');
    image.src = src;
    image.alt = cleanText(el.getAttribute('data-alt'), badgeType === 'carbon_tested'
      ? 'GreenTracer Carbon Tested badge'
      : badgeType === 'green_hosting'
        ? 'GreenTracer Green Hosting badge'
        : 'GreenTracer Verified badge');
    image.width = SIZE.width;
    image.height = SIZE.height;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.style.cssText = 'display:block;width:' + SIZE.width + 'px;max-width:100%;height:auto;border:0;object-fit:contain';
    image.onerror = function () {
      renderInlineBadge(el, badgeType === 'green_hosting'
        ? 'green_hosting_not_detected'
        : badgeType === 'carbon_tested'
          ? 'active'
          : 'not_active');
    };

    anchor.appendChild(image);
    el.appendChild(anchor);

    if (latestDataUrl && window.fetch) {
      try {
        window.fetch(latestDataUrl, { mode: 'cors' })
          .then(function (res) { return res.ok ? res.json() : null; })
          .then(function (data) {
            if (!data) return;
            if (data.reportUrl) {
              anchor.href = data.reportUrl;
            } else if (data.resultSlug) {
              anchor.href = SITE_BASE + '/result/' + encodeURIComponent(data.resultSlug);
            }
          })
          .catch(ignoreError);
      } catch {
        ignoreError();
      }
    }
  }

  function initBadges() {
    var badges = document.querySelectorAll('.greentrace-badge');
    Array.prototype.forEach.call(badges, renderBadge);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBadges);
  } else {
    initBadges();
  }
})();
