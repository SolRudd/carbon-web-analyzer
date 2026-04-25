import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  FaArrowRight,
  FaChartBar,
  FaChartLine,
  FaDatabase,
  FaGlobe,
  FaLeaf,
  FaQuestionCircle,
  FaRocket,
  FaTerminal,
  FaTrophy,
} from "react-icons/fa";

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap');

  .gt-page {
    --gt-bg: #04111f;
    --gt-bg-soft: #071827;
    --gt-panel: rgba(7, 24, 39, 0.9);
    --gt-panel-2: rgba(9, 29, 46, 0.96);
    --gt-border: rgba(255,255,255,0.08);
    --gt-border-strong: rgba(74, 222, 128, 0.24);
    --gt-text: #f8fafc;
    --gt-muted: #94a3b8;
    --gt-muted-2: #64748b;
    --gt-green: #22c55e;
    --gt-green-2: #16a34a;
    --gt-green-3: #4ade80;
    --gt-white-btn: #f8fafc;
    --gt-dark-btn: #0f172a;
    font-family: 'Inter', sans-serif;
    background:
      radial-gradient(circle at top center, rgba(34,197,94,0.06), transparent 24%),
      linear-gradient(180deg, #03101d 0%, #04111f 35%, #04111f 100%);
    color: var(--gt-text);
  }

  html:not(.dark) .gt-page {
    --gt-bg: #ffffff;
    --gt-bg-soft: #f8fafc;
    --gt-panel: rgba(255, 255, 255, 0.85);
    --gt-panel-2: rgba(248, 250, 252, 0.95);
    --gt-border: rgba(0,0,0,0.07);
    --gt-border-strong: rgba(22, 163, 74, 0.22);
    --gt-text: #0f172a;
    --gt-muted: #475569;
    --gt-muted-2: #64748b;
    --gt-green: #16a34a;
    --gt-green-2: #15803d;
    --gt-green-3: #16a34a;
    --gt-white-btn: #0f172a;
    --gt-dark-btn: #f8fafc;
    background:
      radial-gradient(circle at top center, rgba(34,197,94,0.04), transparent 24%),
      linear-gradient(180deg, #f8fafc 0%, #ffffff 35%, #ffffff 100%);
    color: var(--gt-text);
  }

  .gt-display {
    font-family: 'Fraunces', serif;
    letter-spacing: -0.03em;
  }

  .gt-mono {
    font-family: 'JetBrains Mono', monospace;
  }

  .gt-hero-grid {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.10));
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.10));
  }

  .gt-panel {
    background: linear-gradient(180deg, var(--gt-panel) 0%, var(--gt-panel-2) 100%);
    border: 1px solid var(--gt-border);
    border-radius: 28px;
    backdrop-filter: blur(10px);
    box-shadow: 0 18px 60px -32px rgba(0,0,0,0.6);
  }

  .gt-card {
    position: relative;
    overflow: hidden;
    transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
  }

  .gt-card:hover {
    transform: translateY(-3px);
    border-color: rgba(255,255,255,0.12);
  }

  .gt-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid var(--gt-border);
    background: rgba(5, 19, 31, 0.7);
  }

  .gt-icon-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 16px;
    border: 1px solid var(--gt-border);
    background: rgba(255,255,255,0.04);
    color: var(--gt-green-3);
    flex: 0 0 auto;
  }

  .gt-stat {
    min-width: 120px;
  }

  .gt-stat__value {
    color: var(--gt-green-3);
  }

  .gt-grade-btn {
    min-width: 72px;
    min-height: 56px;
    border-radius: 16px;
    border: 1px solid var(--gt-border);
    background: rgba(255,255,255,0.04);
    color: var(--gt-text);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 800;
    transition: transform .18s ease, border-color .18s ease, background .18s ease, color .18s ease;
  }

  .gt-grade-btn:hover {
    transform: translateY(-1px);
    border-color: rgba(255,255,255,0.14);
  }

  .gt-grade-btn.is-active {
    color: white;
    box-shadow: 0 14px 28px -18px rgba(0,0,0,0.55);
  }

  .gt-toggle {
    display: inline-flex;
    align-items: center;
    padding: 5px;
    border-radius: 999px;
    border: 1px solid var(--gt-border);
    background: rgba(6, 22, 35, 0.84);
  }

  .gt-toggle__btn {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--gt-muted);
    border-radius: 999px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background .18s ease, color .18s ease;
  }

  .gt-toggle__btn:hover {
    color: var(--gt-text);
  }

  .gt-toggle__btn.is-active {
    background: linear-gradient(135deg, var(--gt-green-2) 0%, var(--gt-green) 100%);
    color: white;
    box-shadow: 0 12px 24px -14px rgba(34,197,94,0.65);
  }

  .gt-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid var(--gt-border);
    background: rgba(255,255,255,0.04);
    color: var(--gt-muted);
    font-size: 12px;
    font-weight: 700;
  }

  .gt-divider {
    border-top: 1px solid var(--gt-border);
  }

  .gt-btn,
  .gt-link-btn {
    min-height: 54px;
    border-radius: 999px;
    font-weight: 800;
    transition: transform .18s ease, filter .18s ease, background .18s ease;
  }

  .gt-btn:hover,
  .gt-link-btn:hover {
    transform: translateY(-1px);
  }

  .gt-btn--light {
    background: var(--gt-white-btn);
    color: var(--gt-dark-btn);
  }

  .gt-btn--green {
    background: linear-gradient(135deg, var(--gt-green-2) 0%, var(--gt-green) 100%);
    color: white;
  }

  .gt-btn--ghost {
    background: rgba(255,255,255,0.06);
    color: white;
    border: 1px solid var(--gt-border);
  }

  .gt-btn--light:hover,
  .gt-btn--green:hover,
  .gt-btn--ghost:hover {
    filter: brightness(1.03);
  }

  .gt-btn:focus-visible,
  .gt-link-btn:focus-visible,
  .gt-grade-btn:focus-visible,
  .gt-toggle__btn:focus-visible {
    outline: 2px solid var(--gt-green-3);
    outline-offset: 2px;
  }

  .gt-table-wrap {
    overflow-x: auto;
  }

  .gt-table-wrap table {
    min-width: 760px;
  }

  .gt-chart-panel {
    height: 420px;
  }

  .gt-threshold-box {
    border: 1px solid var(--gt-border);
    background: rgba(255,255,255,0.04);
  }

  .gt-row-selected {
    background: rgba(255,255,255,0.04);
  }

  .gt-row-hover:hover {
    background: rgba(255,255,255,0.03);
  }

  @media (max-width: 767px) {
    .gt-chart-panel {
      height: 340px;
    }
  }

  /* Light mode typography */
  html:not(.dark) .gt-page h1,
  html:not(.dark) .gt-page h2,
  html:not(.dark) .gt-page h3,
  html:not(.dark) .gt-page h4 {
    color: #0f172a;
  }

  html:not(.dark) .gt-page .text-slate-300 {
    color: #475569;
  }

  html:not(.dark) .gt-page section {
    border-color: rgba(0,0,0,0.06) !important;
  }

  html:not(.dark) .gt-hero-grid {
    background-image:
      linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
  }

  html:not(.dark) .gt-panel {
    background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%);
    border-color: rgba(0,0,0,0.07);
    box-shadow: 0 4px 24px -8px rgba(0,0,0,0.08);
  }

  html:not(.dark) .gt-card:hover {
    border-color: rgba(0,0,0,0.10);
  }

  html:not(.dark) .gt-chip {
    background: rgba(255,255,255,0.9);
    border-color: rgba(0,0,0,0.08);
  }

  html:not(.dark) .gt-icon-box {
    background: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.08);
    color: var(--gt-green);
  }

  html:not(.dark) .gt-stat__value {
    color: var(--gt-green);
  }

  html:not(.dark) .gt-grade-btn {
    background: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.08);
    color: #0f172a;
  }

  html:not(.dark) .gt-grade-btn:hover {
    border-color: rgba(0,0,0,0.14);
  }

  html:not(.dark) .gt-toggle {
    background: rgba(255,255,255,0.85);
    border-color: rgba(0,0,0,0.08);
  }

  html:not(.dark) .gt-badge {
    background: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.08);
    color: #475569;
  }

  html:not(.dark) .gt-divider {
    border-top-color: rgba(0,0,0,0.07);
  }

  html:not(.dark) .gt-btn--ghost {
    background: rgba(0,0,0,0.04);
    color: #0f172a;
    border-color: rgba(0,0,0,0.10);
  }

  html:not(.dark) .gt-threshold-box {
    background: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.08);
  }

  html:not(.dark) .gt-row-selected {
    background: rgba(0,0,0,0.02);
  }

  html:not(.dark) .gt-row-hover:hover {
    background: rgba(0,0,0,0.02);
  }

  @media (prefers-reduced-motion: reduce) {
    .gt-card,
    .gt-btn,
    .gt-link-btn,
    .gt-grade-btn,
    .gt-toggle__btn {
      transition: none !important;
    }

    .gt-card:hover,
    .gt-btn:hover,
    .gt-link-btn:hover,
    .gt-grade-btn:hover {
      transform: none !important;
    }
  }
`;

const chartData = [
  { grade: "A+", value: 0.095, label: "Ultra-Efficient", count: 12 },
  { grade: "A", value: 0.186, label: "Efficient", count: 18 },
  { grade: "B", value: 0.341, label: "Good", count: 25 },
  { grade: "C", value: 0.493, label: "Average", count: 20 },
  { grade: "D", value: 0.656, label: "Below Average", count: 15 },
  { grade: "E", value: 0.846, label: "Less Efficient", count: 8 },
  { grade: "F", value: 1.0, label: "Above Global Average", count: 2 },
];

const gradeColors = {
  "A+": "#10b981",
  A: "#22c55e",
  B: "#84cc16",
  C: "#eab308",
  D: "#f59e0b",
  E: "#f97316",
  F: "#ef4444",
};

const gradeDetails = [
  {
    grade: "A+",
    title: "Ultra-Efficient",
    description:
      "Exceptional performance. Your site sits in the highest-performing sustainability tier and reflects a very low-impact page experience.",
    tips: ["Optimised images", "Minimal JavaScript", "Green hosting", "Efficient delivery"],
  },
  {
    grade: "A",
    title: "Efficient",
    description:
      "A strong result. Your website performs very well environmentally and already shows good optimisation choices.",
    tips: ["Lean assets", "Reasonable file sizes", "Fast delivery", "Efficient hosting"],
  },
  {
    grade: "B",
    title: "Good",
    description:
      "Above-average environmental performance with clear opportunities to become even lighter and more efficient.",
    tips: ["Image optimisation", "Code minification", "Compression", "Script review"],
  },
  {
    grade: "C",
    title: "Average",
    description:
      "A typical result. There is room to reduce emissions and improve overall efficiency without a full rebuild.",
    tips: ["Reduce image sizes", "Audit plugins", "Optimise CSS/JS", "Reduce third parties"],
  },
  {
    grade: "D",
    title: "Below Average",
    description:
      "This score suggests your website is carrying more weight than it should and would benefit from focused optimisation work.",
    tips: ["Compress assets", "Remove unused code", "Review hosting", "Improve media delivery"],
  },
  {
    grade: "E",
    title: "Less Efficient",
    description:
      "Significant improvements are recommended. The current page experience is likely generating avoidable emissions.",
    tips: ["Major image optimisation", "Refactor code", "Reduce dependencies", "Upgrade hosting"],
  },
  {
    grade: "F",
    title: "Above Global Average",
    description:
      "This is the heaviest end of the scale. A full sustainability and performance review is recommended.",
    tips: ["Full audit", "Professional optimisation", "Green hosting", "Large asset reduction"],
  },
];

function useTailwindDark() {
  const [dark, setDark] = useState(
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() =>
      setDark(html.classList.contains("dark"))
    );
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0]?.payload;
  if (!item) return null;

  const dark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <div
      style={{
        background: dark ? "rgba(6,22,35,0.96)" : "rgba(255,255,255,0.96)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: "14px",
        padding: "12px 14px",
        boxShadow: dark ? "0 18px 40px -24px rgba(0,0,0,0.65)" : "0 8px 24px -8px rgba(0,0,0,0.12)",
        color: dark ? "#f8fafc" : "#0f172a",
        minWidth: 180,
      }}
    >
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: dark ? "#94a3b8" : "#64748b",
          marginBottom: 6,
        }}
      >
        Grade {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
        {item.label}
      </div>
      <div style={{ fontSize: 13, color: dark ? "#cbd5e1" : "#475569" }}>
        {item.grade !== "F" ? `≤ ${item.value.toFixed(3)} g CO₂e / view` : "≥ 0.847 g CO₂e / view"}
      </div>
    </div>
  );
}

export default function RatingPage() {
  const isDark = useTailwindDark();
  const [selectedGrade, setSelectedGrade] = useState("A+");
  const [activeChart, setActiveChart] = useState("bar");

  const tickColor = isDark ? "#cbd5e1" : "#334155";

  const selectedGradeInfo = useMemo(
    () => gradeDetails.find((g) => g.grade === selectedGrade),
    [selectedGrade]
  );

  const selectedGradeData = useMemo(
    () => chartData.find((g) => g.grade === selectedGrade),
    [selectedGrade]
  );

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "GreenTracer Carbon Rating System",
    description:
      "Learn how GreenTracer grades website environmental impact from A+ to F based on CO₂ emissions, and get tips to improve your score.",
    url: "https://www.greentracer.org/rating",
  };

  return (
    <>
      <Helmet>
        <title>Carbon Rating System | GreenTracer</title>
        <meta
          name="description"
          content="Understand how GreenTracer grades your website's environmental impact from A+ to F. Explore our CO₂ rating scale, thresholds, and optimisation guidance."
        />
        <link rel="canonical" href="https://www.greentracer.org/rating" />
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      </Helmet>

      <div className="gt-page min-h-screen">
        <style>{pageStyles}</style>

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/5 px-6 pb-16 pt-28 sm:pt-32">
          <div className="gt-hero-grid absolute inset-0 pointer-events-none opacity-60" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-[-120px] h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-green-500/10 blur-[120px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="gt-chip">
                <FaChartBar className="text-[11px] text-green-400" />
                <span className="gt-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Rating Protocol
                </span>
              </div>
            </div>

            <h1 className="gt-display mx-auto max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl md:text-7xl">
              The carbon
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text italic font-light text-transparent">
                grading system
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              Understand how GreenTracer turns page-level CO₂ estimates into a
              clear A+ to F grading system, rooted in benchmark thresholds and
              practical optimisation guidance.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="gt-badge">7 grade levels</span>
              <span className="gt-badge">CO₂e per page view</span>
              <span className="gt-badge">Benchmark-led thresholds</span>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10">
              <div className="gt-stat text-center">
                <div className="gt-mono gt-stat__value text-2xl font-bold">7</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Grade Levels
                </div>
              </div>
              <div className="gt-stat text-center">
                <div className="gt-mono gt-stat__value text-2xl font-bold">A+–F</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Full Scale
                </div>
              </div>
              <div className="gt-stat text-center">
                <div className="gt-mono gt-stat__value text-2xl font-bold">g/view</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Core Metric
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTEXT CARDS */}
        <section className="border-b border-white/5 px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            <article className="gt-panel gt-card p-8">
              <div className="gt-icon-box mb-4">
                <FaGlobe className="text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white">Why the scale matters</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                A raw emissions number is useful, but a grading system makes it
                easier to understand where a website sits relative to better and
                worse-performing pages.
              </p>
            </article>

            <article className="gt-panel gt-card p-8">
              <div className="gt-icon-box mb-4">
                <FaChartLine className="text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white">Clear benchmarking</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Each grade corresponds to a threshold in grams of CO₂e per page
                view, helping you translate technical output into a clear
                performance position.
              </p>
            </article>

            <article className="gt-panel gt-card p-8">
              <div className="gt-icon-box mb-4">
                <FaTrophy className="text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white">Actionable outcomes</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                The goal is not just to label a site, but to show what that
                grade means and where optimisation effort can have the most
                impact.
              </p>
            </article>
          </div>
        </section>

        {/* INTERACTIVE GRADING */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <div className="gt-mono mb-4 text-xs font-bold uppercase tracking-[0.22em] text-green-400">
                // INTERACTIVE_SCALE
              </div>
              <h2 className="gt-display text-3xl font-bold text-white sm:text-4xl">
                Explore each grade
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                Select a grade to see its threshold, interpretation, and the
                kinds of optimisations commonly associated with that level.
              </p>
            </div>

            <div className="mb-8 flex flex-wrap justify-center gap-3">
              {gradeDetails.map((g) => (
                <button
                  key={g.grade}
                  type="button"
                  onClick={() => setSelectedGrade(g.grade)}
                  aria-pressed={selectedGrade === g.grade}
                  className={`gt-grade-btn ${selectedGrade === g.grade ? "is-active" : ""}`}
                  style={
                    selectedGrade === g.grade
                      ? { backgroundColor: gradeColors[g.grade], borderColor: "transparent" }
                      : {}
                  }
                >
                  {g.grade}
                </button>
              ))}
            </div>

            {selectedGradeInfo && selectedGradeData && (
              <div className="gt-panel rounded-[28px] p-8 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <div className="mb-5 flex items-start gap-4">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-extrabold text-white"
                        style={{ backgroundColor: gradeColors[selectedGradeInfo.grade] }}
                      >
                        {selectedGradeInfo.grade}
                      </div>

                      <div>
                        <div className="gt-mono mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          // SELECTED_GRADE
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          {selectedGradeInfo.title}
                        </h3>
                        <p className="mt-1 text-sm font-semibold" style={{ color: gradeColors[selectedGradeInfo.grade] }}>
                          {selectedGradeInfo.grade === "F"
                            ? "High-impact threshold"
                            : "Maximum threshold benchmark"}
                        </p>
                      </div>
                    </div>

                    <p className="max-w-2xl text-base leading-relaxed text-slate-400">
                      {selectedGradeInfo.description}
                    </p>

                    <div className="mt-6 inline-flex items-center gap-3 rounded-2xl px-4 py-3 gt-threshold-box">
                      <span className="gt-mono text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Threshold
                      </span>
                      <span
                        className="gt-mono text-sm font-bold"
                        style={{ color: gradeColors[selectedGradeInfo.grade] }}
                      >
                        {selectedGradeInfo.grade !== "F"
                          ? `≤ ${selectedGradeData.value.toFixed(3)} g CO₂e / view`
                          : "≥ 0.847 g CO₂e / view"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/8 bg-white/4 p-6">
                    <div className="gt-mono mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      <FaTerminal />
                      Optimisation vectors
                    </div>

                    <ul className="space-y-3">
                      {selectedGradeInfo.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                          <span
                            className="mt-2 h-2 w-2 rounded-full"
                            style={{ backgroundColor: gradeColors[selectedGradeInfo.grade] }}
                          />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="gt-divider my-6" />

                    <div className="flex items-start gap-3 text-sm text-slate-400">
                      <FaQuestionCircle className="mt-0.5 flex-shrink-0 text-slate-500" />
                      <p>
                        Grades are designed to make the emissions number easier
                        to understand at a glance, not replace the underlying
                        metric itself.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CHARTS */}
        <section className="border-t border-white/5 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col items-center justify-between gap-5 sm:flex-row">
              <div>
                <div className="gt-mono mb-3 text-xs font-bold uppercase tracking-[0.22em] text-green-400">
                  // VISUAL_BENCHMARK
                </div>
                <h2 className="text-3xl font-bold text-white">Threshold chart</h2>
                <p className="mt-2 max-w-2xl text-slate-400">
                  Compare the full A+ to F scale in either bar or area view.
                </p>
              </div>

              <div className="gt-toggle" role="tablist" aria-label="Chart type">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeChart === "bar"}
                  className={`gt-toggle__btn ${activeChart === "bar" ? "is-active" : ""}`}
                  onClick={() => setActiveChart("bar")}
                >
                  Bar Chart
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeChart === "area"}
                  className={`gt-toggle__btn ${activeChart === "area" ? "is-active" : ""}`}
                  onClick={() => setActiveChart("area")}
                >
                  Area Chart
                </button>
              </div>
            </div>

            <div className="gt-panel gt-chart-panel p-6 sm:p-8">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === "bar" ? (
                  <BarChart
                    data={chartData}
                    margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
                  >
                    <XAxis
                      dataKey="grade"
                      tick={{
                        fill: tickColor,
                        fontFamily: "JetBrains Mono",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fill: tickColor,
                        fontFamily: "Inter",
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={58}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.grade}
                          fill={gradeColors[entry.grade]}
                          opacity={selectedGrade === entry.grade ? 1 : 0.68}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <AreaChart
                    data={chartData}
                    margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
                  >
                    <defs>
                      <linearGradient id="gtAreaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.36} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="grade"
                      tick={{
                        fill: tickColor,
                        fontFamily: "JetBrains Mono",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fill: tickColor,
                        fontFamily: "Inter",
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={58}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#22c55e"
                      strokeWidth={3}
                      fill="url(#gtAreaFill)"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* RAW DATA TABLE */}
        <section className="border-t border-white/5 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <div className="gt-mono mb-3 text-xs font-bold uppercase tracking-[0.22em] text-green-400">
                // RAW_DATA_LOG
              </div>
              <h2 className="text-3xl font-bold text-white">Threshold reference table</h2>
              <p className="mt-2 max-w-2xl text-slate-400">
                A quick-reference view of each grade, threshold, classification,
                and illustrative distribution.
              </p>
            </div>

            <div className="gt-panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/8 bg-white/4 px-6 py-4">
                <span className="gt-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Benchmark Data
                </span>
                <FaDatabase className="text-slate-500" />
              </div>

              <div className="gt-table-wrap">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-white/8 bg-white/3 text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-bold uppercase tracking-[0.14em]">Grade</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-[0.14em]">Threshold</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-[0.14em]">Classification</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-[0.14em]">Distribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map(({ grade, value, label, count }) => (
                      <tr
                        key={grade}
                        className={`${selectedGrade === grade ? "gt-row-selected" : "gt-row-hover"}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white"
                              style={{ backgroundColor: gradeColors[grade] }}
                            >
                              {grade}
                            </div>
                          </div>
                        </td>
                        <td className="gt-mono px-6 py-4 font-medium text-slate-300">
                          {grade !== "F" ? `≤ ${value.toFixed(3)} g/view` : "≥ 0.847 g/view"}
                        </td>
                        <td className="px-6 py-4 text-slate-300">{label}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-28 overflow-hidden rounded-full bg-white/8">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(count / 25) * 100}%`,
                                  backgroundColor: gradeColors[grade],
                                }}
                              />
                            </div>
                            <span className="gt-mono text-xs text-slate-500">{count}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-20 pt-8">
          <div className="mx-auto max-w-5xl">
            <div className="gt-panel relative overflow-hidden border-white/10 px-8 py-12 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(74,222,128,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_34%)]" />

              <div className="relative z-10 mx-auto max-w-3xl text-center">
                <div className="gt-mono mb-4 text-xs font-bold uppercase tracking-[0.22em] text-green-300">
                  // NEXT_STEP
                </div>
                <h2 className="gt-display text-3xl font-bold text-white sm:text-4xl">
                  Discover your grade
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
                  Run your site through the GreenTracer engine to see exactly
                  where it sits on the scale and what to improve next.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    to="/#input-form"
                    className="gt-link-btn gt-btn--light inline-flex items-center justify-center gap-2 px-8 py-4 text-sm"
                  >
                    Initialise Scan
                    <FaRocket className="text-xs" />
                  </Link>

                  <Link
                    to="/how-it-works"
                    className="gt-link-btn gt-btn--ghost inline-flex items-center justify-center gap-2 px-8 py-4 text-sm"
                  >
                    View Methodology
                    <FaLeaf className="text-xs" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/"
                className="gt-mono inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 transition-colors hover:text-green-400"
              >
                <FaArrowRight className="rotate-180" />
                System Root
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}