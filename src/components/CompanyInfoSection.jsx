import React from "react";
import {
  ArrowRight,
  Code,
  Search,
  BarChart3,
  Rocket,
  Terminal,
  ExternalLink,
} from "lucide-react";

import buzzboostPng from "../assets/buzzboost.png";
import buzzboostWebp from "../assets/buzzboost.webp";
import buzzboostAvif from "../assets/buzzboost.avif";

const sectionStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');

  .gt-section { font-family: 'Inter', sans-serif; }
  .gt-display { font-family: 'Fraunces', serif; letter-spacing: -0.02em; }
  .gt-mono { font-family: 'JetBrains Mono', monospace; }

  .gt-grid-faint {
    background-size: 34px 34px;
    background-image:
      linear-gradient(to right, rgba(15,23,42,0.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(15,23,42,0.035) 1px, transparent 1px);
    mask-image: radial-gradient(circle at center, black 52%, transparent 100%);
  }

  .dark .gt-grid-faint {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
  }

  .gt-capability-card {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .gt-capability-card:hover {
    transform: translateY(-4px);
    border-color: rgba(21, 128, 61, 0.35);
    box-shadow: 0 15px 30px -10px rgba(15,23,42,0.10);
  }

  .dark .gt-capability-card:hover {
    box-shadow: 0 15px 30px -10px rgba(22, 163, 74, 0.14);
  }
`;

const services = [
  {
    id: "01",
    icon: <Code className="w-5 h-5" />,
    title: "Sustainable Dev",
    desc: "We build low-carbon, high-performance web architectures that scale without the bloat.",
  },
  {
    id: "02",
    icon: <Search className="w-5 h-5" />,
    title: "Eco-SEO Strategy",
    desc: "Visibility that balances user value with environmental impact. Rank higher, burn less.",
  },
  {
    id: "03",
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Digital Strategy",
    desc: "Turning sustainability insights into commercial roadmaps. Good for the planet, better for profit.",
  },
];

export default function CompanyInfoSection() {
  return (
    <section
      id="company-info"
      className="gt-section relative bg-white dark:bg-[#020f1e] py-24 sm:py-28 px-5 sm:px-6 transition-colors duration-300 overflow-hidden border-t border-slate-100 dark:border-slate-900"
      aria-labelledby="company-info-heading"
    >
      <style>{sectionStyles}</style>

      <div className="absolute inset-0 gt-grid-faint pointer-events-none opacity-60" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent pointer-events-none" />
      <div
        className="absolute bottom-[-10%] left-[-8%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[110px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-14 lg:gap-16 items-center">
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
          <div className="inline-flex flex-col items-center lg:items-start gap-4">
            <div className="gt-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
              // POWERED_BY
            </div>

            <a
              href="https://buzzboost.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit BuzzBoost Digital"
              className="group relative bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl hover:scale-[1.02] transition-transform duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
            >
              <picture>
                <source type="image/avif" srcSet={buzzboostAvif} />
                <source type="image/webp" srcSet={buzzboostWebp} />
                <img
                  src={buzzboostPng}
                  alt="BuzzBoost Digital"
                  className="h-12 md:h-14 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </picture>

              <ExternalLink
                className="absolute top-3 right-3 w-3 h-3 text-slate-600 group-hover:text-white transition-colors"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className="space-y-4">
            <h2
              id="company-info-heading"
              className="gt-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-[1.05]"
            >
              Built by engineers, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                backed by expertise.
              </span>
            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              GreenTracer is a{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                non-profit initiative
              </span>{" "}
              by BuzzBoost Digital. We built this because we believe the web
              should be lighter, faster, and cleaner — for everyone.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <a
              href="https://buzzboost.co.uk/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-sm hover:translate-y-[-2px] shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
            >
              <Rocket className="w-4 h-4" aria-hidden="true" />
              Hire the Agency
            </a>

            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800/30">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="gt-mono text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">
                Open Source Contribution
              </span>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2 p-6 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shrink-0">
                  <Terminal className="w-5 h-5 text-slate-500" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="gt-mono text-[10px] font-bold text-slate-400 uppercase">
                    Core Competencies
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    Agency Capabilities
                  </div>
                </div>
              </div>

              <div className="flex gap-1" aria-hidden="true">
                <div className="w-2 h-2 rounded-full bg-red-400/20"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400/20"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>

            {services.map((s) => (
              <article
                key={s.title}
                className="gt-capability-card p-6 bg-white/95 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {s.icon}
                  </div>
                  <span className="gt-mono text-[10px] text-slate-300 dark:text-slate-600">
                    {s.id}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  {s.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </article>
            ))}

            <a
              href="https://buzzboost.co.uk/services"
              target="_blank"
              rel="noopener noreferrer"
              className="gt-capability-card p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl flex flex-col justify-center items-center text-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
              aria-label="View BuzzBoost full service stack"
            >
              <h3 className="font-bold text-lg mb-1 group-hover:scale-105 transition-transform">
                See Full Stack
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                View our complete service menu
              </p>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}