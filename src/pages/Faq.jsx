import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Activity, ArrowRight, BadgeCheck, ChevronDown, Database, Search, Server, ShieldCheck, WalletCards } from "lucide-react";

const categories = [
  { id: "scans", label: "Scans", icon: Activity },
  { id: "badges", label: "Free badges", icon: BadgeCheck },
  { id: "verified", label: "Verified", icon: ShieldCheck },
  { id: "hosting", label: "Hosting", icon: Server },
  { id: "pricing", label: "Pricing", icon: WalletCards },
  { id: "data", label: "Data", icon: Database },
];

const faqs = [
  {
    category: "scans",
    question: "How does a GreenTracer scan work?",
    answer: "Enter a public URL and GreenTracer measures the page, checks hosting signals, calculates an estimated carbon value per page view, assigns a grade, and saves a public report page that you can share.",
    tags: ["scan", "report", "carbon"],
  },
  {
    category: "scans",
    question: "Why does the public scan ask for email and consent?",
    answer: "The homepage and calculator flows are lead-capture scans. Anonymous visitors provide an email and consent so GreenTracer can send the report and follow up. Logged-in dashboard scans do not ask for email or consent.",
    tags: ["email", "consent", "dashboard"],
  },
  {
    category: "badges",
    question: "Which badges are free?",
    answer: "Carbon Result and Green Hosting are free public badges. They come from saved public report data and do not require login, payment, or a verified membership.",
    tags: ["carbon result", "green hosting", "free"],
  },
  {
    category: "badges",
    question: "Where do I get the Carbon Result badge code?",
    answer: "Run a scan, open the saved result page, and use the badge actions section. The snippet is generated from the saved result so you do not manually enter grades, scores, or report slugs.",
    tags: ["carbon result", "embed", "result"],
  },
  {
    category: "badges",
    question: "When can I use the Green Hosting badge?",
    answer: "Only when the saved report detects green hosting. If green hosting is not detected, GreenTracer shows an explanation instead of giving you a badge that would overstate the evidence.",
    tags: ["green hosting", "eligibility", "badge"],
  },
  {
    category: "verified",
    question: "What does GreenTracer Verified mean?",
    answer: "GreenTracer Verified is the paid supporter/member badge. It indicates active licence or manual trial status and domain verification. It does not mean the site has a perfect carbon score.",
    tags: ["verified", "licence", "member"],
  },
  {
    category: "verified",
    question: "Does verified require a perfect grade?",
    answer: "No. A company can have a poor carbon score and still be GreenTracer Verified if it has an active supporter licence and verified domain. The scan grade and supporter status are separate claims.",
    tags: ["verified", "grade", "supporter"],
  },
  {
    category: "hosting",
    question: "Why is my host not showing as green?",
    answer: "GreenTracer depends on available provider and hosting evidence. CDNs, proxies, redirects, or unlisted providers can hide the underlying hosting signal. Re-run a scan after provider or DNS changes.",
    tags: ["hosting", "cdn", "provider"],
  },
  {
    category: "pricing",
    question: "What will paid plans unlock?",
    answer: "Paid plans are intended for GreenTracer Verified status, managed domain verification, supporter badge rights, and future directory/profile visibility. Free report-backed badges remain free.",
    tags: ["pricing", "licence", "plans"],
  },
  {
    category: "data",
    question: "How accurate is the carbon estimate?",
    answer: "Carbon results are modelled estimates based on measurable inputs and published assumptions. They are useful for comparison and prioritization, not a full lifecycle assessment, exact footprint, or regulatory audit.",
    tags: ["accuracy", "methodology", "estimate"],
  },
  {
    category: "data",
    question: "Is GreenTracer open source?",
    answer: "GreenTracer follows an open methodology and protected infrastructure model. We publish selected methodology and scoring assumptions so results can be understood and questioned, while operational infrastructure, API keys, rate limits, and private systems remain protected.",
    tags: ["open methodology", "infrastructure", "trust"],
  },
  {
    category: "data",
    question: "Why are some performance signals unavailable?",
    answer: "Older cached results or failed Lighthouse runs may not include every performance category. GreenTracer labels missing values as unavailable rather than inventing a score.",
    tags: ["lighthouse", "performance", "data"],
  },
  {
    category: "verified",
    question: "Is the verified directory live?",
    answer: "The link model is prepared for verified profiles and directory pages. The initial verified badge can point to a placeholder profile while the fuller directory experience is built.",
    tags: ["directory", "profile", "verified"],
  },
];

export default function Faq() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaqs, setExpandedFaqs] = useState(new Set([faqs[0].question]));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const filteredFaqs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch = !term ||
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term) ||
        faq.tags.some((tag) => tag.toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const toggleFaq = (key) => {
    setExpandedFaqs((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <>
      <Helmet>
        <title>FAQ | GreenTracer</title>
        <meta
          name="description"
          content="Answers about GreenTracer scans, free badges, verified badges, green hosting, pricing, data accuracy, and directory plans."
        />
        <link rel="canonical" href="https://www.greentracer.org/faq" />
        <meta property="og:title" content="FAQ | GreenTracer" />
        <meta property="og:description" content="Answers about GreenTracer scans, badges, verification, hosting, pricing, and data accuracy." />
        <meta property="og:image" content="https://www.greentracer.org/GreenFavi.png" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-100/70 text-slate-900 dark:bg-[#020f1e] dark:text-white">
        <section className="border-b border-slate-200 bg-white px-4 pb-12 pt-28 dark:border-slate-900 dark:bg-[#020f1e] sm:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
              <Activity size={13} aria-hidden="true" />
              Support center
            </p>
            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-6xl">
                  Frequently asked questions.
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                  Focused answers about scans, free report badges, GreenTracer Verified, green hosting, pricing, data quality, and the directory roadmap.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Core product model</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Carbon Result and Green Hosting are report-backed. GreenTracer Verified is the paid supporter/member badge.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-6xl space-y-5">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search scans, badges, hosting, pricing..."
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  aria-label="Search frequently asked questions"
                />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filteredFaqs.length} of {faqs.length} questions
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold ${
                  selectedCategory === "all"
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                All
              </button>
              {categories.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedCategory(id)}
                  className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${
                    selectedCategory === id
                      ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                      : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  }`}
                >
                  {React.createElement(Icon, { size: 14, "aria-hidden": true })}
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                  <p className="font-semibold text-slate-900 dark:text-white">No matching questions.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="mt-4 inline-flex h-10 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                filteredFaqs.map((faq, index) => {
                  const isExpanded = expandedFaqs.has(faq.question);
                  const panelId = `faq-panel-${index}`;
                  const category = categories.find((item) => item.id === faq.category);
                  const Icon = category?.icon || Activity;
                  return (
                    <article key={`${faq.category}-${faq.question}`} className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.question)}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6"
                      >
                        <span className="flex min-w-0 gap-4">
                          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-300">
                            <Icon size={16} aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-base font-semibold text-slate-950 dark:text-white sm:text-lg">{faq.question}</span>
                            <span className="mt-2 flex flex-wrap gap-2">
                              {faq.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                  {tag}
                                </span>
                              ))}
                            </span>
                          </span>
                        </span>
                        <ChevronDown className={`mt-2 h-4 w-4 shrink-0 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true" />
                      </button>

                      {isExpanded && (
                        <div id={panelId} className="border-t border-slate-200 px-5 pb-5 pt-4 dark:border-slate-700 sm:px-6 sm:pb-6">
                          <p className="max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.answer}</p>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 sm:p-8">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Still need a specific answer?</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Start with a public scan, then use the result page for report-backed badges or the dashboard for GreenTracer Verified.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link to="/" className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                    Run scan
                  </Link>
                  <Link to="/badge" className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">
                    Badge builder
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}
