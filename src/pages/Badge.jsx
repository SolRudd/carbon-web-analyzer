import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, LockKeyhole, Search, ShieldCheck } from "lucide-react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";
import GreenTracerBadgePreview from "../components/badges/GreenTracerBadgePreview";
import { buildBadgeEmbedCode } from "../lib/badges/embed";
import { getDefaultBadgeAccent, normalizeBadgeType } from "../lib/badges/formatters";

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap');

  .gt-page { font-family: 'Inter', sans-serif; }
  .gt-mono { font-family: 'JetBrains Mono', monospace; }
`;

const BADGE_OPTIONS = [
  {
    type: "carbon_tested",
    label: "Carbon Tested",
    access: "Free public badge",
    description: "Works without login or licence. Uses report data when available, and renders a clean fallback when it is not.",
  },
  {
    type: "green_hosting",
    label: "Green Hosting",
    access: "Free public badge",
    description: "Shows detected green hosting from report data. If unknown or not detected, it renders a neutral checked state.",
  },
  {
    type: "greentracer_verified",
    label: "GreenTracer Verified",
    access: "Account/licence badge",
    description: "Requires an active paid licence, manual trial, or manual approval. This is the badge Stripe will later activate.",
  },
];

function paramValue(searchParams, ...keys) {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) return value;
  }
  return "";
}

function colorInputValue(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? value : fallback;
}

function normalizeDomainInput(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return parsed.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return raw.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0].toLowerCase();
  }
}

function extractResultSlug(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const direct = raw.match(/(?:^|\/)result\/([a-z0-9-]{3,220})(?:[/?#]|$)/i);
  if (direct) return direct[1].toLowerCase().replace(/-+$/, "");
  if (/^[a-z0-9-]{3,220}$/i.test(raw) && raw.includes("-")) return raw.toLowerCase().replace(/-+$/, "");
  return "";
}

function getPublicLookupMessage(type, badge, fallback = "") {
  if (fallback) return fallback;
  if (!badge) return "No report data loaded. The public badge will still render with a clean fallback.";
  if (badge.publicStatus === "active") return "Report data loaded. The snippet will link to the saved public result.";
  if (type === "green_hosting") return "Green hosting is not detected or not known. The badge will render a neutral checked state.";
  return "No saved public report was found. The badge will still render.";
}

function getVerifiedToken(badge) {
  return String(badge?.token || "").trim();
}

export default function Badge() {
  const [searchParams] = useSearchParams();
  const { user, configured, loading: authLoading, getValidAccessToken, logout } = useAuth();
  const initialType = normalizeBadgeType(paramValue(searchParams, "type", "badgeType") || "carbon_tested");
  const initialSlug = paramValue(searchParams, "result", "slug", "resultSlug");
  const initialDomain = normalizeDomainInput(paramValue(searchParams, "domain", "site", "url"));

  const [badgeType, setBadgeType] = useState(initialType);
  const [domainInput, setDomainInput] = useState(initialDomain);
  const [reportInput, setReportInput] = useState(initialSlug ? `/result/${initialSlug}` : initialDomain);
  const [showReportLookup, setShowReportLookup] = useState(Boolean(initialSlug));
  const [publicBadge, setPublicBadge] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupMessage, setLookupMessage] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(paramValue(searchParams, "bg", "background") || "#07111f");
  const [accentColor, setAccentColor] = useState(paramValue(searchParams, "accent") || getDefaultBadgeAccent(initialType));
  const [copied, setCopied] = useState(false);
  const [badge, setBadge] = useState(null);
  const [loadingBadge, setLoadingBadge] = useState(false);
  const [error, setError] = useState("");

  const selectedOption = BADGE_OPTIONS.find((option) => option.type === badgeType) || BADGE_OPTIONS[0];
  const isPublicBadge = badgeType !== "greentracer_verified";
  const authenticated = Boolean(user);
  const verifiedActive = !isPublicBadge && badge?.state === "active" && getVerifiedToken(badge);
  const badgeDomain = publicBadge?.domain || domainInput || normalizeDomainInput(reportInput) || badge?.domain || "example.com";
  const previewStatus = isPublicBadge
    ? (publicBadge?.publicStatus || (badgeType === "green_hosting" ? "green_hosting_not_detected" : "active"))
    : (verifiedActive ? "active" : authenticated ? "pending" : "not_active");
  const previewValue = isPublicBadge
    ? (publicBadge?.valueText || (badgeType === "carbon_tested" ? "Grade B" : ""))
    : "";
  const reportSlug = isPublicBadge ? publicBadge?.resultSlug || extractResultSlug(reportInput) : "";
  const publicSnippet = useMemo(() => buildBadgeEmbedCode({
    badgeType,
    domain: publicBadge?.domain || domainInput,
    resultSlug: reportSlug,
    apiBase: API_BASE,
    backgroundColor,
    accentColor,
  }), [accentColor, backgroundColor, badgeType, domainInput, publicBadge?.domain, reportSlug]);
  const verifiedSnippet = useMemo(() => {
    if (!verifiedActive) return "";
    return buildBadgeEmbedCode({
      badgeType: "greentracer_verified",
      token: getVerifiedToken(badge),
      domain: badge?.domain || domainInput,
      apiBase: API_BASE,
      backgroundColor,
      accentColor,
    });
  }, [accentColor, backgroundColor, badge, domainInput, verifiedActive]);
  const snippet = isPublicBadge ? publicSnippet : verifiedSnippet;
  const canCopySnippet = isPublicBadge || Boolean(verifiedSnippet);

  const fetchBadge = useCallback(async () => {
    if (!configured || !user) return;

    setLoadingBadge(true);
    setError("");
    try {
      const token = await getValidAccessToken();
      if (!token) throw new Error("Session expired. Please log in again.");
      const res = await fetch(`${API_BASE}/api/account/me/badge`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to load verified badge.");
      setBadge(data);
    } catch (err) {
      if (/invalid or expired auth token|missing bearer token|session expired/i.test(String(err.message || ""))) {
        await logout();
        return;
      }
      setError(err.message || "Failed to load verified badge.");
      setBadge(null);
    } finally {
      setLoadingBadge(false);
    }
  }, [configured, getValidAccessToken, logout, user]);

  useEffect(() => {
    fetchBadge();
  }, [fetchBadge]);

  const chooseBadgeType = (type) => {
    const nextType = normalizeBadgeType(type);
    setBadgeType(nextType);
    setAccentColor(getDefaultBadgeAccent(nextType));
    setCopied(false);
    setPublicBadge(null);
    setLookupMessage("");
  };

  const loadPublicBadge = useCallback(async () => {
    if (!isPublicBadge) return;
    const input = reportInput || domainInput;
    const slug = extractResultSlug(input);
    const domain = normalizeDomainInput(input);
    if (!slug && !domain) {
      setLookupMessage("Enter a result URL or domain to load saved report data.");
      setPublicBadge(null);
      return;
    }

    setLookupLoading(true);
    setLookupMessage("");
    try {
      const url = slug
        ? `${API_BASE}/api/badge/result/${encodeURIComponent(slug)}/data?${new URLSearchParams({ type: badgeType }).toString()}`
        : `${API_BASE}/api/badge/result/latest/data?${new URLSearchParams({ type: badgeType, domain }).toString()}`;
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load report data.");
      setPublicBadge(data);
      if (data.domain) setDomainInput(data.domain);
      setLookupMessage(getPublicLookupMessage(badgeType, data));
    } catch (err) {
      setPublicBadge(null);
      setLookupMessage(getPublicLookupMessage(badgeType, null, err.message || "Report lookup failed. The badge will still render."));
    } finally {
      setLookupLoading(false);
    }
  }, [badgeType, domainInput, isPublicBadge, reportInput]);

  const copySnippet = async () => {
    if (!canCopySnippet || !snippet) return;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Badge Builder | GreenTracer</title>
        <meta
          name="description"
          content="Create Carbon Tested, Green Hosting, and GreenTracer Verified badge snippets."
        />
        <link rel="canonical" href="https://www.greentracer.org/badge" />
      </Helmet>

      <div className="gt-page min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#020f1e] dark:text-white">
        <style>{pageStyles}</style>

        <section className="border-b border-slate-200 bg-white px-5 pb-8 pt-28 dark:border-slate-800 dark:bg-[#020f1e] sm:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <ShieldCheck size={13} className="text-green-600 dark:text-green-400" aria-hidden="true" />
              GreenTracer Badge Builder
            </p>
            <div className="mt-5 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Create a badge snippet.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                Pick a badge, tune the colours, preview it, and copy the embed code. Public badges stay visible even when report lookup or install tracking is unavailable.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-6">
          <div className="mx-auto max-w-6xl space-y-5">
            <div className="grid gap-3 md:grid-cols-3">
              {BADGE_OPTIONS.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => chooseBadgeType(option.type)}
                  className={`min-h-[132px] rounded-2xl border p-4 text-left transition ${
                    badgeType === option.type
                      ? "border-green-500 bg-green-50 text-green-950 shadow-sm dark:border-green-500 dark:bg-green-900/20 dark:text-green-100"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  }`}
                >
                  <span className="block text-base font-bold">{option.label}</span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {option.access}
                  </span>
                  <span className="mt-3 block text-sm leading-5 text-slate-600 dark:text-slate-300">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_390px]">
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_56px_-38px_rgba(15,23,42,0.5)] dark:border-slate-700 dark:bg-slate-900 sm:p-6">
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">{selectedOption.label}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedOption.description}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 dark:border-slate-700">
                    <p className="gt-mono mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Live preview</p>
                    <div className="flex min-h-[92px] items-center justify-center">
                      <GreenTracerBadgePreview
                        status={previewStatus}
                        badgeType={badgeType}
                        domain={badgeDomain}
                        valueText={previewValue}
                        customColors={{ backgroundColor, accentColor }}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Background colour
                      <div className="mt-2 flex gap-2">
                        <input
                          type="color"
                          value={colorInputValue(backgroundColor, "#07111f")}
                          onChange={(event) => setBackgroundColor(event.target.value)}
                          className="h-11 w-14 rounded border border-slate-300 bg-white p-1 dark:border-slate-600 dark:bg-slate-800"
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={(event) => setBackgroundColor(event.target.value)}
                          className="h-11 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </label>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Accent colour
                      <div className="mt-2 flex gap-2">
                        <input
                          type="color"
                          value={colorInputValue(accentColor, getDefaultBadgeAccent(badgeType))}
                          onChange={(event) => setAccentColor(event.target.value)}
                          className="h-11 w-14 rounded border border-slate-300 bg-white p-1 dark:border-slate-600 dark:bg-slate-800"
                        />
                        <input
                          type="text"
                          value={accentColor}
                          onChange={(event) => setAccentColor(event.target.value)}
                          className="h-11 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Colour guardrails keep badge text readable if a selected colour is too low contrast.
                  </p>
                </div>
              </section>

              <aside className="space-y-5">
                {isPublicBadge ? (
                  <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                    <h2 className="text-lg font-bold text-slate-950 dark:text-white">Snippet</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Domain is optional. Result data can be loaded later, but the badge will render either way.
                    </p>
                    <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Domain
                      <input
                        type="text"
                        value={domainInput}
                        onChange={(event) => {
                          setDomainInput(normalizeDomainInput(event.target.value));
                          setPublicBadge(null);
                          setCopied(false);
                        }}
                        placeholder="example.com"
                        className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowReportLookup((value) => !value)}
                      className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                    >
                      {showReportLookup ? "Hide saved report" : "Use a saved report"}
                    </button>

                    {showReportLookup && (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Result URL or domain
                          <input
                            type="text"
                            value={reportInput}
                            onChange={(event) => {
                              setReportInput(event.target.value);
                              setPublicBadge(null);
                              setLookupMessage("");
                            }}
                            placeholder="https://www.greentracer.org/result/example-com"
                            className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={loadPublicBadge}
                          disabled={lookupLoading}
                          className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
                        >
                          <Search size={15} aria-hidden="true" />
                          {lookupLoading ? "Loading..." : "Load report data"}
                        </button>
                        {(publicBadge || lookupMessage) && (
                          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {getPublicLookupMessage(badgeType, publicBadge, lookupMessage)}
                          </p>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={copySnippet}
                      className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
                    >
                      <Copy size={15} aria-hidden="true" />
                      {copied ? "Copied" : "Copy embed snippet"}
                    </button>
                    <pre className="gt-mono mt-4 max-h-[280px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                      {snippet}
                    </pre>
                  </section>
                ) : (
                  <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <LockKeyhole size={17} aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                          {verifiedActive ? "Verified badge ready" : "Verified badge locked"}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          GreenTracer Verified requires an account and an active paid licence, manual trial, or manual approval.
                        </p>
                      </div>
                    </div>
                    {verifiedActive ? (
                      <>
                        <button
                          type="button"
                          onClick={copySnippet}
                          className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
                        >
                          <Copy size={15} aria-hidden="true" />
                          {copied ? "Copied" : "Copy verified snippet"}
                        </button>
                        <pre className="gt-mono mt-4 max-h-[280px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                          {snippet}
                        </pre>
                      </>
                    ) : (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link to={authenticated ? "/dashboard" : "/pricing"} className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                          {authenticated ? "Open dashboard" : "View plans"}
                        </Link>
                        <Link to="/pricing" className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">
                          Pricing
                        </Link>
                      </div>
                    )}
                    {loadingBadge || authLoading ? (
                      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Checking account badge state...</p>
                    ) : null}
                    {error && (
                      <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-900/25 dark:text-rose-300">
                        {error}
                      </p>
                    )}
                    {!configured && (
                      <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/25 dark:text-amber-300">
                        Account auth is not configured here. Public Carbon Tested and Green Hosting snippets still work without login.
                      </p>
                    )}
                  </section>
                )}
              </aside>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
