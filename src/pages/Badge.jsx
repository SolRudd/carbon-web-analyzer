import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { API_BASE } from "../config";
import {
  FaCertificate,
  FaCode,
  FaRocket,
  FaPalette,
  FaShieldAlt,
  FaQuestionCircle,
  FaExternalLinkAlt,
  FaTerminal,
} from "react-icons/fa";
import { ArrowRight, Check, Copy } from "lucide-react";

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');

  :root {
    --gt-green: #15803d;
    --gt-neon: #4ade80;
  }

  .gt-page { font-family: 'Inter', sans-serif; }
  .gt-display { font-family: 'Fraunces', serif; letter-spacing: -0.03em; }
  .gt-mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes gt-blink { 50% { opacity: 0; } }
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
    background: rgba(255, 255, 255, 0.72);
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

  .gt-input-wrapper:focus-within {
    border-color: var(--gt-green);
    box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
  }

  .gt-badge-preview {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .gt-badge-preview:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
  }
`;

const badgeTypes = {
  carbon: {
    id: "carbon",
    title: "Carbon Impact Badge",
    subtitle: "Responsive & Logo-Enabled",
    icon: <FaRocket />,
    features: ["CO₂ per view", "Percentile score", "Dark mode ready"],
  },
  hosting: {
    id: "hosting",
    title: "Green Hosting Verified",
    subtitle: "Trust Signal Badge",
    icon: <FaShieldAlt />,
    features: ["Verified host check", "Cached result", "No false positives"],
  },
};

const isValidHexColor = (v) => /^#[0-9A-Fa-f]{6}$/.test((v || "").trim());

const normalizeSiteUrl = (u) => {
  try {
    const url = new URL((u || "").includes("://") ? u : `https://${u}`);
    return url.href.replace(/\/$/, "");
  } catch {
    return null;
  }
};

const getLogoFilterForColor = (hexColor, hasCustomColor) => {
  if (!hasCustomColor) return "brightness(0) invert(1)";
  const hex = hexColor.slice(1);
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.6
    ? "brightness(0) invert(1)"
    : "brightness(0)";
};

const hexToRgba = (hex, alpha) => {
  if (!isValidHexColor(hex)) return null;
  const clean = hex.trim().slice(1);
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Add the GreenTracer Badge",
  step: [
    { "@type": "HowToStep", name: "Test Site", text: "Run a carbon audit on your URL." },
    { "@type": "HowToStep", name: "Configure Badge", text: "Choose style and copy code." },
    { "@type": "HowToStep", name: "Embed", text: "Paste snippet into HTML footer." },
  ],
};

export default function Badge() {
  const [websiteUrl, setWebsiteUrl] = useState("yoursite.com");
  const [selectedBadgeType, setSelectedBadgeType] = useState("carbon");
  const [copiedCode, setCopiedCode] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [accentColor, setAccentColor] = useState("#16A34A");
  const [textColor, setTextColor] = useState("");
  const [hostingStatus, setHostingStatus] = useState({
    loading: false,
    checkedUrl: "",
    hasSavedData: false,
    isGreenHost: false,
  });

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const normalizedUrl = normalizeSiteUrl(websiteUrl);

    if (!normalizedUrl) {
      setHostingStatus({
        loading: false,
        checkedUrl: "",
        hasSavedData: false,
        isGreenHost: false,
      });
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setHostingStatus((prev) => ({
        ...prev,
        loading: true,
        checkedUrl: normalizedUrl,
      }));

      fetch(`${API_BASE}/api/trace?site=${encodeURIComponent(normalizedUrl)}`, {
        signal: controller.signal,
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          setHostingStatus({
            loading: false,
            checkedUrl: normalizedUrl,
            hasSavedData: !!data,
            isGreenHost: !!data?.greenHost,
          });
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setHostingStatus((prev) => ({ ...prev, loading: false }));
          }
        });
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [websiteUrl]);

  useEffect(() => {
    if (selectedBadgeType === "hosting" && !hostingStatus.isGreenHost) {
      setSelectedBadgeType("carbon");
    }
  }, [hostingStatus.isGreenHost, selectedBadgeType]);

  const getCurrentCode = () => {
    const target = normalizeSiteUrl(websiteUrl) || "https://yoursite.com";
    const cleanText = isValidHexColor(textColor) ? textColor.trim() : "";
    const typeAttr = selectedBadgeType === "hosting" ? ` data-badge-type="hosting"` : "";
    const customAttrs = `${bgColor !== "#ffffff" ? ` data-bg-color="${bgColor}"` : ""}${
      accentColor !== "#16A34A" ? ` data-accent-color="${accentColor}"` : ""
    }${cleanText ? ` data-text-color="${cleanText}"` : ""}`;

    return `<div class="greentrace-badge" data-url="${target}" data-theme="auto"${typeAttr}${customAttrs}></div>\n<script src="https://api.greentracer.org/greentrace-badge.js" defer></script>`;
  };

  const selectedBadge = badgeTypes[selectedBadgeType];
  const hasCustomTextColor = isValidHexColor(textColor);
  const previewTextColor = hasCustomTextColor ? textColor.trim() : "#0F172A";
  const previewLogoFilter = getLogoFilterForColor(previewTextColor, hasCustomTextColor);
  const previewBorderColor = hexToRgba(accentColor, 0.38) || accentColor;
  const previewDividerColor = hexToRgba(accentColor, 0.22) || accentColor;

  return (
    <>
      <Helmet>
        <title>Get Your Website Carbon Badge | GreenTracer</title>
        <meta
          name="description"
          content="Display your website's carbon score with pride. The badge updates automatically."
        />
        <link rel="canonical" href="https://www.greentracer.org/badge" />
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <div className="gt-page bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 min-h-screen">
        <style>{pageStyles}</style>

        <section className="relative pt-28 sm:pt-32 pb-20 px-5 sm:px-6 overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900">
          <div className="absolute inset-0 gt-bg-data opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-[gt-reveal_0.8s_ease-out]">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
                <FaCertificate className="text-[10px] text-green-600 dark:text-green-400" />
                <span className="gt-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Official Trust Signal
                </span>
              </div>
            </div>

            <h1 className="gt-display text-5xl sm:text-7xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              Prove your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 italic font-light">
                digital ethics.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
              Don&apos;t just say you&apos;re sustainable. Prove it. Our live badges fetch
              real-time data from your latest audit, verifying your carbon score and
              green hosting status.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="#generator"
                className="inline-flex items-center px-8 py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-green-900/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <FaCode className="mr-2" /> Configure Badge
              </a>

              <Link
                to="/"
                className="inline-flex items-center px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-bold text-xs tracking-widest uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <FaRocket className="mr-2" /> Test Site First
              </Link>
            </div>
          </div>
        </section>

        <section id="generator" className="py-20 px-5 sm:px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <div className="gt-panel p-1.5 rounded-xl shadow-lg">
                <div className="gt-input-wrapper bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center px-4 py-3 transition-colors">
                  <span className="text-slate-400 mr-2 gt-mono select-none text-sm shrink-0">
                    https://
                  </span>
                  <input
                    type="text"
                    inputMode="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="yoursite.com"
                    autoComplete="off"
                    aria-label="Website URL"
                    className="w-full min-w-0 bg-transparent border-none outline-none text-base text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 font-medium gt-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedBadgeType("carbon")}
                  className={`gt-panel p-4 rounded-xl text-left border-2 transition-all ${
                    selectedBadgeType === "carbon"
                      ? "border-green-500 ring-1 ring-green-500/20"
                      : "border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold gt-mono text-xs">
                    <FaRocket /> CARBON_BADGE
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    Displays CO₂ per visit and global percentile.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => hostingStatus.isGreenHost && setSelectedBadgeType("hosting")}
                  disabled={!hostingStatus.isGreenHost}
                  className={`gt-panel p-4 rounded-xl text-left border-2 transition-all relative ${
                    selectedBadgeType === "hosting"
                      ? "border-green-500 ring-1 ring-green-500/20"
                      : "border-transparent"
                  } ${
                    !hostingStatus.isGreenHost
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400 font-bold gt-mono text-xs">
                    <FaShieldAlt /> HOSTING_VERIFIED
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    Requires valid green hosting check.
                  </p>
                  {hostingStatus.loading && (
                    <span className="absolute top-2 right-2 text-[10px] animate-pulse">
                      Checking...
                    </span>
                  )}
                </button>
              </div>

              <div className="gt-panel p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-sm">
                  <FaPalette className="text-slate-400" /> Style Configuration
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-xs gt-mono text-slate-500 uppercase">Background</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={bgColor}
                        readOnly
                        className="w-20 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-center font-mono text-slate-600 dark:text-slate-400"
                      />
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                        aria-label="Background colour"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="text-xs gt-mono text-slate-500 uppercase">Accent</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={accentColor}
                        readOnly
                        className="w-20 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-center font-mono text-slate-600 dark:text-slate-400"
                      />
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                        aria-label="Accent colour"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="text-xs gt-mono text-slate-500 uppercase">Text (Opt)</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={textColor || "Default"}
                        readOnly
                        className="w-20 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-center font-mono text-slate-600 dark:text-slate-400"
                      />
                      <input
                        type="color"
                        value={isValidHexColor(textColor) ? textColor : "#0F172A"}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                        aria-label="Text colour"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setBgColor("#ffffff");
                        setAccentColor("#16A34A");
                        setTextColor("");
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-green-500 uppercase tracking-wider"
                    >
                      Reset Defaults
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="gt-panel rounded-2xl p-8 lg:p-12 flex flex-col items-center justify-center min-h-[300px] border border-slate-200 dark:border-slate-800 relative">
                <div className="absolute top-4 left-4 gt-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  // LIVE_PREVIEW
                </div>

                <div className="gt-badge-preview scale-100 sm:scale-110">
                  <div
                    className="inline-flex overflow-hidden border transition-all duration-300"
                    style={{
                      borderColor: previewBorderColor,
                      backgroundColor: bgColor,
                      borderRadius: "10px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      className="px-3.5 py-[7px] text-[13px] font-semibold tracking-[0.01em]"
                      style={{
                        backgroundColor: bgColor,
                        color: previewTextColor,
                      }}
                    >
                      {selectedBadgeType === "hosting"
                        ? "Green Hosting Verified"
                        : "0.45g CO₂/view"}
                    </div>
                    <div
                      className="flex items-center px-[15px] py-[6px]"
                      style={{
                        backgroundColor: accentColor,
                        borderLeft: `1px solid ${previewDividerColor}`,
                      }}
                    >
                      <img
                        src="/GreenTraceLogo.png"
                        alt="GreenTracer"
                        style={{
                          filter: previewLogoFilter,
                          height: "18px",
                          display: "block",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-8 text-xs text-slate-500 font-medium gt-mono">
                  STATUS:{" "}
                  {selectedBadgeType === "hosting"
                    ? "VERIFIED_HOST"
                    : "CARBON_CALCULATED"}
                </p>
              </div>

              <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 group">
                <div className="bg-slate-950 px-4 py-3 flex justify-between items-center border-b border-slate-800">
                  <div className="flex gap-2" aria-hidden="true">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(getCurrentCode())}
                    className="flex items-center gap-2 text-[10px] font-bold text-green-400 hover:text-white transition-colors uppercase tracking-wider"
                  >
                    {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                    {copiedCode ? "COPIED" : "COPY CODE"}
                  </button>
                </div>

                <div className="p-6 overflow-x-auto">
                  <pre className="gt-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {getCurrentCode()}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20 px-5 sm:px-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 overflow-hidden">
          <div className="absolute inset-0 gt-grid-faint pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            {[
              {
                id: "01",
                title: "Run Audit",
                desc: "Scan your site on the homepage to generate a baseline carbon score.",
                icon: <FaRocket />,
              },
              {
                id: "02",
                title: "Config",
                desc: "Select your badge style and customize colors to match your brand.",
                icon: <FaCode />,
              },
              {
                id: "03",
                title: "Embed",
                desc: "Paste the script tag into your website footer. Data updates automatically.",
                icon: <FaTerminal />,
              },
            ].map((step) => (
              <div
                key={step.id}
                className="gt-panel p-8 rounded-xl border border-slate-200 dark:border-slate-800 group hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="gt-mono text-xs text-slate-400">STEP {step.id}</span>
                  <div className="text-green-600 dark:text-green-400 opacity-50 group-hover:opacity-100 transition-opacity">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 px-5 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto gt-panel p-10 rounded-2xl border border-slate-200 dark:border-slate-800">
            <FaQuestionCircle className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="gt-display text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Need integration help?
            </h2>

            <div className="flex justify-center gap-4 pt-2 flex-wrap">
              <Link
                to="/faq"
                className="px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                View FAQ
              </Link>

              <a
                href="mailto:support@greentracer.org"
                className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <FaExternalLinkAlt size={10} /> Contact Devs
              </a>
            </div>
          </div>
        </section>

        <div className="text-center py-10 border-t border-slate-100 dark:border-slate-900">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors gt-mono text-xs font-bold uppercase tracking-wider"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}