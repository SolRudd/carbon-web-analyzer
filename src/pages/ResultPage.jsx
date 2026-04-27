// src/routes/ResultPage.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaArrowRight,
  FaBolt,
  FaCheckCircle,
  FaChartLine,
  FaClipboardCheck,
  FaFilePdf,
  FaRedo,
  FaServer,
  FaShieldAlt,
} from "react-icons/fa";

import LoadingOverlay from "../components/LoadingOverlay";
import BadgePromo from "../components/BadgePromo";
import { API_BASE } from "../config";

const INDEX_RESULTS_FLAG = String(import.meta.env.VITE_INDEX_RESULTS || "").toLowerCase() === "true";

function ErrorDisplay({ message }) {
  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-500">Error</h1>
      <p className="text-slate-600 dark:text-slate-300">{message}</p>
      <Link to="/" className="underline text-green-600 dark:text-green-400 mt-6 inline-block">
        &larr; Back to Homepage
      </Link>
    </div>
  );
}

const gradeColorMap = {
  "A+": "text-emerald-500",
  A: "text-green-500",
  B: "text-lime-500",
  C: "text-yellow-500",
  D: "text-orange-500",
  E: "text-red-500",
  F: "text-red-600",
};

const getPerformanceInsight = (percentile) => {
  const pct = Number(percentile) || 0;
  if (pct >= 75) return "Strong delivery efficiency compared with tested pages.";
  if (pct >= 50) return "Moderate efficiency. There is room to improve payload and runtime costs.";
  return "Lower-than-average efficiency signal. Prioritize performance optimization opportunities.";
};

const formatScore = (value) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
};

const scoreToneClass = (score) => {
  if (typeof score !== "number") return "text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600";
  if (score >= 90) return "text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700";
  if (score >= 75) return "text-lime-700 dark:text-lime-300 border-lime-300 dark:border-lime-700";
  if (score >= 50) return "text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700";
  return "text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700";
};

function ReportSection({ eyebrow, title, description, children, id = "" }) {
  return (
    <section id={id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_56px_-38px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900 sm:p-7">
      <div className="mb-5">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-slate-900 dark:text-white sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function SignalCard({ label, value, detail, tone = "slate", icon: Icon }) {
  const toneClasses = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200",
    amber: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200",
    rose: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-200",
    sky: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-200",
    slate: "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200",
  };

  return (
    <article className={`rounded-2xl border p-4 ${toneClasses[tone] || toneClasses.slate}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.02em]">{value}</p>
        </div>
        {Icon && <Icon className="mt-1 shrink-0 opacity-70" aria-hidden="true" />}
      </div>
      {detail && <p className="mt-3 text-sm leading-6 opacity-80">{detail}</p>}
    </article>
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

  drawRectTop(0, 0, pageWidth, 90, "0.06 0.50 0.26");
  drawRectTop(0, 90, pageWidth, 26, "0.05 0.42 0.22");
  drawTextTop(42, 36, "GreenTracer Website Intelligence Report", { size: 18, color: "1 1 1", font: "F2", lineGap: 20 });
  drawTextTop(42, 64, `Generated on ${report.testedOn}`, { size: 10, color: "0.92 0.97 0.94" });
  drawTextTop(430, 50, "greentracer.org", { size: 10, color: "0.92 0.97 0.94", font: "F2", maxLen: 20 });

  drawRectTop(36, 136, 523, 95, "0.95 0.98 0.96");
  drawTextTop(52, 160, "Report Context", { size: 12, font: "F2", color: "0.06 0.40 0.22" });
  drawTextTop(52, 182, `Tested URL: ${report.url}`, { size: 10, maxLen: 80 });
  drawTextTop(52, 198, `Hostname: ${report.hostname}`, { size: 10 });
  drawTextTop(52, 214, `Date: ${report.testedOn}`, { size: 10 });

  drawRectTop(36, 252, 255, 180, "0.98 0.99 0.99");
  drawTextTop(52, 276, "Core Sustainability Metrics", { size: 12, font: "F2", color: "0.06 0.40 0.22" });
  drawTextTop(52, 302, `Carbon Intensity: ${report.carbonIntensity}`, { size: 11, font: "F2" });
  drawTextTop(52, 321, `Grade: ${report.grade}`, { size: 11 });
  drawTextTop(52, 339, `Percentile: ${report.percentile}`, { size: 11 });
  drawTextTop(52, 357, `Green Hosting: ${report.greenHosting}`, { size: 11 });

  drawRectTop(304, 252, 255, 180, "0.98 0.99 0.99");
  drawTextTop(320, 276, "Lighthouse Categories", { size: 12, font: "F2", color: "0.06 0.40 0.22" });
  drawTextTop(320, 302, `Performance: ${scoreText(report.scores.performance)}`, { size: 11 });
  drawTextTop(320, 320, `Accessibility: ${scoreText(report.scores.accessibility)}`, { size: 11 });
  drawTextTop(320, 338, `SEO: ${scoreText(report.scores.seo)}`, { size: 11 });
  drawTextTop(320, 356, `Best Practices: ${scoreText(report.scores.bestPractices)}`, { size: 11 });

  drawRectTop(36, 448, 523, 110, "0.95 0.97 0.99");
  drawTextTop(52, 472, "Hosting and Badge Status", { size: 12, font: "F2", color: "0.06 0.32 0.49" });
  drawTextTop(52, 496, report.greenHost
    ? "Green hosting was detected for this report. Green Hosting Detected badge eligibility is active."
    : "Green hosting was not detected for this report. The Green Hosting badge is not active for this result.", {
    size: 10,
    maxLen: 88,
    lineGap: 13
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

export default function ResultPage() {
  const { slug } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/results/${encodeURIComponent(slug)}`)
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
        console.error("Failed to fetch result:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingOverlay />;
  if (error) return <ErrorDisplay message={error} />;
  if (!result) return <ErrorDisplay message="Result data is unavailable." />;

  const shouldIndex = INDEX_RESULTS_FLAG;
  const canonical = `https://www.greentracer.org${location.pathname}`;
  const pageTitle = `Carbon Report for ${result.url} | GreenTracer`;
  const pageDescription = `An automated carbon footprint analysis for ${result.url}, showing a score of ${result.carbonEstimate}g CO₂e per page view and a grade of ${result.grade}.`;

  const resultTime = result.timestamp || result.created_at || result.createdAt;
  const testedOn = new Date(resultTime).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hostname = (() => {
    try {
      return new URL(result.url).hostname;
    } catch {
      return result.url || slug;
    }
  })();

  const gradeColor = gradeColorMap[result.grade] || "text-slate-500";
  const percentileValue = Math.max(0, Math.min(100, Math.round(Number(result.percentile || 0))));
  const lighthouseScores = result.lighthouseScores || {};
  const perfScore = formatScore(lighthouseScores.performance);
  const seoScore = formatScore(lighthouseScores.seo);
  const accessibilityScore = formatScore(lighthouseScores.accessibility);
  const bestPracticesScore = formatScore(lighthouseScores["best-practices"] ?? lighthouseScores.bestPractices);
  const trustScores = [
    { label: "Performance", icon: FaBolt, value: perfScore },
    { label: "SEO", icon: FaChartLine, value: seoScore },
    { label: "Accessibility", icon: FaShieldAlt, value: accessibilityScore },
    { label: "Best practices", icon: FaCheckCircle, value: bestPracticesScore },
  ];
  const carbonValue = Number(result.carbonEstimate || 0);
  const gradeTone = ["A+", "A", "B"].includes(result.grade)
    ? "emerald"
    : ["C", "D"].includes(result.grade)
      ? "amber"
      : "rose";
  const recommendationCards = [
    {
      title: "Reduce transfer weight",
      body: "Prioritize image compression, script pruning, and critical-path CSS. Lower payload directly reduces the estimated carbon per page view.",
      action: "Review methodology",
      to: "/how-it-works",
    },
    {
      title: result.greenHost ? "Keep hosting evidence current" : "Review hosting provider",
      body: result.greenHost
        ? "Green hosting was detected for this scan. Re-run scans after infrastructure or CDN changes so the public badge remains accurate."
        : "Green hosting was not detected. Moving to a provider listed by the Green Web Foundation can improve the hosting signal.",
      action: result.greenHost ? "Get hosting badge" : "Request hosting review",
      href: result.greenHost ? "#badge-options" : "https://buzzboost.co.uk/contact/",
    },
    {
      title: "Publish the right trust signal",
      body: "Use free report-backed badges for scan facts. GreenTracer Verified is a paid supporter/member signal and does not require a perfect carbon score.",
      action: "Badge actions",
      href: "#badge-options",
    },
  ];
  const handleDownloadPdf = () => {
    const blob = createPdfBlob({
      url: result.url,
      hostname,
      testedOn,
      carbonIntensity: `${Number(result.carbonEstimate || 0).toFixed(2)} g CO₂ per page view`,
      grade: result.grade || "Unavailable",
      percentile: `${percentileValue}% cleaner than tested pages`,
      greenHost: !!result.greenHost,
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
        name: `Website Carbon Report for ${result.url}`,
        description: pageDescription,
        url: canonical,
        author: { "@type": "Organization", name: "GreenTracer" },
        datePublished: new Date(resultTime).toISOString(),
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

      <section className="min-h-screen bg-slate-100/70 px-4 py-10 text-slate-900 dark:bg-[#020f1e] dark:text-white sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_56px_-38px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900 sm:p-8 lg:p-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                  <FaClipboardCheck aria-hidden="true" />
                  Website audit report
                </p>
                <h1 className="mt-4 break-words text-3xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white sm:text-5xl">
                  {hostname}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Saved GreenTracer analysis for {result.url}. This report combines page carbon estimate, green hosting detection, performance signals, and badge eligibility.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  <FaFilePdf className="text-xs" aria-hidden="true" />
                  Export PDF
                </button>
                <button
                  type="button"
                  onClick={fetchData}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  <FaRedo className="text-xs" aria-hidden="true" />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <SignalCard label="Domain" value={hostname} detail="Normalized scan target" tone="slate" />
              <SignalCard label="Grade" value={result.grade || "N/A"} detail={`${percentileValue}% efficiency percentile`} tone={gradeTone} />
              <SignalCard label="Carbon" value={`${carbonValue.toFixed(2)}g`} detail="CO₂e per page view" tone="sky" />
              <SignalCard
                label="Hosting"
                value={result.greenHost ? "Green detected" : "Not detected"}
                detail={result.greenHost ? "Eligible for Green Hosting badge" : "No green-hosting claim for this report"}
                tone={result.greenHost ? "emerald" : "amber"}
                icon={FaServer}
              />
              <SignalCard label="Last scanned" value={testedOn} detail="Saved public result" tone="slate" />
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <ReportSection
              eyebrow="Carbon result"
              title="Page carbon estimate"
              description="GreenTracer estimates carbon from measured page weight, energy intensity, grid intensity, and hosting state. The figure below is per page view."
            >
              <div className="grid gap-4 sm:grid-cols-[220px_1fr] sm:items-center">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-800/40">
                  <p className={`text-6xl font-semibold tracking-[-0.06em] ${gradeColor}`}>{result.grade}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Report grade</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Carbon intensity</p>
                    <p className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                      {carbonValue.toFixed(2)}
                      <span className="ml-2 text-base font-medium tracking-normal text-slate-500 dark:text-slate-400">g CO₂e/view</span>
                    </p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percentileValue}%` }} />
                  </div>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    This page is estimated to be cleaner than {percentileValue}% of tested pages in the current GreenTracer dataset.
                  </p>
                </div>
              </div>
            </ReportSection>

            <ReportSection
              eyebrow="Hosting"
              title={result.greenHost ? "Green hosting detected" : "Green hosting not detected"}
              description={result.greenHost
                ? "This report supports the free Green Hosting badge. Keep the scan current after infrastructure changes."
                : "This result should not publish a Green Hosting badge. The Carbon Tested badge remains available from the saved report."}
            >
              <div className={`rounded-2xl border p-4 ${
                result.greenHost
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200"
                  : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200"
              }`}>
                <div className="flex items-start gap-3">
                  <FaServer className="mt-1 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">{result.greenHost ? "Hosting evidence supports a public badge." : "No green hosting evidence was found."}</p>
                    <p className="mt-2 text-sm leading-6 opacity-85">
                      {result.greenHost
                        ? `Estimated hosting-related reduction is about ${Math.round(Number(result.reductionPct || 0))}%.`
                        : "If the site uses green hosting behind a CDN or proxy, run another scan after DNS/provider changes or review provider data."}
                    </p>
                  </div>
                </div>
              </div>
            </ReportSection>
          </div>

          <ReportSection
            eyebrow="Performance signals"
            title="Technical quality indicators"
            description="Lighthouse category scores are included when the saved measurement contains them. Missing scores are shown as unavailable rather than inferred."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {trustScores.map(({ label, icon, value }) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {React.createElement(icon, { className: "text-slate-400", "aria-hidden": true })}
                      {label}
                    </span>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${scoreToneClass(value)}`}>
                      {typeof value === "number" ? `${value}/100` : "Unavailable"}
                    </span>
                  </div>
                  {label === "Performance" && (
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {typeof value === "number" ? getPerformanceInsight(result.percentile) : "Re-run a scan to capture this signal."}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ReportSection>

          <ReportSection
            eyebrow="Recommendations"
            title="Next actions"
            description="These actions keep the report practical: reduce page weight, keep hosting claims current, and publish only the badge that the data supports."
          >
            <div className="grid gap-3 lg:grid-cols-3">
              {recommendationCards.map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
                  {item.to ? (
                    <Link to={item.to} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200">
                      {item.action}
                      <FaArrowRight className="text-xs" aria-hidden="true" />
                    </Link>
                  ) : (
                    <a href={item.href} target={item.href?.startsWith("#") ? undefined : "_blank"} rel={item.href?.startsWith("#") ? undefined : "noopener noreferrer"} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200">
                      {item.action}
                      <FaArrowRight className="text-xs" aria-hidden="true" />
                    </a>
                  )}
                </article>
              ))}
            </div>
          </ReportSection>

          <BadgePromo
            siteUrl={result.url}
            greenHost={!!result.greenHost}
            resultSlug={result.slug || slug}
            grade={result.grade}
          />

          <ReportSection
            eyebrow="Verified badge"
            title="Paid verification is a supporter/member signal"
            description="GreenTracer Verified does not mean the site has a perfect carbon score. It means the organization has an active paid or manually approved supporter status, a managed domain, and a profile/directory path."
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/pricing" className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                View verified plans
              </Link>
              <Link to="/dashboard" className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">
                Manage verified badge
              </Link>
            </div>
          </ReportSection>
        </div>
      </section>
    </>
  );
}
