// src/components/BadgePromo.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CarbonBadge from "./CarbonBadge";

export default function BadgePromo({ siteUrl }) {
  const previewUrl = siteUrl || "https://buzzboost.co.uk";
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const key = `carbon:${previewUrl}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      setPreviewData(JSON.parse(cached));
      return;
    }
    fetch(`/api/trace?site=${encodeURIComponent(previewUrl)}`)
      .then(res => res.json())
      .then(data => {
        setPreviewData(data);
        sessionStorage.setItem(key, JSON.stringify(data));
      })
      .catch(console.error);
  }, [previewUrl]);

  return (
    <section className="py-2 px-4">
      <div className="
        mx-auto max-w-4xl
        bg-white/95 dark:bg-slate-900/90
        p-8 sm:p-12
        rounded-3xl
        shadow-2xl
        border border-greenbuzz/20 dark:border-greenbuzz/30
        backdrop-blur-sm
        space-y-8
      ">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Website Carbon Badge
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Tell your visitors about your carbon emissions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Show your carbon credentials
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                Drop this badge into your site’s footer and it will automatically
                display your page’s carbon footprint—cached locally to load instantly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Open Source API
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                Our public API lets you fetch carbon data for any page and
                integrate it into your workflows.
              </p>
            </div>

            <Link
              to="/get-the-badge"
              className="inline-block mt-4 bg-greenbuzz hover:bg-greenbuzz-light text-black font-semibold py-3 px-6 rounded-full transition"
            >
              Get the badge!
            </Link>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-lg flex justify-center">
              <div>
                <p className="text-sm mb-2 text-slate-400">Dark theme</p>
                <CarbonBadge url={previewUrl} data={previewData} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg flex justify-center">
              <div className="light">
                <p className="text-sm mb-2 text-slate-600">Light theme</p>
                <CarbonBadge url={previewUrl} data={previewData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}