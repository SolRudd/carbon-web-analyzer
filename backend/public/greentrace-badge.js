;(function(){
  'use strict';

  // Derive BASE from this file's <script src="...">
  var me = (document.currentScript && document.currentScript.src)
        || (function(){ var s=document.getElementsByTagName('script'); return s[s.length-1].src })();
  var BASE     = me.replace(/\/[^/]+$/, '');
  var API_BASE = BASE; // call the API on the same origin serving this file
  var LOGO     = BASE + '/GreenTraceLogo.svg';

  function cleanUrl(url) {
    try {
      var u = (url || '').trim();
      if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
      var p = new URL(u);
      var host = p.hostname.toLowerCase();
      var path = p.pathname.replace(/\/+$/,'');
      return p.protocol + '//' + host + path;
    } catch {
      return url;
    }
  }

  function fetchOrCreateBadge(url, el) {
    fetch(API_BASE + '/api/trace?site=' + encodeURIComponent(url), { mode:'cors', credentials:'omit' })
      .then(function(r){ if (!r.ok) throw new Error('status '+r.status); return r.json(); })
      .then(function(d){ renderBadge(d, el); })
      .catch(function(){
        el.innerHTML = '<div style="color:#dc2626;font-size:12px;">'
          + 'Run a carbon check first at '
          + '<a href="https://greentracer.org" target="_blank" rel="noopener">greentracer.org</a>'
          + '</div>';
      });
  }

  function renderBadge(d, el) {
    var co2  = (+d.carbonEstimate || 0).toFixed(2);
    var pct  = (d.percentile != null) ? d.percentile : '--';
    var dark = document.documentElement.classList.contains('dark');

    // Left side: white in light mode, near-black in dark
    var leftBg   = dark ? '#18181b' : '#fff';
    var leftText = dark ? '#e5e7eb' : '#0F172A';

    // Right side: white with your green logo (change to '#16A34A' if you want a green panel)
    var rightBg  = '#ffffff';
    var subText  = dark ? '#a3a3a3' : '#334155';

    el.innerHTML =
      '<div style="display:inline-flex;align-items:center;overflow:hidden;'
        + 'border:1px solid #16A34A;border-radius:6px;'
        + 'font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif">'
        + '<div style="padding:4px 8px;background:'+leftBg+';color:'+leftText+';font-size:12px;font-weight:600;white-space:nowrap">'
          + co2 + 'g CO₂/view'
        + '</div>'
        + '<div style="display:flex;align-items:center;justify-content:center;padding:4px 8px;background:'+rightBg+'">'
          + '<img src="'+LOGO+'" alt="GreenTrace" style="height:16px;display:block" loading="lazy" decoding="async">'
        + '</div>'
      + '</div>'
      + '<div style="font-size:11px;margin-top:4px;color:'+subText+';">'
        + 'Cleaner than ' + pct + '% of pages tested'
      + '</div>';
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
