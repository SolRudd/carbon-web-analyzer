// src/pages/Badge.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { API_BASE } from "../config";
import {
  FaCertificate,
  FaCode,
  FaRocket,
  FaCopy,
  FaCheck,
  FaEye,
  FaPalette,
  FaGlobe,
  FaShieldAlt,
  FaLightbulb,
  FaQuestionCircle,
  FaExternalLinkAlt,
  FaDownload,
  FaSync,
  FaCog,
  FaMoon,
  FaSun,
  FaMobile,
  FaDesktop
} from "react-icons/fa";

const badgeTypes = {
  carbon: {
    id: "carbon",
    title: "Carbon Impact Badge",
    subtitle: "Responsive & Logo-Enabled",
    icon: <FaRocket className="text-2xl" />,
    color: "from-blue-500 to-cyan-500",
    features: ["CO₂ per view", "Cleaner-than percentile", "Custom colours", "Cached-only (no rescans)"]
  },
  hosting: {
    id: "hosting",
    title: "Green Hosting Verified",
    subtitle: "Trust Signal Badge",
    icon: <FaShieldAlt className="text-2xl" />,
    color: "from-green-500 to-emerald-600",
    features: ["Hosting verification status", "Latest saved result only", "Custom colours", "No false verification"]
  }
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
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.6 ? "brightness(0) invert(1)" : "brightness(0)";
};



export default function Badge() {

  const [websiteUrl, setWebsiteUrl] = useState("https://yoursite.com");
  const [selectedBadgeType, setSelectedBadgeType] = useState("carbon");
  const [copiedCode, setCopiedCode] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [accentColor, setAccentColor] = useState("#16A34A");
  const [textColor, setTextColor] = useState("");
  const [hostingStatus, setHostingStatus] = useState({
    loading: false,
    checkedUrl: "",
    hasSavedData: false,
    isGreenHost: false
  });

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Add the GreenTracer Carbon Badge to Your Website",
    "description":
      "Display your website's carbon score with pride by following these three simple steps to add our responsive badge to your site.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Test Your Website",
        "text":
          "Visit our homepage and test your website's carbon footprint. You must test each page before the badge will display data.",
        "url": "https://greentracer.org/#input-form"
      },
      {
        "@type": "HowToStep",
        "name": "Copy the Code",
        "text":
          "Choose your preferred badge style on this page, enter your URL, and copy the generated code snippet."
      },
      {
        "@type": "HowToStep",
        "name": "Add to Your Site",
        "text":
          "Paste the code into your HTML, typically in the footer or sidebar. The badge will automatically display your carbon score."
      }
    ]
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  useEffect(() => {
    const normalizedUrl = normalizeSiteUrl(websiteUrl);
    if (!normalizedUrl) {
      setHostingStatus({
        loading: false,
        checkedUrl: "",
        hasSavedData: false,
        isGreenHost: false
      });
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setHostingStatus((prev) => ({ ...prev, loading: true, checkedUrl: normalizedUrl }));
      fetch(`${API_BASE}/api/trace?site=${encodeURIComponent(normalizedUrl)}`, { signal: controller.signal })
        .then((res) => {
          if (res.status === 404) {
            return null;
          }
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (!data) {
            setHostingStatus({
              loading: false,
              checkedUrl: normalizedUrl,
              hasSavedData: false,
              isGreenHost: false
            });
            return;
          }
          setHostingStatus({
            loading: false,
            checkedUrl: normalizedUrl,
            hasSavedData: true,
            isGreenHost: !!data.greenHost
          });
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          console.error("Failed to fetch cached badge eligibility:", err);
          setHostingStatus({
            loading: false,
            checkedUrl: normalizedUrl,
            hasSavedData: false,
            isGreenHost: false
          });
        });
    }, 350);

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

  /* Robust generator: ensures https://, trims trailing slash */
  const getCurrentCode = () => {
    const target = normalizeSiteUrl(websiteUrl) || "https://yoursite.com";
    const normalizedTextColor = isValidHexColor(textColor) ? textColor.trim() : "";
    const typeAttr = selectedBadgeType === "hosting" ? ` data-badge-type="hosting"` : "";
    const customAttrs = `${bgColor !== '#ffffff' ? ` data-bg-color="${bgColor}"` : ''}${accentColor !== '#16A34A' ? ` data-accent-color="${accentColor}"` : ''}${normalizedTextColor ? ` data-text-color="${normalizedTextColor}"` : ''}`;

    return `<div class="greentrace-badge" data-url="${target}" data-theme="auto"${typeAttr}${customAttrs}></div>
<script src="https://api.greentracer.org/greentrace-badge.js" defer></script>`;
  };

  const selectedBadge = badgeTypes[selectedBadgeType];
  const hasCustomTextColor = isValidHexColor(textColor);
  const previewTextColor = hasCustomTextColor ? textColor.trim() : "#0F172A";
  const previewLogoFilter = getLogoFilterForColor(previewTextColor, hasCustomTextColor);

  return (
    <>
      <Helmet>
        <title>Get Your Website Carbon Badge | GreenTracer</title>
        <meta
          name="description"
          content="Display your website's carbon score with pride! Get the code for our responsive, auto-updating sustainability badge and show your environmental commitment."
        />
        <link rel="canonical" href="https://greentracer.org/badge" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://greentracer.org/badge" />
        <meta property="og:title" content="Get Your Website Carbon Badge | GreenTracer" />
        <meta
          property="og:description"
          content="Display your website's carbon score with pride! Get the code for our responsive, auto-updating sustainability badge."
        />
        <meta property="og:image" content="https://greentracer.org/your-social-share-image-for-badge.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://greentracer.org/badge" />
        <meta property="twitter:title" content="Get Your Website Carbon Badge | GreenTracer" />
        <meta
          property="twitter:description"
          content="Display your website's carbon score with pride! Get the code for our responsive, auto-updating sustainability badge."
        />
        <meta property="twitter:image" content="https://greentracer.org/your-social-share-image-for-badge.jpg" />

        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-green-400/20 transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 motion-safe:animate-pulse" />
            <div className="absolute top-3/4 right-1/4 w-[500px] h-[500px] bg-blue-400/20 transform rotate-12 blur-2xl opacity-25 motion-safe:animate-pulse motion-safe:delay-1000" />
            <div className="absolute bottom-1/4 left-3/4 w-[400px] h-[400px] bg-purple-400/20 transform -rotate-45 blur-2xl opacity-20 motion-safe:animate-pulse motion-safe:delay-2000" />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-3 bg-green-500/10 dark:bg-green-400/10 px-6 py-3 rounded-full border border-green-500/20 dark:border-green-400/20">
              <FaCertificate className="text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400 font-semibold">GreenTracer Badges</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-green-600 to-green-600 dark:from-white dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
              Show Your Green Credentials
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Display your website's carbon score with pride! Add our beautiful, responsive badge to showcase your
              environmental commitment to visitors.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaRocket className="mr-2" />
                Test Your Site First
              </Link>
              <a
                href="#badge-generator"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold transition-all duration-300"
              >
                <FaCode className="mr-2" />
                Get Badge Code
              </a>
            </div>
          </div>
        </section>

        {/* Badge Generator Section */}
        <section id="badge-generator" className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Badge Style</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Select the perfect badge for your website and customize it to match your design
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Your Website URL
              </label>
              <div className="relative">
                <FaGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yoursite.com"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-lg"
                />
              </div>
            </div>

            <div className="max-w-2xl mx-auto mb-8">
              <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">
                Badge Type
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedBadgeType("carbon")}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    selectedBadgeType === "carbon"
                      ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  }`}
                >
                  <p className="font-semibold">Carbon Impact Badge</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">CO₂ + percentile trust signal</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (hostingStatus.isGreenHost) setSelectedBadgeType("hosting");
                  }}
                  disabled={!hostingStatus.isGreenHost}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    selectedBadgeType === "hosting"
                      ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  } ${!hostingStatus.isGreenHost ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <p className="font-semibold">Green Hosting Verified</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Available only for green-hosted saved results</p>
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                {hostingStatus.loading
                  ? "Checking latest saved result for hosting verification..."
                  : hostingStatus.isGreenHost
                    ? "Green hosting verified on latest saved result. Hosting badge is available."
                    : hostingStatus.hasSavedData
                      ? "Latest saved result does not confirm green hosting, so hosting badge is disabled."
                      : "No saved result found yet for this URL. Run a check first to unlock hosting verification."}
              </p>
            </div>

            {/* Customisation Section */}
            <div className="max-w-2xl mx-auto mb-12 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                <FaPalette className="text-green-600 dark:text-green-400" />
                Customize Your Badge
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Background Colour
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-16 h-12 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-600"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="#ffffff"
                    />
                    <button
                      onClick={() => setBgColor('#ffffff')}
                      className="px-3 py-2 text-xs font-medium bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Accent Colour
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-16 h-12 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-600"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="#16A34A"
                    />
                    <button
                      onClick={() => setAccentColor('#16A34A')}
                      className="px-3 py-2 text-xs font-medium bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Text / Logo Colour (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={/^#[0-9A-Fa-f]{6}$/.test((textColor || "").trim()) ? textColor : "#0F172A"}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-16 h-12 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-600"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Leave blank for default"
                    />
                    <button
                      onClick={() => setTextColor('')}
                      className="px-3 py-2 text-xs font-medium bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge Info Card */}
            <div className="max-w-2xl mx-auto mb-12 p-8 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${selectedBadge.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  {selectedBadge.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedBadge.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{selectedBadge.subtitle}</p>
                </div>
              </div>
              <div className="space-y-2">
                {selectedBadge.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <FaCheck className="text-green-600 dark:text-green-400 text-sm" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Preview Section */}
            <div className="max-w-2xl mx-auto mb-12 p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                <FaEye className="text-green-600 dark:text-green-400" />
                Live Preview
              </h3>
              <div className="flex flex-col items-center gap-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">Your badge will look like this on your website:</p>
                {/* HTML Badge Preview - matching the actual JS badge structure */}
                <div className="inline-flex flex-col items-center">
                  <div
                    className="inline-flex overflow-hidden rounded-md shadow-lg border"
                    style={{
                      borderColor: accentColor,
                      backgroundColor: bgColor,
                    }}
                  >
                    <div
                      className="px-4 py-2 text-sm font-semibold"
                      style={{
                        backgroundColor: bgColor,
                        color: previewTextColor,
                        borderRight: `1px solid ${accentColor}`,
                      }}
                    >
                      {selectedBadgeType === "hosting" ? "Green Hosting Verified" : "0.45g CO₂/view"}
                    </div>
                    <div
                      className="flex items-center px-4 py-2"
                      style={{
                        backgroundColor: accentColor,
                      }}
                    >
                      <picture>
                        <source type="image/avif" srcSet="/GreenTraceLogo.avif" />
                        <source type="image/webp" srcSet="/GreenTraceLogo.webp" />
                        <img
                          src="/GreenTraceLogo.png"
                          alt="GreenTracer"
                          className="h-5 w-auto"
                          style={{ filter: previewLogoFilter }}
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-400 text-center">
                    {selectedBadgeType === "hosting"
                      ? "Verified from latest saved GreenTracer result"
                      : "Cleaner than 82% of pages tested"}
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center space-y-1">
                  <p>Sample data shown. This is how your badge will appear on your website.</p>
                  <p className="font-medium">Test your website first at the top of this page →</p>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
                <div className={`p-6 bg-gradient-to-r ${selectedBadge.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedBadge.icon}
                      <div>
                        <h3 className="text-xl font-bold">{selectedBadge.title} Code</h3>
                        <p className="opacity-90">Copy and paste into your HTML</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(getCurrentCode())}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                    >
                      {copiedCode ? <FaCheck /> : <FaCopy />}
                      {copiedCode ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <pre className="font-mono text-sm whitespace-pre-wrap break-words bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 rounded-lg overflow-x-auto">
                    {getCurrentCode()}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">Get your badge working in just 3 simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4">Test Your Website</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Visit our homepage and test your website's carbon footprint. You must test each page before the badge
                  will display data.
                </p>
                <Link to="/" className="inline-flex items-center gap-2 mt-4 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold">
                  <FaRocket />
                  Test Now
                </Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4">Copy the Code</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Choose your preferred badge style above, enter your URL, and copy the generated code snippet.
                </p>
                <a href="#badge-generator" className="inline-flex items-center gap-2 mt-4 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold">
                  <FaCode />
                  Get Code
                </a>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4">Add to Your Site</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Paste the code into your HTML (typically in the footer). The badge will automatically display your
                  carbon score.
                </p>
                <div className="inline-flex items-center gap-2 mt-4 text-green-600 dark:text-green-400 font-semibold">
                  <FaCertificate />
                  Done!
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Use Our Badge?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Show your environmental commitment with a professional, trust-building badge
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <FaShieldAlt className="text-2xl" />,
                  title: "Build Trust",
                  description: "Show visitors you care about the environment and sustainability",
                  color: "from-green-500 to-green-600"
                },
                {
                  icon: <FaSync className="text-2xl" />,
                  title: "Auto Updates",
                  description: "Badge automatically refreshes with your latest carbon score every 7 days",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <FaMobile className="text-2xl" />,
                  title: "Responsive",
                  description: "Looks perfect on desktop, tablet, and mobile devices",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: <FaLightbulb className="text-2xl" />,
                  title: "Smart Design",
                  description: "Automatically adapts to light and dark themes on your website",
                  color: "from-orange-500 to-red-500"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white shadow-lg mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 dark:border-green-400/20 rounded-2xl p-8">
              <FaQuestionCircle className="text-4xl text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Need Help?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Check our FAQ for common questions about badges, or contact our support team for personalized help.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/faq"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FaQuestionCircle className="mr-2" />
                  View FAQ
                </Link>

                <a
                  href="mailto:support@greentracer.org"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900 rounded-full font-semibold transition-all duration-300"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center py-8">
          <Link to="/" className="inline-block text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}
