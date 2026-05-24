// src/pages/ApiAccess.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaCode,
  FaRocket,
  FaShieldAlt,
  FaChartLine,
  FaGlobe,
  FaBolt,
  FaCheck,
  FaUniversity,
  FaBuilding,
  FaCopy,
  FaBook,
  FaHeart,
  FaQuestionCircle,
  FaEnvelope,
  FaExternalLinkAlt,
  FaArrowRight,
  FaCog,
  FaDatabase,
  FaCloud,
  FaLock,
} from "react-icons/fa";
import { Terminal, Activity, KeyRound } from "lucide-react";

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

  .gt-soft-ring:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px rgba(34,197,94,0.9),
      0 0 0 5px rgba(34,197,94,0.18);
  }
`;

const apiFeatures = [
  {
    icon: <FaBolt className="text-xl" />,
    title: "Fast response cycle",
    description: "Get carbon analysis results quickly through a structured request pipeline.",
  },
  {
    icon: <FaShieldAlt className="text-xl" />,
    title: "Controlled access",
    description: "API access is reviewed manually so infrastructure, API keys, and rate limits remain protected.",
  },
  {
    icon: <FaChartLine className="text-xl" />,
    title: "Usage visibility",
    description: "Planned support for usage tracking, request monitoring, and reporting.",
  },
  {
    icon: <FaGlobe className="text-xl" />,
    title: "Production ready",
    description: "Designed for websites, platforms, and internal tooling that need repeatable checks.",
  },
];

const useCases = [
  {
    icon: <FaUniversity className="text-xl" />,
    title: "Academic Research",
    description: "Study digital sustainability trends and environmental impact.",
    type: "Non-Commercial",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700",
  },
  {
    icon: <FaHeart className="text-xl" />,
    title: "Non-Profits",
    description: "Track and improve your organization's digital carbon footprint.",
    type: "Non-Commercial",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-700",
  },
  {
    icon: <FaBuilding className="text-xl" />,
    title: "Enterprise Monitoring",
    description: "Integrate carbon tracking into internal workflows and reporting.",
    type: "Commercial",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700",
  },
  {
    icon: <FaCog className="text-xl" />,
    title: "SaaS Integration",
    description: "Add sustainability workflows or reporting into your own product experience.",
    type: "Commercial",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-700",
  },
];

const codeExample = `// Example API Call
const response = await fetch('https://api.greentracer.org/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://yoursite.com',
    options: {
      mobile: false,
      cache: true
    }
  })
});

const data = await response.json();
console.log(data);

// Example Response
{
  "url": "https://yoursite.com",
  "carbon": {
    "grams_per_view": 0.45,
    "grade": "A+",
    "percentile": 85
  },
  "performance": {
    "size_kb": 1240,
    "requests": 15,
    "load_time": 1.2
  },
  "green_hosting": true,
  "timestamp": "2025-01-29T00:06:25.000Z"
}`;

export default function ApiAccess() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    testsPerMonth: "",
    accessType: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Developer API",
    name: "GreenTracer Carbon API",
    description:
      "Integrate powerful carbon footprint analysis into your applications. Measure, track, and optimize digital sustainability at scale with our RESTful JSON API.",
    provider: {
      "@type": "Organization",
      name: "GreenTracer",
    },
    areaServed: {
      "@type": "Country",
      name: "Global",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Non-Commercial Access",
        price: "0",
        priceCurrency: "USD",
        description:
          "Free API access for academic research, non-profits, and open source projects. Up to 1,000 requests/month.",
      },
      {
        "@type": "Offer",
        name: "Commercial Access",
        price: "Custom",
        priceCurrency: "USD",
        description:
          "Custom pricing and access terms for commercial integrations and higher-volume usage.",
      },
    ],
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert("Request submitted successfully! We'll get back to you within 24 hours.");
    }, 2000);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeExample);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Developer API | GreenTracer Carbon Analysis</title>
        <meta
          name="description"
          content="Integrate powerful carbon footprint analysis into your applications with the GreenTracer API. Access is currently reviewed and provisioned manually."
        />
        <link rel="canonical" href="https://www.greentracer.org/api-access" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.greentracer.org/api-access" />
        <meta property="og:title" content="Developer API | GreenTracer Carbon Analysis" />
        <meta
          property="og:description"
          content="Integrate powerful carbon footprint analysis into your applications with the GreenTracer API."
        />
        <meta property="og:image" content="https://www.greentracer.org/GreenFavi.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.greentracer.org/api-access" />
        <meta property="twitter:title" content="Developer API | GreenTracer Carbon Analysis" />
        <meta
          property="twitter:description"
          content="Integrate powerful carbon footprint analysis into your applications with the GreenTracer API."
        />
        <meta property="twitter:image" content="https://www.greentracer.org/GreenFavi.png" />

        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>

      <div className="gt-page bg-slate-50 dark:bg-[#020f1e] text-slate-900 dark:text-white transition-colors duration-300 min-h-screen">
        <style>{pageStyles}</style>

        {/* HERO */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-white dark:bg-[#020f1e] border-b border-slate-200 dark:border-slate-900">
          <div className="absolute inset-0 gt-bg-data opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8 animate-[gt-reveal_0.8s_ease-out]">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
                <FaLock className="text-[10px] text-green-600 dark:text-green-400" />
                <span className="gt-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Controlled Access
                </span>
              </div>
            </div>

            <h1 className="gt-display text-5xl sm:text-7xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              GreenTracer <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 italic font-light">
                API access.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
              Integrate GreenTracer carbon analysis into your own systems.
              Access is currently reviewed manually so methodology can be understood,
              while operational infrastructure, API keys, and rate limits remain protected.
            </p>

            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">REST</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">JSON API</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">Manual</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Access Review</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">Scalable</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Integration Model</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <a
                href="#request-form"
                className="gt-soft-ring inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-green-600 text-white font-semibold rounded-full transition-all duration-300 hover:translate-y-[-2px] shadow-lg"
              >
                <FaRocket className="mr-2" />
                Request Access
              </a>
              <a
                href="#documentation"
                className="gt-soft-ring inline-flex items-center justify-center px-8 py-4 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full font-semibold transition-all duration-300"
              >
                <FaBook className="mr-2" />
                View Example
              </a>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="relative py-20 px-6 bg-slate-50 dark:bg-[#020f1e] border-t border-slate-100 dark:border-slate-900 overflow-hidden">
          <div className="absolute inset-0 gt-grid-faint pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="gt-display text-3xl sm:text-4xl font-bold mb-4">
                API capabilities
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Built for developers, scoped for quality and controlled rollout.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {apiFeatures.map((feature) => (
                <div key={feature.title} className="gt-panel rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CODE EXAMPLE */}
        <section id="documentation" className="py-20 px-6 bg-white dark:bg-[#020f1e] border-t border-slate-100 dark:border-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="gt-display text-3xl sm:text-4xl font-bold mb-4">
                Integration example
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                A sample request structure for approved API access.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl overflow-hidden border border-slate-800">
              <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-slate-400 text-sm font-mono">api-example.js</span>
                </div>

                <button
                  type="button"
                  onClick={copyCode}
                  className="gt-soft-ring flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors duration-200"
                >
                  {copySuccess ? <FaCheck className="text-green-400" /> : <FaCopy />}
                  {copySuccess ? "Copied!" : "Copy"}
                </button>
              </div>

              <pre className="text-slate-100 text-sm overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="relative py-20 px-6 bg-slate-50 dark:bg-[#020f1e] border-t border-slate-100 dark:border-slate-900 overflow-hidden">
          <div className="absolute inset-0 gt-grid-faint pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="gt-display text-3xl sm:text-4xl font-bold mb-4">
                Ideal use cases
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Structured for research, internal reporting, and commercial integrations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className={`gt-panel rounded-2xl border ${useCase.borderColor} overflow-hidden`}
                >
                  <div className={`p-6 ${useCase.bgColor}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-slate-900 dark:bg-slate-800 rounded-xl flex items-center justify-center text-white shadow-sm">
                        {useCase.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {useCase.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            useCase.type === "Non-Commercial"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          }`}
                        >
                          {useCase.type}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ACCESS LEVELS */}
        <section className="py-20 px-6 bg-white dark:bg-[#020f1e] border-t border-slate-100 dark:border-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="gt-display text-3xl sm:text-4xl font-bold mb-4">
                Access models
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Access is reviewed based on use case, volume, and operational fit.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="gt-panel rounded-2xl border border-green-200 dark:border-green-700 p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                    <FaUniversity />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Non-Commercial</h3>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    Free
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    For research, non-profits, and selected public-interest work.
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Up to 1,000 requests/month",
                    "Structured API access",
                    "Email support",
                    "Academic research friendly",
                    "Non-profit organizations",
                    "Open-source / public-interest use",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <FaCheck className="text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Typical requirement:</strong> institutional email, non-profit status,
                  or research / public-interest alignment.
                </p>
              </div>

              <div className="gt-panel rounded-2xl border border-purple-200 dark:border-purple-700 p-8 relative">
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Managed
                </div>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                    <FaBuilding />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Commercial</h3>
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    Custom
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    For internal tools, client reporting, platforms, and production usage.
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Higher request volumes",
                    "Priority support",
                    "Custom rate limits",
                    "Operational alignment",
                    "Dedicated commercial terms",
                    "Integration planning",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <FaCheck className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Pricing:</strong> based on usage profile, support needs, and rollout scope.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section id="request-form" className="relative py-20 px-6 bg-slate-50 dark:bg-[#020f1e] border-t border-slate-100 dark:border-slate-900 overflow-hidden">
          <div className="absolute inset-0 gt-grid-faint pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="gt-display text-3xl sm:text-4xl font-bold mb-4">
                Request API access
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Tell us about your project and we’ll review fit, usage, and access requirements.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="gt-panel rounded-2xl p-8 shadow-xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="gt-soft-ring w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none"
                    placeholder="Your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="gt-soft-ring w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="gt-soft-ring w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="gt-soft-ring w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none"
                  placeholder="Your company, university, or organization"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Estimated Tests Per Month
                </label>
                <input
                  type="number"
                  name="testsPerMonth"
                  value={formData.testsPerMonth}
                  onChange={handleInputChange}
                  className="gt-soft-ring w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none"
                  placeholder="e.g. 500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300">
                  Access Type *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-transparent cursor-pointer hover:border-green-500 transition-all duration-200">
                    <input
                      type="radio"
                      name="accessType"
                      value="nonCommercial"
                      checked={formData.accessType === "nonCommercial"}
                      onChange={handleInputChange}
                      required
                      className="mr-3 text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Non-Commercial
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Free for research & non-profits
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-transparent cursor-pointer hover:border-purple-500 transition-all duration-200">
                    <input
                      type="radio"
                      name="accessType"
                      value="commercial"
                      checked={formData.accessType === "commercial"}
                      onChange={handleInputChange}
                      required
                      className="mr-3 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Commercial
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Custom terms for business use
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Project Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="gt-soft-ring w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none"
                  placeholder="Tell us about your project, expected usage, and any specific requirements..."
                />
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                By submitting this form, you agree to our{" "}
                <Link
                  to="/terms"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline"
                >
                  Privacy Policy
                </Link>
                .
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="gt-soft-ring w-full px-8 py-4 bg-slate-900 dark:bg-green-600 disabled:bg-slate-400 text-white font-semibold rounded-full transition-all duration-300 hover:translate-y-[-2px] shadow-lg disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FaRocket />
                    Request API Access
                  </div>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* SUPPORT */}
        <section className="py-20 px-6 bg-white dark:bg-[#020f1e] border-t border-slate-100 dark:border-slate-900">
          <div className="max-w-4xl mx-auto text-center">
            <div className="gt-panel rounded-2xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800">
              <FaQuestionCircle className="text-4xl text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h2 className="gt-display text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                Need help getting started?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                We can help you figure out whether GreenTracer API access is the right fit
                for your product, research, or reporting workflow.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/faq"
                  className="gt-soft-ring inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-green-600 text-white font-semibold rounded-full transition-all duration-300 hover:translate-y-[-2px] shadow-lg"
                >
                  <FaBook className="mr-2" />
                  View FAQ
                </Link>

                <a
                  href="mailto:api@greentracer.org"
                  className="gt-soft-ring inline-flex items-center justify-center px-8 py-4 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full font-semibold transition-all duration-300"
                >
                  <FaEnvelope className="mr-2" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center py-10 border-t border-slate-100 dark:border-slate-900">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors gt-mono text-xs font-bold uppercase tracking-wider"
          >
            <FaArrowRight className="rotate-180" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}
