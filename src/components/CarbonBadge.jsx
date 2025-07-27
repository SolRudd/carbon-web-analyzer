import React, { useState, useEffect } from 'react';

export default function CarbonBadge({ url, data: preData }) {
  const [data, setData] = useState(preData);
  const [err, setErr]   = useState(false);

  useEffect(() => {
    // skip if we already have data, or if this is our own dev host
    if (preData || url.startsWith(window.location.origin)) return;

    const key = `carbon:${url}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      setData(JSON.parse(cached));
      return;
    }

    fetch(`/api/trace?site=${encodeURIComponent(url)}`)
      .then(r => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then(d => {
        sessionStorage.setItem(key, JSON.stringify(d));
        setData(d);
      })
      .catch(() => setErr(true));
  }, [url, preData]);

  if (err)      return <div className="text-red-500 text-xs">Badge failed to load</div>;
  if (!data)    return <div className="text-xs">Loading badge…</div>;

  const co2 = data.carbonEstimate.toFixed(2);
  const pct = data.percentile;
  const slug = new URL(url).hostname.replace(/[^a-z0-9]/gi,'-').toLowerCase();

  return (
    <div className="inline-flex flex-col items-center text-center">
      <a
        href={`/result/${slug}`}
        className="inline-flex overflow-hidden rounded shadow hover:scale-105 transition"
      >
        <div className="px-3 py-1 bg-white border text-sm font-semibold">
          {co2}g CO₂/view
        </div>
        <div className="px-3 py-1 bg-greenbuzz text-white">GreenTrace</div>
      </a>
      <div className="mt-1 text-xs">Cleaner than {pct}% of pages tested</div>
    </div>
  );
}
