import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { API_BASE } from "../config";

function normalizeDomainInput(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return (parsed.hostname || "").replace(/^www\./i, "").split(":")[0].toLowerCase();
  } catch {
    return raw
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0]
      .split(":")[0]
      .toLowerCase();
  }
}

export default function ResultResolverPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const domain = normalizeDomainInput(searchParams.get("domain") || searchParams.get("url") || searchParams.get("site"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(domain));

  useEffect(() => {
    if (!domain) {
      setError("No domain was supplied for result lookup.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        const latest = await fetch(
          `${API_BASE}/api/badge/result/latest/data?${new URLSearchParams({
            domain,
            type: "carbon_tested",
          })}`,
          { signal }
        );
        const payload = await latest.json().catch(() => ({}));
        if (!latest.ok || !payload?.resultSlug) {
          setError(
            payload?.error ||
              "This domain does not have a public report yet. Run a scan and return here for the latest result."
          );
          return;
        }
        navigate(`/result/${encodeURIComponent(payload.resultSlug)}`, { replace: true });
      } catch (err) {
        if (err?.name === "AbortError") return;
        setError("Unable to resolve latest result right now. Please check the domain or open the badge builder.");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [domain, navigate]);

  const fallback = `/badge?type=carbon_tested${domain ? `&domain=${encodeURIComponent(domain)}` : ""}`;

  return (
    <>
      <Helmet>
        <title>Resolving result | GreenTracer</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="min-h-[calc(100vh-140px)] bg-slate-100 dark:bg-[#020f1e] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-center shadow-[0_12px_38px_-30px_rgba(2,6,23,.55)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700 dark:text-green-300">
              GreenTracer report lookup
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">Resolving report for this domain</h1>
            {loading ? (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Finding the latest report and loading it now.</p>
            ) : error ? (
              <div className="mt-6 space-y-4 text-left">
                <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link
                    to={fallback}
                    className="inline-flex rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Open badge builder
                  </Link>
                  <Link
                    to={domain ? `/license-status?domain=${encodeURIComponent(domain)}` : "/"}
                    className="inline-flex rounded-full bg-slate-900 dark:bg-slate-100 px-4 py-2 text-sm font-semibold text-white dark:text-slate-900"
                  >
                    Go to domain status
                  </Link>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Redirecting you to the latest available report.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

