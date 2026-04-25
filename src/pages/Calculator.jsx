import React from "react";
import { Helmet } from "react-helmet-async";
import { FaBolt, FaLeaf, FaLink, FaServer } from "react-icons/fa";
import InputForm from "../components/InputForm";

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap');

  .gt-calculator-page {
    font-family: 'Inter', sans-serif;
    background:
      radial-gradient(circle at top center, rgba(34,197,94,0.06), transparent 24%),
      linear-gradient(180deg, #f8fafc 0%, #ffffff 35%, #ffffff 100%);
    color: #0f172a;
  }

  .dark .gt-calculator-page {
    background:
      radial-gradient(circle at top center, rgba(34,197,94,0.06), transparent 24%),
      linear-gradient(180deg, #03101d 0%, #04111f 35%, #04111f 100%);
    color: #f8fafc;
  }

  .gt-calculator-page .gt-display {
    font-family: 'Fraunces', serif;
    letter-spacing: -0.03em;
  }

  .gt-calculator-grid {
    background-image:
      linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.08));
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.08));
  }

  .dark .gt-calculator-grid {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px);
  }

  .gt-calculator-panel {
    border: 1px solid rgba(15,23,42,0.08);
    background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.98) 100%);
    backdrop-filter: blur(10px);
  }

  .dark .gt-calculator-panel {
    border-color: rgba(255,255,255,0.08);
    background: linear-gradient(180deg, rgba(7,24,39,0.92) 0%, rgba(10,28,44,0.98) 100%);
  }
`;

const calculatorSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GreenTracer Stash Calculator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://www.greentracer.org/calculator",
  description:
    "Run a website sustainability check with GreenTracer's calculator to see carbon output, hosting verification, and the next action for your site.",
};

export default function Calculator() {
  return (
    <>
      <style>{pageStyles}</style>
      <Helmet>
        <title>GreenTracer Stash Calculator | Website Carbon Checker</title>
        <meta
          name="description"
          content="Run GreenTracer's Stash Calculator to check website carbon output, hosting status, and the trust signals you can act on next."
        />
        <link rel="canonical" href="https://www.greentracer.org/calculator" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.greentracer.org/calculator" />
        <meta property="og:title" content="GreenTracer Stash Calculator" />
        <meta
          property="og:description"
          content="A focused website sustainability calculator for carbon checks, hosting verification, and report-led next steps."
        />
        <meta property="og:image" content="https://www.greentracer.org/GreenFavi.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.greentracer.org/calculator" />
        <meta property="twitter:title" content="GreenTracer Stash Calculator" />
        <meta
          property="twitter:description"
          content="Check a website, see the carbon output, and move straight into the next decision."
        />
        <meta property="twitter:image" content="https://www.greentracer.org/GreenFavi.png" />
        <script type="application/ld+json">{JSON.stringify(calculatorSchema)}</script>
      </Helmet>

      <main className="gt-calculator-page relative min-h-screen overflow-hidden">
        <div className="gt-calculator-grid absolute inset-0 pointer-events-none opacity-70" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-[-140px] h-[360px] w-[560px] -translate-x-1/2 rounded-full bg-green-500/10 blur-[120px]" />
          <div className="absolute bottom-8 right-[12%] h-[260px] w-[260px] rounded-full bg-cyan-500/10 blur-[110px]" />
        </div>

        <section className="relative z-10 border-b border-slate-200/70 px-6 pb-16 pt-28 dark:border-white/5 sm:pt-32">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300">
              <FaBolt className="text-green-500" />
              Focused Test Flow
            </div>

            <h1 className="gt-display mx-auto mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] text-slate-900 dark:text-white sm:text-6xl md:text-7xl">
              GreenTracer
              <br />
              <span className="text-green-600 dark:text-green-400">Stash Calculator</span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
              A cleaner route into the check itself. Drop in a URL, run the test, and get the carbon output, hosting
              status, and the trust-ready next step without the homepage framing around it.
            </p>

            <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
              <div className="gt-calculator-panel rounded-3xl p-5">
                <FaLeaf className="mb-3 text-xl text-green-500" />
                <p className="font-semibold text-slate-900 dark:text-white">Carbon first</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  See the emissions number and performance context in one pass.
                </p>
              </div>
              <div className="gt-calculator-panel rounded-3xl p-5">
                <FaServer className="mb-3 text-xl text-blue-500" />
                <p className="font-semibold text-slate-900 dark:text-white">Hosting check</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Get the infrastructure signal alongside the carbon result.
                </p>
              </div>
              <div className="gt-calculator-panel rounded-3xl p-5">
                <FaLink className="mb-3 text-xl text-emerald-500" />
                <p className="font-semibold text-slate-900 dark:text-white">Shareable next step</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Move from the report into badges, verification, or a deeper review when it makes sense.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="relative z-10">
          <InputForm />
        </div>
      </main>
    </>
  );
}
