// public/greentrace-badge.js
;(function(){
  'use strict';

  // Always point at our real API host
  var API_BASE = 'https://api.greentracer.org';

  // Logos on the www host
  var LOGO_AVIF = 'https://www.greentracer.org/GreenTraceLogo.avif';
  var LOGO_WEBP = 'https://www.greentracer.org/GreenTraceLogo.webp';
  var LOGO_PNG  = 'https://www.greentracer.org/GreenTraceLogo.png';

  // Front-end results path
  var RESULTS_BASE = API_BASE
    .replace(/^(https?:\/\/)api\./,'$1')  // → https://www.greentracer.org
    .replace(/\/+$/,'')
    + '/result';

  function cleanUrl(u){
    try {
      if(!/^https?:\/\//i.test(u)) u='https://'+u.trim();
      var p=new URL(u);
      return p.protocol+'//'+p.hostname.toLowerCase()+p.pathname.replace(/\/+$/,'');
    } catch(e){
      return u;
    }
  }

  function slugifyFromUrl(u){
    try {
      var p=new URL(u);
      return (p.hostname + p.pathname)
        .replace(/\/$/,'')
        .replace(/[^a-z0-9]/gi,'-')
        .toLowerCase();
    } catch(e){
      return '';
    }
  }

  function getTheme(el){
    var f=(el.getAttribute('data-theme')||'auto').toLowerCase();
    var dark = f==='dark'
      ? true
      : f==='light'
      ? false
      : document.documentElement.classList.contains('dark')
        || (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches);
    return dark
      ? { leftBg:'#1f2937', leftText:'#e5e7eb', rightBg:'#16A34A', border:'#16A34A', subText:'#94a3b8', divider:'#111827' }
      : { leftBg:'#ffffff', leftText:'#0F172A', rightBg:'#16A34A', border:'#16A34A', subText:'#475569', divider:'#e2e8f0' };
  }

  function fetchOrCreateBadge(site, el){
    console.log("👉 greentrace: fetch slug for", site);
    fetch(API_BASE+'/api/trace?site='+encodeURIComponent(site), {mode:'cors'})
      .then(function(r){
        console.log("👉 greentrace: response", r.status);
        if(!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then(function(d){
        console.log("👉 greentrace: data", d);
        renderBadge(d, site, el);
      })
      .catch(function(e){
        console.warn("👉 greentrace: error", e);
        el.innerHTML = '<div style="color:#dc2626;font-size:12px;">' +
          'Run a carbon check first at '+
          '<a href="https://www.greentracer.org" target="_blank">greentracer.org</a>' +
          '</div>';
      });
  }

  function renderBadge(d, pageUrl, el){
    var t = getTheme(el);
    var co2 = ((+d.carbonEstimate)||0).toFixed(2);
    var pct = d.percentile!=null?d.percentile:'--';
    var slug = d.slug?.trim()||slugifyFromUrl(pageUrl);
    var href = RESULTS_BASE + '/' + encodeURIComponent(slug);

    var padY=10,padX=16,r=12,fs=18;
    el.innerHTML =
      '<a href="'+href+'" target="_blank" rel="noopener" '+
        'style="text-decoration:none;display:inline-block;">'+
        '<div style="display:inline-flex;align-items:center;overflow:hidden;'+
          'border:1.5px solid '+t.border+';border-radius:'+r+'px;'+
          'box-shadow:0 8px 24px rgba(0,0,0,0.1);transform:translateZ(0);">'+

          '<div style="background:'+t.leftBg+';color:'+t.leftText+';'+
            'padding:'+padY+'px '+padX+'px;font-size:'+fs+'px;font-weight:700;'+
            'white-space:nowrap;border-right:1px solid '+t.divider+';">'+
            co2+'g CO₂/view'+
          '</div>'+

          '<div style="background:'+t.rightBg+';padding:'+(padY-1)+'px '+padX+'px;'+
            'display:flex;align-items:center;justify-content:center;">'+
            '<picture>'+
              '<source type="image/avif" srcset="'+LOGO_AVIF+'">'+
              '<source type="image/webp" srcset="'+LOGO_WEBP+'">'+
              '<img src="'+LOGO_PNG+'" alt="GreenTrace" '+
                'style="height:20px;filter:brightness(0) invert(1);" '+
                'loading="lazy" decoding="async">'+
            '</picture>'+
          '</div>'+

        '</div>'+
      '</a>'+
      '<div style="margin-top:6px;font-size:14px;color:'+t.subText+';text-align:center;">'+
        'Cleaner than '+pct+'% of pages tested'+
      '</div>';
  }

  function init(){
    document.querySelectorAll('.greentrace-badge').forEach(function(el){
      var url = cleanUrl(el.getAttribute('data-url')||window.location.href);
      fetchOrCreateBadge(url, el);
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else init();

})();