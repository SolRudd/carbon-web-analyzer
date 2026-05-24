import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRightLeft,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  Globe,
  Leaf,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
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
    label: "Carbon Result",
    access: "Free public badge",
    description:
      "Works without login or licence. Uses saved report data to show the public carbon grade when available.",
    gradient: "from-emerald-500 to-emerald-700",
  },
  {
    type: "green_hosting",
    icon: Leaf,
    label: "Green Hosting",
    access: "Free public badge",
    description:
      "Shows detected green hosting from report data. If evidence is unavailable, it renders a neutral checked state.",
    gradient: "from-lime-500 to-emerald-500",
  },
  {
    type: "greentracer_verified",
    icon: ShieldCheck,
    label: "GreenTracer Verified",
    access: "Account/licence badge",
    description:
      "Requires an active paid licence, manual trial, or manual approval.",
    gradient: "from-sky-500 to-emerald-500",
  },
];

const badgePageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');

  .gt-badge-builder {
    --gt-bg: #020b13;
    --gt-bg-deep: #01070d;
    --gt-panel: #071423;
    --gt-panel-soft: #0b1b2c;
    --gt-border: rgba(132, 204, 200, 0.18);
    --gt-text: #f5fbff;
    --gt-muted: #8fa6b8;
    --gt-dim: #5f7285;
    --gt-green: #00d084;
    --gt-teal: #00a19d;
    --gt-cyan: #4dd8ff;
    font-family: 'Inter', sans-serif;
  }

  .gt-badge-display {
    font-family: 'Fraunces', serif;
    letter-spacing: 0;
  }

  .gt-badge-mono {
    font-family: 'JetBrains Mono', monospace;
  }

  .gt-badge-bg {
    background:
      radial-gradient(circle at 72% 8%, rgba(0, 208, 132, 0.14), transparent 30%),
      radial-gradient(circle at 12% 12%, rgba(77, 216, 255, 0.08), transparent 32%),
      linear-gradient(180deg, #020b13 0%, #01070d 100%);
  }

  @keyframes gt-badge-float-card {
    0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--rotate, 0deg)); }
    50% { transform: translate3d(0, -8px, 0) rotate(var(--rotate, 0deg)); }
  }

  .gt-badge-float-card {
    animation: gt-badge-float-card 7s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .gt-badge-float-card {
      animation: none !important;
    }
  }
`;

function SignalMesh({ className = "" }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 900 520"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="badgeSignalGlow" cx="52%" cy="48%" r="54%">
          <stop offset="0%" stopColor="#00d084" stopOpacity="0.22" />
          <stop offset="58%" stopColor="#00a19d" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#020b13" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="900" height="520" fill="url(#badgeSignalGlow)" />
      <g fill="none" strokeWidth="1">
        <path d="M18 338 C188 240 302 276 436 330 S660 424 890 246" stroke="rgba(0,208,132,0.18)" />
        <path d="M60 392 C220 296 332 338 488 390 S712 452 880 342" stroke="rgba(77,216,255,0.1)" />
        <path d="M168 154 L302 214 L430 176 L572 238 L724 168" stroke="rgba(0,208,132,0.16)" />
        <path d="M112 214 C256 112 526 96 742 198" stroke="rgba(0,208,132,0.12)" strokeDasharray="5 12" />
        <path d="M92 264 C268 172 514 160 822 278" stroke="rgba(0,161,157,0.12)" strokeDasharray="3 10" />
      </g>
      <g fill="#00d084">
        <circle cx="302" cy="214" r="3" opacity="0.48" />
        <circle cx="430" cy="176" r="2.5" opacity="0.36" />
        <circle cx="572" cy="238" r="3" opacity="0.48" />
        <circle cx="724" cy="168" r="2.5" opacity="0.38" />
      </g>
    </svg>
  );
}

function MiniHeroBadge({ className = "", type, delay = "0s" }) {
  const preview =
    type === "carbon"
      ? { badgeType: "carbon_tested", status: "active", valueText: "Grade B" }
      : type === "hosting"
        ? { badgeType: "green_hosting", status: "active", valueText: "" }
        : { badgeType: "greentracer_verified", status: "active", valueText: "" };

  return (
    <div
      className={`gt-badge-float-card absolute rounded-2xl border border-[rgba(132,204,200,0.24)] bg-[#071423]/88 p-3 shadow-[0_22px_60px_-34px_rgba(0,208,132,0.9)] backdrop-blur ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden="true"
    >
      <GreenTracerBadgePreview {...preview} />
    </div>
  );
}

function BadgeHeroVisual() {
  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] border border-[rgba(132,204,200,0.18)] bg-[linear-gradient(145deg,rgba(7,20,35,0.76),rgba(1,7,13,0.5))] shadow-[0_30px_110px_-70px_rgba(0,208,132,0.86)] sm:min-h-[320px]">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(132,204,200,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(132,204,200,0.055)_1px,transparent_1px)] [background-size:24px_24px]" />
      <SignalMesh className="opacity-85" />
      <div className="absolute inset-x-[-12%] bottom-[-34%] h-[78%] rounded-[100%] border-t border-[#00d084]/55 bg-[radial-gradient(ellipse_at_center,rgba(0,208,132,0.18),transparent_62%)] shadow-[0_-28px_110px_-72px_rgba(0,208,132,1)]" aria-hidden="true" />
      <MiniHeroBadge className="left-[7%] top-[13%] [--rotate:-4deg]" type="carbon" />
      <MiniHeroBadge className="right-[6%] top-[24%] hidden [--rotate:5deg] sm:block" type="hosting" delay=".9s" />
      <MiniHeroBadge className="bottom-[16%] left-1/2 -translate-x-1/2 [--rotate:0deg]" type="verified" delay="1.6s" />
    </div>
  );
}

function PanelHeader({ icon, title, copy }) {
  const HeaderIcon = icon;
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-[#8df8ce]">
        <HeaderIcon size={20} aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-xl font-semibold text-[#f5fbff]">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[#8fa6b8]">{copy}</p>
      </div>
    </div>
  );
}

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
  const [previewTheme, setPreviewTheme] = useState("dark");
  const [cornerRadius, setCornerRadius] = useState(10);
  const [borderStyle, setBorderStyle] = useState("solid");
  const [showIcon, setShowIcon] = useState(true);
  const [copied, setCopied] = useState(false);
  const [badge, setBadge] = useState(null);
  const [loadingBadge, setLoadingBadge] = useState(false);
  const [error, setError] = useState("");
  const [siteBase] = useState(() =>
    String(
      typeof window !== "undefined" ? window.location.origin : "https://www.greentracer.org"
    )
  );

  const isPublicBadge = badgeType !== "greentracer_verified";
  const authenticated = Boolean(user);
  const verifiedActive = !isPublicBadge && badge?.state === "active" && getVerifiedToken(badge);
  const badgeDomain =
    publicBadge?.domain || domainInput || normalizeDomainInput(reportInput) || badge?.domain || "example.com";

  const previewStatus = isPublicBadge
    ? (publicBadge?.publicStatus || (badgeType === "green_hosting" ? "green_hosting_not_detected" : "active"))
    : (verifiedActive ? "active" : "pending");

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

  const applyPreviewTheme = (theme) => {
    setPreviewTheme(theme);
    setBackgroundColor(theme === "light" ? "#f8fafc" : "#07111f");
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

  const snippetPreview = snippet || `<div
  class="greentrace-badge"
  data-badge-type="greentracer_verified"
  data-public-token="gtb_xxxxx"
></div>
<script src="${API_BASE}/greentrace-badge.js" async></script>`;
  const verifiedPlanPath = "/pricing";
  const manageDomainPath = authenticated ? "/dashboard" : "/login";

  return (
    <>
      <Helmet>
        <title>Badge Builder | GreenTracer</title>
        <meta
          name="description"
          content="Create Carbon Result, Green Hosting, and GreenTracer Verified badge snippets."
        />
        <link rel="canonical" href="https://www.greentracer.org/badge" />
      </Helmet>

      <style>{badgePageStyles}</style>

      <div className="gt-badge-builder gt-badge-bg relative min-h-screen overflow-hidden text-[#f5fbff]">
        <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(245,251,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,251,255,0.035)_1px,transparent_1px)] [background-size:34px_34px]" />

        <section className="relative mx-auto max-w-[1440px] px-4 pb-8 pt-10 sm:px-6 lg:px-10 lg:pb-10 lg:pt-14">
          <div className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
            <div>
              <p className="gt-badge-mono inline-flex items-center gap-2 rounded-full border border-[#00d084]/24 bg-[#00d084]/10 px-3 py-1 text-[0.68rem] font-medium uppercase text-[#8df8ce]">
                <ShieldCheck size={12} aria-hidden="true" />
                GreenTracer Badge Builder
              </p>
              <h1 className="gt-badge-display mt-5 max-w-3xl text-4xl font-semibold leading-[0.98] text-[#f5fbff] sm:text-5xl lg:text-6xl">
                Create a <span className="text-[#00d084] italic">badge</span> snippet.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#b7c6d4]">
                Pick a badge, tune the colours, preview it, and copy the embed code. Public badges stay visible even when report lookup or install tracking is unavailable.
              </p>
            </div>
            <BadgeHeroVisual />
          </div>
        </section>

        <section className="relative mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-10">
          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-3">
              {BADGE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const active = badgeType === option.type;
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => chooseBadgeType(option.type)}
                    className={`group relative flex min-h-[248px] flex-col overflow-hidden rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d084]/50 sm:p-6 ${
                      active
                        ? "border-[#00d084]/70 bg-[linear-gradient(145deg,rgba(0,208,132,0.15),rgba(7,20,35,0.88))] shadow-[0_24px_80px_-52px_rgba(0,208,132,0.85)]"
                        : "border-[rgba(132,204,200,0.16)] bg-[linear-gradient(145deg,rgba(7,20,35,0.74),rgba(1,7,13,0.54))] hover:border-[rgba(0,208,132,0.38)]"
                    }`}
                  >
                    <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                      <span className={`block h-full w-full bg-gradient-to-br ${option.gradient} opacity-10`} aria-hidden="true" />
                    </span>
                    {active && (
                      <span className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#00d084] text-[#02110b]">
                        <Check size={15} aria-hidden="true" />
                      </span>
                    )}
                    <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00d084]/22 bg-[#00d084]/10 text-[#8df8ce] shadow-[0_18px_42px_-28px_rgba(0,208,132,0.9)]">
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <span className="relative mt-4 block text-lg font-semibold text-[#f5fbff]">{option.label}</span>
                    <span className="gt-badge-mono relative mt-2 block text-[0.68rem] font-medium uppercase tracking-[0.24em] text-[#b7c6d4]">
                      {option.access}
                    </span>
                    <span className="relative mt-4 block text-sm leading-7 text-[#8fa6b8]">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.88fr)]">
              <section className="relative overflow-hidden rounded-[1.75rem] border border-[rgba(132,204,200,0.18)] bg-[linear-gradient(145deg,rgba(7,20,35,0.84),rgba(1,7,13,0.68))] p-5 shadow-[0_24px_80px_-58px_rgba(77,216,255,0.48)] sm:p-6 lg:p-7">
                <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(132,204,200,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(132,204,200,0.055)_1px,transparent_1px)] [background-size:22px_22px]" />
                <div className="relative z-10">
                  <PanelHeader
                    icon={Eye}
                    title="Preview & customise"
                    copy="Live preview updates as you change the options."
                  />

                  <div className="mt-5 rounded-2xl border border-[rgba(132,204,200,0.16)] bg-[rgba(2,11,19,0.74)] p-4 sm:p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="gt-badge-mono text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#8fa6b8]">
                          Live preview
                        </p>
                        <p className="mt-1 text-sm text-[#5f7285]">Official 240 x 44 badge with GreenTracer mark.</p>
                      </div>
                      <span className="gt-badge-mono inline-flex w-fit rounded-full border border-[#00d084]/18 bg-[#00d084]/8 px-3 py-1 text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[#8df8ce]">
                        Embed ready
                      </span>
                    </div>
                    <div className={`mt-4 flex min-h-[142px] items-center justify-center rounded-2xl border p-5 sm:p-6 ${
                      previewTheme === "light"
                        ? "border-slate-200 bg-slate-50"
                        : "border-[rgba(132,204,200,0.14)] bg-[radial-gradient(circle_at_center,rgba(0,208,132,0.13),transparent_68%),#01070d]"
                    }`}>
                      <div className="w-full max-w-[260px] origin-center sm:scale-110">
                        <GreenTracerBadgePreview
                          status={previewStatus}
                          badgeType={badgeType}
                          domain={badgeDomain}
                          valueText={previewValue}
                          href={previewHref}
                          customColors={{ backgroundColor, accentColor }}
                          cornerRadius={cornerRadius}
                          borderStyle={borderStyle}
                          showIcon={showIcon}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                    <label className="block text-sm font-semibold text-[#dbe8ef] xl:col-span-3">
                      Background colour
                      <div className="mt-2 flex gap-2">
                        <input
                          type="color"
                          value={colorInputValue(backgroundColor, "#07111f")}
                          onChange={(event) => setBackgroundColor(event.target.value)}
                          className="h-11 w-14 rounded-xl border border-[rgba(132,204,200,0.2)] bg-[#020b13] p-1"
                          aria-label="Background colour"
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={(event) => setBackgroundColor(event.target.value)}
                          className="h-11 min-w-0 flex-1 rounded-xl border border-[rgba(132,204,200,0.18)] bg-[rgba(2,11,19,0.78)] px-3 text-sm font-normal text-[#f5fbff] outline-none focus:border-[#00d084]/60"
                          aria-label="Hex background colour"
                        />
                      </div>
                    </label>

                    <label className="block text-sm font-semibold text-[#dbe8ef] xl:col-span-3">
                      Accent colour
                      <div className="mt-2 flex gap-2">
                        <input
                          type="color"
                          value={colorInputValue(accentColor, getDefaultBadgeAccent(badgeType))}
                          onChange={(event) => setAccentColor(event.target.value)}
                          className="h-11 w-14 rounded-xl border border-[rgba(132,204,200,0.2)] bg-[#020b13] p-1"
                          aria-label="Accent colour"
                        />
                        <input
                          type="text"
                          value={accentColor}
                          onChange={(event) => setAccentColor(event.target.value)}
                          className="h-11 min-w-0 flex-1 rounded-xl border border-[rgba(132,204,200,0.18)] bg-[rgba(2,11,19,0.78)] px-3 text-sm font-normal text-[#f5fbff] outline-none focus:border-[#00d084]/60"
                          aria-label="Hex accent colour"
                        />
                      </div>
                    </label>

                    <div className="xl:col-span-2">
                      <p className="text-sm font-semibold text-[#dbe8ef]">Theme</p>
                      <div className="mt-2 grid grid-cols-2 rounded-xl border border-[rgba(132,204,200,0.18)] bg-[rgba(2,11,19,0.78)] p-1">
                        {["dark", "light"].map((theme) => (
                          <button
                            key={theme}
                            type="button"
                            onClick={() => applyPreviewTheme(theme)}
                            className={`h-9 rounded-lg text-sm font-semibold capitalize transition ${
                              previewTheme === theme ? "bg-[#00d084] text-[#02110b]" : "text-[#8fa6b8] hover:text-[#f5fbff]"
                            }`}
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="block text-sm font-semibold text-[#dbe8ef] xl:col-span-2">
                      Corner radius
                      <div className="mt-2 flex h-11 items-center gap-3 rounded-xl border border-[rgba(132,204,200,0.18)] bg-[rgba(2,11,19,0.78)] px-3">
                        <input
                          type="range"
                          min="6"
                          max="18"
                          value={cornerRadius}
                          onChange={(event) => setCornerRadius(Number(event.target.value))}
                          className="min-w-0 flex-1 accent-[#00d084]"
                        />
                        <span className="gt-badge-mono w-10 text-right text-xs text-[#b7c6d4]">{cornerRadius}px</span>
                      </div>
                    </label>

                    <label className="block text-sm font-semibold text-[#dbe8ef] xl:col-span-1">
                      Border style
                      <select
                        value={borderStyle}
                        onChange={(event) => setBorderStyle(event.target.value)}
                        className="mt-2 h-11 w-full rounded-xl border border-[rgba(132,204,200,0.18)] bg-[rgba(2,11,19,0.78)] px-3 text-sm font-normal text-[#f5fbff] outline-none focus:border-[#00d084]/60"
                      >
                        <option value="solid">Subtle</option>
                        <option value="dashed">Dashed</option>
                        <option value="none">None</option>
                      </select>
                    </label>

                    <label className="flex h-11 items-center justify-between rounded-xl border border-[rgba(132,204,200,0.18)] bg-[rgba(2,11,19,0.78)] px-3 text-sm font-semibold text-[#dbe8ef] xl:col-span-1 xl:mt-[1.85rem]">
                      Show icon
                      <input
                        type="checkbox"
                        checked={showIcon}
                        onChange={(event) => setShowIcon(event.target.checked)}
                        className="h-5 w-5 rounded border-[rgba(132,204,200,0.3)] text-[#00d084] focus:ring-[#00d084]"
                      />
                    </label>
                  </div>

                  <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#8fa6b8]">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#00d084]" aria-hidden="true" />
                    Colour guardrails keep badge text readable if a selected colour is too low contrast.
                  </p>
                </div>
              </section>

              <aside className="relative overflow-hidden rounded-[1.75rem] border border-[rgba(132,204,200,0.18)] bg-[linear-gradient(145deg,rgba(7,20,35,0.84),rgba(1,7,13,0.68))] p-5 shadow-[0_24px_80px_-58px_rgba(0,208,132,0.42)] sm:p-6 lg:p-7">
                <div className="pointer-events-none absolute right-0 top-0 h-56 w-72 bg-[radial-gradient(circle_at_70%_20%,rgba(0,208,132,0.14),transparent_62%)]" />
                <div className="relative z-10">
                  <PanelHeader
                    icon={Code2}
                    title="Get your snippet"
                    copy="Add your domain and copy the embed code."
                  />

                  <label className="mt-5 block text-sm font-semibold text-[#dbe8ef]">
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
                      className="mt-2 h-11 w-full rounded-xl border border-[rgba(132,204,200,0.18)] bg-[rgba(2,11,19,0.78)] px-3 text-sm font-normal text-[#f5fbff] outline-none placeholder:text-[#5f7285] focus:border-[#00d084]/60"
                    />
                  </label>

                  {isPublicBadge ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowReportLookup((value) => !value)}
                        className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[rgba(132,204,200,0.22)] bg-white/[0.025] px-4 text-sm font-semibold text-[#dbe8ef] transition hover:border-[#00d084]/45 hover:bg-[#00d084]/8 hover:text-[#f5fbff]"
                      >
                        <ArrowRightLeft size={15} aria-hidden="true" />
                        {showReportLookup ? "Hide saved report" : "Use a saved report"}
                      </button>

                      {showReportLookup && (
                        <div className="mt-4 rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[rgba(2,11,19,0.58)] p-4">
                          <label className="block text-sm font-semibold text-[#dbe8ef]">
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
                              className="mt-2 h-11 w-full rounded-xl border border-[rgba(132,204,200,0.18)] bg-[rgba(2,11,19,0.78)] px-3 text-sm font-normal text-[#f5fbff] outline-none placeholder:text-[#5f7285] focus:border-[#00d084]/60"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={loadPublicBadge}
                            disabled={lookupLoading}
                            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#02110b] disabled:opacity-60"
                          >
                            {lookupLoading ? "Loading..." : "Load report data"}
                          </button>
                          {(publicBadge || lookupMessage) && (
                            <p className="mt-3 text-sm leading-6 text-[#8fa6b8]">
                              {getPublicLookupMessage(badgeType, publicBadge, lookupMessage)}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-[#00d084]/18 bg-[#00d084]/8 p-4">
                      <div className="flex items-start gap-3">
                        <LockKeyhole size={18} className="mt-0.5 shrink-0 text-[#00d084]" aria-hidden="true" />
                        <p className="text-sm leading-6 text-[#b7c6d4]">
                          {verifiedActive
                            ? "Your account-backed Verified snippet is ready to copy."
                            : "GreenTracer Verified needs an active licence, manual trial, or manual approval before the live snippet can be copied."}
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={copySnippet}
                    disabled={!canCopySnippet || !snippet}
                    className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00d084] px-4 text-sm font-semibold text-[#02110b] transition hover:bg-[#27e39d] disabled:cursor-not-allowed disabled:bg-[#123529] disabled:text-[#8fa6b8]"
                  >
                    <Copy size={16} aria-hidden="true" />
                    {copied ? "Copied" : verifiedActive ? "Copy verified snippet" : "Copy embed snippet"}
                  </button>

                  <div className="mt-4 rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[#01070d] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
                    <div className="flex items-center justify-between border-b border-[rgba(132,204,200,0.1)] px-4 py-3">
                      <span className="gt-badge-mono text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[#8fa6b8]">
                        Embed code
                      </span>
                      <span className="h-1.5 w-20 rounded-full bg-[#00d084]/70" aria-hidden="true" />
                    </div>
                    <pre className="gt-badge-mono max-h-[260px] overflow-auto p-4 text-xs leading-6 text-[#dbe8ef]">
                    {snippetPreview}
                    </pre>
                  </div>

                  <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#8fa6b8]">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#00d084]" aria-hidden="true" />
                    Embed loads include a best-effort install ping for diagnostics. If tracking is blocked, the badge still renders.
                  </p>

                  {loadingBadge || authLoading ? (
                    <p className="mt-4 text-sm text-[#8fa6b8]">Checking Verified entitlement...</p>
                  ) : null}

                  {error && (
                    <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      Verified entitlement is unavailable right now. Public badges are still available.
                    </p>
                  )}

                  {!configured && (
                    <p className="mt-4 rounded-xl border border-amber-400/24 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                      Public badge snippets remain available without login.
                    </p>
                  )}
                </div>
              </aside>
            </div>

            <section className="grid gap-3 rounded-[1.4rem] border border-[rgba(132,204,200,0.16)] bg-[linear-gradient(145deg,rgba(7,20,35,0.72),rgba(1,7,13,0.52))] p-4 sm:grid-cols-3 sm:p-5">
              {[
                { icon: ShieldCheck, title: "Always visible", copy: "Public badges remain visible even when lookup or tracking is unavailable." },
                { icon: RefreshCw, title: "Smart fallbacks", copy: "Clean, readable fallbacks keep your badge trustworthy at all times." },
                { icon: Globe, title: "Works anywhere", copy: "Use your badge on any website, docs, store, or marketing asset." },
              ].map((item) => {
                const BenefitIcon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4 rounded-2xl p-2 transition hover:bg-white/[0.025]">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#00d084]/18 bg-[#00d084]/10 text-[#00d084]">
                      <BenefitIcon size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-[#f5fbff]">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#8fa6b8]">{item.copy}</p>
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="rounded-[1.4rem] border border-[rgba(132,204,200,0.16)] bg-[rgba(7,20,35,0.62)] p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#f5fbff]">Badge states / examples</h2>
                  <p className="mt-1 text-sm text-[#8fa6b8]">Compact states for QA, sales, and public installs.</p>
                </div>
                <span className="gt-badge-mono text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[#5f7285]">
                  Public labels only
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                {[
                  { title: "Carbon Result", type: "carbon_tested", status: "active", value: "Grade A", note: "Grade A" },
                  { title: "Carbon Result", type: "carbon_tested", status: "active", value: "Grade B", note: "Grade B" },
                  { title: "Green Hosting", type: "green_hosting", status: "active", value: "", note: "Detected" },
                  { title: "Green Hosting", type: "green_hosting", status: "green_hosting_not_detected", value: "", note: "Checked" },
                  { title: "Verified", type: "greentracer_verified", status: "active", value: "", note: "Licensed" },
                  { title: "Verified", type: "greentracer_verified", status: "pending", value: "", note: "Pending" },
                ].map((example) => (
                  <article key={`${example.type}-${example.status}-${example.value}`} className="flex min-h-[96px] flex-col items-center justify-center rounded-xl border border-[rgba(132,204,200,0.15)] bg-[rgba(2,11,19,0.56)] p-3">
                    <span className="gt-badge-mono mb-2 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#5f7285]">
                      {example.note}
                    </span>
                    <div className="max-w-full overflow-hidden">
                      <GreenTracerBadgePreview
                        status={example.status}
                        badgeType={example.type}
                        domain="example.com"
                        valueText={example.value}
                        customColors={null}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[1.75rem] border border-[rgba(132,204,200,0.18)] bg-[linear-gradient(145deg,rgba(7,20,35,0.84),rgba(1,7,13,0.66))] p-6 sm:p-8">
              <SignalMesh className="left-auto right-0 w-[62%] opacity-60" />
              <div className="relative z-10 grid gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-center">
                <div>
                  <p className="gt-badge-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#00d084]">
                    Get listed. Show your signals.
                  </p>
                  <h2 className="gt-badge-display mt-4 max-w-xl text-3xl font-semibold leading-tight text-[#f5fbff] sm:text-4xl">
                    Want your site listed in the GreenTracer directory?
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-[#b7c6d4]">
                    Verified supporters can publish a managed profile, display a GreenTracer Verified badge, and show their sustainability signals publicly. Verified is a supporter/member signal, not a perfect carbon score.
                  </p>
                  <ul className="mt-5 space-y-2 text-sm text-[#dbe8ef]">
                    {["Verified badge & public profile", "Display sustainability signals", "Build trust with customers"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check size={15} className="text-[#00d084]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link to={verifiedPlanPath} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#00d084] px-5 text-sm font-semibold text-[#02110b]">
                      Get verified
                      <ExternalLink size={15} aria-hidden="true" />
                    </Link>
                    <Link to="/pricing" className="inline-flex h-11 items-center justify-center rounded-xl border border-[rgba(132,204,200,0.24)] px-5 text-sm font-semibold text-[#dbe8ef]">
                      View verified plans
                    </Link>
                    <Link to={manageDomainPath} className="inline-flex h-11 items-center justify-center rounded-xl border border-[rgba(132,204,200,0.24)] px-5 text-sm font-semibold text-[#dbe8ef]">
                      Manage domain
                    </Link>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-[560px] rounded-2xl border border-[rgba(132,204,200,0.2)] bg-[rgba(2,11,19,0.82)] p-5 shadow-[0_24px_90px_-56px_rgba(0,208,132,0.9)]">
                  <div className="flex gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#5f7285]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#5f7285]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#5f7285]" />
                  </div>
                  <div className="mt-8 flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xl font-semibold text-[#f5fbff]">www.example.com</p>
                      <p className="mt-2 text-sm font-semibold text-[#00d084]">GreenTracer Verified</p>
                    </div>
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00d084]/24 bg-[#00d084]/10 text-[#00d084]">
                      <ShieldCheck size={28} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <GreenTracerBadgePreview status="active" badgeType="carbon_tested" valueText="Grade B" />
                    <GreenTracerBadgePreview status="active" badgeType="green_hosting" />
                    <GreenTracerBadgePreview status="active" badgeType="greentracer_verified" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}
