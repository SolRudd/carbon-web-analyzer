;(function () {
  'use strict';

  // — Resolve BASE from this script’s own URL —
  var me =
    (document.currentScript && document.currentScript.src) ||
    (function () { var s=document.getElementsByTagName('script'); return s[s.length-1].src })();
  var BASE     = me.replace(/\/[^/]+$/, '');
  var API_BASE = BASE; // call API on same origin (e.g. https://api.greentracer.org)
  var LOGO     = BASE + '/GreenTraceLogo.svg';

  function cleanUrl(url) {
    try {
      var u = (url || '').trim();
      if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
      var p = new URL(u);
      return p.protocol + '//' + p.hostname.toLowerCase() + p.pathname.replace(/\/+$/,'');
    } catch { return url; }
  }

  function getOpts(el) {
    // Read data-* overrides
    var forceTheme = (el.getAttribute('data-theme') || 'auto').toLowerCase(); // auto|light|dark
    var size       = (el.getAttribute('data-size') || 'md').toLowerCase();     // sm|md|lg

    var isDark = forceTheme === 'dark'
      ? true
      : forceTheme === 'light'
        ? false
        : document.documentElement.classList.contains('dark');

    // Defaults = match your React badge
    var defaults = {
      leftBg:   isDark ? '#3f3f46' : '#f8fafc', // zinc-700 | slate-50
      leftText: isDark ? '#e2e8f0' : '#334155', // slate-200 | slate-700
      rightBg:  '#16A34A',
      border:   '#16A34A',
      subText:  isDark ? '#a1a1aa' : '#64748b', // zinc-400 | slate-500
      logo:     LOGO
    };

    // Optional overrides
    var o = {
      leftBg:   el.getAttribute('data-left-bg')   || defaults.leftBg,
      leftText: el.getAttribute('data-left-text') || defaults.leftText,
      rightBg:  el.getAttribute('data-right-bg')  || el.getAttribute('data-accent') || defaults.rightBg,
      border:   el.getAttribute('data-border')    || el.getAttribute('data-accent') || defaults.border,
      subText:  defaults.subText,
      logo:     el.getAttribute('data-logo')      || defaults.logo,
      size:     size
    };

    // spacing / icon per size
    var S = { sm: {pad:'6px 10px', fz:12, img:16, gap:10},
              md: {pad:'8px 12px', fz:14, img:18, gap:12},
              lg: {pad:'10px 14px',fz:16, img:20, gap:14} }[o.size] || S.md;

    o.pad    = S.pad;
    o.fz     = S.fz;
    o.imgH   = S.img;
    o.gap    = S.gap;
    return o;
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
    var co2 = (+d.carbonEstimate || 0).toFixed(2);
    var pct = (d.percentile != null) ? d.percentile : '--';
    var o   = getOpts(el);

    el.innerHTML =
      '<div style="' +
        'display:inline-flex;align-items:center;overflow:hidden;' +
        'border:1px solid ' + o.border + ';border-radius:7px;' +
        'box-shadow:0 1px 3px rgba(0,0,0,.08);' +
        'font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;' +
      '">' +

        // Left pill — value
        '<div style="' +
          'background:' + o.leftBg + ';color:' + o.leftText + ';' +
          'padding:' + o.pad + ';font-size:' + o.fz + 'px;font-weight:700;line-height:1;' +
          'display:flex;align-items:center;justify-content:center;white-space:nowrap;' +
          'font-family:JetBrains Mono,Menlo,Consolas,\\\'Liberation Mono\\\',monospace;' +
        '">' +
          co2 + 'g&nbsp;CO₂e' +
        '</div>' +

        // Right pill — solid with logo
        '<div style="' +
          'background:' + o.rightBg + ';padding:' + o.pad + ';' +
          'display:flex;align-items:center;justify-content:center;' +
        '">' +
          '<img src="' + o.logo + '" alt="GreenTrace" style="height:' + o.imgH + 'px;display:block" loading="lazy" decoding="async">' +
        '</div>' +

      '</div>' +
      '<div style="margin-top:6px;font-size:12px;color:' + o.subText + ';text-align:left;">' +
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
