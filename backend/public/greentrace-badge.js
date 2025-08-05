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
      return p.protocol + '//' + p.hostname.toLowerCase() + p.pathname.replace(/\/+$/,'');
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
      force === 'dark' ? true :
      force === 'light' ? false :
      document.documentElement.classList.contains('dark') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return isDark ?
      { leftBg:'#1f2937', leftText:'#e5e7eb', rightBg:'#16A34A', border:'#16A34A', subText:'#94a3b8', divider:'#111827' } :
      { leftBg:'#ffffff', leftText:'#0F172A', rightBg:'#16A34A', border:'#16A34A', subText:'#475569', divider:'#e2e8f0' };
  }

  function fetchOrCreateBadge(siteUrl, el) {
    fetch(API_BASE + '/api/trace-or-check?site=' + encodeURIComponent(siteUrl), { mode:'cors' })
      .then(function(res) { if (!res.ok) throw new Error('status '+res.status); return res.json(); })
      .then(function(data) { renderBadge(data, siteUrl, el); })
      .catch(function() {
        el.innerHTML = '<div style="color:#dc2626;font-size:12px;">Run a carbon check first at ' +
                       '<a href="https://www.greentracer.org" target="_blank" rel="noopener noreferrer">greentracer.org</a></div>';
      });
  }

  function renderBadge(data, pageUrl, el) {
    var t    = getTheme(el);
    var co2  = (+data.carbonEstimate || 0).toFixed(2);
    var pct  = data.percentile != null ? data.percentile : '--';
    var slug = data.slug ? String(data.slug).trim() : slugifyFromUrl(pageUrl);
    var href = RESULTS_BASE + '/' + encodeURIComponent(slug);

    var padY=10,padX=16,radius=12,fontSize=18;
    el.innerHTML =
      '<a href="'+href+'" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block">' +
      '<div style="display:inline-flex;align-items:center;overflow:hidden;border:1.5px solid '+t.border+';border-radius:'+radius+'px;box-shadow:0 8px 24px rgba(0,0,0,0.1);' +
      'font-family:Inter,system-ui;transform:translateZ(0);">' +

      '<div style="background:'+t.leftBg+';color:'+t.leftText+';padding:'+padY+'px '+padX+'px;font-size:'+fontSize+'px;font-weight:700;white-space:nowrap;border-right:1px solid '+t.divider+';">' +
        co2 + 'g CO₂/view' +
      '</div>' +

      '<div style="background:'+t.rightBg+';padding:'+(padY-1)+'px '+padX+'px;display:flex;align-items:center;justify-content:center;">' +
        '<picture>' +
          '<source type="image/avif" srcset="'+LOGO_AVIF+'">' +
          '<source type="image/webp" srcset="'+LOGO_WEBP+'">' +
          '<img src="'+LOGO_PNG+'" alt="GreenTrace" style="height:20px;filter:brightness(0) invert(1);" loading="lazy" decoding="async">' +
        '</picture>' +
      '</div>' +

      '</div></a>' +
      '<div style="margin-top:6px;font-size:14px;color:'+t.subText+';text-align:center;">Cleaner than '+pct+'% of pages tested</div>';
  }

  function initBadges() {
    document.querySelectorAll('.greentrace-badge').forEach(function(el) {
      var siteUrl = cleanUrl(el.getAttribute('data-url') || window.location.href);
      fetchOrCreateBadge(siteUrl, el);
    });
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', initBadges);
  else initBadges();
})();
