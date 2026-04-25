import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaInfoCircle, FaShieldAlt } from "react-icons/fa";
import { API_BASE } from "../config";

const STATUS_STYLES = {
  active: "text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30",
  trial: "text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-900/30",
  charity: "text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/30",
  partner: "text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30",
  internal: "text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/30",
  inactive: "text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30",
  suspended: "text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/30",
  none: "text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/30",
};

const normalizeDomainInput = (value) =>
  String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("/")[0]
    .toLowerCase();

const ISSUE_LABELS = {
  missing_script: "Badge container found, but script tag is missing.",
  missing_badge_container: "Script found, but .greentrace-badge container was not found.",
  missing_data_url: "Badge container found, but data-url is missing or empty.",
  expected_badge_type_mismatch: "Badge is installed, but not using the selected badge type.",
  site_fetch_failed: "Could not fetch the website HTML automatically.",
};

export default function LicenseStatus() {
  const [params] = useSearchParams();
  const initialDomain = normalizeDomainInput(params.get("domain") || "");
  const initialToken = String(params.get("token") || "").trim();
  const checkoutSuccess = params.get("checkout") === "success";
  const initialAction = String(params.get("action") || "").toLowerCase();
  const initialBadgeTypeRaw = String(params.get("badgeType") || "").toLowerCase();
  const initialBadgeType = ["member", "carbon", "hosting"].includes(initialBadgeTypeRaw) ? initialBadgeTypeRaw : "member";

  const [domain, setDomain] = useState(initialDomain);
  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [installBadgeType, setInstallBadgeType] = useState(initialBadgeType);
  const [verifyDomain, setVerifyDomain] = useState(initialDomain);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [checkoutNotice, setCheckoutNotice] = useState("");

  const status = String(result?.status || "none").toLowerCase();
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.none;
  const hasMemberLicense = ["active", "trial", "charity", "partner", "internal"].includes(status) && !!result?.licensed;
  const forceVerifyFlow = initialAction === "verify";
  const showVerificationPanel = Boolean(result) && (hasMemberLicense || forceVerifyFlow);
  const effectiveDomain = normalizeDomainInput(verifyDomain || result?.domain || domain);

  const actionLinks = useMemo(() => {
    const actionDomain = normalizeDomainInput(result?.domain || domain || verifyDomain);
    const badgeSetupTo = actionDomain ? `/badge?site=${encodeURIComponent(actionDomain)}` : "/badge";
    if (["active", "trial", "charity", "partner", "internal"].includes(status)) {
      return [
        { to: badgeSetupTo, label: "Configure Your Badge", type: "internal" },
        { to: "/result", label: "Run a Fresh Scan", type: "internal" },
      ];
    }
    if (status === "suspended") {
      return [{ to: "https://buzzboost.co.uk/contact/", label: "Contact Support", type: "external" }];
    }
    return [
      { to: "/pricing", label: "View Pricing", type: "internal" },
      { to: "https://buzzboost.co.uk/contact/", label: "Request Licensing Help", type: "external" },
    ];
  }, [status, result?.domain, domain, verifyDomain]);

  const getEmbedCode = () => {
    const normalized = normalizeDomainInput(result?.domain || domain || verifyDomain);
    const targetUrl = normalized ? `https://${normalized}` : "https://example.com";
    const typeAttr = installBadgeType === "carbon" ? "" : ` data-badge-type="${installBadgeType}"`;
    return `<div class="greentrace-badge" data-url="${targetUrl}" data-theme="auto"${typeAttr}></div>
<script src="https://api.greentracer.org/greentrace-badge.js" defer></script>`;
  };

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedCode());
    } catch {
      // Ignore clipboard failures in restricted browsers.
    }
  };

  const fetchLicenseStatus = async ({ domainInput, tokenInput, resetResult = false }) => {
    const cleanDomain = normalizeDomainInput(domainInput);
    const cleanToken = String(tokenInput || "").trim();
    if (!cleanDomain && !cleanToken) {
      throw new Error("Enter a domain or token to check license status.");
    }

    setLoading(true);
    setError("");
    if (resetResult) setResult(null);

    try {
      const query = new URLSearchParams();
      if (cleanDomain) query.set("domain", cleanDomain);
      if (cleanToken) query.set("token", cleanToken);
      const res = await fetch(`${API_BASE}/api/license/check?${query.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const details = data.details ? ` Details: ${data.details}` : "";
        throw new Error(`${data.error || "License check failed."}${details}`);
      }
      setResult(data);
      if (data?.domain) {
        setDomain(data.domain);
        setVerifyDomain(data.domain);
      }
      setVerifyResult(null);
      setVerifyError("");
      return data;
    } finally {
      setLoading(false);
    }
  };

  const runCheck = async (e) => {
    e?.preventDefault();
    try {
      await fetchLicenseStatus({ domainInput: domain, tokenInput: token, resetResult: true });
    } catch (err) {
      setError(err.message || "License check failed.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialDomain && !initialToken) return;

    let cancelled = false;
    const runInitialCheck = async () => {
      try {
        await fetchLicenseStatus({ domainInput: initialDomain, tokenInput: initialToken, resetResult: true });
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "License check failed.");
        }
      }
    };

    runInitialCheck();
    return () => {
      cancelled = true;
    };
  }, [initialDomain, initialToken]);

  useEffect(() => {
    if (!checkoutSuccess || !initialDomain) return;

    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 8;

    const poll = async () => {
      if (cancelled) return;
      attempt += 1;
      try {
        const data = await fetchLicenseStatus({ domainInput: initialDomain, tokenInput: "", resetResult: attempt === 1 });
        const status = String(data?.status || "").toLowerCase();
        if (["active", "trial", "charity", "partner", "internal"].includes(status)) {
          if (!cancelled) {
            setCheckoutNotice("Payment confirmed and license is active.");
          }
          return;
        }

        if (attempt < maxAttempts) {
          if (!cancelled) {
            setCheckoutNotice("Payment received. Waiting for license activation confirmation...");
            window.setTimeout(poll, 2500);
          }
          return;
        }
        if (!cancelled) {
          setCheckoutNotice("Payment completed, but activation is still processing. Recheck status in a moment.");
        }
      } catch {
        if (attempt < maxAttempts && !cancelled) {
          window.setTimeout(poll, 2500);
          return;
        }
        if (!cancelled) {
          setCheckoutNotice("Payment completed. Use the status check below to confirm activation.");
        }
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [checkoutSuccess, initialDomain]);

  const runBadgeVerification = async (e) => {
    e?.preventDefault();
    const cleanDomain = normalizeDomainInput(effectiveDomain);
    if (!cleanDomain) {
      setVerifyError("Enter a valid domain to verify badge installation.");
      return;
    }
    setVerifyLoading(true);
    setVerifyError("");
    setVerifyResult(null);
    try {
      const query = new URLSearchParams({
        domain: cleanDomain,
        expectedBadgeType: installBadgeType,
      });
      const res = await fetch(`${API_BASE}/api/license/verify-badge?${query.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Badge verification failed.");
      setVerifyResult(data);
    } catch (err) {
      setVerifyError(err.message || "Badge verification failed.");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>License Status | GreenTracer</title>
        <meta
          name="description"
          content="Verify your GreenTracer license status by domain to confirm badge licensing and activation state."
        />
        <link rel="canonical" href="https://www.greentracer.org/license-status" />
      </Helmet>

      <section className="relative min-h-screen bg-slate-100/70 dark:bg-[#020f1e] py-14 px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-green-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-[22rem] w-[22rem] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl space-y-8">
          <header className="rounded-[2rem] border border-slate-200/90 dark:border-slate-700/70 bg-white/92 dark:bg-slate-900/80 p-7 sm:p-9 shadow-[0_18px_56px_-34px_rgba(15,23,42,0.5)]">
            <p className="inline-flex items-center gap-2 rounded-full border border-green-600/20 bg-green-600/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-green-700 dark:text-green-300">
              <FaShieldAlt />
              License Verification
            </p>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.08] text-slate-900 dark:text-white">
              Check GreenTracer License Status
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              Verify whether a domain is active, trial, charity-approved, partner-approved, suspended, or unlicensed.
            </p>
            {checkoutSuccess && (
              <p className="mt-4 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300">
                Payment completed. Confirm your license activation below.
              </p>
            )}
            {checkoutNotice && (
              <p className="mt-3 rounded-xl border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-900/30 px-4 py-3 text-sm text-sky-800 dark:text-sky-300">
                {checkoutNotice}
              </p>
            )}
          </header>

          <section className="rounded-3xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 p-7 sm:p-9 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
            <form onSubmit={runCheck} className="grid md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="md:col-span-2 h-12 px-4 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-12 inline-flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
              >
                {loading ? "Checking..." : "Check Status"}
              </button>
              <input
                type="text"
                placeholder="Optional token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="md:col-span-3 h-11 px-4 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </form>

            {error && (
              <p className="mt-4 text-sm text-rose-700 dark:text-rose-300">{error}</p>
            )}

            {result && (
              <div className="mt-6 space-y-5">
                <div className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${statusStyle}`}>
                  <FaCheckCircle className="mr-2 text-xs" />
                  Status: {result.status || "none"}
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                    <p className="text-slate-500 dark:text-slate-400">Domain</p>
                    <p className="font-medium text-slate-900 dark:text-white">{result.domain || normalizeDomainInput(domain) || "N/A"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                    <p className="text-slate-500 dark:text-slate-400">Licensed</p>
                    <p className="font-medium text-slate-900 dark:text-white">{result.licensed ? "Yes" : "No"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                    <p className="text-slate-500 dark:text-slate-400">Plan</p>
                    <p className="font-medium text-slate-900 dark:text-white">{result.plan || "N/A"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                    <p className="text-slate-500 dark:text-slate-400">License Type</p>
                    <p className="font-medium text-slate-900 dark:text-white">{result.licenseType || "N/A"}</p>
                  </div>
                </div>

                <p className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <FaInfoCircle />
                  Badge usage remains technically available; licensing state is for commercial verification and entitlement tracking.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  {actionLinks.map((action) =>
                    action.type === "internal" ? (
                      <Link
                        key={action.to}
                        to={action.to}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        {action.label}
                        <FaArrowRight className="text-xs" />
                      </Link>
                    ) : (
                      <a
                        key={action.to}
                        href={action.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-slate-100 px-5 py-2.5 text-sm font-semibold text-white dark:text-slate-900 hover:opacity-90 transition-all"
                      >
                        {action.label}
                        <FaArrowRight className="text-xs" />
                      </a>
                    )
                  )}
                </div>

                {showVerificationPanel && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Next Step: Install and Verify Your Member Badge
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      This badge confirms GreenTracer license membership only. It does not claim green hosting verification or performance certification.
                    </p>
                    {!hasMemberLicense && (
                      <p className="text-sm rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/25 px-3 py-2 text-amber-800 dark:text-amber-300">
                        Member badge eligibility requires an active, trial, charity, partner, or internal license status.
                      </p>
                    )}

                    <div className="grid sm:grid-cols-3 gap-3">
                      <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide sm:col-span-1">
                        Badge Type
                        <select
                          value={installBadgeType}
                          onChange={(e) => setInstallBadgeType(e.target.value)}
                          className="mt-1 h-10 w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-3 text-sm text-slate-900 dark:text-white"
                        >
                          <option value="member">Member (Recommended)</option>
                          <option value="carbon">Carbon</option>
                          <option value="hosting">Hosting</option>
                        </select>
                      </label>
                      <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide sm:col-span-2">
                        Domain to Verify
                        <input
                          type="text"
                          value={verifyDomain}
                          onChange={(e) => setVerifyDomain(e.target.value)}
                          placeholder="example.com"
                          className="mt-1 h-10 w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-3 text-sm text-slate-900 dark:text-white"
                        />
                      </label>
                    </div>

                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                        Embed Snippet
                      </p>
                      <pre className="text-xs whitespace-pre-wrap break-all text-slate-700 dark:text-slate-200">{getEmbedCode()}</pre>
                      <button
                        type="button"
                        onClick={copyEmbedCode}
                        className="mt-3 inline-flex items-center rounded-full bg-slate-900 dark:bg-slate-100 px-4 py-2 text-xs font-semibold text-white dark:text-slate-900"
                      >
                        Copy Embed Code
                      </button>
                    </div>

                    <form onSubmit={runBadgeVerification} className="space-y-3">
                      <button
                        type="submit"
                        disabled={verifyLoading}
                        className="inline-flex items-center rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                      >
                        {verifyLoading ? "Verifying..." : "Verify Badge Connection"}
                      </button>

                      {verifyError && (
                        <p className="text-sm text-rose-700 dark:text-rose-300">{verifyError}</p>
                      )}

                      {verifyResult && (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-sm space-y-2">
                          <p className="font-medium text-slate-900 dark:text-white">
                            Status:{" "}
                            {verifyResult.state === "connected"
                              ? "Connected"
                              : verifyResult.state === "not_detected"
                                ? "Not detected"
                                : "Needs review"}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">
                            {verifyResult.state === "connected" && "GreenTracer embed script and badge container were detected with the expected badge type."}
                            {verifyResult.state === "not_detected" && "No GreenTracer badge embed was detected on the checked page."}
                            {verifyResult.state === "needs_review" && "GreenTracer embed markup was partially detected or did not match the expected setup."}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400">
                            Detected badge types: {Array.isArray(verifyResult.detectedBadgeTypes) && verifyResult.detectedBadgeTypes.length > 0 ? verifyResult.detectedBadgeTypes.join(", ") : "none"}
                          </p>
                          {Array.isArray(verifyResult.issues) && verifyResult.issues.length > 0 && (
                            <p className="text-slate-500 dark:text-slate-400">
                              Checks: {verifyResult.issues.map((issue) => ISSUE_LABELS[issue] || issue).join(" ")}
                            </p>
                          )}
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </section>
    </>
  );
}
