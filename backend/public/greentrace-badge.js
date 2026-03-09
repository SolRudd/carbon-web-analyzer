;(function () {
  'use strict';

  // Hardcode API and Results domains for consistency
  var API_BASE     = 'https://api.greentracer.org';
  var RESULTS_BASE = API_BASE.replace(/^(https?:\/\/)api\./, '$1') + '/result';

  // Logo variants (hosted on same domain as badge script)
  var LOGO_AVIF = API_BASE.replace('api.', 'www.') + '/GreenTraceLogo.avif';
  var LOGO_WEBP = API_BASE.replace('api.', 'www.') + '/GreenTraceLogo.webp';
  var LOGO_PNG  = API_BASE.replace('api.', 'www.') + '/GreenTraceLogo.png';

  function cleanUrl(url) {
    try {
      var u = (url || '').trim();
      if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
      var p = new URL(u);
      return p.protocol + '//' +
             p.hostname.toLowerCase() +
             p.pathname.replace(/\/+$/, '');
    } catch (e) {
      return url;
    }
  }

  function slugifyFromUrl(url) {
    try {
      var u = new URL(url);
      var base = (u.hostname + u.pathname).replace(/\/$/, '');
      return base.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    } catch (e) {
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

  function getTheme(el) {
    var force = (el.getAttribute('data-theme') || 'auto').toLowerCase();
    var customBgColor = el.getAttribute('data-bg-color');
    var customAccentColor = el.getAttribute('data-accent-color');
    var customTextColor = el.getAttribute('data-text-color');
    
    // Helper to validate hex
    function isValidHex(h) {
      return /^#[0-9A-Fa-f]{6}$/.test(h);
    }
    
    var isDark =
      force === 'dark' ? true :
      force === 'light' ? false :
      document.documentElement.classList.contains('dark') ||
      (window.matchMedia &&
       window.matchMedia('(prefers-color-scheme: dark)').matches);

    var base = isDark
      ? { leftBg:'#1f2937', leftText:'#e5e7eb', rightBg:'#16A34A',
          border:'#16A34A', subText:'#94a3b8', divider:'#111827', customTextColor:null }
      : { leftBg:'#ffffff', leftText:'#0F172A', rightBg:'#16A34A',
          border:'#16A34A', subText:'#475569', divider:'#e2e8f0', customTextColor:null };

    // Apply custom colours if provided and valid
    if (customBgColor && isValidHex(customBgColor)) {
      base.leftBg = customBgColor;
    }
    if (customAccentColor && isValidHex(customAccentColor)) {
      base.rightBg = customAccentColor;
      base.border = customAccentColor;
    }
    if (customTextColor && isValidHex(customTextColor)) {
      base.leftText = customTextColor;
      base.subText = customTextColor;
      base.customTextColor = customTextColor;
    }
    
    return base;
  }

  function fetchOrCreateBadge(siteUrl, el) {
    var badgeType = (el.getAttribute('data-badge-type') || 'carbon').toLowerCase();
    fetch(API_BASE + '/api/trace?site=' + encodeURIComponent(siteUrl), { mode:'cors' })
      .then(function(res) {
        if (!res.ok) throw new Error('status '+res.status);
        return res.json();
      })
      .then(function(data) {
        renderBadge(data, siteUrl, el, badgeType);
      })
      .catch(function() {
        var fallbackText = badgeType === 'hosting'
          ? 'Hosting badge unavailable. Run a site check first at '
          : 'Run a carbon check first at ';
        el.innerHTML =
          '<div style="color:#dc2626;font-size:12px;">' + fallbackText +
          '<a href="https://www.greentracer.org" target="_blank" rel="noopener noreferrer">' +
          'greentracer.org</a></div>';
      });
  }

  function getLogoFilter(t) {
    if (!t.customTextColor) return 'brightness(0) invert(1)';
    var hex = t.customTextColor.slice(1);
    var r = parseInt(hex.slice(0, 2), 16) / 255;
    var g = parseInt(hex.slice(2, 4), 16) / 255;
    var b = parseInt(hex.slice(4, 6), 16) / 255;
    var luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 0.6 ? 'brightness(0) invert(1)' : 'brightness(0)';
  }

  function renderBadgeFrame(el, t, href, leftText, subText) {
    var padY = 7;
    var padX = 14;
    var radius = 10;
    var fontSize = 13;
    var logoFilter = getLogoFilter(t);
    var borderColor = hexToRgba(t.border, 0.38) || t.border;
    var dividerColor = hexToRgba(t.border, 0.22) || t.divider;
    var shadowColor = hexToRgba('#0F172A', 0.16) || 'rgba(15,23,42,0.16)';

    var badgeHTML =
      '<a href="' + href + '" target="_blank" rel="noopener noreferrer" ' +
         'style="text-decoration:none;display:inline-block">' +
        '<div style="' +
          'display:inline-flex;align-items:center;overflow:hidden;' +
          'border:1px solid ' + borderColor + ';' +
          'border-radius:' + radius + 'px;' +
          'box-shadow:0 6px 16px -10px ' + shadowColor + ';' +
          'font-family:Inter,system-ui;transform:translateZ(0);' +
        '">' +
          '<div style="' +
            'background:' + t.leftBg + ';' +
            'color:' + t.leftText + ';' +
            'padding:' + padY + 'px ' + padX + 'px;' +
            'font-size:' + fontSize + 'px;' +
            'font-weight:600;letter-spacing:0.01em;white-space:nowrap;' +
          '">' +
            leftText +
          '</div>' +
          '<div style="' +
            'background:' + t.rightBg + ';' +
            'padding:' + (padY - 1) + 'px ' + (padX + 1) + 'px;' +
            'display:flex;align-items:center;justify-content:center;' +
            'border-left:1px solid ' + dividerColor + ';' +
          '">' +
            '<picture>' +
              '<source type="image/avif" srcset="' + LOGO_AVIF + '" />' +
              '<source type="image/webp" srcset="' + LOGO_WEBP + '" />' +
              '<img src="' + LOGO_PNG + '" alt="GreenTrace" ' +
                   'style="height:18px;filter:' + logoFilter + ';display:block;" ' +
                   'loading="lazy" decoding="async" />' +
            '</picture>' +
          '</div>' +
        '</div>' +
      '</a>';

    var textHTML =
      '<div style="' +
        'margin-top:5px;' +
        'font-size:12px;' +
        'font-weight:500;' +
        'letter-spacing:0.01em;' +
        'color:' + t.subText + ';' +
        'text-align:center;' +
      '">' + subText + '</div>';

    el.innerHTML =
      '<div style="display:inline-block; text-align:center;">' +
        badgeHTML +
        textHTML +
      '</div>';
  }

  function renderCarbonBadge(data, pageUrl, el, t) {
    var co2  = (+data.carbonEstimate || 0).toFixed(2);
    var pct  = data.percentile != null ? data.percentile : '--';
    var slug = data.slug ? String(data.slug).trim() : slugifyFromUrl(pageUrl);
    var href = RESULTS_BASE + '/' + encodeURIComponent(slug);
    renderBadgeFrame(el, t, href, co2 + 'g CO₂/view', 'Cleaner than ' + pct + '% of pages tested');
  }

  function renderHostingBadge(data, pageUrl, el, t) {
    if (!data.greenHost) {
      var text = t.customTextColor || '#475569';
      el.innerHTML =
        '<div style="display:inline-block;border:1px solid rgba(100,116,139,0.28);border-radius:10px;padding:8px 12px;' +
        'font-family:Inter,system-ui;font-size:12px;font-weight:500;letter-spacing:0.01em;background:#f8fafc;color:' + text + ';">' +
        'Green hosting is not verified in the latest saved result for this site.' +
        '</div>';
      return;
    }
    var slug = data.slug ? String(data.slug).trim() : slugifyFromUrl(pageUrl);
    var href = RESULTS_BASE + '/' + encodeURIComponent(slug);
    renderBadgeFrame(el, t, href, 'Green Hosting Verified', 'Verified from latest saved GreenTracer result');
  }

  function renderBadge(data, pageUrl, el, badgeType) {
    var t = getTheme(el);
    if (badgeType === 'hosting') {
      renderHostingBadge(data, pageUrl, el, t);
      return;
    }
    renderCarbonBadge(data, pageUrl, el, t);
  }

  function initBadges() {
    document.querySelectorAll('.greentrace-badge').forEach(function(el) {
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
