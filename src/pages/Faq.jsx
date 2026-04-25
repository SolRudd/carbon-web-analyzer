// src/pages/Faq.jsx

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaSearch,
  FaChevronDown,
  FaQuestionCircle,
  FaLightbulb,
  FaServer,
  FaCertificate,
  FaCog,
  FaRocket,
  FaShieldAlt,
  FaGlobe,
} from "react-icons/fa";
import { Activity, ArrowRight } from "lucide-react";

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

  .gt-faq-card {
    transition: all 0.3s ease;
  }

  .gt-faq-card:hover {
    border-color: rgba(22, 163, 74, 0.32);
  }
`;

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <FaRocket className="text-xl" />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700",
  },
  {
    id: "how-it-works",
    title: "How It Works",
    icon: <FaCog className="text-xl" />,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-700",
  },
  {
    id: "badge-api",
    title: "Badge & API",
    icon: <FaCertificate className="text-xl" />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700",
  },
  {
    id: "technical",
    title: "Technical Details",
    icon: <FaServer className="text-xl" />,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-700",
  },
];

const faqs = [
  {
    category: "getting-started",
    question: "How do I check my website's carbon footprint?",
    answer:
      "Simply enter your website URL in our calculator on the homepage. Our system will analyze your site using Google PageSpeed Insights API, check for green hosting via the Green Web Foundation, and calculate your CO₂ emissions per page view. Results are ready in about 15-30 seconds.",
    emoji: "🚀",
    tags: ["calculator", "getting started", "analysis"],
  },
  {
    category: "getting-started",
    question: "Why should I care about my website's carbon footprint?",
    answer:
      "Digital emissions now account for 4% of global greenhouse gases—equivalent to the aviation industry. A typical website produces 60kg CO₂ annually. Beyond environmental responsibility, green websites are faster, cheaper to host, and rank better in search engines. Many countries are implementing digital carbon reporting requirements.",
    emoji: "🌱",
    tags: ["environment", "benefits", "performance"],
  },
  {
    category: "getting-started",
    question: "Is the carbon calculator free to use?",
    answer:
      "Yes! Our basic carbon calculator is completely free with no limits. You can test any website and get detailed results including CO₂ per page view, grade (A+ to F), and percentile ranking. Premium features like historical tracking and advanced reports will be available soon.",
    emoji: "💰",
    tags: ["pricing", "free", "limits"],
  },

  {
    category: "how-it-works",
    question: "How accurate are your carbon calculations?",
    answer:
      "We use industry-standard methodologies: Google PageSpeed Insights for page weight, 0.81 kWh/GB energy intensity (covering data centers + networks), and 442g CO₂/kWh global electricity carbon intensity. Green hosting gets a 9% discount. Our calculations match methods used by Website Carbon Calculator and other recognized tools.",
    emoji: "🎯",
    tags: ["accuracy", "methodology", "standards"],
  },
  {
    category: "how-it-works",
    question: "What data sources do you use?",
    answer:
      "We integrate with Google PageSpeed Insights API for real page weight measurement and the Green Web Foundation database for renewable energy verification. All calculations use peer-reviewed energy intensity factors and global electricity carbon averages from the International Energy Agency.",
    emoji: "📊",
    tags: ["data sources", "apis", "methodology"],
  },
  {
    category: "how-it-works",
    question: "Why don't results update immediately after I make changes?",
    answer:
      "Results are cached for 24 hours to prevent unnecessary API calls and ensure consistent measurements. This also reflects real-world CDN behavior. If you need fresh data sooner, contact us about priority re-testing options coming soon.",
    emoji: "🔄",
    tags: ["caching", "updates", "timing"],
  },
  {
    category: "how-it-works",
    question: "My green host isn't showing as green, why?",
    answer:
      "We rely on the Green Web Foundation's verified database of renewable energy providers. If your host isn't listed, is behind a CDN like Cloudflare, or uses third-party services, the green status may not appear. You can submit your host to Green Web Foundation for verification.",
    emoji: "🌿",
    tags: ["green hosting", "verification", "issues"],
  },

  {
    category: "badge-api",
    question: "How do I add the carbon badge to my website?",
    answer: (
      <>
        Add this code where you want the badge:
        <code className="break-all block bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-xs mt-3 mb-3 font-mono">
          {`<div class="greentrace-badge" data-url="your-site.com"></div>
<script src="https://api.greentracer.org/greentrace-badge.js"></script>`}
        </code>
        The badge will automatically display your latest carbon score and update when visitors load your page.
      </>
    ),
    emoji: "🏷️",
    tags: ["badge", "embed", "installation"],
  },
  {
    category: "badge-api",
    question: "Can I customize the badge appearance?",
    answer:
      "Currently, our badge uses a standard design optimized for readability and trust. Custom styling options including colors, sizes, and themes are planned for our premium tier. The badge automatically adapts to light/dark themes and is fully responsive.",
    emoji: "🎨",
    tags: ["badge", "customization", "styling"],
  },
  {
    category: "badge-api",
    question: "Is there an API I can use programmatically?",
    answer:
      "Yes! Use GET /api/trace?site=yoursite.com to fetch carbon data for any tested website. Results include CO₂ per view, grade, percentile, and green hosting status. Full API documentation with rate limits and authentication coming soon.",
    emoji: "⚡",
    tags: ["api", "integration", "development"],
  },
  {
    category: "badge-api",
    question: "Can I use the badge on multiple websites?",
    answer:
      "Absolutely! Our badge script works on any website and automatically detects the domain. You can embed badges for different sites by setting the data-url attribute. Each badge independently fetches and displays the correct carbon score.",
    emoji: "🌐",
    tags: ["badge", "multiple sites", "domains"],
  },

  {
    category: "technical",
    question: "What technologies power GreenTrace?",
    answer:
      "Frontend: React with Tailwind CSS hosted on Vercel. Backend: Node.js with Express, PostgreSQL database for permanent storage, and integrations with Google PageSpeed Insights and Green Web Foundation APIs. All infrastructure runs on renewable energy where possible.",
    emoji: "⚙️",
    tags: ["technology", "stack", "infrastructure"],
  },
  {
    category: "technical",
    question: "How do you handle data privacy and storage?",
    answer:
      "We store only publicly accessible data: URL, page size, hosting provider, and calculated carbon metrics. No personal information, analytics, or tracking data is collected. All data is stored securely in PostgreSQL with 24-hour caching for performance.",
    emoji: "🔒",
    tags: ["privacy", "data storage", "security"],
  },
  {
    category: "technical",
    question: "What are your rate limits and fair use policy?",
    answer:
      "Free tier: 20 carbon checks per day, 60 badge loads per minute. We use rate limiting to ensure service availability for all users. Higher limits and priority processing available in our upcoming premium plans. Enterprise options for high-volume usage available on request.",
    emoji: "⏱️",
    tags: ["rate limits", "fair use", "limits"],
  },
  {
    category: "technical",
    question: "Do you offer historical tracking and trends?",
    answer:
      "Yes! All carbon checks are permanently stored, enabling historical tracking and trend analysis. You can see how your site's carbon footprint changes over time as you implement optimizations. Detailed trend reports and alerts coming in our premium tier.",
    emoji: "📈",
    tags: ["history", "tracking", "trends"],
  },
];

export default function Faq() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((faq) => typeof faq.answer === "string")
      .map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        searchTerm === "" ||
        (typeof faq.question === "string" &&
          faq.question.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof faq.answer === "string" &&
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (Array.isArray(faq.tags) &&
          faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleFaq = (index) => {
    const newExpanded = new Set(expandedFaqs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFaqs(newExpanded);
  };

  const getCategoryInfo = (categoryId) => {
    return faqCategories.find((cat) => cat.id === categoryId) || {};
  };

  return (
    <>
      <Helmet>
        <title>FAQ | GreenTracer Support Center</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about our website carbon calculator, green hosting verification, API, and the GreenTracer badge."
        />
        <link rel="canonical" href="https://www.greentracer.org/faq" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.greentracer.org/faq" />
        <meta property="og:title" content="FAQ | GreenTracer Support Center" />
        <meta
          property="og:description"
          content="Find answers to frequently asked questions about our website carbon calculator, green hosting verification, API, and the GreenTracer badge."
        />
        <meta property="og:image" content="https://www.greentracer.org/GreenFavi.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.greentracer.org/faq" />
        <meta property="twitter:title" content="FAQ | GreenTracer Support Center" />
        <meta
          property="twitter:description"
          content="Find answers to frequently asked questions about our website carbon calculator, green hosting verification, API, and the GreenTracer badge."
        />
        <meta property="twitter:image" content="https://www.greentracer.org/GreenFavi.png" />

        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="gt-page bg-slate-50 dark:bg-[#020f1e] text-slate-900 dark:text-white transition-colors duration-300 min-h-screen">
        <style>{pageStyles}</style>

        {/* HERO */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-white dark:bg-[#020f1e] border-b border-slate-200 dark:border-slate-900">
          <div className="absolute inset-0 gt-bg-data opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8 animate-[gt-reveal_0.8s_ease-out]">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
                <Activity className="w-3 h-3 text-green-600 dark:text-green-400" />
                <span className="gt-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Support Center
                </span>
              </div>
            </div>

            <h1 className="gt-display text-5xl sm:text-7xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              Frequently asked <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 italic font-light">
                questions.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed font-light">
              Everything you need to know about measuring, reducing, and tracking your
              website&apos;s carbon footprint with GreenTracer.
            </p>

            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {faqs.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Questions Answered
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {faqCategories.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Categories
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  24/7
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Self-Serve Help
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH + FILTERS */}
        <section className="relative py-10 px-6 bg-slate-50 dark:bg-[#020f1e] border-t border-slate-100 dark:border-slate-900 overflow-hidden">
          <div className="absolute inset-0 gt-grid-faint pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-6xl mx-auto space-y-6">
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="gt-soft-ring w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm focus:outline-none text-lg"
                aria-label="Search frequently asked questions"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`gt-soft-ring flex items-center gap-2 px-5 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "bg-slate-900 dark:bg-green-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-400"
                }`}
              >
                <FaGlobe />
                All Categories
              </button>

              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`gt-soft-ring flex items-center gap-2 px-5 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-slate-900 dark:bg-green-600 text-white shadow-lg"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-400"
                  }`}
                >
                  {category.icon}
                  {category.title}
                </button>
              ))}
            </div>

            <div className="text-center text-slate-600 dark:text-slate-400">
              {filteredFaqs.length === faqs.length
                ? `Showing all ${faqs.length} questions`
                : `Found ${filteredFaqs.length} question${
                    filteredFaqs.length !== 1 ? "s" : ""
                  } ${
                    searchTerm
                      ? `for "${searchTerm}"`
                      : `in "${faqCategories.find((c) => c.id === selectedCategory)?.title}"`
                  }`}
            </div>
          </div>
        </section>

        {/* FAQ LIST */}
        <section className="py-16 px-6 bg-white dark:bg-[#020f1e] border-t border-slate-100 dark:border-slate-900">
          <div className="max-w-6xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16">
                <FaQuestionCircle className="text-6xl text-slate-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  No questions found
                </h3>
                <p className="text-slate-500 dark:text-slate-500 mb-6">
                  Try adjusting your search terms or browse different categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="gt-soft-ring px-6 py-3 bg-slate-900 dark:bg-green-600 text-white rounded-full font-semibold transition-all duration-300 hover:translate-y-[-2px]"
                >
                  Show All Questions
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredFaqs.map((faq, index) => {
                  const categoryInfo = getCategoryInfo(faq.category);
                  const isExpanded = expandedFaqs.has(index);
                  const panelId = `faq-panel-${index}`;

                  return (
                    <article
                      key={index}
                      className={`gt-faq-card gt-panel rounded-2xl border ${categoryInfo.borderColor || "border-slate-200 dark:border-slate-700"} overflow-hidden`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        className="gt-soft-ring w-full p-6 md:p-8 text-left flex items-center justify-between gap-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors duration-200"
                      >
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="flex items-center gap-3 shrink-0">
                            <div
                              className={`w-12 h-12 bg-gradient-to-r ${categoryInfo.color || "from-slate-500 to-slate-600"} rounded-xl flex items-center justify-center text-white shadow-sm`}
                            >
                              <span className="text-2xl" aria-hidden="true">
                                {faq.emoji}
                              </span>
                            </div>

                            <div
                              className={`hidden sm:flex w-8 h-8 ${categoryInfo.bgColor || "bg-slate-100 dark:bg-slate-700"} rounded-lg items-center justify-center ${categoryInfo.borderColor || "border border-slate-200 dark:border-slate-600"}`}
                              aria-hidden="true"
                            >
                              {categoryInfo.icon}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                              {faq.question}
                            </h3>

                            <div className="flex flex-wrap gap-2 mt-3">
                              {faq.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`transform transition-transform duration-200 shrink-0 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        >
                          <FaChevronDown className="text-slate-400 text-xl" />
                        </div>
                      </button>

                      <div
                        id={panelId}
                        className={`overflow-hidden transition-all duration-300 ${
                          isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div
                          className={`p-6 md:p-8 pt-0 ${categoryInfo.bgColor || "bg-slate-50 dark:bg-slate-700/30"} border-t ${categoryInfo.borderColor || "border-slate-200 dark:border-slate-600"}`}
                        >
                          <div className="flex items-start gap-4">
                            <FaLightbulb
                              className="text-2xl mt-1 text-yellow-500 shrink-0"
                              aria-hidden="true"
                            />
                            <div className="flex-1">
                              <div className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed space-y-4">
                                {faq.answer}
                              </div>

                              <div className="flex flex-wrap gap-2 mt-5">
                                {faq.tags.map((tag) => (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => setSearchTerm(tag)}
                                    className="gt-soft-ring px-3 py-1 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                                  >
                                    #{tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* SUPPORT CTA */}
        <section className="relative py-20 px-6 bg-slate-50 dark:bg-[#020f1e] border-t border-slate-100 dark:border-slate-900 overflow-hidden">
          <div className="absolute inset-0 gt-grid-faint pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="gt-panel rounded-2xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800">
              <FaShieldAlt className="text-4xl text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h2 className="gt-display text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                Still need help?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help
                you improve performance, trust signals, and sustainability reporting.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/badge"
                  className="gt-soft-ring inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-green-600 text-white font-semibold rounded-full transition-all duration-300 hover:translate-y-[-2px] shadow-lg"
                >
                  <FaCertificate className="mr-2" />
                  Get Your Badge
                </Link>

                <a
                  href="mailto:support@greentracer.org"
                  className="gt-soft-ring inline-flex items-center justify-center px-8 py-4 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full font-semibold transition-all duration-300"
                >
                  <FaQuestionCircle className="mr-2" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* BACK LINK */}
        <div className="text-center py-10 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-[#020f1e]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors gt-mono text-xs font-bold uppercase tracking-wider"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}