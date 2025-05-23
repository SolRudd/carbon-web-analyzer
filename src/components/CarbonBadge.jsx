import React, { useState, useEffect } from "react";

export default function CarbonBadge({ url, data: preData }) {
  const [data, setData] = useState(preData);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (preData) return;
    const key = `carbon:${url}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      setData(JSON.parse(cached));
      return;
    }

    fetch(`/api/trace?site=${encodeURIComponent(url)}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((d) => {
        setData(d);
        sessionStorage.setItem(key, JSON.stringify(d));
      })
      .catch(() => setErr(true));
  }, [url, preData]);

  if (err) return <div className="text-red-500 text-xs">Badge failed to load</div>;
  if (!data) return <div className="text-xs">Loading badge…</div>;

  const co2 = data.carbonEstimate.toFixed(2);
  const pct = data.percentile;

  // make a slug to link back to your result page
  const slug = (() => {
    try {
      const u = new URL(url);
      const base = (u.hostname + u.pathname).replace(/\/$/, "");
      return base.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    } catch {
      return "";
    }
  })();

  return (
    <div className="inline-flex flex-col items-center text-center">
      <a
        href={`/result/${slug}`}
        className="inline-flex overflow-hidden rounded-md shadow-lg transform transition hover:scale-105 no-underline"
      >
        {/* CO₂ panel */}
        <div className="px-4 py-2 bg-white dark:bg-slate-800 border border-greenbuzz text-sm font-semibold text-slate-900 dark:text-slate-200 rounded-l-md">
          {co2}g CO₂/view
        </div>

        {/* Logo panel */}
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
