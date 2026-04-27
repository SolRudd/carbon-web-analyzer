import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, ExternalLink, Globe2, Lock, ShieldCheck } from "lucide-react";
import GreenTracerBadge from "./GreenTracerBadge";

function safeState(value) {
  return ["locked", "setup_required", "active", "inactive"].includes(value) ? value : "locked";
}

export default function VerifiedBadgeCard({
  badge = null,
  loading = false,
  authenticated = true,
  className = "",
}) {
  const [copied, setCopied] = useState(false);
  const state = authenticated ? safeState(badge?.state) : "locked";
  const domain = badge?.domain || "";
  const isActive = authenticated && state === "active" && badge?.embedCode;

  const copyEmbedCode = async () => {
    if (!badge?.embedCode) return;
    try {
      await navigator.clipboard.writeText(badge.embedCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_56px_-34px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900 sm:p-7 ${className}`}>
        <p className="text-sm text-slate-600 dark:text-slate-300">Loading verified badge...</p>
      </section>
    );
  }

  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_56px_-34px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900 sm:p-7 ${className}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-green-600/20 bg-green-600/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-green-700 dark:text-green-300">
            <ShieldCheck size={13} aria-hidden="true" />
            Verified Badge
          </p>
          <h2 className="mt-4 text-xl font-semibold tracking-[-0.01em] text-slate-900 dark:text-white">
            Verified Badge
          </h2>
          {domain && (
            <p className="mt-2 inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
              <Globe2 size={14} aria-hidden="true" />
              <span className="truncate">{domain}</span>
            </p>
          )}
        </div>

        <div className="flex justify-start lg:justify-end">
          <GreenTracerBadge
            status={isActive ? "active" : state === "setup_required" ? "pending" : state === "inactive" ? "licence_inactive" : "not_active"}
            badgeType="greentracer_verified"
            domain={domain}
            href={isActive ? badge.verificationUrl : ""}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-[#020f1e]/40">
        {!authenticated && (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Sign in or create an account to manage your GreenTracer Verified badge.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/login" className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                Sign in
              </Link>
              <Link to="/pricing" className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">
                View pricing
              </Link>
            </div>
          </div>
        )}

        {authenticated && state === "locked" && (
          <div className="space-y-4">
            <p className="flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <Lock size={16} className="mt-1 shrink-0 text-slate-400" aria-hidden="true" />
              <span>Upgrade to Prime to unlock the GreenTracer Verified badge.</span>
            </p>
            <Link to="/pricing" className="inline-flex h-10 items-center justify-center rounded-full bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700">
              View pricing
            </Link>
          </div>
        )}

        {authenticated && state === "setup_required" && (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Add and verify your domain to activate your badge.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard#owned-domains" className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                Add domain
              </Link>
              <Link to={domain ? `/license-status?domain=${encodeURIComponent(domain)}&action=verify` : "/license-status"} className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">
                Verify domain
              </Link>
            </div>
          </div>
        )}

        {authenticated && state === "inactive" && (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Your verified badge is inactive until your Prime subscription or licence is active.
            </p>
            <Link to="/pricing" className="inline-flex h-10 items-center justify-center rounded-full bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700">
              View pricing
            </Link>
          </div>
        )}

        {isActive && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                Status: Active
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyEmbedCode}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
              >
                <Copy size={15} aria-hidden="true" />
                {copied ? "Copied" : "Copy embed code"}
              </button>
              <a
                href={badge.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
              >
                Open verification page
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
