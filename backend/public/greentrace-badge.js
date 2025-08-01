;(function () {
  'use strict';

  // Resolve BASE from this script’s URL so SVG + API come from same origin
  var me =
    (document.currentScript && document.currentScript.src) ||
    (function () { var s=document.getElementsByTagName('script'); return s[s.length-1].src })();
  var BASE     = me.replace(/\/[^/]+$/, '');
  var API_BASE = BASE; // e.g. https://api.greentracer.org
  var LOGO     = BASE + '/GreenTraceLogo.svg';

  function cleanUrl(url) {
    try {
      var u = (url || '').trim();
      if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
      var p = new URL(u);
      return p.protocol + '//' + p.hostname.toLowerCase() + p.pathname.replace(/\/+$/,'');
    } catch { return url; }
  }

  // Same look as your React badge (light/dark)
  function getTheme(el) {
    var force = (el.getAttribute('data-theme') || 'auto').toLowerCase(); // auto|light|dark
    var isDark =
      force === 'dark' ? true :
      force === 'light' ? false :
      document.documentElement.classList.contains('dark') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return isDark ? {
      leftBg:   '#1f2937', // slate-800
      leftText: '#e5e7eb', // slate-200
      rightBg:  '#16A34A', // green-600
      border:   '#16A34A',
      subText:  '#94a3b8', // slate-400
      divider:  '#111827'  // near black; subtle seam
    } : {
      leftBg:   '#ffffff',
      leftText: '#0F172A', // slate-900
      rightBg:  '#16A34A',
      border:   '#16A34A',
      subText:  '#475569', // slate-600
      divider:  '#e2e8f0'  // slate-200
    };
  }

  function fetchOrCreateBadge(url, el) {
    fetch(API_BASE + '/api/trace?site=' + encodeURIComponent(url), { mode:'cors', credentials:'omit' })
      .then(function (r) { if (!r.ok) throw new Error('status '+r.status); return r.json(); })
      .then(function (d) { renderBadge(d, el); })
      .catch(function () {
        el.innerHTML =
          '<div style="color:#dc2626;font-size:12px;">' +
          'Run a carbon check first at ' +
          '<a href="https://greentracer.org" target="_blank" rel="noopener">greentracer.org</a>' +
          '</div>';
      });
  }

  function renderBadge(d, el) {
    var t   = getTheme(el);
    var co2 = ((+d.carbonEstimate) || 0).toFixed(2);
    var pct = (d.percentile != null) ? d.percentile : '--';

    // Sizes (match your React feel)
    var padY = 10, padX = 16, radius = 12, fontSize = 18;

    el.innerHTML =
      '<div style="' +
        'display:inline-flex;align-items:center;overflow:hidden;' +
        'border:1.5px solid ' + t.border + ';border-radius:' + radius + 'px;' +
        'box-shadow:0 8px 24px rgba(2,6,23,.06);' +
        'font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;' +
        'background:#ffffff00;' +
      '">' +

        // Left pill — value (same text + weight as app)
        '<div style="' +
          'background:' + t.leftBg + ';color:' + t.leftText + ';' +
          'padding:' + padY + 'px ' + padX + 'px;' +
          'font-size:' + fontSize + 'px;font-weight:800;line-height:1.1;' +
          'display:flex;align-items:center;white-space:nowrap;' +
          'border-right:1px solid ' + t.divider + ';' +
        '">' +
          co2 + 'g&nbsp;CO₂/view' +
        '</div>' +

        // Right pill — green with your logo
        '<div style="' +
          'background:' + t.rightBg + ';padding:' + (padY-1) + 'px ' + padX + 'px;' +
          'display:flex;align-items:center;justify-content:center;' +
        '">' +
          '<img src="' + LOGO + '" alt="GreenTrace" ' +
            'style="height:20px;display:block;filter:brightness(0) invert(1);" ' + // white logo on green
            'loading="lazy" decoding="async">' +
        '</div>' +

      '</div>' +
      '<div style="margin-top:10px;font-size:16px;color:' + t.subText + ';text-align:center;">' +
        'Cleaner than ' + pct + '% of pages tested' +
      '</div>';
  }

  function initBadges() {
    var list = document.querySelectorAll('.greentrace-badge');
    for (var i=0;i<list.length;i++) {
      var el = list[i];
      var pageURL = cleanUrl(el.getAttribute('data-url') || window.location.href);
      fetchOrCreateBadge(pageURL, el);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBadges);
  } else {
    initBadges();
  }
})();
