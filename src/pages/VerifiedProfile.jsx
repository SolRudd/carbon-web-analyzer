import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import GreenTracerBadge from "../components/badges/GreenTracerBadge";

function cleanDomain(value) {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("/")[0]
    .toLowerCase();
}

export default function VerifiedProfile() {
  const { domain = "" } = useParams();
  const clean = cleanDomain(domain);

  return (
    <>
      <Helmet>
        <title>{clean ? `${clean} | GreenTracer Verified` : "GreenTracer Verified"}</title>
        <meta
          name="description"
          content="GreenTracer Verified directory profile placeholder."
        />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <section className="min-h-[calc(100vh-140px)] bg-slate-100/70 px-4 py-14 dark:bg-[#020f1e] sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_56px_-34px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900 sm:p-9">
          <GreenTracerBadge
            status="pending"
            badgeType="greentracer_verified"
            domain={clean}
          />
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">
            {clean || "Verified profile"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Directory profiles are being prepared. GreenTracer Verified status is currently managed from the account dashboard and licence records.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            >
              Open dashboard
            </Link>
            <Link
              to="/badge"
              className="inline-flex rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
            >
              Badge setup
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
