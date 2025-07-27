import React, { useState, useEffect } from "react";
import CarbonBadge from "./CarbonBadge";
import { Link }    from "react-router-dom";

export default function BadgePromo({ siteUrl }) {
  const previewUrl = siteUrl || "https://buzzboost.co.uk";
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    // don’t fetch on local dev
    if (previewUrl.startsWith(window.location.origin)) return;
    const key = `carbon:${previewUrl}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      setPreviewData(JSON.parse(cached));
    } else {
      fetch(`/api/trace?site=${encodeURIComponent(previewUrl)}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => {
          sessionStorage.setItem(key, JSON.stringify(d));
          setPreviewData(d);
        })
        .catch(console.error);
    }
  }, [previewUrl]);

  return (
    <section className="py-8 px-4">
      <div className="mx-auto max-w-4xl bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl shadow space-y-8">
        <h2 className="text-2xl font-bold">Website Carbon Badge</h2>
        <div className="flex gap-8">
          <div className="flex-1 space-y-2">
            <p>Drop this badge into your site’s footer to show your carbon footprint.</p>
            <Link to="/get-the-badge" className="inline-block bg-greenbuzz text-white px-4 py-2 rounded">
              Get the badge
            </Link>
          </div>
          <div className="flex-1 grid grid-cols-1 gap-4">
            <CarbonBadge url={previewUrl} data={previewData} />
          </div>
        </div>
      </div>
    </section>
  );
}
