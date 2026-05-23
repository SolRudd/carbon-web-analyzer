import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Cloud,
  FileText,
  Gauge,
  Globe,
  Leaf,
  Server,
  Zap,
} from "lucide-react";
import logoPng from "../assets/GreenTraceLogo.png";
import logoWebp from "../assets/GreenTraceLogo.webp";
import logoAvif from "../assets/GreenTraceLogo.avif";

const loaderStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');

  .gt-scan-loader {
    font-family: 'Inter', sans-serif;
  }

  .gt-scan-mono {
    font-family: 'JetBrains Mono', monospace;
  }

  @keyframes gt-scan-sweep {
    0% { transform: translateX(-55%); opacity: 0; }
    18% { opacity: 1; }
    72% { opacity: 1; }
    100% { transform: translateX(55%); opacity: 0; }
  }

  @keyframes gt-scan-pulse {
    0%, 100% { opacity: .36; transform: scale(.96); }
    50% { opacity: .86; transform: scale(1.04); }
  }

  @keyframes gt-scan-drift {
    0% { transform: translate3d(-2%, 0, 0); }
    50% { transform: translate3d(2%, -1%, 0); }
    100% { transform: translate3d(-2%, 0, 0); }
  }

  .gt-scan-sweep {
    animation: gt-scan-sweep 2.6s cubic-bezier(.22,.7,.28,1) infinite;
  }

  .gt-scan-pulse {
    animation: gt-scan-pulse 2.8s ease-in-out infinite;
  }

  .gt-scan-drift {
    animation: gt-scan-drift 12s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .gt-scan-sweep,
    .gt-scan-pulse,
    .gt-scan-drift {
      animation: none !important;
    }
  }
`;

const scanSteps = [
  { label: "Preparing scan environment", detail: "Setting up analysis engine...", icon: Server },
  { label: "Measuring page weight", detail: "Reviewing transferred assets", icon: Gauge },
  { label: "Checking hosting signals", detail: "Looking for provider evidence", icon: Cloud },
  { label: "Estimating page carbon", detail: "Applying page-view assumptions", icon: Leaf },
  { label: "Reviewing performance signals", detail: "Checking efficiency markers", icon: Activity },
  { label: "Preparing your report", detail: "Building public result view", icon: FileText },
];

const ecoInsights = [
  "Optimising images can reduce a page's data usage significantly.",
  "Smaller pages usually mean faster load times and lower estimated carbon.",
  "Green hosting can support lower infrastructure-related emissions.",
  "Your report will show badge eligibility where supported.",
];

function formatScanTarget(value) {
  try {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return url.hostname.replace(/^www\./i, "");
  } catch {
    return String(value || "")
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0];
  }
}

function SignalField() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
      viewBox="0 0 1200 900"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="scanBloom" cx="50%" cy="42%" r="54%">
          <stop offset="0%" stopColor="#00d084" stopOpacity="0.18" />
          <stop offset="54%" stopColor="#00a19d" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#020b13" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#scanBloom)" />
      <g fill="none" strokeWidth="1">
        <path d="M0 500 C190 424 310 462 440 520 S710 646 1200 390" stroke="rgba(0,208,132,0.14)" />
        <path d="M0 575 C230 480 392 510 558 590 S882 702 1200 548" stroke="rgba(77,216,255,0.09)" />
        <path d="M118 310 L318 396 L492 342 L680 438 L910 354 L1088 420" stroke="rgba(0,161,157,0.13)" />
        <path d="M160 260 C334 188 548 172 740 240 S1030 350 1200 262" stroke="rgba(0,208,132,0.08)" strokeDasharray="5 12" />
      </g>
      <g fill="#00d084">
        <circle cx="318" cy="396" r="3.2" opacity="0.52" />
        <circle cx="492" cy="342" r="2.4" opacity="0.38" />
        <circle cx="680" cy="438" r="3.2" opacity="0.46" />
        <circle cx="910" cy="354" r="2.6" opacity="0.36" />
        <circle cx="1088" cy="420" r="2.2" opacity="0.28" />
      </g>
    </svg>
  );
}

function ScanRail() {
  return (
    <div className="relative mx-auto mt-5 w-full max-w-[460px] rounded-full border border-[#00d084]/28 bg-[#020b13]/62 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:mt-6 sm:p-3">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,208,132,0.16),transparent_68%)]" />
      <div className="relative flex h-10 items-center gap-3 sm:h-12">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#00d084]/20 bg-[#00d084]/10 text-[#00d084] sm:h-10 sm:w-10">
          <Leaf size={18} aria-hidden="true" />
        </span>
        <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[#071423]">
          <div className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-[linear-gradient(90deg,rgba(0,208,132,0),rgba(0,208,132,0.95),rgba(77,216,255,0.65))] gt-scan-sweep" />
          <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,transparent,rgba(0,208,132,0.2),transparent)]" />
        </div>
        <span className="gt-scan-pulse inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#00d084]/28 bg-[#00d084]/12 text-[#8df8ce] shadow-[0_0_36px_-18px_rgba(0,208,132,1)] sm:h-11 sm:w-11">
          <Zap size={19} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function ScanStepList({ activeStep }) {
  return (
    <ol className="mx-auto mt-5 max-w-[420px] space-y-2 text-left sm:mt-8 sm:space-y-3">
      {scanSteps.map((step, index) => {
        const Icon = step.icon;
        const active = index === activeStep;
        const complete = index < activeStep;
        return (
          <li key={step.label} className="grid grid-cols-[1.35rem_2rem_1fr] items-start gap-2 sm:grid-cols-[1.75rem_2.25rem_1fr] sm:gap-3">
            <span className="relative flex justify-center">
              <span
                className={`mt-1 h-3.5 w-3.5 rounded-full border sm:h-4 sm:w-4 ${
                  active || complete
                    ? "border-[#00d084] bg-[#00d084] shadow-[0_0_24px_-8px_rgba(0,208,132,1)]"
                    : "border-[rgba(132,204,200,0.26)] bg-[#071423]"
                }`}
                aria-hidden="true"
              />
              {index < scanSteps.length - 1 && (
                <span className="absolute top-5 h-6 w-px bg-[rgba(132,204,200,0.18)] sm:top-6 sm:h-8" aria-hidden="true" />
              )}
            </span>
            <span
              className={`inline-flex h-7 w-7 items-center justify-center rounded-xl border sm:h-8 sm:w-8 ${
                active
                  ? "border-[#00d084]/28 bg-[#00d084]/10 text-[#00d084]"
                  : "border-white/10 bg-white/[0.035] text-[#8fa6b8]"
              }`}
            >
              <Icon size={17} aria-hidden="true" />
            </span>
            <span>
              <span className={`block text-sm font-semibold ${active ? "text-[#f5fbff]" : "text-[#8fa6b8]"}`}>
                {step.label}
              </span>
              {active && (
                <span className="mt-0.5 block text-xs text-[#00d084] sm:mt-1 sm:text-sm">
                  {step.detail}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function EcoInsight({ insight }) {
  return (
    <div className="mt-5 border-t border-[rgba(132,204,200,0.14)] pt-4 sm:mt-8 sm:pt-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="text-left">
          <p className="gt-scan-mono inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase text-[#00d084]">
            <Leaf size={14} aria-hidden="true" />
            Eco insight
          </p>
          <p className="mt-2 text-sm leading-6 text-[#dbe8ef] sm:mt-3 sm:text-base">
            {insight}
          </p>
        </div>
        <div className="hidden h-20 w-20 items-center justify-center rounded-full border border-[#00d084]/18 bg-[#00d084]/8 text-[#00d084] sm:inline-flex">
          <span className="gt-scan-pulse inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#00d084]/22 bg-[#020b13]/70">
            <Leaf size={26} aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}

function LoaderBrandMark() {
  return (
    <div className="mx-auto flex justify-center">
      <picture className="inline-flex">
        <source srcSet={logoAvif} type="image/avif" />
        <source srcSet={logoWebp} type="image/webp" />
        <img
          src={logoPng}
          alt="GreenTracer"
          width="300"
          height="90"
          className="h-8 w-auto max-w-[190px] drop-shadow-[0_0_22px_rgba(0,208,132,0.18)] sm:h-10 sm:max-w-[220px]"
          decoding="async"
        />
      </picture>
    </div>
  );
}

export default function LoadingOverlay({ siteUrl = "" }) {
  const [insightIndex, setInsightIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const scanTarget = useMemo(() => formatScanTarget(siteUrl), [siteUrl]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;

    html.style.overflow = "hidden";
    html.style.height = "100%";
    body.style.overflow = "hidden";
    body.style.height = "100%";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      html.style.height = prevHtmlHeight;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
    };
  }, []);

  useEffect(() => {
    const insightTimer = window.setInterval(
      () => setInsightIndex((index) => (index + 1) % ecoInsights.length),
      4200
    );
    const stepTimer = window.setInterval(
      () => setActiveStep((index) => (index + 1) % scanSteps.length),
      1900
    );

    return () => {
      window.clearInterval(insightTimer);
      window.clearInterval(stepTimer);
    };
  }, []);

  return (
    <div
      className="gt-scan-loader fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain bg-[#020b13] px-4 py-4 text-[#f5fbff] sm:items-center sm:py-6"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <style>{loaderStyles}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(0,208,132,0.14),transparent_34%),linear-gradient(180deg,#020b13_0%,#01070d_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(132,204,200,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(132,204,200,0.045)_1px,transparent_1px)] [background-size:28px_28px]" />
      <SignalField />

      <section className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-[2rem] border border-[rgba(132,204,200,0.22)] bg-[linear-gradient(145deg,rgba(7,20,35,0.88),rgba(1,7,13,0.76))] p-4 shadow-[0_34px_120px_-72px_rgba(0,208,132,0.86)] sm:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(132,204,200,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(132,204,200,0.055)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,208,132,0.52),transparent)]" />
        <div className="gt-scan-drift pointer-events-none absolute right-0 top-8 h-56 w-72 bg-[radial-gradient(ellipse_at_center,rgba(0,208,132,0.12),transparent_68%)]" />

        <div className="relative z-10 text-center">
          <LoaderBrandMark />
          <ScanRail />

          <div className="mt-5 sm:mt-7">
            <p className="gt-scan-mono inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase text-[#00d084]">
              <span className="h-2 w-2 rounded-full bg-[#00d084] shadow-[0_0_18px_rgba(0,208,132,0.75)]" aria-hidden="true" />
              Scan in progress
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-[#f5fbff] sm:mt-5 sm:text-4xl">
              Scanning website
            </h1>
            <p className="mt-2 text-base leading-6 text-[#8fa6b8] sm:mt-3">
              Measuring your website's environmental impact.
            </p>
            {scanTarget && (
              <p className="mx-auto mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-[rgba(132,204,200,0.16)] bg-[#020b13]/62 px-4 py-2 text-sm text-[#dbe8ef] sm:mt-4">
                <Globe size={16} aria-hidden="true" className="shrink-0 text-[#00d084]" />
                <span className="truncate">{scanTarget}</span>
              </p>
            )}
          </div>

          <ScanStepList activeStep={activeStep} />
          <EcoInsight insight={ecoInsights[insightIndex]} />
        </div>
      </section>
    </div>
  );
}
