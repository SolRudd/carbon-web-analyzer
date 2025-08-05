;(function () {
  'use strict';

  // Resolve BASE from this script's URL so assets + API come from same origin
  var me =
    (document.currentScript && document.currentScript.src) ||
    (function () {
      var s = document.getElementsByTagName('script');
      return s[s.length - 1].src;
    })();
  var BASE     = me.replace(/\/[^/]+$/, '');
  var API_BASE = BASE; // e.g. https://api.greentracer.org

  // Logo variants (place these files next to this script)
  var LOGO_AVIF = BASE + '/GreenTraceLogo.avif';
  var LOGO_WEBP = BASE + '/GreenTraceLogo.webp';
  var LOGO_PNG  = BASE + '/GreenTraceLogo.png';

  // WHERE RESULT PAGES LIVE - FIXED TO MATCH REACT VERSION
  // Changed from plural "results" to singular "result"
  var RESULTS_BASE = API_BASE
    .replace(/^(https?:\/\/)api\./, '$1')  // drop "api." if present
    .replace(/\/+$/, '')                  // strip any trailing slash
    + '/result';                          // <-- FIXED: singular "result"

  function cleanUrl(url) {
    try {
      var u = (url || '').trim();
      if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
      var p = new URL(u);
      return (
        p.protocol +
        '//' +
        p.hostname.toLowerCase() +
        p.pathname.replace(/\/+$/, '')
      );
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

  function getTheme(el) {
    var force = (el.getAttribute('data-theme') || 'auto').toLowerCase();
    var isDark =
      force === 'dark'
        ? true
        : force === 'light'
        ? false
        : document.documentElement.classList.contains('dark') ||
          (window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);

    return isDark
      ? {
          leftBg:   '#1f2937',
          leftText: '#e5e7eb',
          rightBg:  '#16A34A',
          border:   '#16A34A',
          subText:  '#94a3b8',
          divider:  '#111827',
        }
      : {
          leftBg:   '#ffffff',
          leftText: '#0F172A',
          rightBg:  '#16A34A',
          border:   '#16A34A',
          subText:  '#475569',
          divider:  '#e2e8f0',
        };
  }

  function fetchOrCreateBadge(siteUrl, el) {
    fetch(API_BASE + '/api/trace?site=' + encodeURIComponent(siteUrl), {
      mode: 'cors',
      credentials: 'omit',
    })
      .then(function (r) {
        if (!r.ok) throw new Error('status ' + r.status);
        return r.json();
      })
      .then(function (d) {
        renderBadge(d, siteUrl, el);
      })
      .catch(function () {
        el.innerHTML =
          '<div style="color:#dc2626;font-size:12px;">' +
          'Run a carbon check first at ' +
          '<a href="' +
          API_BASE
            .replace(/^(https?:\/\/)api\./, '$1') +
          '" target="_blank" rel="noopener noreferrer">greentracer.org</a>' +
          '</div>';
      });
  }

  function renderBadge(d, pageUrl, el) {
    var t    = getTheme(el);
    var co2  = ((+d.carbonEstimate) || 0).toFixed(2);
    var pct  = d.percentile != null ? d.percentile : '--';
    var slug = d.slug && String(d.slug).trim()
      ? String(d.slug).trim()
      : slugifyFromUrl(pageUrl);
    
    // NOW USES SINGULAR "/result" PATH TO MATCH REACT VERSION
    var href = RESULTS_BASE + '/' + encodeURIComponent(slug);

    var padY = 10, padX = 16, radius = 12, fontSize = 18;
    el.innerHTML =
      '<a href="' + href + '" target="_blank" rel="noopener noreferrer" ' +
        'style="text-decoration:none;display:inline-block">' +
        '<div style="display:inline-flex;align-items:center;overflow:hidden;' +
          'border:1.5px solid ' + t.border + ';border-radius:' + radius + 'px;' +
          'box-shadow:0 8px 24px rgba(2,6,23,.06);font-family:Inter,ui-sans-serif,' +
          'system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:transparent;' +
          'transform:translateZ(0);">' +

          '<div style="background:' + t.leftBg + ';color:' + t.leftText +
            ';padding:' + padY + 'px ' + padX + 'px;font-size:' + fontSize +
            'px;font-weight:800;line-height:1.1;display:flex;align-items:center;' +
            'white-space:nowrap;border-right:1px solid ' + t.divider + ';">' +
            co2 + 'g&nbsp;CO₂/view' +
          '</div>' +

          '<div style="background:' + t.rightBg + ';padding:' + (padY-1) + 'px ' +
            padX + 'px;display:flex;align-items:center;justify-content:center;">' +
            '<picture>' +
              '<source type="image/avif" srcset="' + LOGO_AVIF + '">' +
              '<source type="image/webp" srcset="' + LOGO_WEBP + '">' +
              '<img src="' + LOGO_PNG + '" alt="GreenTrace" ' +
                'style="height:20px;display:block;filter:brightness(0) invert(1);" ' +
                'loading="lazy" decoding="async">' +
            '</picture>' +
          '</div>' +

        '</div>' +
      '</a>' +
      '<div style="margin-top:10px;font-size:16px;color:' + t.subText +
        ';text-align:center;">' +
        'Cleaner than ' + pct + '% of pages tested' +
      '</div>';
  }

  function initBadges() {
    var list = document.querySelectorAll('.greentrace-badge');
    for (var i = 0; i < list.length; i++) {
      var el      = list[i];
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