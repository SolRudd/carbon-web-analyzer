import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { API_BASE, RESULTS_BASE } from "../config";
import GreenTracerBadgePreview from "../components/badges/GreenTracerBadgePreview";
import { buildBadgeEmbedCode, buildBadgeVerifyUrl } from "../lib/badges/embed";

const normalizeDomainInput = (value) =>
  String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("/")[0]
    .toLowerCase();

export default function Badge() {
  const [searchParams] = useSearchParams();
  const initialSite = normalizeDomainInput(searchParams.get("site") || "");
  const initialToken = String(searchParams.get("token") || "").trim();

  const [domain, setDomain] = useState(initialSite);
  const [publicToken, setPublicToken] = useState(initialToken);
  const [variant, setVariant] = useState("compact");
  const [lookupState, setLookupState] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!initialSite || initialToken) return;

    const controller = new AbortController();
    setLookupState("Looking up public badge token...");

    fetch(`${API_BASE}/api/license/check?domain=${encodeURIComponent(initialSite)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.badgePublicToken) {
          setPublicToken(data.badgePublicToken);
          setLookupState("Public badge token found for this domain.");
          return;
        }
        setLookupState("No public badge token is available for this domain yet.");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setLookupState("Could not look up a public badge token.");
      });

    return () => controller.abort();
  }, [initialSite, initialToken]);

  const tokenForEmbed = publicToken || "PUBLIC_TOKEN";
  const embedCode = useMemo(() => buildBadgeEmbedCode({
    token: tokenForEmbed,
    apiBase: API_BASE,
    siteBase: RESULTS_BASE,
    variant,
    showMetric: true,
  }), [tokenForEmbed, variant]);
  const verifyUrl = buildBadgeVerifyUrl({ token: tokenForEmbed, siteBase: RESULTS_BASE });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>GreenTracer Verification Badge</title>
        <meta
          name="description"
          content="Generate the compact GreenTracer verification badge embed for a verified public badge token."
        />
        <link rel="canonical" href="https://www.greentracer.org/badge" />
      </Helmet>

      <div className="min-h-screen bg-[#07111f] text-white">
        <section className="px-5 pb-14 pt-28 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                <ShieldCheck size={14} aria-hidden="true" />
                Verification Badge
              </p>
              <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
                Compact trust mark for verified GreenTracer sites.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                The recommended badge is a tokenized SVG that links to a public verification page.
                It does not expose API keys, billing data, or internal license states.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <GreenTracerBadgePreview
                  variant="compact"
                  status="verified"
                  metric={0.21}
                  domain={domain || "example.com"}
                />
                <span className="text-sm text-slate-400">Footer-first compact badge</span>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-700/80 bg-slate-950/55 p-5 shadow-[0_24px_80px_-50px_rgba(0,0,0,0.9)] sm:p-7">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-slate-200">
                  Public badge token
                  <input
                    value={publicToken}
                    onChange={(event) => setPublicToken(event.target.value.trim())}
                    placeholder="PUBLIC_TOKEN"
                    className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none focus:border-emerald-400"
                  />
                </label>

                <label className="text-sm font-semibold text-slate-200">
                  Domain lookup
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={domain}
                      onChange={(event) => setDomain(normalizeDomainInput(event.target.value))}
                      placeholder="example.com"
                      className="h-11 min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!domain) return;
                        setLookupState("Looking up public badge token...");
                        fetch(`${API_BASE}/api/license/check?domain=${encodeURIComponent(domain)}`)
                          .then((res) => (res.ok ? res.json() : null))
                          .then((data) => {
                            if (data?.badgePublicToken) {
                              setPublicToken(data.badgePublicToken);
                              setLookupState("Public badge token found for this domain.");
                              return;
                            }
                            setLookupState("No public badge token is available for this domain yet.");
                          })
                          .catch(() => setLookupState("Could not look up a public badge token."));
                      }}
                      className="h-11 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
                    >
                      Find Token
                    </button>
                  </div>
                </label>

                {lookupState && <p className="text-sm text-slate-400">{lookupState}</p>}

                <div>
                  <p className="text-sm font-semibold text-slate-200">Variant</p>
                  <div className="mt-2 inline-flex rounded-xl border border-slate-700 bg-slate-900 p-1">
                    {["compact", "standard"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setVariant(option)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${
                          variant === option
                            ? "bg-emerald-500 text-emerald-950"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
                  <p className="mb-4 text-xs font-semibold uppercase text-slate-400">Preview</p>
                  <GreenTracerBadgePreview
                    variant={variant}
                    status="verified"
                    metric={0.21}
                    domain={domain || "example.com"}
                  />
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <span className="text-xs font-semibold uppercase text-slate-400">Recommended Embed</span>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:text-white"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap break-all p-4 text-xs leading-6 text-slate-300">
                    {embedCode}
                  </pre>
                </div>

                <a
                  href={verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-white"
                >
                  Open verification page
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-800 px-5 py-12 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-4 text-sm text-slate-300 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
              <p className="font-semibold text-white">Public token only</p>
              <p className="mt-2 leading-6">Embeds use `badge_public_token`, not API keys or secret license tokens.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
              <p className="font-semibold text-white">Supabase-backed</p>
              <p className="mt-2 leading-6">The badge state comes from the backend verification record and active license facts.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
              <p className="font-semibold text-white">Footer-ready</p>
              <p className="mt-2 leading-6">Compact is the default and is designed to remain legible around 220px wide.</p>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-6xl">
            <Link to="/pricing" className="text-sm font-semibold text-emerald-300 hover:text-white">
              Need a verified badge record? View licensing.
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
