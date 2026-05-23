import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Copy, Leaf, ShieldCheck } from "lucide-react";
import GreenTracerBadge from "../badges/GreenTracerBadge";
import { API_BASE } from "../../config";
import { buildBadgeEmbedCode } from "../../lib/badges/embed";
import {
  getHostingDisplayStatus,
  getVerifiedDisplayStatus,
  normalizeDomain,
} from "../../lib/reportDisplay";

const CARD_TONES = {
  green: "border-[#00d084]/26 bg-[linear-gradient(160deg,rgba(11,27,44,0.94),rgba(4,16,27,0.82))] shadow-[0_24px_70px_-58px_rgba(0,208,132,0.9)]",
  amber: "border-[#f5b84b]/24 bg-[linear-gradient(160deg,rgba(11,27,44,0.9),rgba(4,16,27,0.78))]",
  neutral: "border-[rgba(132,204,200,0.16)] bg-[linear-gradient(160deg,rgba(11,27,44,0.82),rgba(4,16,27,0.72))]",
};

function StatusPill({ tone = "neutral", children }) {
  const classes = {
    green: "border-[#00d084]/30 bg-[#00d084]/10 text-[#8df8ce]",
    amber: "border-[#f5b84b]/28 bg-[#f5b84b]/10 text-[#ffd88a]",
    neutral: "border-white/10 bg-white/[0.04] text-[#b7c6d4]",
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${classes[tone] || classes.neutral}`}>
      {children}
    </span>
  );
}

function BadgeSignalPattern() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-55" viewBox="0 0 360 160" preserveAspectRatio="none" aria-hidden="true">
      <g fill="none" stroke="rgba(0,208,132,0.18)" strokeWidth="1">
        <path d="M0 122 C56 92 112 90 164 106 S266 150 360 72" />
        <path d="M32 42 L88 70 L150 48 L218 86 L300 54" stroke="rgba(77,216,255,0.14)" />
        <path d="M0 28 H360" opacity="0.12" />
        <path d="M0 132 H360" opacity="0.12" />
      </g>
      <g fill="#00d084">
        <circle cx="88" cy="70" r="2.6" opacity="0.42" />
        <circle cx="150" cy="48" r="2" opacity="0.28" />
        <circle cx="218" cy="86" r="2.4" opacity="0.38" />
        <circle cx="300" cy="54" r="2" opacity="0.24" />
      </g>
    </svg>
  );
}

function BadgeCard({
  icon: Icon,
  title,
  description,
  statusLabel,
  tone,
  eyebrow,
  previewLabel = "Badge preview",
  children,
  actions,
}) {
  return (
    <article className={`relative flex h-full min-h-[350px] flex-col overflow-hidden rounded-[1.35rem] border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5 ${CARD_TONES[tone] || CARD_TONES.neutral}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,208,132,0.42),transparent)]" />
      <div className="pointer-events-none absolute -right-16 top-14 h-40 w-52 bg-[radial-gradient(ellipse_at_center,rgba(0,208,132,0.12),transparent_68%)]" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="gt-report-mono text-xs font-medium uppercase text-[#5f7285]">
              {eyebrow}
            </p>
          )}
          <h3 className="mt-1 text-lg font-semibold text-[#f5fbff]">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#8fa6b8]">{description}</p>
        </div>
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#00d084]">
          {React.createElement(Icon, { size: 22, "aria-hidden": true })}
        </span>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[#020b13]/56 p-4">
        <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(132,204,200,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(132,204,200,0.06)_1px,transparent_1px)] [background-size:18px_18px]" />
        <BadgeSignalPattern />
        <div className="pointer-events-none absolute left-1/2 top-[58%] h-20 w-56 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(0,208,132,0.11),transparent_68%)]" />
        <div className="relative z-10 mb-4 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-[#5f7285]">{previewLabel}</p>
          <StatusPill tone={tone}>{statusLabel}</StatusPill>
        </div>
        <div className="relative z-10 flex min-h-[106px] items-center justify-center text-center">
          {children}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-5">{actions}</div>
    </article>
  );
}

function ActionButton({ children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#00c471] px-4 text-sm font-semibold text-[#02110b] transition hover:bg-[#1de29d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d084]/45 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function SecondaryLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[rgba(132,204,200,0.22)] px-4 text-sm font-semibold text-[#dbe8ef] transition hover:border-[#00d084]/45 hover:bg-white/[0.03] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d084]/30"
    >
      {children}
    </Link>
  );
}

export default function BadgeEligibilitySection({
  siteUrl,
  greenHost = false,
  resultSlug = "",
  grade = "",
  verified = null,
  className = "",
}) {
  const [copied, setCopied] = useState("");
  const domain = useMemo(() => normalizeDomain(siteUrl), [siteUrl]);
  const hosting = getHostingDisplayStatus(greenHost);
  const verifiedStatus = getVerifiedDisplayStatus(verified || {});
  const builderParams = new URLSearchParams({
    result: resultSlug || "",
    domain: domain || "",
    green: greenHost ? "1" : "0",
  });
  const reportHref = resultSlug ? `/result/${encodeURIComponent(resultSlug)}` : "";
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

  const verifiedBadgeStatus = verifiedStatus.key === "verified"
    ? "active"
    : verifiedStatus.key === "pending"
      ? "pending"
      : "not_active";

  return (
    <section
      id="badge-options"
      className={`relative overflow-hidden scroll-mt-24 rounded-[1.75rem] border border-[rgba(132,204,200,0.2)] bg-[linear-gradient(145deg,rgba(7,20,35,0.88),rgba(1,7,13,0.72))] p-5 sm:p-6 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,208,132,0.34),transparent)]" />
      <div className="pointer-events-none absolute right-0 top-0 h-56 w-72 bg-[radial-gradient(ellipse_at_70%_28%,rgba(77,216,255,0.12),transparent_66%)]" />
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#00d084]/25 bg-[#00d084]/10 text-[#00d084]">
              <ShieldCheck size={23} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-[#f5fbff]">
                Badges & trust signals
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-[#8fa6b8]">
                Carbon Tested and Green Hosting badges are backed by this report. GreenTracer Verified is a separate supporter/member signal.
              </p>
            </div>
          </div>
        </div>
        <Link
          to="/badge"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#00d084] hover:text-[#8df8ce]"
        >
          Learn about badges
        </Link>
      </div>

      <div className="relative z-10 mt-6 grid items-stretch gap-4 lg:grid-cols-3">
        <BadgeCard
          icon={BadgeCheck}
          title="Carbon Tested"
          description="Proves this page has a recent GreenTracer carbon result."
          statusLabel={resultSlug ? "Available" : "Unavailable"}
          tone={resultSlug ? "green" : "neutral"}
          eyebrow="Report-backed"
          actions={
            <>
              <ActionButton onClick={() => copySnippet(carbonSnippet, "carbon")} disabled={!resultSlug}>
                <Copy size={15} aria-hidden="true" />
                {copied === "carbon" ? "Carbon badge copied" : "Copy Carbon badge"}
              </ActionButton>
              <SecondaryLink to={carbonBuilderHref}>Customize Carbon badge</SecondaryLink>
            </>
          }
        >
          <GreenTracerBadge
            status={resultSlug ? "active" : "unavailable"}
            badgeType="carbon_tested"
            domain={domain}
            href={reportHref}
            label={resultSlug ? "" : "Not available"}
            valueText={grade ? `Grade ${grade}` : ""}
            ariaLabel={`Carbon Tested badge for ${domain || "this site"}`}
          />
        </BadgeCard>

        <BadgeCard
          icon={Leaf}
          title="Green Hosting"
          description={greenHost ? "Shows this site is hosted with renewable energy evidence." : "Available only when hosting evidence supports it."}
          statusLabel={hosting.badgeLabel}
          tone={greenHost ? "green" : "neutral"}
          eyebrow="Report-backed"
          actions={
            greenHost ? (
              <>
                <ActionButton onClick={() => copySnippet(greenSnippet, "green")} disabled={!resultSlug}>
                  <Copy size={15} aria-hidden="true" />
                  {copied === "green" ? "Hosting badge copied" : "Copy Hosting badge"}
                </ActionButton>
                <SecondaryLink to={greenBuilderHref}>Customize Green Hosting badge</SecondaryLink>
              </>
            ) : (
              <>
                <SecondaryLink to="/how-it-works">Review hosting method</SecondaryLink>
                <SecondaryLink to="/badge">Customize neutral badge</SecondaryLink>
              </>
            )
          }
        >
          {greenHost ? (
            <GreenTracerBadge
              status="active"
              badgeType="green_hosting"
              domain={domain}
              href={reportHref}
              ariaLabel={`Green Hosting badge for ${domain || "this site"}`}
            />
          ) : (
            <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-[#8fa6b8]">
              Green Hosting remains unavailable until this report detects supporting provider evidence.
            </p>
          )}
        </BadgeCard>

        <BadgeCard
          icon={ShieldCheck}
          title="GreenTracer Verified"
          description="A paid supporter/member signal with a clear upgrade path. It does not mean the site has a perfect carbon score."
          statusLabel={verifiedStatus.badgeLabel}
          tone={verifiedStatus.tone}
          eyebrow="Supporter signal"
          previewLabel="Member signal preview"
          actions={
            <>
              <SecondaryLink to={verifiedStatus.actionTo}>{verifiedStatus.actionLabel}</SecondaryLink>
              <SecondaryLink to="/license-status">Check verified status</SecondaryLink>
            </>
          }
        >
          <GreenTracerBadge
            status={verifiedBadgeStatus}
            badgeType="greentracer_verified"
            domain={domain}
            label={verifiedStatus.label}
            ariaLabel={`GreenTracer Verified status for ${domain || "this site"}: ${verifiedStatus.label}`}
          />
        </BadgeCard>
      </div>

      <p className="relative z-10 mt-4 text-xs leading-5 text-[#8fa6b8]">
        Badges reflect this report and hosting evidence. Verified is a separate paid supporter/member signal and does not require a perfect carbon score.
      </p>
    </section>
  );
}
