;(function () {
  'use strict';

  // --- Configuration ---
  // The script is hosted at https://api.greentracer.org/greentrace-badge.js
  var API_BASE = 'https://api.greentracer.org';
  var LOGO_URL = 'https://api.greentracer.org/GreenTraceLogo.svg'; // Absolute URL is crucial

  function cleanUrl(url) {
    try {
      var u = (url || '').trim();
      if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
      var p = new URL(u);
      return p.protocol + '//' + p.hostname.toLowerCase() + p.pathname.replace(/\/+$/,'');
    } catch { return url; }
  }

  // --- Styling to EXACTLY match your React component ---
  function getTheme() {
    // Detects if the user's OS or the website's <html> tag is in dark mode
    var isDark = document.documentElement.classList.contains('dark') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    var theme = {
      accent:    '#16A34A', // Your 'greenbuzz' color
      light: {
        bg:      '#ffffff', // bg-white
        text:    '#0f172a', // text-slate-900
        subText: '#475569'  // text-slate-600
      },
      dark: {
        bg:      '#1f2937', // dark:bg-slate-800
        text:    '#e2e8f0', // dark:text-slate-200
        subText: '#94a3b8'  // dark:text-slate-400
      }
    };
    return isDark ? { ...theme.dark, accent: theme.accent } : { ...theme.light, accent: theme.accent };
  }

  function fetchOrCreateBadge(url, el) {
    // Override theme if data-theme="light|dark" is set on the element
    var forceTheme = el.getAttribute('data-theme');
    if (forceTheme === 'light' || forceTheme === 'dark') {
        el.setAttribute('data-force-theme', forceTheme);
    }
    
    fetch(API_BASE + '/api/trace?site=' + encodeURIComponent(url), { mode:'cors', credentials:'omit' })
      .then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.json(); })
      .then(function (d) { renderBadge(d, el); })
      .catch(function () {
        el.innerHTML =
          '<div style="color:#dc2626;font-size:12px;font-family:sans-serif;">' +
          'Could not load GreenTracer badge. Run a check at ' +
          '<a href="https://greentracer.org" target="_blank" rel="noopener">greentracer.org</a>.' +
          '</div>';
      });
  }

  function renderBadge(d, el) {
    var o   = getTheme();
    // Check for theme override from the fetch step
    var forceTheme = el.getAttribute('data-force-theme');
    if (forceTheme === 'light') o = { ...o, ...getTheme().light };
    if (forceTheme === 'dark') o = { ...o, ...getTheme().dark };

    var co2 = (+d.carbonEstimate || 0).toFixed(2);
    var pct = (d.percentile != null) ? d.percentile : '--';
    var slug = '';
    try {
      var u = new URL(d.pageURL);
      slug = (u.hostname + u.pathname).replace(/\/$/, "").replace(/[^a-z0-9]/gi, "-").toLowerCase();
    } catch {}

    el.innerHTML =
      '<div style="display:inline-flex; flex-direction:column; align-items:center; text-align:center; font-family:Inter,ui-sans-serif,system-ui,sans-serif;">' +
        // The main badge link - matches `<a>` tag in React
        '<a href="https://greentracer.org/result/' + slug + '" target="_blank" rel="noopener" style="' +
          'display:inline-flex; overflow:hidden; border-radius:6px; ' + // rounded-md
          'box-shadow:0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1); ' + // shadow-lg
          'text-decoration:none; transform:scale(1); transition:transform .2s ease;' + // transform transition
        '" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'">' +
          
          // Left Pill - matches first `<div>`
          '<div style="' +
            'background-color:' + o.bg + '; color:' + o.text + '; ' +
            'padding:8px 16px; font-size:14px; font-weight:600; line-height:24px; ' + // px-4 py-2, text-sm, font-semibold
            'border:1px solid ' + o.accent + '; ' + // border border-greenbuzz
            'border-top-left-radius:6px; border-bottom-left-radius:6px; border-right:none;' + // rounded-l-md
          '">' +
            co2 + 'g CO₂/view' +
          '</div>' +

          // Right Pill (Logo) - matches second `<div>`
          '<div style="' +
            'display:flex; align-items:center; justify-content:center; ' + // flex items-center
            'background-color:' + o.accent + '; padding:8px 16px; ' + // bg-greenbuzz, px-4 py-2
            'border-top-right-radius:6px; border-bottom-right-radius:6px;' + // rounded-r-md
          '">' +
            '<img src="' + LOGO_URL + '" alt="GreenTrace Logo" ' +
              'style="height:24px; width:auto; display:block; filter:brightness(0) invert(1);" ' + // h-6, filter
              // This is the fallback: if the logo is blocked by another site's security, it shows your name instead.
              'onerror="this.style.display=\\\'none\\\'; this.nextElementSibling.style.display=\\\'block\\\';"' +
            '/>' +
            '<span style="display:none; color:white; font-size:14px; font-weight:600;">GreenTrace</span>' +
          '</div>' +

        '</a>' +
        // Subtext - matches the last `<div>`
        '<div style="margin-top:4px; font-size:12px; color:' + o.subText + ';">' + // mt-1, text-xs
          'Cleaner than ' + pct + '% of pages tested' +
        '</div>' +
      '</div>';
  }

  function initBadges() {
    var list = document.querySelectorAll('.greentrace-badge');
    for (var i = 0; i < list.length; i++) {
      fetchOrCreateBadge(list[i].getAttribute('data-url') || window.location.href, list[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBadges);
  } else {
    initBadges();
  }
})();