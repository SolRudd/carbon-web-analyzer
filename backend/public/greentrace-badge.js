;(function () {
  'use strict';

  var SCRIPT_ELEMENT = null;
  var STYLES_APPLIED = false;

  function getScriptElement() {
    if (SCRIPT_ELEMENT) return SCRIPT_ELEMENT;
    if (document.currentScript) {
      SCRIPT_ELEMENT = document.currentScript;
      return SCRIPT_ELEMENT;
    }

    var scripts = document.getElementsByTagName('script');
    for (var index = scripts.length - 1; index >= 0; index -= 1) {
      if (/greentrace-badge\.js/i.test(scripts[index].src || '')) {
        SCRIPT_ELEMENT = scripts[index];
        return SCRIPT_ELEMENT;
      }
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

  function ensureBadgeStyles() {
    if (STYLES_APPLIED) return;
    STYLES_APPLIED = true;

    var style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('data-greentrace-badge-style', '1');
    style.textContent = [
      '@keyframes gt-badge-float {',
      '  0%, 100% { transform: translateY(0px); }',
      '  50% { transform: translateY(1px); }',
      '}',
      '',
      '.greentrace-badge-image {',
      '  transition: transform .18s ease, filter .18s ease, box-shadow .18s ease, opacity .2s ease;',
      '  animation: gt-badge-float 8s ease-in-out infinite;',
      '}',
      '',
      '.greentrace-badge-image:hover {',
      '  transform: translateY(-1px);',
      '  box-shadow: 0 16px 42px -24px rgba(2, 6, 23, .9);',
      '  filter: saturate(1.05) brightness(1.02);',
      '}',
      '',
      '@media (max-width: 540px) {',
      '  .greentrace-badge-link-wrap {',
      '    width: min(240px, 100%);',
      '  }',
      '}',
    ].join('\n');

    var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    if (head) head.appendChild(style);
  }

  var API_BASE = cleanBaseUrl(
    (getScriptElement() && getScriptElement().getAttribute('data-api-base')) ||
      (getScriptElement() && getScriptElement().src),
    'https://api.greentracer.org'
  );
  var SITE_BASE = cleanBaseUrl(
    getScriptElement() && getScriptElement().getAttribute('data-site-base'),
    'https://www.greentracer.org'
  );
  var SIZE = { width: 240, height: 44 };
  var GREEN_TRACER_MARK_PATH = 'M 251.546875 177.761719 C 231.953125 152.234375 216.277344 142.207031 187.519531 140.015625 C 142.855469 136.558594 104.1875 173.613281 104.1875 225.308594 C 104.1875 270.257812 136.285156 305.011719 170.171875 304.550781 C 202.273438 304.089844 219.273438 287.546875 227.800781 260.40625 L 228.378906 248.707031 L 207.285156 248.707031 C 192.648438 248.707031 187.75 265.476562 177.605469 287.546875 C 164.929688 261.328125 164.582031 250.839844 141.933594 231.359375 C 131.789062 222.425781 132.078125 196.894531 148.792969 196.894531 C 160.894531 196.894531 172.652344 216.664062 176.683594 234.703125 L 176.683594 251.875 L 178.527344 251.875 C 183.773438 230.726562 184.347656 225.597656 178.816406 208.191406 C 174.550781 193.898438 172.074219 179.894531 182.792969 179.605469 C 194.894531 179.320312 203.597656 190.097656 199.621094 202.542969 C 196.222656 213.898438 187.460938 223.695312 185.328125 233.492188 L 184.347656 241.15625 L 185.90625 240.234375 C 195.472656 228.304688 196.105469 226.863281 207.632812 216.03125 C 216.910156 207.386719 218.753906 188.539062 218.753906 188.539062 C 229.992188 188.539062 218.464844 219.082031 201.464844 231.648438 C 191.898438 238.734375 188.152344 245.476562 184.117188 255.96875 L 183.484375 258.789062 L 184.753906 258.789062 C 192.648438 246.804688 200.542969 236.832031 216.277344 236.832031 L 256.273438 236.832031 L 256.273438 325.007812 L 229.359375 325.007812 L 229.359375 304.894531 C 212.933594 323.453125 194.609375 331.175781 164.292969 330.253906 C 107.875 328.40625 69.203125 280.804688 69.203125 227.84375 C 69.203125 167.679688 119.34375 120.710938 167.695312 120.996094 L 173.574219 120.996094 C 212.933594 120.710938 237.425781 135.636719 255.0625 166.46875 Z M 251.546875 177.761719';
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
    greentracer_verified: 'greentracer_verified',
  };

  function cleanToken(value) {
    var token = String(value || '').trim();
    return TOKEN_PATTERN.test(token) ? token : '';
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

  function cleanText(value, fallback) {
    return String(value || fallback || '').replace(/[<>&"]/g, '');
  }

  function appendGreenTracerMark(container) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    svg.setAttribute('viewBox', '60 112 205 226');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.style.cssText = 'display:block;width:18px;height:18px';
    path.setAttribute('d', GREEN_TRACER_MARK_PATH);
    path.setAttribute('fill', 'currentColor');
    svg.appendChild(path);
    container.appendChild(svg);
  }

  function ignoreError(error) {
    try {
      if (window.__greentraceBadgeDebug) {
        window.__greentraceBadgeLastError = error || true;
      }
    } catch {
      return false;
    }
    return false;
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
      theme.background = background;
    }
    if (accent) {
      theme.accent = accent;
    }
    return theme;
  }

  function getDetectedHost() {
    try {
      return String(window.location.hostname || '').trim().toLowerCase();
    } catch {
      return '';
    }
  }

  function sanitizeHref(value) {
    try {
      return String(value || "").trim();
    } catch {
      return "";
    }
  }

  function getCurrentPageUrl() {
    try {
      return sanitizeHref(window.location.href).slice(0, 500);
    } catch {
      return "";
    }
  }

  function getBadgeType(el) {
    var explicit = String(
      el.getAttribute('data-badge-type') ||
      el.getAttribute('data-type') ||
      ''
    ).trim().toLowerCase().replace(/-/g, '_');
    var fallback = getPublicToken(el) ? 'greentracer_verified' : 'carbon_tested';
    return BADGE_TYPE_ALIASES[explicit] || fallback;
  }

  function getPublicToken(el) {
    return cleanToken(
      el.getAttribute('data-public-token') ||
      el.getAttribute('data-badge-token') ||
      el.getAttribute('data-token')
    );
  }

  function normalizeDomainInput(value) {
    var raw = String(value || '').trim();
    if (!raw) return '';
    try {
      var parsed = new URL(raw, window.location.href);
      return (parsed.hostname || '').replace(/^www\./i, '').split(':')[0].toLowerCase();
    } catch {
      return raw
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .split('/')[0]
        .split(':')[0]
        .toLowerCase();
    }
  }

  function getDeclaredDomain(el) {
    var value = String(
      el.getAttribute('data-domain') ||
      el.getAttribute('data-site') ||
      el.getAttribute('data-url') ||
      ''
    ).trim();
    return normalizeDomainInput(value);
  }

  function getCanonicalLookupDomain(el, badgeType) {
    if (badgeType === 'greentracer_verified') {
      return getDeclaredDomain(el);
    }
    return getDeclaredDomain(el) || getDetectedHost();
  }

  function getResultSlug(el) {
    return String(
      el.getAttribute('data-result-slug') ||
      el.getAttribute('data-report-slug') ||
      el.getAttribute('data-slug') ||
      ''
    ).trim().replace(/-+$/, '').slice(0, 220);
  }

  function buildResultFallbackHref(lookupDomain, resultSlug) {
    if (resultSlug) return SITE_BASE + '/result/' + encodeURIComponent(resultSlug);
    if (lookupDomain) return SITE_BASE + '/result?domain=' + encodeURIComponent(lookupDomain);
    return SITE_BASE + '/result';
  }

  function withResultAnchor(href, badgeType) {
    if (badgeType !== 'green_hosting' || !href || href.indexOf('#') !== -1) return href;
    return href + '#result-breakdown';
  }

  function luminance(hex) {
    var normal = normalizeHex(hex);
    if (!normal) return null;

    var rgb = {
      r: parseInt(normal.slice(1, 3), 16),
      g: parseInt(normal.slice(3, 5), 16),
      b: parseInt(normal.slice(5, 7), 16)
    };
    var channels = [rgb.r, rgb.g, rgb.b].map(function (channel) {
      var value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
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

  function getDefaultColors(status, badgeType) {
    if (status === 'active' && badgeType === 'carbon_tested') {
      return { background: '#07111f', border: '#075985', accent: '#38bdf8' };
    }
    if (status === 'active' && badgeType === 'green_hosting') {
      return { background: '#07111f', border: '#047857', accent: '#34d399' };
    }
    if (status === 'active') {
      return { background: '#07111f', border: '#1f5f46', accent: '#22c55e' };
    }
    if (status === 'pending') {
      return { background: '#07111f', border: '#7c5f24', accent: '#f59e0b' };
    }
    if (status === 'domain_mismatch') {
      return { background: '#111827', border: '#7c2d12', accent: '#f97316' };
    }
    if (status === 'licence_inactive' || status === 'green_hosting_not_detected') {
      return { background: '#111827', border: '#475569', accent: '#94a3b8' };
    }
    return { background: '#111827', border: '#334155', accent: '#64748b' };
  }

  function fallbackColors(status, theme, badgeType) {
    var defaults = getDefaultColors(status, badgeType);
    var background = theme.background || defaults.background;
    var accent = theme.accent || defaults.accent;
    var text = readableText(background);

    return {
      background: background,
      border: theme.background ? (text === '#f8fafc' ? '#334155' : '#475569') : defaults.border,
      accent: accent,
      text: text,
      muted: text === '#f8fafc' ? '#a8b3c7' : '#475569',
      markText: readableText(accent)
    };
  }

  function buildFallbackLabel(status, badgeType) {
    if (badgeType === 'green_hosting' && (
      status === 'green_hosting_not_detected' ||
      status === 'unknown_domain' ||
      status === 'unavailable' ||
      status === 'not_active'
    )) {
      return status === 'green_hosting_not_detected' ? 'Green Hosting Checked' : 'Hosting Not Confirmed';
    }
    if (status === 'licence_inactive' || status === 'not_active') {
      if (badgeType === 'greentracer_verified') return 'Verified Not Active';
      return badgeType === 'carbon_tested' ? 'Carbon Result Unavailable' : 'Hosting Not Confirmed';
    }
    if (badgeType === 'carbon_tested' && (
      status === 'badge_missing' ||
      status === 'unknown_domain' ||
      status === 'unavailable'
    )) {
      return 'Carbon Result Unavailable';
    }
    return {
      pending: 'Verification Pending',
      green_hosting_not_detected: 'Green Hosting Checked',
      domain_mismatch: 'Domain Mismatch',
      badge_missing: 'Not Seen Yet',
      unknown_domain: 'Unknown Domain',
      unavailable: badgeType === 'carbon_tested' ? 'Carbon Result Unavailable' : 'Verification Unavailable',
    }[status || 'unavailable'] || 'Verification Unavailable';
  }

  function resolveInlineLabel(status, badgeType) {
    var fallback = buildFallbackLabel(status, badgeType);
    if (status === 'active') {
      if (badgeType === 'carbon_tested') return 'Carbon Result';
      if (badgeType === 'green_hosting') return 'Green Hosting Detected';
      return 'GreenTracer Verified';
    }
    if (badgeType === 'green_hosting' && (
      status === 'green_hosting_not_detected' ||
      status === 'not_active' ||
      status === 'unknown_domain' ||
      status === 'unavailable'
    )) {
      return status === 'green_hosting_not_detected' ? 'Green Hosting Checked' : 'Hosting Not Confirmed';
    }
    return fallback;
  }

  function renderInlineBadge(el, status, badgeType, href) {
    var theme = getTheme(el);
    var colors = fallbackColors(status || 'not_active', theme, badgeType);
    var label = resolveInlineLabel(status, badgeType);
    var target = href || '#';

    el.innerHTML = '';
    el.style.display = 'inline-block';
    el.style.maxWidth = '100%';

    var anchor = document.createElement('a');
    anchor.className = 'greentrace-badge-link-wrap';
    anchor.href = target;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.cssText = 'display:inline-block;max-width:100%;text-decoration:none;line-height:0';

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
      'overflow:hidden',
      'animation:gt-badge-float 9s ease-in-out infinite'
    ].join(';');

    var mark = document.createElement('span');
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
      'line-height:1',
      'box-shadow:inset 0 0 0 1px ' + (colors.markText === '#f8fafc' ? 'rgba(248,250,252,.22)' : 'rgba(7,17,31,.18)')
    ].join(';');
    appendGreenTracerMark(mark);

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
    anchor.appendChild(badge);
    el.appendChild(anchor);
  }

  function appendBadgeParams(url, theme, el) {
    var params = [];
    var statusAware = getTheme(el);
    if (theme.background) params.push('bg=' + encodeURIComponent(theme.background));
    if (theme.accent) params.push('accent=' + encodeURIComponent(theme.accent));
    var host = getDetectedHost();
    var declared = getDeclaredDomain(el);
    if (host) params.push('detected_host=' + encodeURIComponent(host));
    if (declared) params.push('declared_domain=' + encodeURIComponent(declared));

    if (statusAware) {
      if (statusAware.background) {
        params.push('background=' + encodeURIComponent(statusAware.background));
      }
      if (statusAware.accent) {
        params.push('accent=' + encodeURIComponent(statusAware.accent));
      }
    }

    return params.length ? url + (url.indexOf('?') === -1 ? '?' : '&') + params.join('&') : url;
  }

  function pingInstall(payload, el) {
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

    // keep reference to avoid duplicate work until next page load
    if (el) el.dataset.gtBadgeTracked = '1';
  }

  function buildVerifiedPayload(token, declaredDomain) {
    return {
      public_token: token || '',
      declared_domain: normalizeDomainInput(declaredDomain || document.referrer || ''),
      detected_host: getDetectedHost(),
      badge_type: 'greentracer_verified',
      source_url: getCurrentPageUrl(),
    };
  }

  function buildPublicPayload(el, badgeType, resultSlug, domain) {
    return {
      public_token: getPublicToken(el) || '',
      declared_domain: domain || '',
      detected_host: getDetectedHost(),
      badge_type: badgeType,
      result_slug: resultSlug || '',
      source_url: getCurrentPageUrl(),
    };
  }

  function renderBadge(el) {
    ensureBadgeStyles();

    var badgeType = getBadgeType(el);
    var publicToken = getPublicToken(el);
    var resultSlug = getResultSlug(el);
    var lookupDomain = getCanonicalLookupDomain(el, badgeType);
    var theme = getTheme(el);

    if (badgeType === 'greentracer_verified' && !publicToken) {
      renderInlineBadge(
        el,
        'not_active',
        badgeType,
        SITE_BASE + '/pricing'
      );
      return;
    }

    var fallbackHref = withResultAnchor(buildResultFallbackHref(lookupDomain, resultSlug), badgeType);
    var href;
    var defaultStatus = badgeType === 'green_hosting' ? 'green_hosting_not_detected' : 'active';
    var src;
    var latestDataUrl = '';

    if (badgeType === 'greentracer_verified') {
      href = publicToken
        ? (lookupDomain ? SITE_BASE + '/verified/' + encodeURIComponent(lookupDomain) : SITE_BASE + '/verify/' + encodeURIComponent(publicToken))
        : SITE_BASE + '/pricing';
      src = appendBadgeParams(API_BASE + '/api/badge/' + encodeURIComponent(publicToken), theme, el);
      if (!el.dataset.gtBadgeTracked) {
        pingInstall(buildVerifiedPayload(publicToken, lookupDomain || document.referrer), el);
      }
    } else {
      var hasDomainForRender = Boolean(lookupDomain);
      if (resultSlug) {
        href = withResultAnchor(SITE_BASE + '/result/' + encodeURIComponent(resultSlug), badgeType);
        src = appendBadgeParams(API_BASE + '/api/badge/result/' + encodeURIComponent(resultSlug) + '?type=' + encodeURIComponent(badgeType), theme, el);
        latestDataUrl = appendBadgeParams(API_BASE + '/api/badge/result/' + encodeURIComponent(resultSlug) + '/data?type=' + encodeURIComponent(badgeType), theme, el);
      } else if (hasDomainForRender) {
        href = withResultAnchor(SITE_BASE + '/result?domain=' + encodeURIComponent(lookupDomain), badgeType);
        src = appendBadgeParams(API_BASE + '/api/badge/result/latest?type=' + encodeURIComponent(badgeType) + '&domain=' + encodeURIComponent(lookupDomain), theme, el);
        latestDataUrl = appendBadgeParams(API_BASE + '/api/badge/result/latest/data?type=' + encodeURIComponent(badgeType) + '&domain=' + encodeURIComponent(lookupDomain), theme, el);
      } else {
        href = fallbackHref;
        src = appendBadgeParams(API_BASE + '/api/badge.svg?type=' + encodeURIComponent(badgeType), theme, el);
      }

      if (!el.dataset.gtBadgeTracked) {
        pingInstall(buildPublicPayload(el, badgeType, resultSlug, lookupDomain), el);
      }
    }

    el.innerHTML = '';
    el.style.display = 'inline-block';
    el.style.maxWidth = '100%';

    var anchor = document.createElement('a');
    anchor.className = 'greentrace-badge-link-wrap';
    anchor.href = href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.cssText = 'display:inline-block;max-width:100%;text-decoration:none;line-height:0';

    var image = document.createElement('img');
    image.className = 'greentrace-badge-image';
    image.src = src;
    image.alt = cleanText(el.getAttribute('data-alt'), badgeType === 'carbon_tested'
      ? 'GreenTracer Carbon Result badge'
      : badgeType === 'green_hosting'
        ? 'GreenTracer Green Hosting badge'
        : 'GreenTracer Verified badge');
    image.width = SIZE.width;
    image.height = SIZE.height;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.style.cssText = 'display:block;width:' + SIZE.width + 'px;max-width:100%;height:auto;border:0;object-fit:contain';

    image.onerror = function () {
      var fallbackLink = fallbackHref;
      if (badgeType === 'green_hosting') {
        renderInlineBadge(el, 'green_hosting_not_detected', badgeType, fallbackLink);
      } else if (badgeType === 'carbon_tested') {
        renderInlineBadge(el, defaultStatus, badgeType, fallbackLink);
      } else {
        renderInlineBadge(el, 'not_active', badgeType, href || fallbackLink);
      }
    };

    anchor.appendChild(image);
    el.appendChild(anchor);

    if (badgeType !== 'greentracer_verified' && latestDataUrl && window.fetch) {
      try {
        window.fetch(latestDataUrl, {
          method: 'GET',
          mode: 'cors'
        })
          .then(function (res) {
            if (!res.ok) return null;
            return res.json();
          })
          .then(function (data) {
            if (!data) {
              anchor.href = fallbackHref;
              return;
            }
            if (data.reportUrl) {
              anchor.href = withResultAnchor(data.reportUrl, badgeType);
              return;
            }
            if (data.resultSlug) {
              anchor.href = withResultAnchor(SITE_BASE + '/result/' + encodeURIComponent(data.resultSlug), badgeType);
              return;
            }
            if (data.domain) {
              anchor.href = withResultAnchor(SITE_BASE + '/result?domain=' + encodeURIComponent(data.domain), badgeType);
              return;
            }
            anchor.href = fallbackHref;
          })
          .catch(function () {
            anchor.href = fallbackHref;
            ignoreError();
          });
      } catch {
        ignoreError();
      }
    }

    // Keep the badge link always a result when known; if it's not known yet but a domain exists,
    // try to update once the SVG payload is fetched above.
  }

  function initBadges() {
    var badges = document.querySelectorAll('.greentrace-badge');
    var index;

    for (index = 0; index < badges.length; index += 1) {
      if (badges[index].dataset.gtBadgeRendered === '1') continue;
      badges[index].dataset.gtBadgeRendered = '1';
      renderBadge(badges[index]);
    }

    var root = document.body || document.documentElement;
    if (!root || root.dataset.greentraceObserverInstalled) return;
    root.dataset.greentraceObserverInstalled = '1';

    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i += 1) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j += 1) {
          var node = added[j];
          if (!node || !node.querySelectorAll) continue;

          if (node.classList && node.classList.contains('greentrace-badge')) {
            if (node.dataset.gtBadgeRendered !== '1') {
              node.dataset.gtBadgeRendered = '1';
              renderBadge(node);
            }
          }

          var children = node.querySelectorAll('.greentrace-badge');
          for (var k = 0; k < children.length; k += 1) {
            if (children[k].dataset.gtBadgeRendered === '1') continue;
            children[k].dataset.gtBadgeRendered = '1';
            renderBadge(children[k]);
          }
        }
      }
    });

    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBadges);
  } else {
    initBadges();
  }
})();
