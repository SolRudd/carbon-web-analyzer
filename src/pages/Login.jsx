import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaTerminal,
  FaUser,
} from "react-icons/fa";
import { ArrowRight } from "lucide-react";

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
      radial-gradient(circle at top center, rgba(34,197,94,0.06), transparent 24%),
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
      radial-gradient(circle at top center, rgba(34,197,94,0.04), transparent 24%),
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
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.10));
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.10));
  }

  .gt-panel {
    background: linear-gradient(180deg, var(--gt-panel) 0%, var(--gt-panel-2) 100%);
    border: 1px solid var(--gt-border);
    border-radius: 28px;
    backdrop-filter: blur(10px);
    box-shadow: 0 18px 60px -32px rgba(0,0,0,0.6);
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
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background .18s ease, color .18s ease;
  }

  .gt-toggle__btn:hover {
    color: var(--gt-text);
  }

  .gt-toggle__btn.is-active {
    background: linear-gradient(135deg, var(--gt-green-2) 0%, var(--gt-green) 100%);
    color: white;
    box-shadow: 0 12px 24px -14px rgba(34,197,94,0.65);
  }

  .gt-input-wrap {
    position: relative;
  }

  .gt-input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gt-muted-2);
    pointer-events: none;
  }

  .gt-input {
    width: 100%;
    min-height: 54px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.04);
    color: var(--gt-text);
    padding: 0 16px 0 44px;
    transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  }

  .gt-input::placeholder {
    color: var(--gt-muted);
  }

  .gt-input:focus {
    outline: none;
    border-color: rgba(74, 222, 128, 0.38);
    box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
    background: rgba(255,255,255,0.05);
  }

  .gt-password-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: 0;
    color: var(--gt-muted);
    cursor: pointer;
    padding: 4px;
    transition: color .18s ease;
  }

  .gt-password-toggle:hover {
    color: var(--gt-text);
  }

  .gt-btn,
  .gt-link-btn {
    min-height: 54px;
    border-radius: 999px;
    font-weight: 800;
    transition: transform .18s ease, filter .18s ease, background .18s ease, border-color .18s ease;
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

  .gt-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  .gt-btn:focus-visible,
  .gt-link-btn:focus-visible,
  .gt-input:focus-visible,
  .gt-password-toggle:focus-visible,
  .gt-toggle__btn:focus-visible {
    outline: 2px solid var(--gt-green-3);
    outline-offset: 2px;
  }

  .gt-alert {
    border-radius: 18px;
    border: 1px solid;
    padding: 14px 16px;
  }

  .gt-alert--info {
    border-color: rgba(96, 165, 250, 0.22);
    background: rgba(59,130,246,0.10);
    color: #bfdbfe;
  }

  .gt-alert--warning {
    border-color: rgba(251, 191, 36, 0.22);
    background: rgba(245,158,11,0.10);
    color: #fde68a;
  }

  .gt-alert--error {
    border-color: rgba(248, 113, 113, 0.22);
    background: rgba(239,68,68,0.10);
    color: #fecaca;
  }

  .gt-alert--success {
    border-color: rgba(74, 222, 128, 0.22);
    background: rgba(34,197,94,0.10);
    color: #bbf7d0;
  }

  .gt-muted-link {
    color: var(--gt-muted);
    transition: color .18s ease;
  }

  .gt-muted-link:hover {
    color: var(--gt-green-3);
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

  html:not(.dark) .gt-chip {
    background: rgba(255,255,255,0.9);
    border-color: rgba(0,0,0,0.08);
  }

  html:not(.dark) .gt-input {
    background: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.10);
    color: #0f172a;
  }

  html:not(.dark) .gt-input::placeholder {
    color: #94a3b8;
  }

  html:not(.dark) .gt-input:focus {
    border-color: rgba(22, 163, 74, 0.38);
    box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
    background: rgba(0,0,0,0.02);
  }

  html:not(.dark) .gt-password-toggle {
    color: #94a3b8;
  }

  html:not(.dark) .gt-password-toggle:hover {
    color: #0f172a;
  }

  html:not(.dark) .gt-toggle {
    background: rgba(255,255,255,0.85);
    border-color: rgba(0,0,0,0.08);
  }

  html:not(.dark) .gt-btn--ghost {
    background: rgba(0,0,0,0.04);
    color: #0f172a;
    border-color: rgba(0,0,0,0.10);
  }

  html:not(.dark) .gt-divider {
    border-top-color: rgba(0,0,0,0.07);
  }

  html:not(.dark) .gt-muted-link {
    color: #475569;
  }

  html:not(.dark) .gt-muted-link:hover {
    color: #16a34a;
  }

  @media (prefers-reduced-motion: reduce) {
    .gt-btn,
    .gt-link-btn,
    .gt-toggle__btn,
    .gt-input,
    .gt-password-toggle {
      transition: none !important;
    }

    .gt-btn:hover,
    .gt-link-btn:hover {
      transform: none !important;
    }
  }
`;

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function toFriendlyAuthError(message) {
  const text = String(message || "");

  if (/email.*not.*confirmed/i.test(text) || /Email not confirmed/i.test(text)) {
    return "Your email is not confirmed yet. Check your inbox and click the confirmation link.";
  }

  if (/invalid login credentials/i.test(text)) {
    return "Invalid email or password. If you just signed up, confirm your email first.";
  }

  return text || "Authentication failed. Check your details and try again.";
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, configured } = useAuth();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fromPath = location.state?.from || "/dashboard";
  const redirectedFromProtected = Boolean(location.state?.from);

  const submit = async (e) => {
    e.preventDefault();

    const clean = cleanEmail(email);

    if (!clean || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      if (mode === "login") {
        await login({ email: clean, password });
        navigate(fromPath, { replace: true });
        return;
      }

      const data = await signup({ email: clean, password });

      if (data?.session) {
        navigate(fromPath, { replace: true });
        return;
      }

      setNotice("Account created. Check your inbox to confirm your email before signing in.");
      setMode("login");
    } catch (err) {
      setError(toFriendlyAuthError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Account Access | GreenTracer</title>
        <meta
          name="description"
          content="Sign in to manage your GreenTracer account, licensed domains, and badge setup."
        />
        <link rel="canonical" href="https://www.greentracer.org/login" />
      </Helmet>

      <div className="gt-page relative min-h-screen overflow-hidden px-4 py-12">
        <style>{pageStyles}</style>

        <div className="gt-hero-grid absolute inset-0 pointer-events-none opacity-60" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[14%] top-[12%] h-[320px] w-[320px] rounded-full bg-green-500/10 blur-[110px]" />
          <div className="absolute bottom-[10%] right-[14%] h-[320px] w-[320px] rounded-full bg-emerald-500/10 blur-[110px]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_460px]">
            {/* LEFT SIDE */}
            <section className="hidden lg:block">
              <div className="max-w-xl">
                <div className="mb-6 inline-flex">
                  <div className="gt-chip">
                    <FaTerminal className="text-[11px] text-green-400" />
                    <span className="gt-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                      Account Access
                    </span>
                  </div>
                </div>

                <h1 className="gt-display text-5xl font-semibold leading-[1.02] text-white xl:text-6xl">
                  Access your
                  <br />
                  <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text italic font-light text-transparent">
                    GreenTracer account
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
                  Sign in to manage your licensed domains, badge access, and the
                  wider GreenTracer membership experience as the platform grows.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full border border-slate-200 dark:border-white/8 bg-slate-100 dark:bg-white/4 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Domain management
                  </span>
                  <span className="rounded-full border border-slate-200 dark:border-white/8 bg-slate-100 dark:bg-white/4 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Badge access
                  </span>
                  <span className="rounded-full border border-slate-200 dark:border-white/8 bg-slate-100 dark:bg-white/4 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Reports & visibility
                  </span>
                </div>
              </div>
            </section>

            {/* RIGHT SIDE / FORM */}
            <section className="w-full">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-6 text-center lg:hidden">
                  <div className="mb-4 inline-flex">
                    <div className="gt-chip">
                      <FaTerminal className="text-[11px] text-green-400" />
                      <span className="gt-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                        Account Access
                      </span>
                    </div>
                  </div>

                  <h1 className="gt-display text-4xl font-semibold leading-tight text-white">
                    Sign in to
                    <br />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text italic font-light text-transparent">
                      GreenTracer
                    </span>
                  </h1>
                </div>

                <div className="gt-panel p-8 sm:p-10">
                  <div className="mb-8">
                    <div className="gt-toggle" role="tablist" aria-label="Authentication mode">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mode === "login"}
                        className={`gt-toggle__btn ${mode === "login" ? "is-active" : ""}`}
                        onClick={() => {
                          setMode("login");
                          setError("");
                          setNotice("");
                        }}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mode === "signup"}
                        className={`gt-toggle__btn ${mode === "signup" ? "is-active" : ""}`}
                        onClick={() => {
                          setMode("signup");
                          setError("");
                          setNotice("");
                        }}
                      >
                        Create Account
                      </button>
                    </div>
                  </div>

                  <div className="mb-6 space-y-4">
                    {redirectedFromProtected && (
                      <div className="gt-alert gt-alert--info text-sm">
                        Please sign in to access your dashboard.
                      </div>
                    )}

                    {!configured && (
                      <div className="gt-alert gt-alert--warning text-sm">
                        Authentication is not configured yet. Check your environment keys before testing login.
                      </div>
                    )}

                    {error && (
                      <div className="gt-alert gt-alert--error text-sm">
                        {error}
                      </div>
                    )}

                    {notice && (
                      <div className="gt-alert gt-alert--success text-sm">
                        {notice}
                      </div>
                    )}
                  </div>

                  <form onSubmit={submit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="gt-mono mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500"
                      >
                        Email Address
                      </label>
                      <div className="gt-input-wrap">
                        <FaUser className="gt-input-icon text-sm" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          autoComplete="email"
                          disabled={loading}
                          className="gt-input text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="gt-mono mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500"
                      >
                        Password
                      </label>
                      <div className="gt-input-wrap">
                        <FaLock className="gt-input-icon text-sm" />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          autoComplete={mode === "login" ? "current-password" : "new-password"}
                          disabled={loading}
                          className="gt-input pr-12 text-sm"
                        />
                        <button
                          type="button"
                          className="gt-password-toggle"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !configured}
                      className="gt-btn gt-btn--green inline-flex w-full items-center justify-center gap-2 px-6 py-4 text-sm"
                    >
                      {loading ? (
                        <span className="gt-mono text-xs uppercase tracking-[0.14em]">
                          Processing...
                        </span>
                      ) : (
                        <>
                          {mode === "login" ? "Sign In" : "Create Account"}
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>

                  {mode === "signup" && configured && (
                    <p className="gt-mono mt-5 text-center text-[10px] uppercase tracking-[0.16em] text-slate-500">
                      Email verification is required before account access is granted.
                    </p>
                  )}

                  <div className="gt-divider my-8" />

                  <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-4">
                    <Link to="/" className="gt-muted-link text-sm font-medium">
                      Return Home
                    </Link>
                    <span className="hidden text-slate-700 sm:inline dark:text-slate-600">•</span>
                    <Link to="/pricing" className="gt-muted-link text-sm font-medium">
                      View Licensing
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}