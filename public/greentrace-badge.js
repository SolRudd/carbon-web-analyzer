;(function () {
  const API_BASE =
    location.hostname.includes('localhost') || location.hostname.includes('127.')
      ? 'http://localhost:8080/api/trace?site='
      : 'https://api.greentracer.org/api/trace?site=';

  const LOGO = '/GreenTraceLogo.svg';

  function initBadges() {
    document.querySelectorAll('.greentrace-badge').forEach(el => {
      const page = el.dataset.url || window.location.href;

      fetch(API_BASE + encodeURIComponent(page))
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(d => {
          const co2 = d.carbonEstimate?.toFixed(2) || "–";
          const pct = d.percentile ?? "–";

          el.innerHTML = `
            <div style="
              display:inline-flex; align-items:center;
              font-family:sans-serif; overflow:hidden;
              border-radius:4px; box-shadow:0 1px 3px rgba(0,0,0,0.1);
            ">
              <div style="
                padding:4px 8px; background:#fff;
                border:1px solid #16A34A; font-weight:600;
                color:#0F172A; font-size:12px;
              ">
                ${co2}g CO₂/view
              </div>
              <div style="
                display:flex; align-items:center;
                padding:4px 10px; background:#1E3A8A;
                color:#fff; font-size:12px;
              ">
                <img src="${LOGO}" alt="GreenTrace" style="height:16px; margin-right:6px;">
                <span>GreenTrace</span>
              </div>
            </div>
            <div style="
              margin-top:4px; font-family:sans-serif;
              font-size:11px; color:#334155;
            ">
              Cleaner than ${pct}% of pages tested
            </div>
          `;
        })
        .catch(err => {
          console.error('Greentrace badge error:', err);
          el.innerHTML = `<div style="color:#dc2626; font-size:12px;">Badge failed to load</div>`;
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBadges);
  } else {
    initBadges();
  }
})();
