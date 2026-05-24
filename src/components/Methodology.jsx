import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe,
  BarChart3,
  Shield,
  Award,
  Terminal,
} from "lucide-react";
import { FaBolt } from "react-icons/fa";

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

  .gt-step-card {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;
  }

  .gt-step-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: #15803d;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .gt-step-card:hover::before,
  .gt-step-card:focus-within::before {
    opacity: 1;
  }

  .gt-step-card:hover {
    transform: translateY(-4px);
    background-color: rgba(255,255,255,0.88);
    box-shadow: 0 20px 40px -10px rgba(15,23,42,0.10);
  }

  .dark .gt-step-card:hover {
    background-color: rgba(30, 41, 59, 0.6);
    box-shadow: 0 20px 40px -10px rgba(22, 163, 74, 0.10);
  }
`;

const steps = [
  {
    id: "01",
    cmd: "init_scan()",
    icon: <Globe className="w-5 h-5" />,
    title: "Run a page test",
    description:
      "Submit a URL to calculate carbon intensity. We ping the server, check energy sources, and baseline performance.",
  },
  {
    id: "02",
    cmd: "parse_data()",
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Review the report",
    description:
      "Get a modelled carbon grade, percentile context, and hosting evidence status in one view.",
  },
  {
    id: "03",
    cmd: "deploy_signal()",
    icon: <Shield className="w-5 h-5" />,
    title: "Publish trust badges",
    description:
      "Use Carbon Result, Green Hosting, and GreenTracer Verified badge families to surface the right public signal without mixing claims.",
  },
  {
    id: "04",
    cmd: "loop_optimize()",
    icon: <Award className="w-5 h-5" />,
    title: "Improve & Re-test",
    description:
      "Turn insights into code edits. Optimize images, cache assets, switch hosts, and re-run the test to track gains.",
  },
];

export default function Methodology() {
  return (
    <section
      id="methodology"
      className="gt-section relative bg-white dark:bg-[#020f1e] py-24 sm:py-28 px-5 sm:px-6 transition-colors duration-300 border-t border-slate-200 dark:border-slate-900 overflow-hidden"
      aria-labelledby="methodology-heading"
    >
      <style>{sectionStyles}</style>

      <div className="absolute inset-0 gt-grid-faint pointer-events-none opacity-50" />

      <div
        className="hidden lg:block absolute top-1/2 left-0 w-full h-px border-t border-dashed border-slate-300 dark:border-slate-800 -z-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md shadow-sm backdrop-blur-sm">
              <Terminal className="w-3 h-3 text-slate-400" />
              <span className="gt-mono text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Workflow Protocol
              </span>
            </div>

            <h2
              id="methodology-heading"
              className="gt-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-[1.05]"
            >
              A practical workflow for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                Green Intelligence.
              </span>
            </h2>
          </div>

          <div className="max-w-md pb-1">
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Measurement, verification, and trust outputs combined into a single engineering loop.
            </p>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/40 md:grid-cols-[auto_1fr] md:items-start">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
            <Shield className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Open methodology. Protected infrastructure.
            </h3>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              GreenTracer publishes selected methodology and scoring assumptions so results can be understood and questioned.
              Operational infrastructure, API keys, rate limits, and private systems remain protected. GreenTracer is operated by BuzzBoost Ltd and may offer paid hosted tools, verification, partnerships, or enterprise services in future.
            </p>
          </div>
        </div>

        <div>
          <div
            className="flex items-center justify-between px-4 py-2 bg-slate-200 dark:bg-slate-900 rounded-t-lg border-x border-t border-slate-300 dark:border-slate-800"
            aria-hidden="true"
          >
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-700"></div>
            </div>
            <div className="gt-mono text-[10px] text-slate-500 dark:text-slate-500">
              &gt; executing_sustainability_protocol.sh
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-b-lg overflow-hidden shadow-xl">
            {steps.map((step) => (
              <article
                key={step.title}
                className="gt-step-card group bg-white dark:bg-[#020f1e] p-8 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="gt-mono text-xs font-bold text-green-600 dark:text-green-500 mb-1">
                      // STEP {step.id}
                    </span>
                    <span className="gt-mono text-[10px] text-slate-400">
                      &gt; {step.cmd}
                    </span>
                  </div>

                  <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-md text-slate-600 dark:text-slate-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>

                <div
                  className="mt-auto pt-6 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                >
                  <ArrowRight className="w-4 h-4 text-green-600" />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#top"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-green-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/10 hover:translate-y-[-2px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
          >
            Start Workflow
            <FaBolt className="w-3 h-3 group-hover:text-yellow-300 transition-colors" />
          </a>

          <Link
            to="/how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 px-8 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
          >
            Read Documentation
          </Link>
        </div>
      </div>
    </section>
  );
}
