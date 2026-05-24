import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  Gauge,
  Layers,
  LineChart,
  RefreshCcw,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  clampPercent,
  formatCarbonValue,
  getHostingDisplayStatus,
} from "../../lib/reportDisplay";

const SCORE_TONE = {
  available: "border-[#00d084]/24 bg-[#00d084]/10 text-[#8df8ce]",
  missing: "border-white/10 bg-white/[0.04] text-[#b7c6d4]",
};

function SectionTitle({ icon: Icon, title, description, action }) {
  return (
    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#00d084]/25 bg-[#00d084]/10 text-[#00d084]">
            <Icon size={23} aria-hidden="true" />
          </span>
        )}
        <div>
          <h2 className="text-xl font-semibold text-[#f5fbff]">{title}</h2>
          {description && <p className="mt-1 max-w-3xl text-sm leading-6 text-[#8fa6b8]">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function ReportPanel({ children, className = "", id }) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden rounded-[1.75rem] border border-[rgba(132,204,200,0.14)] bg-[linear-gradient(145deg,rgba(7,20,35,0.54),rgba(1,7,13,0.46))] p-5 sm:p-6 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(132,204,200,0.22),transparent)]" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function SignalMeshVisual({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 240 180" fill="none" aria-hidden="true">
      <path d="M28 128 C66 92 96 88 132 102 S194 142 222 72" stroke="rgba(0,208,132,0.22)" strokeWidth="1.2" />
      <path d="M42 56 L82 84 L126 62 L168 94 L210 48" stroke="rgba(77,216,255,0.18)" strokeWidth="1.1" />
      <path d="M62 138 L104 112 L146 128 L184 104" stroke="rgba(0,161,157,0.2)" strokeWidth="1" strokeDasharray="4 8" />
      <g fill="#00d084">
        <circle cx="82" cy="84" r="3" opacity="0.55" />
        <circle cx="126" cy="62" r="2.4" opacity="0.42" />
        <circle cx="168" cy="94" r="3" opacity="0.5" />
        <circle cx="210" cy="48" r="2.2" opacity="0.38" />
      </g>
      <g opacity="0.4">
        <path d="M38 32 H218" stroke="rgba(132,204,200,0.12)" />
        <path d="M38 150 H218" stroke="rgba(132,204,200,0.1)" />
        <path d="M70 22 V162" stroke="rgba(132,204,200,0.08)" />
        <path d="M152 18 V166" stroke="rgba(132,204,200,0.08)" />
      </g>
    </svg>
  );
}

function BreakdownCard({ icon: Icon, label, value, detail, tone = "green" }) {
  const iconClass = {
    green: "border-[#00d084]/22 bg-[#00d084]/10 text-[#00d084]",
    cyan: "border-[#4dd8ff]/22 bg-[#4dd8ff]/10 text-[#4dd8ff]",
    amber: "border-[#f5b84b]/24 bg-[#f5b84b]/10 text-[#f5b84b]",
    neutral: "border-white/10 bg-white/[0.04] text-[#8fa6b8]",
  }[tone] || "border-white/10 bg-white/[0.04] text-[#8fa6b8]";

  return (
    <article className="rounded-2xl border border-[rgba(132,204,200,0.1)] bg-[#071423]/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase text-[#8fa6b8]">
            {label}
          </p>
          <p className="mt-3 text-xl font-semibold tabular-nums text-white">
            {value}
          </p>
        </div>
        <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${iconClass}`}>
          {React.createElement(Icon, { size: 22, "aria-hidden": true })}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#8fa6b8]">{detail}</p>
    </article>
  );
}

export function ResultBreakdownSection({
  carbonPerView,
  greenHost,
  percentile,
  lighthouseScores = {},
}) {
  const hosting = getHostingDisplayStatus(greenHost);
  const normalizedScores = [
    lighthouseScores.performance,
    lighthouseScores.seo,
    lighthouseScores.accessibility,
    lighthouseScores["best-practices"] ?? lighthouseScores.bestPractices,
  ]
    .map((score) => (Number.isFinite(Number(score)) ? Math.round(Number(score)) : null))
    .filter((score) => score !== null);
  const performanceValue = normalizedScores.length
    ? `${Math.round(normalizedScores.reduce((sum, score) => sum + score, 0) / normalizedScores.length)}/100`
    : "Unavailable";

  return (
    <section id="result-breakdown" className="scroll-mt-24">
      <SectionTitle
        title="What affects this result?"
        description="These core factors combine to determine your carbon footprint score."
      />
      <div className="grid gap-3 rounded-[1.35rem] border border-[rgba(132,204,200,0.1)] bg-[#020b13]/22 p-2 md:grid-cols-2 xl:grid-cols-4">
        <BreakdownCard
          icon={Sparkles}
          label="Page carbon"
          value={`${formatCarbonValue(carbonPerView)}g / view`}
          detail="Measured from page delivery data and the GreenTracer scoring model."
          tone="green"
        />
        <BreakdownCard
          icon={Server}
          label="Hosting"
          value={hosting.label}
          detail={greenHost ? "Hosting evidence supports a renewable energy claim." : "Green hosting evidence was not detected for this report."}
          tone={greenHost ? "green" : "amber"}
        />
        <BreakdownCard
          icon={LineChart}
          label="Efficiency"
          value={`${clampPercent(percentile)}th percentile`}
          detail={`Cleaner than ${clampPercent(percentile)}% of tested pages.`}
          tone="green"
        />
        <BreakdownCard
          icon={Gauge}
          label="Performance signals"
          value={performanceValue}
          detail={normalizedScores.length ? "Saved Lighthouse category signals are included in this report." : "Run a fresh scan to capture current performance signals."}
          tone={normalizedScores.length ? "cyan" : "neutral"}
        />
      </div>
      <div className="mt-4">
        <PerformanceScoreList scores={lighthouseScores} />
      </div>
    </section>
  );
}

function RecommendationCard({ index, icon: Icon, title, body, children, tone = "green" }) {
  const iconClass = {
    green: "text-[#00d084]",
    cyan: "text-[#4dd8ff]",
    amber: "text-[#f5b84b]",
  }[tone] || "text-[#00d084]";

  return (
    <article className="group flex min-h-[184px] flex-col rounded-2xl border border-transparent p-4 transition hover:border-[rgba(132,204,200,0.14)] hover:bg-white/[0.025] sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-lg border border-white/10 bg-white/[0.035] px-2 py-1 text-xs font-semibold text-[#8fa6b8]">
          {index}
        </span>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.035]">
          {React.createElement(Icon, { className: iconClass, size: 21, "aria-hidden": true })}
        </span>
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#f5fbff]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#8fa6b8]">{body}</p>
      <div className="mt-auto pt-4">{children}</div>
    </article>
  );
}

function InlineAction({ to, onClick, children }) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#00d084] hover:text-[#8df8ce]"
      >
        {children}
        <ArrowRight size={15} aria-hidden="true" />
      </button>
    );
  }

  return (
    <Link to={to} className="inline-flex items-center gap-2 text-sm font-semibold text-[#00d084] hover:text-[#8df8ce]">
      {children}
      <ArrowRight size={15} aria-hidden="true" />
    </Link>
  );
}

export function RecommendationSection({ greenHost }) {
  return (
    <section id="recommendations" className="scroll-mt-24">
      <SectionTitle
        title="Recommended next actions"
        description="Practical steps to keep this report accurate and improve future scans."
        action={
          <Link to="/how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold text-[#00d084] hover:text-[#8df8ce]">
            See all recommendations
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        }
      />
      <div className="grid gap-2 rounded-[1.35rem] border border-[rgba(132,204,200,0.12)] bg-[#071423]/28 p-2 md:grid-cols-2 xl:grid-cols-4">
        <RecommendationCard
          index="01"
          icon={Layers}
          title="Reduce transfer weight"
          body="Compress images, minify scripts, and remove unused assets to cut page weight."
          tone="amber"
        >
          <InlineAction to="/how-it-works">Review opportunities</InlineAction>
        </RecommendationCard>
        <RecommendationCard
          index="02"
          icon={CalendarDays}
          title="Keep hosting evidence current"
          body={greenHost ? "Ensure your host keeps publishing renewable energy evidence." : "Review provider evidence before making a hosting claim."}
          tone="amber"
        >
          <InlineAction to="/license-status">Check hosting status</InlineAction>
        </RecommendationCard>
        <RecommendationCard
          index="03"
          icon={BadgeCheck}
          title="Publish the correct badge"
          body="Use report-backed badges that reflect the current scan status."
          tone="green"
        >
          <InlineAction to="#badge-options">Get your badge</InlineAction>
        </RecommendationCard>
        <RecommendationCard
          index="04"
          icon={RefreshCcw}
          title="Re-run after major changes"
          body="Run a new scan after content, CDN, hosting, or build changes."
          tone="cyan"
        >
          <InlineAction to="/">Run new scan</InlineAction>
        </RecommendationCard>
      </div>
    </section>
  );
}

export function VerifiedDirectoryCta() {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-[#00d084]/22 bg-[linear-gradient(135deg,rgba(7,20,35,0.78),rgba(1,7,13,0.6))] p-5 shadow-[0_26px_90px_-68px_rgba(0,208,132,0.78)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(132,204,200,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(132,204,200,0.055)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_72%_42%,rgba(0,208,132,0.16),transparent_66%)]" />
      <SignalMeshVisual className="pointer-events-none absolute right-2 top-1/2 hidden h-40 w-56 -translate-y-1/2 opacity-70 md:block" />

      <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#00d084]/24 bg-[#00d084]/10 text-[#00d084]">
            <ShieldCheck size={24} aria-hidden="true" />
          </span>
          <div>
            <p className="gt-report-mono text-[0.68rem] font-medium uppercase text-[#8df8ce]">
              Verified directory signal
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#f5fbff]">
              Turn this report into a public trust signal.
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8fa6b8]">
              Verified supporters can publish a managed profile, display a GreenTracer Verified badge, and show sustainability signals publicly. Verified is a supporter/member signal, not a perfect carbon score.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <Link
            to="/pricing"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#00c471] px-5 text-sm font-semibold text-[#02110b] transition hover:bg-[#1de29d]"
          >
            Get verified
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[rgba(132,204,200,0.24)] bg-[#020b13]/28 px-5 text-sm font-semibold text-[#f5fbff] transition hover:border-[#00d084]/45 hover:bg-white/[0.03]"
          >
            View verified plans
          </Link>
          <Link
            to="/license-status"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[rgba(132,204,200,0.2)] bg-[#020b13]/18 px-5 text-sm font-semibold text-[#dbe8ef] transition hover:border-[#00d084]/45 hover:bg-white/[0.03]"
          >
            Manage domain
          </Link>
        </div>
      </div>
    </section>
  );
}

function MethodologyItem({ title, children }) {
  return (
    <details className="group border-b border-[rgba(132,204,200,0.1)] last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-[#dbe8ef]">
        {title}
        <ChevronDown className="shrink-0 transition group-open:rotate-180" size={16} aria-hidden="true" />
      </summary>
      <div className="pb-4 text-sm leading-6 text-[#8fa6b8]">
        {children}
      </div>
    </details>
  );
}

export function MethodologyAccordion() {
  return (
    <ReportPanel id="methodology">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.46fr]">
        <div>
          <SectionTitle
            title="Methodology & technical details"
            description="Transparent, open, and audit-friendly."
          />
          <div className="rounded-2xl border border-[rgba(132,204,200,0.12)] bg-[#071423]/36 px-4">
            <MethodologyItem title="How we calculate page carbon">
              GreenTracer uses the saved scan's page-view carbon estimate. It accounts for measured delivery signals, emissions assumptions, and hosting state without changing the underlying scoring maths on this page.
            </MethodologyItem>
            <MethodologyItem title="Hosting detection">
              Green hosting eligibility is based on detected hosting evidence. If no evidence is found, this report keeps the claim unavailable rather than guessing.
            </MethodologyItem>
            <MethodologyItem title="Performance signals">
              Lighthouse category scores are shown only when the saved result contains them. Missing values remain unavailable.
            </MethodologyItem>
            <MethodologyItem title="Data sources & assumptions">
              Traffic equivalents are modelled approximations for context. They should not be treated as exact environmental accounting.
            </MethodologyItem>
            <MethodologyItem title="Limitations">
              Results are page-level estimates. Re-run scans after major website, CDN, or infrastructure changes to keep the report current.
            </MethodologyItem>
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-2xl border border-[rgba(132,204,200,0.12)] bg-[#071423]/36 p-5">
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-52 bg-[radial-gradient(ellipse_at_70%_30%,rgba(0,208,132,0.14),transparent_68%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(132,204,200,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(132,204,200,0.06)_1px,transparent_1px)] [background-size:18px_18px]" />
          <SignalMeshVisual className="pointer-events-none absolute right-2 top-2 h-36 w-44 opacity-70" />
          <div className="relative z-10">
            <p className="text-sm font-semibold text-[#00d084]">About GreenTracer</p>
            <p className="mt-3 text-sm leading-6 text-[#8fa6b8]">
              Engineers on a mission to make digital ecology measurable.
            </p>
            <div className="mt-5 space-y-3 border-t border-[rgba(132,204,200,0.1)] pt-4">
              <p className="text-sm font-semibold text-[#f5fbff]">No paywalls. Just pure data.</p>
              <p className="text-sm text-[#8fa6b8]">Built for transparent public reports.</p>
            </div>
            <Link
              to="/how-it-works"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[rgba(132,204,200,0.22)] px-4 text-sm font-semibold text-[#f5fbff] hover:border-[#00d084]/45"
            >
              How it works
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </ReportPanel>
  );
}

export function PerformanceScoreList({ scores = {} }) {
  const items = [
    ["Performance", scores.performance],
    ["SEO", scores.seo],
    ["Accessibility", scores.accessibility],
    ["Best practices", scores["best-practices"] ?? scores.bestPractices],
  ];

  return (
    <div className="grid gap-2 rounded-2xl border border-[rgba(132,204,200,0.1)] bg-[#071423]/28 p-2 sm:grid-cols-2">
      {items.map(([label, raw]) => {
        const value = Number.isFinite(Number(raw)) ? Math.round(Number(raw)) : null;
        return (
          <div key={label} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#dbe8ef]">
              <Zap size={14} aria-hidden="true" />
              {label}
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${value === null ? SCORE_TONE.missing : SCORE_TONE.available}`}>
              {value === null ? "Unavailable" : `${value}/100`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
