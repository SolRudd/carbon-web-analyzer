;(function () {
  'use strict';

  var API_BASE     = 'https://api.greentracer.org';
  var RESULTS_BASE = 'https://www.greentracer.org/result';

  var LOGO_AVIF = 'https://www.greentracer.org/GreenTraceLogo.avif';
  var LOGO_WEBP = 'https://www.greentracer.org/GreenTraceLogo.webp';
  var LOGO_PNG  = 'https://www.greentracer.org/GreenTraceLogo.png';

  function cleanUrl(url) {
    try {
      var u = (url || '').trim();
      if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
      var p = new URL(u);
      return p.protocol + '//' +
             p.hostname.toLowerCase() +
             p.pathname.replace(/\/+$/, '');
    } catch {
      return url;
    }
  }

  function slugifyFromUrl(url) {
    try {
      var u = new URL(url);
      var base = (u.hostname + u.pathname).replace(/\/$/, '');
      return base.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    } catch {
      return '';
    }
  }

  function hexToRgba(hex, alpha) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex || '')) return null;
    var clean = hex.slice(1);
    var r = parseInt(clean.slice(0, 2), 16);
    var g = parseInt(clean.slice(2, 4), 16);
    var b = parseInt(clean.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  function isValidHex(h) {
    return /^#[0-9A-Fa-f]{6}$/.test(h || '');
  }

  // Convert hex accent to a very subtle background tint
  function accentToTintBg(hex, isDark) {
    var alpha = isDark ? 0.14 : 0.08;
    return hexToRgba(hex, alpha) || (isDark ? 'rgba(34,197,94,0.14)' : 'rgba(34,197,94,0.08)');
  }

  function getTheme(el) {
    var force = (el.getAttribute('data-theme') || 'auto').toLowerCase();
    var customBgColor     = el.getAttribute('data-bg-color');
    var customAccentColor = el.getAttribute('data-accent-color');
    var customTextColor   = el.getAttribute('data-text-color');

    var isDark =
      force === 'dark'  ? true  :
      force === 'light' ? false :
      document.documentElement.classList.contains('dark') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    var accent = '#16A34A'; // default green-700

    // Apply custom accent before building theme
    if (customAccentColor && isValidHex(customAccentColor)) {
      accent = customAccentColor;
    }

    var base;
    if (isDark) {
      base = {
        leftBg:          '#1a2332',
        leftText:        '#e2e8f0',
        rightBg:         accentToTintBg(accent, true),
        border:          hexToRgba(accent, 0.30) || accent,
        subText:         '#64748b',
        accent:          accent,
        logoFilter:      'brightness(0) invert(1) opacity(0.8)',
        isDark:          true,
        customTextColor: null,
      };
    } else {
      base = {
        leftBg:          '#ffffff',
        leftText:        '#1e293b',
        rightBg:         accentToTintBg(accent, false),
        border:          hexToRgba(accent, 0.28) || accent,
        subText:         '#64748b',
        accent:          accent,
        logoFilter:      'none',
        isDark:          false,
        customTextColor: null,
      };
    }

    if (customBgColor && isValidHex(customBgColor)) {
      base.leftBg = customBgColor;
    }
    if (customTextColor && isValidHex(customTextColor)) {
      base.leftText = customTextColor;
      base.customTextColor = customTextColor;
    }

    return base;
  }

  // Ping endpoint: fire-and-forget tracking (never blocks rendering)
  function pingInstall(siteUrl, badgeType) {
    try {
      var hostDomain = window.location.hostname || '';
      fetch(API_BASE + '/api/badge/ping', {
        method:    'POST',
        mode:      'cors',
        keepalive: true,
        headers:   { 'Content-Type': 'application/json' },
        body:      JSON.stringify({ site: siteUrl, host: hostDomain, type: badgeType })
      }).catch(function () { /* ignore */ });
    } catch (e) { /* ignore */ }
  }

  function fetchOrCreateBadge(siteUrl, el) {
    var badgeType = (el.getAttribute('data-badge-type') || 'carbon').toLowerCase();
    fetch(API_BASE + '/api/trace?site=' + encodeURIComponent(siteUrl), { mode: 'cors' })
      .then(function (res) {
        if (!res.ok) throw new Error('status ' + res.status);
        return res.json();
      })
      .then(function (data) {
        renderBadge(data, siteUrl, el, badgeType);
        pingInstall(siteUrl, badgeType);
      })
      .catch(function () {
        var msg = badgeType === 'hosting'
          ? 'Run a site check at '
          : badgeType === 'member'
            ? 'Check license at '
            : 'Run a carbon check at ';
        el.innerHTML =
          '<div style="font-size:11px;color:#94a3b8;">' + msg +
          '<a href="https://www.greentracer.org" target="_blank" rel="noopener noreferrer" ' +
          'style="color:#4ade80;">greentracer.org</a></div>';
      });
  }

  // ── Badge renderer ──────────────────────────────────
  function renderBadgeFrame(el, t, href, labelText, metricText) {
    var radius       = 10;
    var labelColor   = hexToRgba(t.leftText, 0.5) || (t.isDark ? 'rgba(226,232,240,0.5)' : 'rgba(30,41,59,0.5)');

    var checkmark =
      '<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 12 12" ' +
      'fill="none" style="display:inline-block;vertical-align:middle;margin-right:5px;flex-shrink:0;" ' +
      'aria-hidden="true">' +
      '<path d="M2 6.5L4.8 9.3L10 3" stroke="' + t.accent + '" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';

    var mainRow =
      '<div style="display:flex;align-items:stretch;">' +
        '<div style="' +
          'background:' + t.leftBg + ';' +
          'color:' + t.leftText + ';' +
          'padding:9px 13px 8px;' +
          'display:flex;flex-direction:column;gap:2px;' +
        '">' +
          '<span style="' +
            'font-family:JetBrains Mono,Courier New,monospace;' +
            'font-size:7.5px;letter-spacing:0.14em;text-transform:uppercase;' +
            'white-space:nowrap;color:' + labelColor + ';' +
          '">' + labelText + '</span>' +
          '<div style="display:flex;align-items:center;">' +
            checkmark +
            '<span style="font-size:12px;font-weight:500;letter-spacing:-0.01em;white-space:nowrap;">' +
              metricText +
            '</span>' +
          '</div>' +
        '</div>' +
        '<div style="' +
          'background:' + t.rightBg + ';' +
          'border-left:1px solid ' + t.border + ';' +
          'display:flex;align-items:center;justify-content:center;' +
          'padding:0 11px;' +
        '">' +
          '<picture>' +
            '<source type="image/avif" srcset="' + LOGO_AVIF + '" />' +
            '<source type="image/webp" srcset="' + LOGO_WEBP + '" />' +
            '<img src="' + LOGO_PNG + '" alt="GreenTracer" ' +
                 'style="height:14px;filter:' + t.logoFilter + ';display:block;opacity:0.9;" ' +
                 'loading="lazy" decoding="async" />' +
          '</picture>' +
        '</div>' +
      '</div>';

    var badgeHTML =
      '<a href="' + href + '" target="_blank" rel="noopener noreferrer" ' +
         'style="text-decoration:none;display:inline-block;" ' +
         'aria-label="GreenTracer carbon report">' +
        '<div style="' +
          'display:inline-flex;overflow:hidden;' +
          'border:1.5px solid ' + t.border + ';' +
          'border-radius:' + radius + 'px;' +
          'box-shadow:0 4px 18px -6px rgba(0,0,0,0.14);' +
          'font-family:Inter,-apple-system,system-ui,sans-serif;' +
          'transform:translateZ(0);' +
        '">' +
          mainRow +
        '</div>' +
      '</a>';

    el.innerHTML =
      '<div style="display:inline-block;">' +
        badgeHTML +
      '</div>';
  }

  function renderCarbonBadge(data, pageUrl, el, t) {
    var co2  = (+data.carbonEstimate || 0).toFixed(2);
    var pct  = data.percentile != null ? data.percentile : '--';
    var slug = data.slug ? String(data.slug).trim() : slugifyFromUrl(pageUrl);
    var href = RESULTS_BASE + '/' + encodeURIComponent(slug);
    renderBadgeFrame(el, t, href,
      'Cleaner than ' + pct + '%',
      co2 + 'g CO₂/view'
    );
  }

  function renderHostingBadge(data, pageUrl, el, t) {
    if (!data.greenHost) {
      el.innerHTML =
        '<div style="display:inline-block;border:1.5px solid rgba(100,116,139,0.22);' +
        'border-radius:12px;padding:6px 12px;' +
        'font-family:Inter,-apple-system,system-ui,sans-serif;' +
        'font-size:11.5px;font-weight:400;background:' + t.leftBg + ';color:' + t.subText + ';">' +
        'Green hosting not yet verified for this site.' +
        '</div>';
      return;
    }
    var slug = data.slug ? String(data.slug).trim() : slugifyFromUrl(pageUrl);
    var href = RESULTS_BASE + '/' + encodeURIComponent(slug);
    renderBadgeFrame(el, t, href,
      'Green Hosting Verified',
      'Renewable energy host'
    );
  }

  function renderMemberBadge(data, pageUrl, el, t) {
    var license = data && data.license ? data.license : null;
    var status  = String((license && license.status) || 'none').toLowerCase();
    var isLicensed = !!(license && license.licensed);
    var activeStates = { active: true, charity: true, partner: true, trial: true, internal: true };

    if (!isLicensed || !activeStates[status]) {
      var fallback = status === 'suspended'
        ? 'License suspended — contact GreenTracer support.'
        : 'Member badge requires an active GreenTracer license.';
      el.innerHTML =
        '<div style="display:inline-block;border:1.5px solid rgba(100,116,139,0.22);' +
        'border-radius:12px;padding:6px 12px;' +
        'font-family:Inter,-apple-system,system-ui,sans-serif;' +
        'font-size:11.5px;font-weight:400;background:' + t.leftBg + ';color:' + t.subText + ';">' +
        fallback +
        '</div>';
      return;
    }

    var labels = {
      active:   'GreenTracer Member',
      charity:  'GreenTracer Charity',
      partner:  'GreenTracer Partner',
      trial:    'GreenTracer Trial',
      internal: 'GreenTracer Internal'
    };
    var slug = data.slug ? String(data.slug).trim() : slugifyFromUrl(pageUrl);
    var href = RESULTS_BASE + '/' + encodeURIComponent(slug);
    renderBadgeFrame(el, t, href,
      labels[status] || 'GreenTracer Member',
      'Licensed by GreenTracer'
    );
  }

  function renderBadge(data, pageUrl, el, badgeType) {
    var t = getTheme(el);
    if (badgeType === 'hosting') { renderHostingBadge(data, pageUrl, el, t); return; }
    if (badgeType === 'member')  { renderMemberBadge(data, pageUrl, el, t);  return; }
    renderCarbonBadge(data, pageUrl, el, t);
  }

  function initBadges() {
    document.querySelectorAll('.greentrace-badge').forEach(function (el) {
      var siteUrl = cleanUrl(el.getAttribute('data-url') || window.location.href);
      fetchOrCreateBadge(siteUrl, el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBadges);
  } else {
    initBadges();
  }
})();
