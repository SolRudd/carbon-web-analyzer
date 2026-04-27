import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";
import VerifiedBadgeCard from "../components/badges/VerifiedBadgeCard";

const ACTIVE_STATUSES = new Set(["active", "trial", "charity", "partner", "internal", "non_profit", "nonprofit", "community", "manual_lifetime"]);
const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
  trial: "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700",
  charity: "bg-violet-50 text-violet-700 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700",
  partner: "bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700",
  internal: "bg-teal-50 text-teal-700 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700",
  non_profit: "bg-violet-50 text-violet-700 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700",
  nonprofit: "bg-violet-50 text-violet-700 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700",
  community: "bg-cyan-50 text-cyan-700 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700",
  manual_lifetime: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
  suspended: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700",
  inactive: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  none: "bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700",
};
const BADGE_INSTALL_STYLES = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
  pending: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  badge_missing: "bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700",
  domain_mismatch: "bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",
  licence_inactive: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700",
  unknown_domain: "bg-violet-50 text-violet-700 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700",
  unavailable: "bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700",
};
const BADGE_INSTALL_LABELS = {
  active: "Active badge",
  pending: "Verification pending",
  badge_missing: "Badge not installed",
  domain_mismatch: "Domain mismatch",
  licence_inactive: "Licence inactive",
  unknown_domain: "Unknown domain",
  unavailable: "Unavailable",
};
const BADGE_STATE_STYLES = {
  active: BADGE_INSTALL_STYLES.active,
  pending: BADGE_INSTALL_STYLES.pending,
  not_active: BADGE_INSTALL_STYLES.badge_missing,
  green_hosting_not_detected: BADGE_INSTALL_STYLES.unavailable,
  domain_mismatch: BADGE_INSTALL_STYLES.domain_mismatch,
  licence_inactive: BADGE_INSTALL_STYLES.licence_inactive,
  unavailable: BADGE_INSTALL_STYLES.unavailable,
};
const BADGE_STATE_LABELS = {
  active: "Active",
  pending: "Verification pending",
  not_active: "Badge not active",
  green_hosting_not_detected: "Green hosting not detected",
  domain_mismatch: "Domain mismatch",
  licence_inactive: "Licence inactive",
  unavailable: "Unavailable",
};
const VERIFIED_BADGE_TYPE = "greentracer_verified";

function normalizeDomainInput(value) {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("/")[0]
    .toLowerCase();
}

function formatLastSeen(value) {
  if (!value) return "Never";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Never";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInstallState(badge) {
  const state = String(badge?.install?.state || badge?.install?.status || badge?.badgeInstall?.state || badge?.badgeInstall?.status || "badge_missing").toLowerCase();
  return BADGE_INSTALL_LABELS[state] ? state : "unavailable";
}

function getBadgeState(badge) {
  const state = String(badge?.status || "unavailable").toLowerCase();
  return BADGE_STATE_LABELS[state] ? state : "unavailable";
}

export default function Dashboard() {
  const { user, configured, getValidAccessToken, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [domains, setDomains] = useState([]);
  const [badge, setBadge] = useState(null);
  const [domainInput, setDomainInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingDomain, setUpdatingDomain] = useState("");
  const [copiedBadge, setCopiedBadge] = useState("");
  const [scanningDomain, setScanningDomain] = useState("");

  const displayEmail = useMemo(() => user?.email || "Signed-in user", [user?.email]);
  const totalDomains = domains.length;
  const activeDomains = domains.filter((entry) =>
    ACTIVE_STATUSES.has(String(entry?.license?.status || "").toLowerCase()) && !!entry?.license?.licensed
  ).length;
  const installedBadges = domains.reduce((total, entry) => (
    total + (getInstallState(entry?.badges?.[VERIFIED_BADGE_TYPE]) === "active" ? 1 : 0)
  ), 0);
  const pendingDomains = totalDomains - activeDomains;
  const primaryDomain = domains[0]?.domain || "";

  const toFriendlyDashboardError = (message) => {
    const text = String(message || "");
    if (/account_domains/i.test(text) || /does not exist/i.test(text)) {
      return "Dashboard setup is incomplete. Run the account_domains SQL migration, then retry.";
    }
    if (/failed to fetch/i.test(text) || /network/i.test(text)) {
      return `Unable to reach backend API. ${text}`;
    }
    return text || "Failed to load dashboard.";
  };

  const requestDashboardApi = async ({ url, method = "GET", token, body = null }) => {
    if (import.meta.env.DEV) {
      console.info("[dashboard-api]", { method, url, hasToken: Boolean(token) });
    }

    let res;
    try {
      res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    } catch (networkErr) {
      throw new Error(
        `Failed to fetch ${method} ${url}. Check backend availability/CORS. ${networkErr?.message || ""}`.trim()
      );
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const base = data.error || `Request failed (${res.status})`;
      const details = data.details ? ` Details: ${data.details}` : "";
      throw new Error(`${base} [${method} ${url} | ${res.status}]${details}`);
    }
    return data;
  };

  const fetchDashboard = useCallback(async ({ clearNotice = false } = {}) => {
    if (!configured) {
      setDomains([]);
      setError("Auth is not configured. Set frontend and backend Supabase env vars first.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    if (clearNotice) setNotice("");
    try {
      const token = await getValidAccessToken();
      if (!token) throw new Error("Session expired. Please log in again.");
      const data = await requestDashboardApi({
        url: `${API_BASE}/api/account/me/dashboard`,
        method: "GET",
        token,
      });
      setDomains(Array.isArray(data.domains) ? data.domains : []);
      setBadge(data.badge || null);
    } catch (err) {
      if (/invalid or expired auth token|missing bearer token|session expired/i.test(String(err.message || ""))) {
        await logout();
        return;
      }
      setDomains([]);
      setBadge(null);
      setError(toFriendlyDashboardError(err.message));
    } finally {
      setLoading(false);
    }
  }, [configured, getValidAccessToken, logout]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const addDomain = async (e) => {
    e.preventDefault();
    const clean = normalizeDomainInput(domainInput);
    if (!clean) {
      setError("Enter a valid domain such as example.com.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");
    setUpdatingDomain(clean);
    try {
      const token = await getValidAccessToken();
      if (!token) throw new Error("Session expired. Please log in again.");
      await requestDashboardApi({
        url: `${API_BASE}/api/account/me/domains`,
        method: "POST",
        token,
        body: { domain: clean },
      });

      setDomainInput("");
      setNotice(`Added ${clean} to your dashboard.`);
      await fetchDashboard();
    } catch (err) {
      if (/invalid or expired auth token|missing bearer token|session expired/i.test(String(err.message || ""))) {
        await logout();
        return;
      }
      setError(toFriendlyDashboardError(err.message));
    } finally {
      setSaving(false);
      setUpdatingDomain("");
    }
  };

  const removeDomain = async (domain) => {
    setSaving(true);
    setError("");
    setNotice("");
    setUpdatingDomain(domain);
    try {
      const token = await getValidAccessToken();
      if (!token) throw new Error("Session expired. Please log in again.");
      await requestDashboardApi({
        url: `${API_BASE}/api/account/me/domains/remove`,
        method: "POST",
        token,
        body: { domain },
      });

      setNotice(`Removed ${domain} from your dashboard.`);
      await fetchDashboard();
    } catch (err) {
      if (/invalid or expired auth token|missing bearer token|session expired/i.test(String(err.message || ""))) {
        await logout();
        return;
      }
      setError(toFriendlyDashboardError(err.message));
    } finally {
      setSaving(false);
      setUpdatingDomain("");
    }
  };

  const runDashboardScan = async (domain) => {
    const clean = normalizeDomainInput(domain);
    if (!clean) {
      setError("Enter a valid domain before running a scan.");
      return;
    }

    setError("");
    setNotice("");
    setScanningDomain(clean);
    try {
      const token = await getValidAccessToken();
      if (!token) throw new Error("Session expired. Please log in again.");
      const data = await requestDashboardApi({
        url: `${API_BASE}/api/account/check-carbon`,
        method: "POST",
        token,
        body: { domain: clean },
      });

      setNotice(`Scan complete for ${data.accountDomain || clean}.`);
      await fetchDashboard({ clearNotice: false });
    } catch (err) {
      if (/invalid or expired auth token|missing bearer token|session expired/i.test(String(err.message || ""))) {
        await logout();
        return;
      }
      if (/contact_leads|contact details|email address|contact permission/i.test(String(err.message || ""))) {
        setError("Dashboard scans do not use lead capture. Please retry from the dashboard.");
      } else {
        setError(toFriendlyDashboardError(err.message));
      }
    } finally {
      setScanningDomain("");
    }
  };

  const copyBadgeCode = async (code, key) => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBadge(key);
      window.setTimeout(() => setCopiedBadge(""), 1800);
    } catch {
      setCopiedBadge("");
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | GreenTracer</title>
        <meta
          name="description"
          content="Manage your GreenTracer licensed domains and badge setup from your account dashboard."
        />
        <link rel="canonical" href="https://www.greentracer.org/dashboard" />
      </Helmet>

      <section className="min-h-[calc(100vh-140px)] bg-slate-100/70 dark:bg-[#020f1e] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <header className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-[0_12px_35px_-24px_rgba(15,23,42,0.45)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-green-700 dark:text-green-300 font-semibold">Account Dashboard</p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{displayEmail}</p>
                {!configured && (
                  <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                    Auth config missing. See local setup steps before using dashboard APIs.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Sign out
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Linked Domains</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{totalDomains}</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Active Licences</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{activeDomains}</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Installed Verified Badges</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{installedBadges}</p>
                {pendingDomains > 0 && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{pendingDomains} pending or unlicensed</p>
                )}
              </div>
            </div>
          </header>

          <VerifiedBadgeCard badge={badge} loading={loading} authenticated />

          <section id="owned-domains" className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5 scroll-mt-24">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Owned Domains</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Add domains you manage to view license state and launch badge actions quickly.
              </p>
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fetchDashboard({ clearNotice: false })}
                  disabled={loading || saving}
                  className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-60"
                >
                  {loading ? "Refreshing..." : "Refresh statuses"}
                </button>
                <Link to="/badge" className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Public badge builder
                </Link>
                <Link to="/pricing" className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Manage Licensing
                </Link>
              </div>
            </div>

            <form onSubmit={addDomain} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="example.com"
                className="h-11 flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm"
              />
              <button
                type="submit"
                disabled={saving || !configured}
                className="h-11 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Add domain"}
              </button>
            </form>

            {error && <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
            {notice && <p className="text-sm text-emerald-700 dark:text-emerald-300">{notice}</p>}

            {loading ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">Loading domains...</p>
            ) : domains.length === 0 ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/30 p-4">
                <p className="text-sm text-slate-700 dark:text-slate-200">No domains linked yet.</p>
                <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                  Add your first domain above, then use License Status to confirm plan activation.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {domains.map((entry) => {
                  const status = String(entry?.license?.status || "none").toLowerCase();
                  const licensed = ACTIVE_STATUSES.has(status) && !!entry?.license?.licensed;
                  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.none;
                  const verifiedBadge = entry?.badges?.[VERIFIED_BADGE_TYPE] || {};
                  const verifiedBadgeState = getBadgeState(verifiedBadge);
                  const verifiedInstallState = getInstallState(verifiedBadge);
                  const verifiedInstall = verifiedBadge.install || {};
                  const verifiedLoadCount = Number(verifiedInstall.loadCount || 0);
                  const verificationStatus = String(entry?.verificationStatus || "pending").toLowerCase();
                  const verificationActive = ["verified", "active", "approved"].includes(verificationStatus);
                  const latestResult = entry?.latestResult || null;
                  const reportSlug = latestResult?.slug || "";
                  const reportHref = reportSlug ? `/result/${encodeURIComponent(reportSlug)}` : "";
                  const reportBadgeHref = reportHref ? `${reportHref}#badge-options` : "";
                  const verifiedCopyKey = `${entry.domain}:${VERIFIED_BADGE_TYPE}`;
                  const publicBadgeSignals = [
                    entry?.badges?.carbon_tested?.install && {
                      label: "Carbon Tested",
                      install: entry.badges.carbon_tested.install,
                    },
                    entry?.badges?.green_hosting?.install && {
                      label: "Green Hosting",
                      install: entry.badges.green_hosting.install,
                    },
                  ].filter((signal) => signal && getInstallState({ install: signal.install }) !== "badge_missing");
                  const isScanning = scanningDomain === entry.domain;
                  return (
                    <div key={entry.domain} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.domain}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                            <span className={`inline-flex rounded-full border px-2 py-0.5 font-semibold ${statusStyle}`}>
                              {entry?.license?.status || "none"}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">
                              {licensed
                                ? "GreenTracer Verified can be active after domain verification"
                                : "Verified supporter badge requires an active licence"}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDomain(entry.domain)}
                          disabled={saving}
                          className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-60"
                        >
                          {saving && updatingDomain === entry.domain ? "Removing..." : "Remove"}
                        </button>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/30">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">GreenTracer Verified</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${statusStyle}`}>
                                  Licence: {entry?.license?.status || "none"}
                                </span>
                                <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${
                                  verificationActive ? BADGE_INSTALL_STYLES.active : BADGE_INSTALL_STYLES.pending
                                }`}>
                                  Domain: {verificationStatus}
                                </span>
                                <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${BADGE_STATE_STYLES[verifiedBadgeState] || BADGE_STATE_STYLES.unavailable}`}>
                                  {verifiedBadge.label || BADGE_STATE_LABELS[verifiedBadgeState]}
                                </span>
                                <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${BADGE_INSTALL_STYLES[verifiedInstallState] || BADGE_INSTALL_STYLES.unavailable}`}>
                                  {verifiedInstall.label || BADGE_INSTALL_LABELS[verifiedInstallState]}
                                </span>
                              </div>
                              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                Last seen: {formatLastSeen(verifiedInstall.lastSeenAt)} | {verifiedLoadCount.toLocaleString()} loads
                              </p>
                              {(verifiedInstall.detectedHost || verifiedInstall.declaredDomain) && (
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                  Declared: {verifiedInstall.declaredDomain || "N/A"} | Detected: {verifiedInstall.detectedHost || "N/A"}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 lg:justify-end">
                              {licensed && verifiedBadge.embedCode && (
                                <button
                                  type="button"
                                  onClick={() => copyBadgeCode(verifiedBadge.embedCode, verifiedCopyKey)}
                                  className="rounded-full bg-slate-900 dark:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-white dark:text-slate-900"
                                >
                                  {copiedBadge === verifiedCopyKey ? "Copied" : "Get verified badge code"}
                                </button>
                              )}
                              <Link
                                to={`/license-status?domain=${encodeURIComponent(entry.domain)}&action=verify`}
                                className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200"
                              >
                                Verify domain
                              </Link>
                              <Link to={licensed ? `/license-status?domain=${encodeURIComponent(entry.domain)}` : "/pricing"} className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                                {licensed ? "Manage plan" : "Upgrade"}
                              </Link>
                              {verifiedBadge.directoryUrl && (
                                <Link to={verifiedBadge.directoryUrl.replace(/^https?:\/\/[^/]+/i, "")} className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                                  Directory profile
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900/60">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">Free report badges</p>
                              {latestResult ? (
                                <>
                                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    Latest report: {latestResult.grade ? `Grade ${latestResult.grade}` : "Carbon tested"} | Green hosting {latestResult.greenHost ? "detected" : "not detected"}
                                  </p>
                                  {!latestResult.greenHost && (
                                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                                      Green Hosting badge appears on the report only when green hosting is detected.
                                    </p>
                                  )}
                                </>
                              ) : (
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                  No public report is linked yet. Run a scan first, then generate free Carbon Tested or Green Hosting badge code from the result.
                                </p>
                              )}
                              {publicBadgeSignals.length > 0 && (
                                <div className="mt-3 space-y-1.5">
                                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Public badge install signals</p>
                                  {publicBadgeSignals.map(({ label, install }) => (
                                    <p key={`${label}:${install.badgeType || ""}:${install.detectedHost || ""}`} className="text-xs text-slate-500 dark:text-slate-400">
                                      {label}: {install.detectedHost || install.declaredDomain || "unknown host"} | {formatLastSeen(install.lastSeenAt)} | {Number(install.loadCount || 0).toLocaleString()} loads
                                      {install.sourceUrl ? ` | ${install.sourceUrl}` : ""}
                                    </p>
                                  ))}
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Outreach opportunity: public badge installs can indicate domains to invite into the verified supporter programme.
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 lg:justify-end">
                              {latestResult ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => runDashboardScan(entry.domain)}
                                    disabled={isScanning || saving}
                                    className="rounded-full bg-slate-900 dark:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-white dark:text-slate-900 disabled:opacity-60"
                                  >
                                    {isScanning ? "Scanning..." : "Run scan for this domain"}
                                  </button>
                                  <Link to={reportHref} className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                                    View report
                                  </Link>
                                  <Link to={reportBadgeHref} className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                                    Get free badges from report
                                  </Link>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => runDashboardScan(entry.domain)}
                                    disabled={isScanning || saving}
                                    className="rounded-full bg-slate-900 dark:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-white dark:text-slate-900 disabled:opacity-60"
                                  >
                                    {isScanning ? "Scanning..." : "Run scan for this domain"}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {!loading && primaryDomain && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use <Link className="underline" to={`/license-status?domain=${encodeURIComponent(primaryDomain)}&action=verify`}>Verify</Link> after installing the badge to rescan the live page markup.
              </p>
            )}
          </section>
        </div>
      </section>
    </>
  );
}
