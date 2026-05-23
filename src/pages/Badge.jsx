import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRightLeft,
  Copy,
  Globe,
  Leaf,
  LockKeyhole,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";
import GreenTracerBadgePreview from "../components/badges/GreenTracerBadgePreview";
import { buildBadgeEmbedCode } from "../lib/badges/embed";
import { getDefaultBadgeAccent, normalizeBadgeType } from "../lib/badges/formatters";

const BADGE_OPTIONS = [
  {
    type: "carbon_tested",
    icon: Globe,
    label: "Carbon Tested",
    access: "Free, public, no login",
    description:
      "Open badge for any site that has been checked or wants a clean fallback badge while report data loads.",
    gradient: "from-emerald-500 to-emerald-700",
  },
  {
    type: "green_hosting",
    icon: Leaf,
    label: "Green Hosting",
    access: "Free, public, no login",
    description:
      "Shows detected green hosting when report data confirms it, otherwise renders a neutral public badge.",
    gradient: "from-lime-500 to-emerald-500",
  },
  {
    type: "greentracer_verified",
    icon: ShieldCheck,
    label: "GreenTracer Verified",
    access: "Paid/licensed account badge",
    description:
      "Requires an active paid, trial, or manual licence. Styling is previewable before activation.",
    gradient: "from-sky-500 to-emerald-500",
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
    return raw
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0]
      .toLowerCase();
  }
}

function extractResultSlug(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const direct = raw.match(/(?:^|\/)result\/([a-z0-9-]{3,220})(?:[/#?]|$)/i);
  if (direct) return direct[1].toLowerCase().replace(/-+$/u, "");
  if (/^[a-z0-9-]{3,220}$/i.test(raw) && raw.includes("-")) {
    return raw.toLowerCase().replace(/-+$/u, "");
  }
  return "";
}

function getPublicLookupMessage(type, badge, fallback = "") {
  if (fallback) return fallback;
  if (!badge) return "No report data loaded. The badge still renders with a clean fallback.";
  if (badge.publicStatus === "active") {
    return "Report data loaded. Snippet links to the saved public result.";
  }
  if (type === "green_hosting") {
    return "Green hosting is unknown or not detected. The badge remains a neutral public badge.";
  }
  return "No saved public report found yet. The badge still renders.";
}

function getVerifiedToken(badge) {
  return String(badge?.token || "").trim();
}

function getBadgeTarget(origin, { isPublicBadge, publicBadge = null, verifiedBadge = null }) {
  const base = String(origin || "").replace(/\/+$/, "");
  if (isPublicBadge) {
    if (publicBadge?.reportUrl) return publicBadge.reportUrl;
    if (publicBadge?.resultSlug) return `${base}/result/${encodeURIComponent(publicBadge.resultSlug)}`;
    if (publicBadge?.domain) return `${base}/result?domain=${encodeURIComponent(publicBadge.domain)}`;
    return `${base}/result`;
  }

  return verifiedBadge?.verificationUrl || `${base}/pricing`;
}

export default function Badge() {
  const [searchParams] = useSearchParams();
  const {
    user,
    configured,
    loading: authLoading,
    getValidAccessToken,
    logout,
  } = useAuth();

  const initialType = normalizeBadgeType(
    paramValue(searchParams, "type", "badgeType") || "carbon_tested"
  );
  const initialSlug = paramValue(searchParams, "result", "slug", "resultSlug");
  const initialDomain = normalizeDomainInput(paramValue(searchParams, "domain", "site", "url"));

  const [badgeType, setBadgeType] = useState(initialType);
  const [domainInput, setDomainInput] = useState(initialDomain);
  const [reportInput, setReportInput] = useState(initialSlug ? `/result/${initialSlug}` : initialDomain);
  const [showReportLookup, setShowReportLookup] = useState(Boolean(initialSlug));
  const [publicBadge, setPublicBadge] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupMessage, setLookupMessage] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(
    paramValue(searchParams, "bg", "background") || "#07111f"
  );
  const [accentColor, setAccentColor] = useState(
    paramValue(searchParams, "accent") || getDefaultBadgeAccent(initialType)
  );
  const [copied, setCopied] = useState(false);
  const [badge, setBadge] = useState(null);
  const [loadingBadge, setLoadingBadge] = useState(false);
  const [error, setError] = useState("");
  const [siteBase] = useState(() =>
    String(
      typeof window !== "undefined" ? window.location.origin : "https://www.greentracer.org"
    )
  );

  const selectedOption = BADGE_OPTIONS.find((option) => option.type === badgeType) || BADGE_OPTIONS[0];
  const isPublicBadge = badgeType !== "greentracer_verified";
  const authenticated = Boolean(user);
  const verifiedActive = !isPublicBadge && badge?.state === "active" && getVerifiedToken(badge);
  const badgeDomain =
    publicBadge?.domain || domainInput || normalizeDomainInput(reportInput) || badge?.domain || "example.com";

  const previewStatus = isPublicBadge
    ? (publicBadge?.publicStatus || (badgeType === "green_hosting" ? "green_hosting_not_detected" : "active"))
    : (verifiedActive ? "active" : authenticated ? "pending" : "not_active");

  const previewValue = isPublicBadge
    ? (publicBadge?.valueText || "")
    : "";

  const reportSlug = isPublicBadge ? publicBadge?.resultSlug || extractResultSlug(reportInput) : "";

  const previewHref = useMemo(
    () =>
      getBadgeTarget(siteBase, {
        isPublicBadge,
        publicBadge,
        verifiedBadge: badge,
      }),
    [badge, isPublicBadge, publicBadge, siteBase]
  );

  const publicSnippet = useMemo(
    () =>
      buildBadgeEmbedCode({
        badgeType,
        domain: publicBadge?.domain || domainInput,
        resultSlug: reportSlug,
        apiBase: API_BASE,
        backgroundColor,
        accentColor,
      }),
    [accentColor, backgroundColor, badgeType, domainInput, publicBadge?.domain, reportSlug]
  );

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
        ? `${API_BASE}/api/badge/result/${encodeURIComponent(slug)}/data?${new URLSearchParams({
            type: badgeType,
          }).toString()}`
        : `${API_BASE}/api/badge/result/latest/data?${new URLSearchParams({
            type: badgeType,
            domain,
          }).toString()}`;

      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load report data.");

      setPublicBadge(data);
      if (data.domain) setDomainInput(data.domain);
      setLookupMessage(getPublicLookupMessage(badgeType, data));
    } catch (err) {
      setPublicBadge(null);
      setLookupMessage(
        getPublicLookupMessage(
          badgeType,
          null,
          err.message || "Report lookup failed. The badge will still render with your selected styling."
        )
      );
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

  const ActiveIcon = selectedOption.icon;

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

      <div className="min-h-screen bg-slate-100/70 text-slate-900 transition-colors duration-300 dark:bg-[#020f1e] dark:text-white">
        <section className="border-b border-slate-200 bg-white px-5 py-10 sm:px-6 dark:border-slate-800 dark:bg-[#020f1e]">
          <div className="mx-auto max-w-6xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <Sparkles size={12} className="text-emerald-500" aria-hidden="true" />
              Trust badge builder
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Build and copy your badge embed
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              Choose a badge type, pick colours, and copy the snippet. Carbon Tested and Green Hosting are public
              and fail open; GreenTracer Verified is the only badge that needs an account licence.
            </p>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="grid gap-3 md:grid-cols-3">
              {BADGE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const active = badgeType === option.type;
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => chooseBadgeType(option.type)}
                    className={`group relative overflow-hidden rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-green-500 bg-green-50 text-green-950 shadow-[0_18px_44px_-34px_rgba(16,185,129,.65)] dark:border-green-400/70 dark:bg-green-900/20 dark:text-green-100"
                        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span
                        className={`block h-full w-full bg-gradient-to-br ${option.gradient} opacity-10`}
                        aria-hidden="true"
                      />
                    </span>
                    <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-green-300/70 bg-green-50 text-green-700 transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3 dark:border-green-300/30 dark:bg-slate-900 dark:text-green-200">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <span className="relative mt-3 block text-base font-bold">{option.label}</span>
                    <span className="relative mt-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {option.access}
                    </span>
                    <span className="relative mt-2 block text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_390px]">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_18px_56px_-38px_rgba(15,23,42,0.5)] dark:border-slate-700 dark:bg-slate-900 sm:p-6">
                <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Badge preview</p>
                    <h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">{selectedOption.label}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {selectedOption.description}
                    </p>
                    <div className="mt-4 inline-flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <ScanLine size={12} aria-hidden="true" />
                        Live preview
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <ActiveIcon size={12} aria-hidden="true" />
                        {badgeType === "greentracer_verified" ? "Entitlement controlled" : "Result-backed"}
                      </span>
                    </div>
                  </div>

                  <div className="flex min-h-[176px] items-center justify-center rounded-xl border border-slate-200 bg-slate-950 p-6 dark:border-slate-700">
                    <div className="w-full max-w-[240px] origin-center scale-100 sm:scale-110">
                      <GreenTracerBadgePreview
                        status={previewStatus}
                        badgeType={badgeType}
                        domain={badgeDomain}
                        valueText={previewValue}
                        href={previewHref}
                        customColors={{ backgroundColor, accentColor }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Background colour
                    <div className="mt-2 flex gap-2">
                      <input
                        type="color"
                        value={colorInputValue(backgroundColor, "#07111f")}
                        onChange={(event) => setBackgroundColor(event.target.value)}
                        className="h-11 w-14 rounded-md border border-slate-300 bg-white p-1 dark:border-slate-600 dark:bg-slate-800"
                        aria-label="Background colour"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(event) => setBackgroundColor(event.target.value)}
                        className="h-11 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        aria-label="Hex background colour"
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
                        className="h-11 w-14 rounded-md border border-slate-300 bg-white p-1 dark:border-slate-600 dark:bg-slate-800"
                        aria-label="Accent colour"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(event) => setAccentColor(event.target.value)}
                        className="h-11 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        aria-label="Hex accent colour"
                      />
                    </div>
                  </label>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Colour inputs are validated and kept readable in fallback view.
                </p>
              </section>

              <aside className="space-y-5">
                {isPublicBadge ? (
                  <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                    <h2 className="text-lg font-bold text-slate-950 dark:text-white">Public badge settings</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Login and licence are not required. Add a domain only if you want the badge to link to a site report.
                    </p>

                    <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Domain (optional)
                      <input
                        type="text"
                        value={domainInput}
                        onChange={(event) => {
                          setDomainInput(normalizeDomainInput(event.target.value));
                          setPublicBadge(null);
                          setCopied(false);
                        }}
                        placeholder="example.com"
                        className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowReportLookup((value) => !value)}
                      className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors dark:border-slate-600 dark:text-slate-200"
                    >
                      <ArrowRightLeft size={15} className="mr-2" aria-hidden="true" />
                      {showReportLookup ? "Hide saved report" : "Use a saved report"}
                    </button>

                    <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Advanced: load report data by result URL or domain. The badge still renders if lookup fails.
                    </p>

                    {showReportLookup && (
                      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
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
                            className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={loadPublicBadge}
                          disabled={lookupLoading}
                          className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
                        >
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
                    <pre className="mt-4 max-h-[240px] overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                      {snippet}
                    </pre>
                  </section>
                ) : (
                  <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <LockKeyhole size={17} aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                          {verifiedActive ? "Verified badge ready" : "Verified badge locked"}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          GreenTracer Verified is account-backed and controlled by licence state.
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
                        <pre className="mt-4 max-h-[240px] overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                          {snippet}
                        </pre>
                        <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-300">
                          Keep this embed beside the verified site claim block to maintain consistency.
                        </p>
                      </>
                    ) : (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          to={authenticated ? "/dashboard" : "/pricing"}
                          className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                        >
                          {authenticated ? "Open dashboard" : "View plans"}
                        </Link>
                        <Link
                          to="/pricing"
                          className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                        >
                          Upgrade now
                        </Link>
                      </div>
                    )}

                    {loadingBadge || authLoading ? (
                      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Checking badge entitlement…</p>
                    ) : null}

                    {error && (
                      <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-900/25 dark:text-rose-300">
                        {error}
                      </p>
                    )}

                    {!configured && (
                      <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/25 dark:text-amber-300">
                        Public badge snippets remain available without login.
                      </p>
                    )}
                  </section>
                )}

                <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-green-50 via-white to-emerald-50 p-5 text-sm text-slate-700 shadow-[0_12px_34px_-30px_rgba(16,185,129,.45)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <p className="font-semibold text-slate-900 dark:text-white">Copy flow</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Add the{' '}
                    <code className="rounded bg-slate-900/5 px-1.5 py-0.5 dark:bg-white/10">.greentrace-badge</code>{' '}
                    container and script to any page. Public badges auto-load and link to report pages.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
