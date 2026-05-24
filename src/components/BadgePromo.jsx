import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Check,
  ClipboardCopy,
  ExternalLink,
  Globe2,
  Leaf,
  Lock,
  ShieldCheck,
} from "lucide-react";
import GreenTracerBadge from "./badges/GreenTracerBadge";
import { API_BASE } from "../config";
import { buildBadgeEmbedCode } from "../lib/badges/embed";
import { getVerifiedDisplayStatus } from "../lib/reportDisplay";

const normalizeDomain = (raw) =>
  (() => {
    try {
      const value = String(raw || "").trim();
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      return url.hostname.replace(/^www\./i, "").toLowerCase();
    } catch {
      return String(raw || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .split("/")[0]
        .toLowerCase();
    }
  })();

function StatusPill({ status }) {
  const tones = {
    available: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
    pending: "border-amber-300/30 bg-amber-400/10 text-amber-100",
    neutral: "border-slate-300/20 bg-slate-400/10 text-slate-200",
    unavailable: "border-slate-300/20 bg-slate-400/10 text-slate-300",
  };

  return (
    <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${tones[status.tone] || tones.neutral}`}>
      {status.label}
    </span>
  );
}

function BadgeFrame({ children, tone = "green" }) {
  const tones = {
    green: "border-emerald-300/20 bg-emerald-400/10 text-emerald-300",
    cyan: "border-cyan-300/20 bg-cyan-400/10 text-cyan-200",
    slate: "border-slate-300/20 bg-slate-400/10 text-slate-200",
  };

  return (
    <div className={`inline-flex min-h-[88px] w-full items-center justify-center rounded-2xl border p-3 ${tones[tone] || tones.green}`}>
      {children}
    </div>
  );
}

function BadgeActionButton({ children, onClick, disabled = false, variant = "primary" }) {
  const variants = {
    primary: "border-emerald-300/30 bg-[#00d084] text-[#02110c] hover:bg-[#1de29d]",
    secondary: "border-white/15 bg-white/[0.035] text-white hover:border-emerald-300/40 hover:bg-white/[0.07]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] || variants.primary}`}
    >
      {children}
    </button>
  );
}

function BadgeCard({
  icon,
  title,
  description,
  status,
  preview,
  children,
  tone = "green",
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border gt-report-card p-5">
      <StatusPill status={status} />
      <div className="mt-5">
        <BadgeFrame tone={tone}>
          {preview || React.createElement(icon, { size: 34, "aria-hidden": true })}
        </BadgeFrame>
        <div className="mt-4 min-w-0">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#8fa6b8]">{description}</p>
        </div>
      </div>
      <div className="mt-auto pt-5">{children}</div>
    </article>
  );
}

export default function BadgePromo({ siteUrl, greenHost = false, resultSlug = "", grade = "", verifiedStatus = "inactive" }) {
  const [copied, setCopied] = useState("");
  const domain = useMemo(() => normalizeDomain(siteUrl), [siteUrl]);
  const reportHref = resultSlug ? `/result/${encodeURIComponent(resultSlug)}` : "";
  const hostingReportHref = reportHref ? `${reportHref}#result-breakdown` : "";
  const gradeText = grade && grade !== "N/A" ? `Grade ${grade}` : "";
  const verified = getVerifiedDisplayStatus(verifiedStatus);
  const builderParams = new URLSearchParams({
    result: resultSlug || "",
    domain: domain || "",
    green: greenHost ? "1" : "0",
  });
  const carbonBuilderHref = `/badge?type=carbon_tested&${builderParams.toString()}`;
  const greenBuilderHref = `/badge?type=green_hosting&${builderParams.toString()}`;
  const carbonSnippet = buildBadgeEmbedCode({
    badgeType: "carbon_tested",
    domain,
    resultSlug,
    apiBase: API_BASE,
  });
  const greenSnippet = buildBadgeEmbedCode({
    badgeType: "green_hosting",
    domain,
    resultSlug,
    apiBase: API_BASE,
  });

  const copySnippet = async (code, key) => {
    if (!code || !resultSlug) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(key);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("");
    }
  };

  const carbonStatus = { label: "Available", tone: "available" };
  const hostingStatus = greenHost
    ? { label: "Available", tone: "available" }
    : { label: "Not available", tone: "unavailable" };

  return (
    <section id="badge-options" className="scroll-mt-24 rounded-[28px] border gt-report-panel p-5 sm:p-7">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
            <ShieldCheck size={13} aria-hidden="true" />
            Available badges
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Badges & trust signals</h2>
          <p className="mt-2 text-sm leading-6 text-[#8fa6b8]">
            Carbon Result and Green Hosting badges are backed by this report. GreenTracer Verified is a separate supporter/member signal.
          </p>
          {domain && <p className="mt-2 text-xs text-[#5f7285]">Badge domain: {domain}</p>}
        </div>
        <Link to="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
          Learn about badges
          <ExternalLink size={15} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BadgeCard
          icon={Globe2}
          title="Carbon Result"
          description="Shows this page has a recent GreenTracer carbon result and public grade."
          status={carbonStatus}
          tone="cyan"
          preview={
            <GreenTracerBadge
              status="active"
              badgeType="carbon_tested"
              domain={domain}
              href={reportHref}
              valueText={gradeText}
            />
          }
        >
          <div className="grid gap-2">
            <BadgeActionButton onClick={() => copySnippet(carbonSnippet, "carbon")} disabled={!resultSlug}>
              {copied === "carbon" ? "Copied Carbon Result badge" : "Copy Carbon Result badge"}
              <ClipboardCopy size={15} aria-hidden="true" />
            </BadgeActionButton>
            <Link to={carbonBuilderHref} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-white hover:border-emerald-300/40">
              Customize Carbon Result badge
              <ExternalLink size={15} aria-hidden="true" />
            </Link>
          </div>
        </BadgeCard>

        <BadgeCard
          icon={Leaf}
          title="Green Hosting"
          description={greenHost ? "Shows this site is hosted with renewable-energy evidence." : "Available when this report detects green-hosting evidence."}
          status={hostingStatus}
          tone="green"
          preview={
            greenHost ? (
              <GreenTracerBadge
                status="active"
                badgeType="green_hosting"
                domain={domain}
                href={hostingReportHref}
              />
            ) : (
              <Leaf size={36} aria-hidden="true" />
            )
          }
        >
          <div className="grid gap-2">
            <BadgeActionButton onClick={() => copySnippet(greenSnippet, "green")} disabled={!greenHost || !resultSlug}>
              {copied === "green" ? "Copied Hosting badge" : "Copy Hosting badge"}
              <ClipboardCopy size={15} aria-hidden="true" />
            </BadgeActionButton>
            {greenHost ? (
              <Link to={greenBuilderHref} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-white hover:border-emerald-300/40">
                Customize Green Hosting
                <ExternalLink size={15} aria-hidden="true" />
              </Link>
            ) : (
              <a href="https://buzzboost.co.uk/contact/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-white hover:border-emerald-300/40">
                Review hosting evidence
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            )}
          </div>
        </BadgeCard>

        <BadgeCard
          icon={ShieldCheck}
          title="GreenTracer Verified"
          description="A paid or approved supporter/member signal. It does not mean the site has a perfect carbon score."
          status={{ label: verified.label, tone: verified.tone === "available" ? "available" : "neutral" }}
          tone="slate"
          preview={verified.key === "verified" ? <Check size={36} aria-hidden="true" /> : <Lock size={32} aria-hidden="true" />}
        >
          <div className="grid gap-2">
            <Link to={verified.key === "verified" ? "/dashboard" : "/pricing"} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-white hover:border-emerald-300/40">
              {verified.key === "verified" ? "Manage verified badge" : "Upgrade to Verified"}
              <ExternalLink size={15} aria-hidden="true" />
            </Link>
            <Link to="/dashboard" className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-[#b7c7d6] hover:border-white/25 hover:text-white">
              Manage domain
              <BadgeCheck size={15} aria-hidden="true" />
            </Link>
          </div>
        </BadgeCard>
      </div>

      <p className="mt-5 text-xs leading-5 text-[#8fa6b8]">
        GreenTracer Verified does not mean the site has a perfect carbon score. It means the organisation has an active paid or approved supporter status, a managed domain, and a public profile.
      </p>
    </section>
  );
}
