import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWind, FaBolt, FaTerminal, FaCheck, FaSpinner } from "react-icons/fa";
import { API_BASE } from "../config";
import LoadingOverlay from "./LoadingOverlay";

const heroStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');

  :root {
    --gt-green: #15803d;
    --gt-neon: #4ade80;
  }

  .gt-hero { font-family: 'Inter', sans-serif; }
  .gt-display { font-family: 'Fraunces', serif; letter-spacing: -0.03em; }
  .gt-mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes gt-reveal {
    0% { opacity: 0; transform: translateY(20px); filter: blur(5px); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  @keyframes gt-wind-flow {
    0% { transform: translateX(0) translateY(0); }
    50% { transform: translateX(-20px) translateY(10px); }
    100% { transform: translateX(0) translateY(0); }
  }

  @keyframes gt-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes gt-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .gt-stagger {
    opacity: 0;
    animation: gt-reveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  .gt-delay-1 { animation-delay: 0.1s; }
  .gt-delay-2 { animation-delay: 0.2s; }
  .gt-delay-3 { animation-delay: 0.3s; }
  .gt-delay-4 { animation-delay: 0.4s; }

  .gt-input-wrapper {
    position: relative;
    transition: all 0.3s ease;
    box-shadow:
      0 10px 30px -18px rgba(15, 23, 42, 0.28),
      0 8px 18px -18px rgba(15, 23, 42, 0.18);
  }

  .gt-input-wrapper:focus-within {
    transform: translateY(-2px);
    box-shadow:
      0 22px 36px -20px rgba(15, 23, 42, 0.20),
      0 10px 18px -16px rgba(21, 128, 61, 0.16);
    border-color: rgba(21, 128, 61, 0.5);
  }

  .gt-btn-brand {
    background-color: var(--gt-green);
    color: white;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .gt-btn-brand::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(0,0,0,0.08));
    opacity: 0;
    transition: opacity 0.2s ease-out;
  }

  .gt-btn-brand:hover::after { opacity: 1; }

  .gt-btn-brand:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px -14px rgba(21, 128, 61, 0.45);
  }

  .gt-btn-brand:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .gt-grid-bg {
    background-size: 46px 46px;
    background-image:
      linear-gradient(to right, rgba(15,23,42,0.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(15,23,42,0.035) 1px, transparent 1px);
    mask-image: radial-gradient(circle at center, black 38%, transparent 82%);
  }

  .dark .gt-grid-bg {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px);
  }

  .gt-hero-fade {
    background:
      radial-gradient(circle at 50% 22%, rgba(34,197,94,0.08), transparent 34%),
      linear-gradient(to bottom, transparent 0%, transparent 72%, rgba(248,250,252,0.95) 100%);
  }

  .dark .gt-hero-fade {
    background:
      radial-gradient(circle at 50% 22%, rgba(34,197,94,0.10), transparent 34%),
      linear-gradient(to bottom, transparent 0%, transparent 72%, rgba(2,6,23,0.95) 100%);
  }
`;

function normalizeUrl(inputUrl) {
  let url = inputUrl.trim();

  if (!url) return "";

  if (!/^(https?:\/\/)/i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const urlObject = new URL(url);

    if (urlObject.hostname.startsWith("www.")) {
      urlObject.hostname = urlObject.hostname.substring(4);
    }

    return urlObject.origin + urlObject.pathname.replace(/\/+$/, "");
  } catch {
    return inputUrl;
  }
}

function WindStatus() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-200/80 dark:border-slate-800">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Server Power
        </span>
        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
          100% WIND <FaWind className="text-green-600 dark:text-green-400 text-[10px]" />
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanUrl = normalizeUrl(url);

    if (!cleanUrl) {
      alert("Please enter a valid URL.");
      return;
    }

    setLoading(true);

    try {
      const apiPromise = fetch(`${API_BASE}/api/check-carbon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const [res] = await Promise.all([
        apiPromise,
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      const data = await res.json().catch(() => {
        throw new Error("Invalid JSON response from server.");
      });

      if (!res.ok) {
        throw new Error(data.error || `Server returned ${res.status} status.`);
      }

      navigate(`/result/${data.slug}`);
    } catch (err) {
      console.error("❌ Error fetching carbon data:", err);
      alert(`Oops! Something went wrong: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{heroStyles}</style>

      <section id="top" className="gt-hero relative overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 border-b border-slate-100 dark:border-slate-900">
        <div className="absolute inset-0 gt-grid-bg pointer-events-none" />
        <div className="absolute inset-0 gt-hero-fade pointer-events-none" />

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-[14%] left-[-8%] w-[420px] h-[420px] sm:w-[560px] sm:h-[560px] bg-green-300/20 rounded-full blur-[110px] animate-[gt-wind-flow_10s_ease-in-out_infinite]" />
          <div className="absolute bottom-[-8%] right-[-8%] w-[460px] h-[460px] sm:w-[620px] sm:h-[620px] bg-emerald-400/10 rounded-full blur-[120px] animate-[gt-wind-flow_15s_ease-in-out_infinite_reverse]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-[clamp(5rem,10vw,8rem)] pb-[clamp(3rem,7vw,5rem)]">
          <div className="max-w-5xl mx-auto text-center">
            <div className="gt-stagger gt-delay-1 flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md shadow-sm backdrop-blur-sm">
                <FaTerminal className="text-xs text-green-600 dark:text-green-400" />
                <span className="gt-mono text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300">
                  Built for free by engineers
                </span>
              </div>
            </div>

            <h1 className="gt-stagger gt-delay-2 gt-display text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.96] font-semibold tracking-tight text-slate-900 dark:text-white mb-6">
              DIGITAL{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-emerald-400 italic font-light">
                sustainability
              </span>
              <br />
              WITHOUT THE FLUFF.
            </h1>

            <p className="gt-stagger gt-delay-3 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              We built GreenTracer to democratise digital ecology.
              Audited open-source tools to measure, optimise, and neutralise your web footprint.
              <span className="block mt-2 text-slate-900 dark:text-slate-200 font-medium">
                No paywalls. Just pure data.
              </span>
            </p>

            <div className="gt-stagger gt-delay-4 w-full max-w-2xl mx-auto">
              <form
                onSubmit={handleSubmit}
                className="gt-input-wrapper flex flex-col sm:flex-row p-2 bg-white/92 dark:bg-slate-900/92 border border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-sm"
              >
                <div className="flex-1 min-w-0 flex items-center px-4 py-3">
                  <span className="text-slate-400 mr-2 font-mono select-none shrink-0 text-sm sm:text-base">
                    https://
                  </span>

                  <input
                    id="url-input"
                    type="text"
                    placeholder="yoursite.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    required
                    inputMode="url"
                    aria-label="Website URL"
                    autoComplete="off"
                    className="w-full min-w-0 bg-transparent border-none outline-none text-base sm:text-lg text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 font-medium"
                  />

                  {!loading && (
                    <span className="animate-[gt-blink_1s_infinite] w-2 h-5 bg-green-500 block ml-1 shrink-0 rounded-full"></span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="gt-btn-brand sm:w-auto w-full mt-2 sm:mt-0 px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2"
                  aria-live="polite"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-[gt-spin_1s_linear_infinite]" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Run Audit <FaBolt />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex flex-wrap justify-center items-center gap-x-7 gap-y-3 text-sm text-slate-500 dark:text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <FaCheck className="text-green-500" /> Carbon Analysis
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCheck className="text-green-500" /> Hosting Check
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCheck className="text-green-500" /> Performance
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 opacity-80">
            <WindStatus />
            <div className="text-xs gt-mono text-slate-400 text-center sm:text-right">
              v3.0.1 // SUSTAINABILITY_ENGINE_ONLINE
            </div>
          </div>
        </div>

        {loading && <LoadingOverlay />}
      </section>
    </>
  );
}