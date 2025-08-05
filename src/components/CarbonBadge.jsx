import React, { useState, useEffect } from "react";
import { API_BASE, RESULTS_BASE } from "../config";

// NOTE: plural "/results"
const RESULTS_PATH = "/results";

export default function CarbonBadge({ url, data: preData }) {
  const [data, setData] = useState(preData || null);
  const [err, setErr] = useState(false);

  // Normalize and skip localhost
  const target = (() => {
    try {
      const u = new URL(url);
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1")
        return null;
      return (
        u.protocol +
        "//" +
        u.hostname +
        u.pathname.replace(/\/+$/, "")
      );
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (preData || !target) return;
    const key = `carbon:${target}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      setData(JSON.parse(cached));
      return;
    }

    // use /api/trace to ensure a slug is generated
    fetch(`${API_BASE}/api/trace?site=${encodeURIComponent(target)}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then((d) => {
        setData(d);
        sessionStorage.setItem(key, JSON.stringify(d));
      })
      .catch(() => setErr(true));
  }, [target, preData]);

  if (!target) return null;
  if (err)
    return (
      <div className="text-red-500 text-xs">
        Badge failed to load
      </div>
    );
  if (!data) return <div className="text-xs">Loading badge…</div>;

  const co2 = Number(data.carbonEstimate || 0).toFixed(2);
  const pct = data.percentile ?? "--";
  const slug = data.slug; // guaranteed from /api/trace

  // Build the **frontend** URL
  const href = `${RESULTS_BASE}${RESULTS_PATH}/${encodeURIComponent(
    slug
  )}`;

  return (
    <div className="inline-flex flex-col items-center text-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex overflow-hidden rounded-md shadow-lg
                   transform transition hover:scale-105"
      >
        <div
          className="px-4 py-2 bg-white dark:bg-slate-800 border
                     border-greenbuzz text-sm font-semibold text-slate-900
                     dark:text-slate-200 rounded-l-md"
        >
          {co2}g CO₂/view
        </div>
        <div className="flex items-center px-4 py-2 bg-greenbuzz rounded-r-md">
          <picture>
            <source type="image/avif" srcSet="/GreenTraceLogo.avif" />
            <source type="image/webp" srcSet="/GreenTraceLogo.webp" />
            <img
              src="/GreenTraceLogo.png"
              alt="GreenTrace"
              className="h-6 w-auto filter brightness-0 invert"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      </a>
      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
        Cleaner than {pct}% of pages tested
      </div>
    </div>
  );
}