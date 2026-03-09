import React from "react";
import { Leaf, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";

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

  .gt-card {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .gt-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -16px rgba(15,23,42,0.10);
    border-color: rgba(21, 128, 61, 0.35);
  }

  .dark .gt-card:hover {
    box-shadow: 0 20px 40px -16px rgba(22, 163, 74, 0.14);
    border-color: rgba(34, 197, 94, 0.4);
  }
`;

const pillars = [
  {
    id: "01",
    tag: "VISIBILITY",
    icon: <Leaf className="w-6 h-6" />,
    title: "Carbon Visibility",
    stat: "1.2g CO2",
    statLabel: "Avg. per pageview",
    description:
      "Stop guessing. We visualize your per-page impact with granular grading, so product and marketing teams can see exactly where the waste is.",
  },
  {
    id: "02",
    tag: "VERIFICATION",
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Trust & Verification",
    stat: "+15%",
    statLabel: "Brand Trust Lift",
    description:
      "Greenwashing doesn't work. Prove your claims with our verified hosting checks and live badges that link directly to your audit data.",
  },
  {
    id: "03",
    tag: "PERFORMANCE",
    icon: <Zap className="w-6 h-6" />,
    title: "Performance & SEO",
    stat: "< 1.5s",
    statLabel: "Target Load Time",
    description:
      "Sustainability is speed. Cleaner code means faster load times, better Google rankings, and higher conversion rates. It pays to be green.",
  },
];

export default function WhyItMatters() {
  return (
    <section
      id="impact"
      className="gt-section relative bg-slate-50 dark:bg-slate-950 py-24 sm:py-28 px-5 sm:px-6 transition-colors duration-300 overflow-hidden"
    >
      <style>{sectionStyles}</style>

      <div className="absolute inset-0 gt-grid-faint pointer-events-none opacity-70" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-green-500/[0.04] dark:bg-green-500/[0.06] rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-end mb-16 border-b border-slate-200/80 dark:border-slate-800 pb-12">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="gt-mono text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
                System Architecture
              </span>
            </div>

            <h2 className="gt-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-[1.05]">
              Sustainability isn't just ethics. <br />
              <span className="text-slate-400 dark:text-slate-500">
                It’s an engineering problem.
              </span>
            </h2>
          </div>

          <div className="max-w-sm pb-2">
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              GreenTracer turns vague "eco-friendly" goals into hard data points, clear ROI, and faster code.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((item) => (
            <article
              key={item.title}
              className="gt-card group relative flex flex-col justify-between h-full bg-white/92 dark:bg-slate-900/55 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-8 rounded-2xl"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-green-700 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                    {item.icon}
                  </div>
                  <span className="gt-mono text-xs text-slate-400 dark:text-slate-500 font-bold opacity-60">
                    // {item.id}_{item.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div>
                  <div className="gt-mono text-2xl font-bold text-slate-900 dark:text-white">
                    {item.stat}
                  </div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {item.statLabel}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}