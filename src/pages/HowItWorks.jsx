// src/pages/HowItWorks.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaGlobe,
  FaLeaf,
  FaRuler,
  FaBolt,
  FaSmog,
  FaTrophy,
  FaDatabase,
  FaServer,
  FaNetworkWired,
  FaCogs,
  FaArrowRight,
} from "react-icons/fa";
import { ChevronDown, ExternalLink, Activity, Cpu, Layers } from "lucide-react";

// --- DESIGN SYSTEM ---
const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');

  :root {
    --gt-green: #15803d;
    --gt-neon: #4ade80;
  }

  .gt-page { font-family: 'Inter', sans-serif; }
  .gt-display { font-family: 'Fraunces', serif; letter-spacing: -0.03em; }
  .gt-mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes gt-reveal {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .gt-bg-data {
    background-image:
      linear-gradient(
        0deg,
        transparent 24%,
        rgba(34, 197, 94, .05) 25%,
        rgba(34, 197, 94, .05) 26%,
        transparent 27%,
        transparent 74%,
        rgba(34, 197, 94, .05) 75%,
        rgba(34, 197, 94, .05) 76%,
        transparent 77%,
        transparent
      ),
      linear-gradient(
        90deg,
        transparent 24%,
        rgba(34, 197, 94, .05) 25%,
        rgba(34, 197, 94, .05) 26%,
        transparent 27%,
        transparent 74%,
        rgba(34, 197, 94, .05) 75%,
        rgba(34, 197, 94, .05) 76%,
        transparent 77%,
        transparent
      );
    background-size: 50px 50px;
  }

  .gt-grid-faint {
    background-size: 40px 40px;
    background-image:
      linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
  }

  .dark .gt-grid-faint {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
  }

  .gt-panel {
    background: rgba(255, 255, 255, 0.74);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0,0,0,0.08);
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .gt-panel:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
    border-color: rgba(22, 163, 74, 0.3);
  }

  .dark .gt-panel {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .dark .gt-panel:hover {
    box-shadow: 0 10px 30px -10px rgba(22, 163, 74, 0.1);
  }

  .gt-step-card {
    transition: all 0.3s ease;
  }

  .gt-step-card:hover {
    border-color: rgba(22, 163, 74, 0.45);
    transform: translateX(4px);
  }

  .gt-soft-ring:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px rgba(34,197,94,0.9),
      0 0 0 5px rgba(34,197,94,0.18);
  }
`;

// --- DATA ---
const steps = [
  {
    title: "URL Parsing & Domain Extraction",
    description:
      "We intelligently parse your URL, clean trailing slashes, and extract the hostname for precise analysis. Our system handles all URL formats automatically.",
    icon: <FaGlobe />,
    color: "from-blue-500 to-cyan-500",
    details: [
      "Automatic protocol detection",
      "Trailing slash normalization",
      "Subdomain handling",
      "Invalid URL protection",
    ],
  },
  {
    title: "Green Hosting Verification",
    description:
      "We check the Green Web Foundation API to verify renewable-energy hosting. Green hosts receive a reduction coefficient in the final carbon calculation.",
    icon: <FaLeaf />,
    color: "from-green-500 to-emerald-500",
    details: [
      "Real-time GWF API call",
      "Renewable energy cert check",
      "25% cleaner DC portion",
      "Global provider database",
    ],
  },
  {
    title: "Page Weight Analysis",
    description:
      "Using Google's PageSpeed Insights API, we measure total page weight across all resources: images, CSS, JavaScript, fonts, and third-party content.",
    icon: <FaRuler />,
    color: "from-orange-500 to-red-500",
    details: [
      "Lighthouse engine",
      "Desktop & mobile weighting",
      "Resource breakdown",
      "HTML fallback estimator",
    ],
  },
  {
    title: "Energy Consumption Calculation",
    description:
      "We convert page size to energy using the SWDM split: total 0.197 kWh/GB made up of data-centre, network, and user-device portions.",
    icon: <FaBolt />,
    color: "from-yellow-500 to-orange-500",
    details: [
      "0.197 kWh/GB total",
      "Breakdown: DC, network, user",
      "Megabytes → kWh conversion",
      "Green-host saving applied",
    ],
  },
  {
    title: "CO₂ Emissions Estimation",
    description:
      "Energy consumption is multiplied by global electricity carbon intensity (442 g CO₂/kWh) to calculate grams of CO₂ per page view.",
    icon: <FaSmog />,
    color: "from-purple-500 to-pink-500",
    details: [
      "442 g CO₂/kWh global avg",
      "Per-page-view calculation",
      "Rounded to 2 decimals",
      "Weighted against traffic",
    ],
  },
  {
    title: "Performance Grading",
    description:
      "Your CO₂ result is assigned a grade (A+ to F) and compared against our global dataset to show how you rank versus other websites.",
    icon: <FaTrophy />,
    color: "from-indigo-500 to-purple-500",
    details: [
      "A+ to F grading scale",
      "Percentile ranking",
      "Global benchmarks",
      "Actionable suggestions",
    ],
  },
  {
    title: "Persistent Data Storage",
    description:
      "Results are stored in PostgreSQL (Supabase) with a 24-hour cache window, enabling badge generation and historical tracking.",
    icon: <FaDatabase />,
    color: "from-teal-500 to-green-500",
    details: [
      "PostgreSQL storage",
      "24h cache window",
      "Badge API integration",
      "Historical trends",
    ],
  },
];

const techSpecs = [
  { label: "Energy Intensity", value: "0.197 kWh/GB", sub: "SWDM Standard" },
  { label: "Carbon Intensity", value: "442 g CO₂/kWh", sub: "Global Average" },
  { label: "Green Host Impact", value: "~8% Reduction", sub: "DC Portion Only" },
  { label: "Cache Window", value: "24 Hours", sub: "Re-scan Limit" },
];

export default function HowItWorks() {
  const [expandedStep, setExpandedStep] = useState(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: steps.map((step) => ({
      "@type": "Question",
      name: step.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: step.description,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>How It Works | GreenTracer Methodology</title>
        <meta
          name="description"
          content="A transparent look at our 7-step scientific process for measuring website carbon emissions."
        />
        <link rel="canonical" href="https://www.greentracer.org/how-it-works" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="gt-page bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 min-h-screen">
        <style>{pageStyles}</style>

        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900">
          <div className="absolute inset-0 gt-bg-data opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-[gt-reveal_0.8s_ease-out]">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
                <Activity className="w-3 h-3 text-green-600 dark:text-green-400" />
                <span className="gt-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Transparency Protocol
                </span>
              </div>
            </div>

            <h1 className="gt-display text-5xl sm:text-7xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              How GreenTracer <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 italic font-light">
                works.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
              A transparent, scientific workflow for measuring website carbon impact.
              We use open standards and verified data to calculate your digital footprint.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
                <FaServer className="text-green-500" /> PageSpeed API
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
                <FaLeaf className="text-green-500" /> Green Web Foundation
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
                <FaDatabase className="text-green-500" /> PostgreSQL
              </div>
            </div>
          </div>
        </section>

        {/* --- TECH SPECS GRID --- */}
        <section className="relative py-20 px-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 overflow-hidden">
          <div className="absolute inset-0 gt-grid-faint pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="gt-display text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                Technical Specifications
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                The constants and assumptions powering our calculation engine.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {techSpecs.map((spec) => (
                <div key={spec.label} className="gt-panel p-6 rounded-2xl text-center">
                  <div className="gt-mono text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {spec.value}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                    {spec.label}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {spec.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- PROCESS ACCORDION --- */}
        <section className="py-20 px-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="gt-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Analysis Workflow
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Our 7-step process for every URL submitted.
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const isOpen = expandedStep === index;
                const panelId = `step-panel-${index}`;

                return (
                  <article
                    key={step.title}
                    className="gt-step-card bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedStep(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="gt-soft-ring w-full text-left p-6 flex items-start gap-6"
                    >
                      <div
                        className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-lg shadow-md`}
                      >
                        {step.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2 gap-4">
                          <div className="gt-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            STEP {index + 1}
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          {step.title}
                        </h3>

                        <p
                          className={`text-slate-600 dark:text-slate-400 leading-relaxed ${
                            !isOpen ? "line-clamp-2" : ""
                          }`}
                        >
                          {step.description}
                        </p>

                        <div className="mt-4 text-green-600 dark:text-green-400 font-medium inline-flex items-center gap-2">
                          {isOpen ? "Show Less" : "Learn More"}
                        </div>

                        <div
                          id={panelId}
                          className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                            isOpen
                              ? "grid-rows-[1fr] opacity-100 mt-6"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="min-h-0 bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                              Technical Detail
                            </h4>
                            <ul className="grid sm:grid-cols-2 gap-2">
                              {step.details.map((d) => (
                                <li
                                  key={d}
                                  className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2"
                                >
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.color}`}
                                    aria-hidden="true"
                                  />
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- SYSTEM ARCHITECTURE --- */}
        <section className="relative py-20 px-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 overflow-hidden">
          <div className="absolute inset-0 gt-grid-faint pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
            <h2 className="gt-display text-3xl font-bold text-slate-900 dark:text-white">
              Data Architecture
            </h2>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="gt-panel p-8 rounded-2xl relative">
                <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
                  <ExternalLink size={40} />
                </div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <FaNetworkWired className="text-blue-500" />
                  Sources
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  We query Google PSI for performance metrics and Green Web Foundation
                  for hosting data.
                </p>
              </div>

              <div className="gt-panel p-8 rounded-2xl relative">
                <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
                  <Cpu size={40} />
                </div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <FaCogs className="text-green-500" />
                  Engine
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Our Node.js backend processes the raw data, applies SWDM math, and
                  assigns a grade.
                </p>
              </div>

              <div className="gt-panel p-8 rounded-2xl relative">
                <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
                  <Layers size={40} />
                </div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <FaDatabase className="text-purple-500" />
                  Storage
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Results persist in Supabase for 24 hours to serve badges and
                  historical lookups.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA --- */}
        <section className="py-20 px-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 text-center">
          <div className="max-w-3xl mx-auto gt-panel p-10 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="gt-display text-3xl font-bold text-slate-900 dark:text-white mb-6">
              See the engine in action.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Run your own analysis now to see this methodology applied to your site.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/#top"
                className="gt-soft-ring px-8 py-4 bg-slate-900 dark:bg-green-600 text-white font-bold rounded-full hover:-translate-y-1 transition-transform shadow-lg"
              >
                Analyze Website
              </Link>

              <Link
                to="/badge"
                className="gt-soft-ring px-8 py-4 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Get Badge
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-green-600 transition-colors"
            >
              <FaArrowRight className="rotate-180" /> Back to Home
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}