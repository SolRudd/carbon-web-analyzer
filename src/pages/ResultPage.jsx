import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  BadgeCheck,
  CalendarDays,
  Clipboard,
  Copy,
  Download,
  ExternalLink,
  Leaf,
  LineChart,
  RefreshCcw,
  Server,
} from "lucide-react";

import LoadingOverlay from "../components/LoadingOverlay";
import BadgeEligibilitySection from "../components/report/BadgeEligibilitySection";
import CarbonScoreGauge from "../components/report/CarbonScoreGauge";
import {
  MethodologyAccordion,
  RecommendationSection,
  ResultBreakdownSection,
  VerifiedDirectoryCta,
} from "../components/report/ReportContentSections";
import TrafficImpactCalculator from "../components/report/TrafficImpactCalculator";
import { API_BASE } from "../config";
import { buildBadgeEmbedCode } from "../lib/badges/embed";
import {
  clampPercent,
  formatCarbonValue,
  formatScanDate,
  getGaugeScore,
  getGradeConfig,
  getGradeLabel,
  getHostingDisplayStatus,
  normalizeDomain,
  normalizeMetricNumber,
} from "../lib/reportDisplay";

const INDEX_RESULTS_FLAG = String(import.meta.env.VITE_INDEX_RESULTS || "").toLowerCase() === "true";

const reportStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');

  .gt-report {
    --gt-bg: #020b13;
    --gt-bg-deep: #01070d;
    --gt-panel: #071423;
    --gt-panel-soft: #0b1b2c;
    --gt-panel-raised: #0d2033;
    --gt-border: rgba(132, 204, 200, 0.18);
    --gt-border-strong: rgba(0, 218, 180, 0.36);
    --gt-text: #f5fbff;
    --gt-muted: #8fa6b8;
    --gt-dim: #5f7285;
    --gt-green: #00d084;
    --gt-teal: #00a19d;
    --gt-cyan: #4dd8ff;
    --gt-amber: #f5b84b;
    --gt-red: #ff5f57;
    font-family: 'Inter', sans-serif;
  }

  .gt-report-display {
    font-family: 'Fraunces', serif;
    letter-spacing: 0;
  }

  .gt-report-mono {
    font-family: 'JetBrains Mono', monospace;
  }

  .gt-report-bg {
    background:
      radial-gradient(circle at 72% 8%, rgba(0, 208, 132, 0.14), transparent 30%),
      radial-gradient(circle at 12% 16%, rgba(77, 216, 255, 0.08), transparent 32%),
      linear-gradient(180deg, #020b13 0%, #01070d 100%);
  }
`;

function ErrorDisplay({ message }) {
  return (
    <section className="min-h-[70vh] bg-[#020b13] px-4 py-20 text-center text-[#f5fbff]">
      <h1 className="text-2xl font-bold text-[#ff8a83]">Report unavailable</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#8fa6b8]">{message}</p>
      <Link to="/" className="mt-6 inline-flex rounded-full border border-[#00d084]/35 px-5 py-2.5 text-sm font-semibold text-[#00d084] hover:text-[#8df8ce]">
        Back to homepage
      </Link>
    </section>
  );
}

const pdfEscape = (value) =>
  String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const wrapText = (value, maxLen = 88) => {
  const words = String(value ?? "").split(" ");
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLen) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);
  return lines.length ? lines : [""];
};

const createPdfBlob = (report) => {
  const pageWidth = 595;
  const pageHeight = 842;
  const commands = [];
  const toPdfY = (topY) => pageHeight - topY;
  const drawRectTop = (x, topY, width, height, fillRgb) => {
    const y = pageHeight - topY - height;
    commands.push("q");
    commands.push(`${fillRgb} rg`);
    commands.push(`${x} ${y} ${width} ${height} re f`);
    commands.push("Q");
  };
  const drawTextTop = (x, topY, text, options = {}) => {
    const { size = 11, color = "0.07 0.11 0.16", font = "F1", maxLen = 90, lineGap = 14 } = options;
    let currentY = topY;
    wrapText(text, maxLen).forEach((line) => {
      commands.push("BT");
      commands.push(`${color} rg`);
      commands.push(`/${font} ${size} Tf`);
      commands.push(`1 0 0 1 ${x} ${toPdfY(currentY)} Tm`);
      commands.push(`(${pdfEscape(line)}) Tj`);
      commands.push("ET");
      currentY += lineGap;
    });
    return currentY;
  };
  const scoreText = (score) => (typeof score === "number" ? `${score}/100` : "Unavailable");

  drawRectTop(0, 0, pageWidth, 90, "0.02 0.12 0.10");
  drawRectTop(0, 90, pageWidth, 26, "0.00 0.42 0.26");
  drawTextTop(42, 36, "GreenTracer Website Intelligence Report", { size: 18, color: "1 1 1", font: "F2", lineGap: 20 });
  drawTextTop(42, 64, `Generated on ${report.testedOn}`, { size: 10, color: "0.90 0.97 0.94" });
  drawTextTop(430, 50, "greentracer.org", { size: 10, color: "0.90 0.97 0.94", font: "F2", maxLen: 20 });

  drawRectTop(36, 136, 523, 95, "0.95 0.98 0.96");
  drawTextTop(52, 160, "Report Context", { size: 12, font: "F2", color: "0.03 0.35 0.22" });
  drawTextTop(52, 182, `Tested URL: ${report.url}`, { size: 10, maxLen: 80 });
  drawTextTop(52, 198, `Hostname: ${report.hostname}`, { size: 10 });
  drawTextTop(52, 214, `Date: ${report.testedOn}`, { size: 10 });

  drawRectTop(36, 252, 255, 180, "0.98 0.99 0.99");
  drawTextTop(52, 276, "Core Sustainability Metrics", { size: 12, font: "F2", color: "0.03 0.35 0.22" });
  drawTextTop(52, 302, `Carbon Intensity: ${report.carbonIntensity}`, { size: 11, font: "F2" });
  drawTextTop(52, 321, `Grade: ${report.grade}`, { size: 11 });
  drawTextTop(52, 339, `Percentile: ${report.percentile}`, { size: 11 });
  drawTextTop(52, 357, `Green Hosting: ${report.greenHosting}`, { size: 11 });

  drawRectTop(304, 252, 255, 180, "0.98 0.99 0.99");
  drawTextTop(320, 276, "Lighthouse Categories", { size: 12, font: "F2", color: "0.03 0.35 0.22" });
  drawTextTop(320, 302, `Performance: ${scoreText(report.scores.performance)}`, { size: 11 });
  drawTextTop(320, 320, `Accessibility: ${scoreText(report.scores.accessibility)}`, { size: 11 });
  drawTextTop(320, 338, `SEO: ${scoreText(report.scores.seo)}`, { size: 11 });
  drawTextTop(320, 356, `Best Practices: ${scoreText(report.scores.bestPractices)}`, { size: 11 });

  drawRectTop(36, 448, 523, 110, "0.95 0.97 0.99");
  drawTextTop(52, 472, "Hosting and Badge Status", { size: 12, font: "F2", color: "0.03 0.25 0.36" });
  drawTextTop(52, 496, report.greenHost
    ? "Green hosting was detected for this report. Green Hosting badge eligibility is active."
    : "Green hosting was not detected for this report. The Green Hosting badge is not available for this result.", {
    size: 10,
    maxLen: 88,
    lineGap: 13,
  });

  drawRectTop(36, 574, 523, 92, "0.99 0.99 0.99");
  drawTextTop(52, 598, "Method Notes", { size: 12, font: "F2", color: "0.28 0.33 0.38" });
  drawTextTop(52, 622, "Only real saved result data is included in this export.", { size: 10, maxLen: 86 });
  drawTextTop(52, 638, "Missing Lighthouse category values are labeled Unavailable.", { size: 10, maxLen: 86 });

  drawTextTop(36, 792, "GreenTracer report export v1", { size: 9, color: "0.42 0.48 0.54", maxLen: 40 });

  const stream = `${commands.join("\n")}\n`;

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}endstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj) => {
    offsets.push(pdf.length);
    pdf += obj;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

function formatScore(value) {
  const score = Number(value);
  if (!Number.isFinite(score)) return null;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function HeroMetricCard({ icon: Icon, label, value, detail, tone = "green" }) {
  const toneClass = {
    green: "text-[#00d084]",
    cyan: "text-[#4dd8ff]",
    amber: "text-[#f5b84b]",
    neutral: "text-[#b7c6d4]",
  }[tone] || "text-[#00d084]";

  return (
    <article className="min-h-[116px] rounded-2xl border border-[rgba(132,204,200,0.16)] bg-[#071423]/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] sm:min-h-[132px] sm:p-5">
      <div className="gt-report-mono flex items-center gap-2 text-[0.68rem] font-medium uppercase text-[#8fa6b8]">
        {React.createElement(Icon, { className: toneClass, size: 13, "aria-hidden": true })}
        {label}
      </div>
      <p className={`mt-4 break-words text-2xl font-semibold leading-tight tabular-nums sm:text-3xl ${toneClass}`}>
        {value}
      </p>
      <p className="mt-2 text-sm leading-5 text-[#8fa6b8]">{detail}</p>
    </article>
  );
}

function HeroSignalField() {
  return (
    <svg className="pointer-events-none absolute inset-0 hidden h-full w-full opacity-55 sm:block" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true">
      <g strokeWidth="1.1" fill="none">
        <path d="M710 72 C844 96 948 156 1036 244 S1154 392 1200 432" stroke="rgba(0,208,132,0.14)" />
        <path d="M704 410 C806 336 912 304 1032 292 S1150 252 1200 218" stroke="rgba(77,216,255,0.1)" />
        <path d="M0 410 C172 334 332 310 494 332 S762 382 920 296" stroke="rgba(0,208,132,0.08)" />
        <path d="M612 112 L732 168 L848 146 L988 224 L1098 196" stroke="rgba(0,161,157,0.12)" />
      </g>
      <g fill="#00d084">
        <circle cx="732" cy="168" r="3.2" opacity="0.42" />
        <circle cx="848" cy="146" r="2.2" opacity="0.28" />
        <circle cx="988" cy="224" r="2.8" opacity="0.36" />
        <circle cx="1098" cy="196" r="2" opacity="0.24" />
      </g>
      <g stroke="#00d084" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="5 10">
        <path d="M812 74 C912 132 996 218 1046 342" />
        <path d="M642 454 C788 386 976 362 1164 400" />
      </g>
    </svg>
  );
}

function ReportHero({
  result,
  hostname,
  testedOn,
  carbonValue,
  percentileValue,
  gradeLabel,
  onDownloadPdf,
  onRefresh,
  onCopyBadge,
  copiedBadge,
}) {
  const gradeConfig = getGradeConfig(gradeLabel);
  const hosting = getHostingDisplayStatus(Boolean(result.greenHost));
  const gaugeScore = getGaugeScore({ grade: gradeLabel, percentile: percentileValue });

  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-[rgba(132,204,200,0.2)] bg-[linear-gradient(145deg,rgba(7,20,35,0.84),rgba(1,7,13,0.62))] p-5 shadow-[0_34px_120px_-76px_rgba(0,208,132,0.82)] sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(132,204,200,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(132,204,200,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(ellipse_at_72%_42%,rgba(0,208,132,0.14),transparent_66%)]" />
      <HeroSignalField />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,208,132,0.5),transparent)]" />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:items-center">
        <div className="min-w-0">
          <p className="gt-report-mono inline-flex items-center gap-2 rounded-full border border-[#00d084]/24 bg-[#00d084]/10 px-3 py-1 text-[0.68rem] font-medium uppercase text-[#8df8ce]">
            <Clipboard size={13} aria-hidden="true" />
            Public carbon report
          </p>

          <h1 className="gt-report-display mt-5 break-words text-4xl font-semibold leading-none text-[#f5fbff] sm:text-5xl lg:text-6xl">
            {hostname || result.url}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b7c6d4] sm:text-base">
            A public GreenTracer report measuring page carbon, hosting evidence, and performance signals.
          </p>

          {result.url && (
            <div className="mt-4 flex max-w-3xl flex-col gap-2 rounded-2xl border border-[rgba(132,204,200,0.12)] bg-[#020b13]/50 p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="gt-report-mono min-w-0 truncate text-xs text-[#8fa6b8]">
                Scan target: {result.url}
              </p>
              <p className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-[#8fa6b8]">
                <CalendarDays size={14} aria-hidden="true" className="text-[#5f7285]" />
                Last scanned {testedOn}
              </p>
            </div>
          )}

          <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <HeroMetricCard
              icon={BadgeCheck}
              label="Grade"
              value={gradeLabel}
              detail={gradeConfig.label}
              tone={gradeConfig.tone === "red" ? "amber" : "green"}
            />
            <HeroMetricCard
              icon={Leaf}
              label="Carbon / page view"
              value={`${formatCarbonValue(carbonValue)}g`}
              detail="CO₂e per page view"
              tone="cyan"
            />
            <HeroMetricCard
              icon={LineChart}
              label="Efficiency"
              value={`${percentileValue}%`}
              detail="Cleaner than tested pages"
              tone={gaugeScore >= 50 ? "green" : "amber"}
            />
            <HeroMetricCard
              icon={Server}
              label="Hosting"
              value={hosting.shortLabel}
              detail={hosting.key === "detected" ? "Hosting detected" : "No hosting claim"}
              tone={hosting.tone === "green" ? "green" : "amber"}
            />
          </div>
        </div>

        <CarbonScoreGauge
          grade={gradeLabel}
          carbonPerView={carbonValue}
          percentile={percentileValue}
        />
      </div>

      <div className="relative z-10 mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href="#result-breakdown"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#00c471] px-6 text-sm font-semibold text-[#02110b] shadow-[0_18px_40px_-26px_rgba(0,208,132,0.95)] transition hover:bg-[#1de29d] sm:w-auto"
        >
          View full report
          <ExternalLink size={15} aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={onDownloadPdf}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[rgba(132,204,200,0.24)] bg-[#020b13]/24 px-6 text-sm font-semibold text-[#f5fbff] transition hover:border-[#00d084]/45 hover:bg-white/[0.035] sm:w-auto"
        >
          <Download size={16} aria-hidden="true" />
          Export PDF
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[rgba(132,204,200,0.24)] bg-[#020b13]/24 px-6 text-sm font-semibold text-[#f5fbff] transition hover:border-[#00d084]/45 hover:bg-white/[0.035] sm:w-auto"
        >
          <RefreshCcw size={16} aria-hidden="true" />
          Refresh report
        </button>
        <button
          type="button"
          onClick={onCopyBadge}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[rgba(132,204,200,0.24)] bg-[#020b13]/24 px-6 text-sm font-semibold text-[#f5fbff] transition hover:border-[#00d084]/45 hover:bg-white/[0.035] sm:w-auto"
        >
          <Copy size={16} aria-hidden="true" />
          {copiedBadge ? "Badge copied" : "Copy badge"}
        </button>
      </div>
    </header>
  );
}

export default function ResultPage() {
  const { slug } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedBadge, setCopiedBadge] = useState(false);

  const fetchData = useCallback((signal) => {
    if (!slug) return Promise.resolve();
    setLoading(true);
    setError(null);

    return fetch(`${API_BASE}/api/results/${encodeURIComponent(slug)}`, { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not find a report for this URL. Please try testing it from the homepage.");
        }
        return res.json();
      })
      .then((data) => {
        setResult(data);
      })
      .catch((err) => {
        if (signal?.aborted || err.name === "AbortError") return;
        setError(err.message);
      })
      .finally(() => {
        if (!signal?.aborted) setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchData]);

  const resultDomain = useMemo(() => (result?.url ? normalizeDomain(result.url) : ""), [result?.url]);
  const resultSlug = result?.slug || slug || "";

  const carbonSnippet = useMemo(
    () =>
      buildBadgeEmbedCode({
        badgeType: "carbon_tested",
        domain: resultDomain,
        resultSlug,
        apiBase: API_BASE,
      }),
    [resultDomain, resultSlug]
  );

  const copyHeroBadge = async () => {
    if (!carbonSnippet || !resultSlug) return;
    try {
      await navigator.clipboard.writeText(carbonSnippet);
      setCopiedBadge(true);
      window.setTimeout(() => setCopiedBadge(false), 1800);
    } catch {
      setCopiedBadge(false);
    }
  };

  if (loading) return <LoadingOverlay />;
  if (error) return <ErrorDisplay message={error} />;
  if (!result) return <ErrorDisplay message="Result data is unavailable." />;

  const shouldIndex = INDEX_RESULTS_FLAG;
  const canonical = `https://www.greentracer.org${location.pathname}`;
  const hostname = resultDomain || result.url || slug;
  const pageTitle = `Carbon Report for ${hostname} | GreenTracer`;
  const carbonValue = normalizeMetricNumber(result.carbonEstimate ?? result.carbon_estimate) ?? 0;
  const gradeLabel = getGradeLabel(result.grade);
  const percentileValue = clampPercent(result.percentile);
  const pageDescription = `A public GreenTracer carbon report for ${hostname}, showing ${formatCarbonValue(carbonValue)}g CO₂e per page view and a grade of ${gradeLabel}.`;

  const resultTime = result.timestamp || result.created_at || result.createdAt;
  const testedOn = formatScanDate(resultTime);
  const schemaDate = (() => {
    const date = new Date(resultTime);
    return Number.isFinite(date.getTime()) ? date.toISOString() : new Date().toISOString();
  })();

  const lighthouseScores =
    result.lighthouseScores ||
    result.resultData?.lighthouseScores ||
    result.result_data?.lighthouseScores ||
    {};
  const perfScore = formatScore(lighthouseScores.performance);
  const seoScore = formatScore(lighthouseScores.seo);
  const accessibilityScore = formatScore(lighthouseScores.accessibility);
  const bestPracticesScore = formatScore(lighthouseScores["best-practices"] ?? lighthouseScores.bestPractices);
  const verifiedInput =
    result.verified ||
    result.verifiedBadge ||
    result.badges?.greentracer_verified ||
    { status: "not_active" };

  const handleDownloadPdf = () => {
    const blob = createPdfBlob({
      url: result.url,
      hostname,
      testedOn,
      carbonIntensity: `${formatCarbonValue(carbonValue)} g CO₂e per page view`,
      grade: gradeLabel,
      percentile: `${percentileValue}% cleaner than tested pages`,
      greenHost: Boolean(result.greenHost),
      greenHosting: result.greenHost ? "Detected" : "Not detected",
      scores: {
        performance: perfScore,
        accessibility: accessibilityScore,
        seo: seoScore,
        bestPractices: bestPracticesScore,
      },
    });
    const fileHost = String(hostname || "website").replace(/[^a-z0-9.-]/gi, "-").toLowerCase();
    const downloadName = `greentracer-report-${fileHost || "website"}.pdf`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const reportSchema = shouldIndex
    ? {
        "@context": "https://schema.org",
        "@type": "Report",
        name: `Website Carbon Report for ${hostname}`,
        description: pageDescription,
        url: canonical,
        author: { "@type": "Organization", name: "GreenTracer" },
        datePublished: schemaDate,
      }
    : null;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content={shouldIndex ? "index,follow" : "noindex,nofollow,noarchive,nosnippet,noimageindex"} />
        <meta name="googlebot" content={shouldIndex ? "index,follow" : "noindex,nofollow,noarchive,nosnippet,noimageindex"} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content="https://www.greentracer.org/GreenFavi.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonical} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content="https://www.greentracer.org/GreenFavi.png" />
        {reportSchema && <script type="application/ld+json">{JSON.stringify(reportSchema)}</script>}
      </Helmet>

      <style>{reportStyles}</style>

      <section className="gt-report gt-report-bg relative min-h-screen overflow-hidden px-4 py-8 text-[#f5fbff] sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(to_right,rgba(245,251,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,251,255,0.035)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(0,208,132,0.08),transparent)]" />

        <div className="relative z-10 mx-auto max-w-[1440px] space-y-10">
          <ReportHero
            result={result}
            hostname={hostname}
            testedOn={testedOn}
            carbonValue={carbonValue}
            percentileValue={percentileValue}
            gradeLabel={gradeLabel}
            onDownloadPdf={handleDownloadPdf}
            onRefresh={() => fetchData()}
            onCopyBadge={copyHeroBadge}
            copiedBadge={copiedBadge}
          />

          <TrafficImpactCalculator
            carbonPerView={carbonValue}
            percentile={percentileValue}
          />

          <ResultBreakdownSection
            carbonPerView={carbonValue}
            greenHost={Boolean(result.greenHost)}
            percentile={percentileValue}
            lighthouseScores={lighthouseScores}
          />

          <BadgeEligibilitySection
            siteUrl={result.url}
            greenHost={Boolean(result.greenHost)}
            resultSlug={resultSlug}
            grade={gradeLabel}
            verified={verifiedInput}
          />

          <VerifiedDirectoryCta />

          <RecommendationSection
            greenHost={Boolean(result.greenHost)}
            onRefresh={() => fetchData()}
          />

          <MethodologyAccordion />
        </div>
      </section>
    </>
  );
}
