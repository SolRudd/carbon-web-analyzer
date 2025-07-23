;(function () {
  const API_BASE =
    location.hostname.includes("localhost") || location.hostname.includes("127.")
      ? "http://localhost:8080"
      : "https://api.greentracer.org";

  // load from your backend's public folder
  const LOGO = `${API_BASE}/GreenTraceLogo.svg`;

  function initBadges() {
    document.querySelectorAll(".greentrace-badge").forEach(el => {
      const page = el.dataset.url || window.location.href;
      fetch(`${API_BASE}/api/trace?site=${encodeURIComponent(page)}`)
        .then(res => res.ok ? res.json() : Promise.reject(res.status))
        .then(d => {
          const co2 = d.carbonEstimate?.toFixed(2) || "–";
          const pct = d.percentile ?? "–";
          el.innerHTML = `
            <div style="display:inline-flex;align-items:center;…">
              <div style="padding:4px 8px;…">
                ${co2}g CO₂/view
              </div>
              <div style="display:flex;align-items:center;…">
                <img src="${LOGO}" alt="GreenTrace" style="height:16px;margin-right:6px;">
                <span>GreenTrace</span>
              </div>
            </div>
            <div style="margin-top:4px;…">
              Cleaner than ${pct}% of pages tested
            </div>
          `;
        })
        .catch(err => {
          console.error("GreenTrace badge error:", err);
          el.innerHTML = `<div style="color:#dc2626;font-size:12px;">Badge failed to load</div>`;
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBadges);
  } else {
    initBadges();
  }
})();
