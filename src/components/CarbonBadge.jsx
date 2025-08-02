// src/components/CarbonBadge.jsx
import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";

export default function CarbonBadge({ url, data: preData }) {
  const [data, setData] = useState(preData || null);
  const [err,  setErr]  = useState(false);

  // Don’t check localhost (PageSpeed can’t crawl it)
  const target = (() => {
    try {
      const u = new URL(url);
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return null;
      // normalise to proto + host + path (no trailing slash)
      return u.protocol + "//" + u.hostname + u.pathname.replace(/\/+$/, "");
    } catch { return null; }
  })();

  useEffect(() => {
    if (preData || !target) return;
    const key = `carbon:${target}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      setData(JSON.parse(cached));
      return;
    }

    // IMPORTANT: endpoint that auto-creates a record if missing
    fetch(`${API_BASE}/api/trace-or-check?site=${encodeURIComponent(target)}`)
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(d => {
        setData(d);
        sessionStorage.setItem(key, JSON.stringify(d));
      })
      .catch(() => setErr(true));
  }, [target, preData]);

  if (!target) return null;
  if (err)    return <div className="text-red-500 text-xs">Badge failed to load</div>;
  if (!data)  return <div className="text-xs">Loading badge…</div>;

  const co2  = Number(data.carbonEstimate || 0).toFixed(2);
  const pct  = data.percentile ?? "--";
  const slug = data.slug || (() => {
    try {
      const u = new URL(target);
      const base = (u.hostname + u.pathname).replace(/\/$/, "");
      return base.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    } catch { return ""; }
  })();

  return (
    <div className="inline-flex flex-col items-center text-center">
      <a
        href={`/result/${slug}`}
        className="inline-flex overflow-hidden rounded-md shadow-lg transform transition hover:scale-105"
      >
        <div className="px-4 py-2 bg-white dark:bg-slate-800 border border-greenbuzz text-sm font-semibold text-slate-900 dark:text-slate-200 rounded-l-md">
          {co2}g CO₂/view
        </div>
        <div className="flex items-center px-4 py-2 bg-greenbuzz rounded-r-md">
          <img
            src="/GreenTraceLogo.svg"
            alt="GreenTrace"
            className="h-6 w-auto filter brightness-0 invert"
          />
        </div>
      </a>
      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
        Cleaner than {pct}% of pages tested
      </div>
    </div>
  );
}
