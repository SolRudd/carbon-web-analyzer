import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE } from "../config";
import {
  ArrowRight,
  Building2,
  Check,
  ExternalLink,
  FileText,
  Globe,
  Leaf,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

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
      radial-gradient(circle at top center, rgba(34,197,94,0.06), transparent 26%),
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
      radial-gradient(circle at top center, rgba(34,197,94,0.04), transparent 26%),
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
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.12));
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.12));
  }

  .gt-section-clean {
    background: transparent;
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

  .gt-card--featured {
    border-color: var(--gt-border-strong);
    box-shadow: 0 22px 80px -34px rgba(34,197,94,0.28);
  }

  .gt-card__glow {
    position: absolute;
    left: 50%;
    bottom: -58px;
    transform: translateX(-50%);
    width: 78%;
    height: 150px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(34,197,94,0.18), rgba(34,197,94,0.05) 42%, transparent 72%);
    filter: blur(24px);
    pointer-events: none;
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

  .gt-toggle-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    margin-bottom: 2.5rem;
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
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background .18s ease, color .18s ease, transform .18s ease;
  }

  .gt-toggle__btn:hover {
    color: var(--gt-text);
  }

  .gt-toggle__btn.is-active {
    background: linear-gradient(135deg, var(--gt-green-2) 0%, var(--gt-green) 100%);
    color: white;
    box-shadow: 0 12px 24px -14px rgba(34,197,94,0.65);
  }

  .gt-toggle__btn:focus-visible,
  .gt-btn:focus-visible,
  .gt-link-btn:focus-visible {
    outline: 2px solid var(--gt-green-3);
    outline-offset: 2px;
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

  .gt-popular {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.18);
    color: var(--gt-green-3);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .14em;
    text-transform: uppercase;
  }

  .gt-check {
    flex: 0 0 auto;
    margin-top: 3px;
    color: var(--gt-green-3);
  }

  .gt-card-copy {
    min-height: 132px;
  }

  .gt-helper {
    min-height: 20px;
  }

  .gt-trust-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 18px;
  }

  .gt-trust-pill {
    border: 1px solid var(--gt-border);
    background: rgba(255,255,255,0.04);
    color: var(--gt-muted);
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
  }

  .gt-price-meta {
    color: var(--gt-muted-2);
    font-size: 14px;
  }

  /* Light mode typography */
  html:not(.dark) .gt-page h1,
  html:not(.dark) .gt-page h2,
  html:not(.dark) .gt-page h3 {
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

  html:not(.dark) .gt-card--featured {
    border-color: var(--gt-border-strong);
    box-shadow: 0 22px 80px -34px rgba(22,163,74,0.12);
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

  html:not(.dark) .gt-toggle {
    background: rgba(255,255,255,0.85);
    border-color: rgba(0,0,0,0.08);
  }

  html:not(.dark) .gt-popular {
    background: rgba(22,163,74,0.08);
    border-color: rgba(22,163,74,0.15);
    color: #16a34a;
  }

  html:not(.dark) .gt-divider {
    border-top-color: rgba(0,0,0,0.07);
  }

  html:not(.dark) .gt-btn--ghost {
    background: rgba(0,0,0,0.04);
    color: #0f172a;
    border-color: rgba(0,0,0,0.10);
  }

  html:not(.dark) .gt-trust-pill {
    background: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.08);
    color: #475569;
  }

  @media (max-width: 1023px) {
    .gt-card-copy {
      min-height: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gt-card,
    .gt-btn,
    .gt-link-btn,
    .gt-toggle__btn {
      transition: none !important;
    }

    .gt-card:hover,
    .gt-btn:hover,
    .gt-link-btn:hover {
      transform: none !important;
    }
  }
`;

const prices = {
  monthly: {
    starter: { main: "£39", suffix: "/mo", helper: "Cancel anytime" },
    agency: { main: "£129", suffix: "/mo", helper: "Cancel anytime" },
  },
  annual: {
    starter: { main: "£390", suffix: "/year", helper: "2 months free with annual" },
    agency: { main: "£1,290", suffix: "/year", helper: "2 months free with annual" },
  },
};

export default function Pricing() {
  const [params] = useSearchParams();
  const [billing, setBilling] = useState("monthly");
  const [checkoutDomain, setCheckoutDomain] = useState(String(params.get("domain") || ""));
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const checkoutCanceled = params.get("checkout") === "cancel";

  const normalizeDomain = (value) =>
    String(value || "")
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0]
      .toLowerCase();

  const startCheckout = async () => {
    const domain = normalizeDomain(checkoutDomain);
    if (!domain) {
      setCheckoutError("Enter a valid domain (for example: example.com) before checkout.");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detailText = data.details ? ` Details: ${data.details}` : "";
        const modeText = data.checkoutMode ? ` (mode: ${data.checkoutMode})` : "";
        throw new Error(`${data.error || "Unable to start checkout."}${modeText}${detailText}`);
      }
      if (!data.url) throw new Error("Stripe checkout URL was not returned.");
      window.location.assign(data.url);
    } catch (err) {
      setCheckoutError(err.message || "Unable to start checkout.");
      setCheckoutLoading(false);
    }
  };

  const tiers = useMemo(() => {
    const starter = prices[billing].starter;
    const agency = prices[billing].agency;

    return [
      {
        name: "Starter",
        code: "// SINGLE_DOMAIN",
        note: "1 domain included",
        description:
          "For businesses that want a credible GreenTracer presence on their website, access to reporting, and a profile within the wider GreenTracer ecosystem.",
        price: starter.main,
        suffix: starter.suffix,
        helper: starter.helper,
        icon: ShieldCheck,
        ctaLabel: "Get Starter Access",
        ctaType: "button",
        ctaClass: "gt-btn--light",
        featured: false,
        features: [
          "1 licensed domain",
          "GreenTracer verified badge",
          "Green hosting badge if eligible",
          "Directory/profile listing",
          "Shareable reporting access",
          "Backlink and visibility benefits",
        ],
      },
      {
        name: "Agency",
        code: "// MULTI_DOMAIN",
        note: "Up to 10 domains",
        description:
          "For agencies, studios, and teams managing multiple websites that want trusted sustainability badges, reporting, and profile visibility across client projects.",
        price: agency.main,
        suffix: agency.suffix,
        helper: agency.helper,
        icon: Building2,
        ctaLabel: "Choose Agency",
        ctaType: "button",
        ctaClass: "gt-btn--green",
        featured: true,
        badge: "Most Popular",
        features: [
          "Up to 10 licensed domains",
          "GreenTracer verified badges",
          "Green hosting badges if eligible",
          "Multi-site reporting access",
          "Directory visibility for licensed sites",
          "Ideal for agency client portfolios",
        ],
      },
      {
        name: "Custom",
        code: "// ENTERPRISE_CUSTOM",
        note: "Flexible pricing",
        description:
          "For larger organisations, networks, partners, or specialist rollouts needing more domains, tailored support, or a custom GreenTracer commercial setup.",
        price: "Custom",
        suffix: "",
        helper: "Talk to us for tailored licensing",
        icon: Sparkles,
        ctaLabel: "Talk to Us",
        ctaType: "link",
        href: "https://buzzboost.co.uk/contact/",
        ctaClass: "gt-btn--ghost",
        featured: false,
        features: [
          "More than 10 domains",
          "Tailored commercial licensing",
          "Custom reporting scope",
          "Directory and partner opportunities",
          "Support for larger rollouts",
          "Direct onboarding and support",
        ],
      },
    ];
  }, [billing]);

  const valueBlocks = [
    {
      icon: ShieldCheck,
      title: "Trusted Badge Licensing",
      text: "Show that your business is actively engaging with greener digital practice through a clear and credible public trust signal.",
    },
    {
      icon: FileText,
      title: "Reports & Visibility",
      text: "Give clients, prospects, and internal teams something tangible to share, review, and build from over time.",
    },
    {
      icon: Globe,
      title: "Directory & Backlink Value",
      text: "Get listed within GreenTracer and benefit from additional visibility as the ecosystem grows across industries.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Pricing | GreenTracer Badge Licensing</title>
        <meta
          name="description"
          content="Choose a GreenTracer pricing plan for badge licensing, reporting access, directory visibility, and multi-domain use."
        />
        <link rel="canonical" href="https://www.greentracer.org/pricing" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.greentracer.org/pricing" />
        <meta property="og:title" content="Pricing | GreenTracer Badge Licensing" />
        <meta
          property="og:description"
          content="Simple GreenTracer pricing for single-site, agency, and custom sustainability badge licensing."
        />
        <meta property="og:image" content="https://www.greentracer.org/GreenFavi.png" />
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
                <Terminal className="h-3.5 w-3.5 text-green-400" />
                <span className="gt-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  GreenTracer Pricing
                </span>
              </div>
            </div>

            <h1 className="gt-display mx-auto max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl md:text-7xl">
              Sustainability trust
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text italic font-light text-transparent">
                you can actually show
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              GreenTracer helps businesses show progress, gain visibility, and
              strengthen their sustainability story with trusted badges,
              reporting, and ecosystem exposure.
            </p>

            <div className="gt-trust-row">
              <span className="gt-trust-pill">Verified badge licensing</span>
              <span className="gt-trust-pill">Green hosting recognition where eligible</span>
              <span className="gt-trust-pill">Directory & backlink value</span>
            </div>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#pricing-tiers"
                className="gt-btn gt-btn--light inline-flex items-center justify-center gap-2 px-8 py-4 text-sm"
              >
                View Pricing
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                to="/badge"
                className="gt-link-btn gt-btn--ghost inline-flex items-center justify-center px-8 py-4 text-sm"
              >
                Explore Badge Setup
              </Link>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing-tiers" className="gt-section-clean px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <div className="gt-mono mb-4 text-xs font-bold uppercase tracking-[0.22em] text-green-400">
                // PRICING_TIERS
              </div>
              <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                Choose the right GreenTracer plan
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                Keep it simple with a single-site plan, scale across client
                websites with an agency tier, or talk to us for a tailored rollout.
              </p>
            </div>

            <div className="gt-toggle-wrap">
              <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-600 dark:text-green-400">
                  Checkout Domain
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Enter the domain to license before selecting Starter or Agency checkout.
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={checkoutDomain}
                    onChange={(e) => setCheckoutDomain(e.target.value)}
                    placeholder="example.com"
                    className="h-11 flex-1 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#04111f] px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={startCheckout}
                    disabled={checkoutLoading}
                    className="gt-btn gt-btn--green inline-flex items-center justify-center gap-2 px-5 py-3 text-sm disabled:opacity-60"
                  >
                    {checkoutLoading ? "Starting..." : "Start Test Checkout"}
                  </button>
                </div>
                {checkoutCanceled && (
                  <p className="mt-3 text-sm text-amber-300">
                    Checkout was canceled. You can retry with the same or a different domain.
                  </p>
                )}
                {checkoutError && <p className="mt-3 text-sm text-rose-300">{checkoutError}</p>}
                <p className="mt-3 text-xs text-slate-500">
                  Current Stripe integration provisions the Verified Badge License SKU in test mode.
                </p>
              </div>

              <div className="gt-toggle" role="tablist" aria-label="Billing period">
                <button
                  type="button"
                  role="tab"
                  aria-selected={billing === "monthly"}
                  className={`gt-toggle__btn ${billing === "monthly" ? "is-active" : ""}`}
                  onClick={() => setBilling("monthly")}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={billing === "annual"}
                  className={`gt-toggle__btn ${billing === "annual" ? "is-active" : ""}`}
                  onClick={() => setBilling("annual")}
                >
                  Annual
                </button>
              </div>

              <p className="text-sm text-slate-400">
                Annual billing saves the equivalent of{" "}
                <span className="font-semibold text-green-400">2 months free</span>.
              </p>
            </div>

            <div className="grid items-stretch gap-8 lg:grid-cols-3">
              {tiers.map((tier) => {
                const Icon = tier.icon;

                return (
                  <article
                    key={tier.name}
                    className={`gt-panel gt-card flex h-full flex-col p-8 ${tier.featured ? "gt-card--featured" : ""}`}
                    aria-label={`${tier.name} plan`}
                  >
                    <div className="relative z-10 flex h-full flex-col">
                      <div>
                        <div className="mb-6 min-h-[28px]">
                          {tier.badge ? <span className="gt-popular">{tier.badge}</span> : null}
                        </div>

                        <div className="mb-6 flex items-start justify-between gap-4">
                          <div>
                            <div className="gt-mono mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                              {tier.code}
                            </div>
                            <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                            <p className="mt-2 text-sm font-semibold text-green-400">{tier.note}</p>
                          </div>

                          <div className="gt-icon-box">
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="gt-card-copy mb-6">
                          <div className="flex flex-wrap items-end gap-2">
                            <span className="text-5xl font-extrabold tracking-tight text-white">
                              {tier.price}
                            </span>
                            {tier.suffix ? (
                              <span className="mb-2 text-base font-semibold text-slate-400">
                                {tier.suffix}
                              </span>
                            ) : null}
                          </div>

                          {tier.name !== "Custom" && (
                            <p className="gt-price-meta mt-2">
                              {billing === "monthly"
                                ? "Switch to annual and get 2 months free"
                                : `Effective monthly cost: ${tier.name === "Starter" ? "£32.50/mo" : "£107.50/mo"}`}
                            </p>
                          )}

                          <p className="mt-5 text-base leading-relaxed text-slate-400">
                            {tier.description}
                          </p>
                        </div>

                        <div className="gt-divider my-6" />

                        <ul className="space-y-4">
                          {tier.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <Check className="gt-check h-4 w-4" />
                              <span className="text-base leading-relaxed text-slate-300">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-8">
                        {tier.ctaType === "link" ? (
                          <a
                            href={tier.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`gt-link-btn ${tier.ctaClass} inline-flex w-full items-center justify-center gap-2 px-6 py-4 text-base`}
                          >
                            {tier.ctaLabel}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={startCheckout}
                            disabled={checkoutLoading}
                            className={`gt-btn ${tier.ctaClass} inline-flex w-full items-center justify-center gap-2 px-6 py-4 text-base`}
                            aria-label={`${tier.ctaLabel} for the ${tier.name} plan`}
                          >
                            {checkoutLoading ? "Starting..." : tier.ctaLabel}
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}

                        <p className="gt-helper mt-4 text-center text-sm text-slate-500">
                          {tier.helper}
                        </p>
                      </div>
                    </div>

                    <div className="gt-card__glow" />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* VALUE */}
        <section className="border-t border-white/5 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <div className="gt-mono mb-4 text-xs font-bold uppercase tracking-[0.22em] text-green-400">
                // WHAT_YOU_GET
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Built for visibility, credibility, and growth
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                GreenTracer is not just a badge. It is a clearer way to show digital
                sustainability intent and become part of a growing green-focused ecosystem.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {valueBlocks.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="gt-panel p-6">
                    <div className="gt-icon-box mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-base leading-relaxed text-slate-400">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* NOTES */}
        <section className="px-6 py-4">
          <div className="mx-auto max-w-4xl">
            <div className="gt-panel p-8 sm:p-10">
              <div className="gt-mono mb-4 text-xs font-bold uppercase tracking-[0.22em] text-green-400">
                // LICENSING_NOTES
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Clearer, simpler positioning
              </h2>

              <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-400">
                <p>
                  <strong className="text-white">Starter</strong> is for one website that wants a
                  credible GreenTracer presence.
                </p>
                <p>
                  <strong className="text-white">Agency</strong> is for people managing multiple
                  domains, such as agencies, freelancers, or internal teams running several sites.
                </p>
                <p>
                  <strong className="text-white">Custom</strong> is for larger opportunities,
                  partnerships, or anything needing a more tailored commercial setup.
                </p>
                <p>
                  Green hosting recognition is available where eligible, while broader GreenTracer
                  membership value comes from badges, reporting, directory presence, and visibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-20 pt-16">
          <div className="mx-auto max-w-5xl">
            <div className="gt-panel relative overflow-hidden border-white/10 px-8 py-12 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(74,222,128,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_34%)]" />
              <div className="relative z-10 mx-auto max-w-3xl text-center">
                <div className="gt-mono mb-4 text-xs font-bold uppercase tracking-[0.22em] text-green-300">
                  // NEXT_STEP
                </div>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Ready to make GreenTracer a real product?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-slate-300">
                  This pricing structure is now in a much stronger place for proper
                  checkout, account upgrades, directory access, and future reporting workflows.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href="https://buzzboost.co.uk/contact/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gt-btn gt-btn--light inline-flex items-center justify-center gap-2 px-8 py-4 text-sm"
                  >
                    Talk About Custom Licensing
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <Link
                    to="/badge"
                    className="gt-link-btn gt-btn--ghost inline-flex items-center justify-center px-8 py-4 text-sm"
                  >
                    View Badge Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-white/5 py-10 text-center">
          <Link
            to="/"
            className="gt-mono inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-green-400"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}
