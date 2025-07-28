;(function(){
  const API_BASE = location.hostname.includes('localhost')
    ? 'http://localhost:8080'
    : 'https://api.greentracer.org';
  const LOGO = `${API_BASE}/GreenTraceLogo.svg`;

  // Consistent URL cleaner (must match backend slug logic!)
  function cleanUrl(url) {
    try {
      let u = url.trim();
      if (!/^https?:\/\//.test(u)) u = 'https://' + u;
      const parsed = new URL(u);
      // Remove trailing slash from path
      let host = parsed.hostname.toLowerCase();
      let pathname = parsed.pathname.replace(/\/+$/, '');
      let base = parsed.protocol + '//' + host + pathname;
      return base;
    } catch {
      return url;
    }
  }

  // Try to fetch, if not found, auto-trigger a scan
  function fetchOrCreateBadge(url, el) {
    fetch(`${API_BASE}/api/trace?site=${encodeURIComponent(url)}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => renderBadge(data, el))
      .catch(() => {
        // Try to run a check if not found
        fetch(`${API_BASE}/api/check-carbon`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url })
        })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => renderBadge(data, el))
        .catch(() => {
          el.innerHTML = `<div style="color:#dc2626;font-size:12px;">
            Run a carbon check first at <a href="https://greentracer.org" target="_blank">greentracer.org</a>
          </div>`;
        });
      });
  }

  function renderBadge(d, el) {
    const co2 = d.carbonEstimate.toFixed(2);
    const pct = d.percentile;
    // Dark mode?
    const dark = document.documentElement.classList.contains('dark');
    const badgeBg = dark ? '#18181b' : '#fff';
    const textColor = dark ? '#e5e7eb' : '#0F172A';
    el.innerHTML = `
      <div style="display:inline-flex;align-items:center;font-family:sans-serif;overflow:hidden;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.10);">
        <div style="padding:4px 8px;background:${badgeBg};border:1px solid #16A34A;font-size:12px;color:${textColor};font-weight:600;">
          ${co2}g CO₂/view
        </div>
        <div style="display:flex;align-items:center;padding:4px 10px;background:#16A34A;color:#fff;font-size:12px;">
          <img src="${LOGO}" alt="GreenTrace" style="height:16px;margin-right:6px;">
          <span>GreenTrace</span>
        </div>
      </div>
      <div style="margin-top:4px;font-size:11px;color:${dark ? '#a3a3a3' : '#334155'};">
        Cleaner than ${pct}% of pages tested
      </div>`;
  }

  function initBadges() {
    document.querySelectorAll('.greentrace-badge').forEach(el => {
      const pageURL = cleanUrl(el.dataset.url || window.location.href);
      fetchOrCreateBadge(pageURL, el);
    });
  }

  if (document.readyState==='loading') {
    document.addEventListener('DOMContentLoaded', initBadges);
  } else {
    initBadges();
  }
})();
