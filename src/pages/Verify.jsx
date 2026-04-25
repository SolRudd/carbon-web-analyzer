import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { API_BASE } from "../config";
import GreenTracerBadge from "../components/badges/GreenTracerBadge";

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getStatusCopy(status) {
  if (status === "verified") return "This site has an active GreenTracer verification badge record.";
  if (status === "pending") return "This GreenTracer verification is pending final review.";
  if (status === "inactive") return "This GreenTracer verification is not currently active.";
  return "This GreenTracer verification could not be found or is unavailable.";
}

export default function Verify() {
  const { token = "" } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(`${API_BASE}/api/badge/${encodeURIComponent(token)}/data`, {
      mode: "cors",
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((payload) => setData(payload))
      .catch(() => {
        setData({
          publicStatus: "unavailable",
          label: "GreenTracer Unavailable",
          showMetric: false,
        });
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [token]);

  const badgeData = useMemo(() => data || {
    publicStatus: loading ? "pending" : "unavailable",
    label: loading ? "GreenTracer Pending" : "GreenTracer Unavailable",
    showMetric: false,
  }, [data, loading]);

  const title = badgeData.publicStatus === "verified"
    ? `GreenTracer Verified${badgeData.domain ? ` | ${badgeData.domain}` : ""}`
    : "GreenTracer Verification";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta
          name="description"
          content="Public GreenTracer verification status, carbon metric, and badge details."
        />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <section className="min-h-[calc(100vh-140px)] bg-[#07111f] px-4 py-14 text-white sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[28px] border border-slate-700/80 bg-slate-950/55 p-6 shadow-[0_24px_80px_-50px_rgba(0,0,0,0.9)] sm:p-9">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <ShieldCheck size={14} aria-hidden="true" />
                  GreenTracer Verification
                </p>
                <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
                  {badgeData.domain || "Verification unavailable"}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  {getStatusCopy(badgeData.publicStatus)}
                </p>
              </div>

              <div className="flex justify-start lg:justify-end">
                <GreenTracerBadge
                  variant="standard"
                  status={badgeData.publicStatus}
                  metric={badgeData.metric}
                  metricText={badgeData.metricText}
                  domain={badgeData.domain}
                  showMetric={badgeData.showMetric}
                />
              </div>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Public status</p>
                <p className="mt-2 text-sm font-semibold text-white">{badgeData.label || "GreenTracer Unavailable"}</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Carbon metric</p>
                <p className="mt-2 text-sm font-semibold text-white">{badgeData.metricText || "Not available"}</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Latest scan</p>
                <p className="mt-2 text-sm font-semibold text-white">{formatDate(badgeData.latestScanAt)}</p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400">Verified since</p>
              <p className="mt-2 text-sm font-semibold text-white">{formatDate(badgeData.verifiedAt)}</p>
            </div>

            <div className="mt-8 border-t border-slate-800 pt-6">
              <p className="max-w-2xl text-sm leading-6 text-slate-300">
                GreenTracer verification means the badge is tied to a public badge token and a backend verification record.
                Public badge output is limited to safe status, domain, metric, and timestamp information.
              </p>
              <Link
                to="/badge"
                className="mt-5 inline-flex rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-emerald-400 hover:text-emerald-200"
              >
                Learn about badges
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
