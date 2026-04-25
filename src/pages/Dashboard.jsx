import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";

const ACTIVE_STATUSES = new Set(["active", "trial", "charity", "partner", "internal"]);
const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
  trial: "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700",
  charity: "bg-violet-50 text-violet-700 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700",
  partner: "bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700",
  internal: "bg-teal-50 text-teal-700 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700",
  suspended: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700",
  inactive: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  none: "bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700",
};

function normalizeDomainInput(value) {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("/")[0]
    .toLowerCase();
}

export default function Dashboard() {
  const { user, configured, getValidAccessToken, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [domains, setDomains] = useState([]);
  const [domainInput, setDomainInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingDomain, setUpdatingDomain] = useState("");

  const displayEmail = useMemo(() => user?.email || "Signed-in user", [user?.email]);
  const totalDomains = domains.length;
  const activeDomains = domains.filter((entry) =>
    ACTIVE_STATUSES.has(String(entry?.license?.status || "").toLowerCase()) && !!entry?.license?.licensed
  ).length;
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
    } catch (err) {
      if (/invalid or expired auth token|missing bearer token|session expired/i.test(String(err.message || ""))) {
        await logout();
        return;
      }
      setDomains([]);
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
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Active Licenses</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{activeDomains}</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Pending / None</p>
                <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-300">{pendingDomains}</p>
              </div>
            </div>
          </header>

          <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5">
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
                  Open Badge Setup
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
                  Add your first domain above, then use License Status and Badge Verification actions from this dashboard.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {domains.map((entry) => {
                  const status = String(entry?.license?.status || "none").toLowerCase();
                  const licensed = ACTIVE_STATUSES.has(status) && !!entry?.license?.licensed;
                  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.none;
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
                                ? "Member badge eligible"
                                : "Not eligible until license status is active/trial/charity/partner/internal"}
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

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link to={`/badge?site=${encodeURIComponent(entry.domain)}`} className="rounded-full bg-slate-900 dark:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-white dark:text-slate-900">
                          Badge setup
                        </Link>
                        <Link to={`/license-status?domain=${encodeURIComponent(entry.domain)}`} className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                          License status
                        </Link>
                        <Link
                          to={`/license-status?domain=${encodeURIComponent(entry.domain)}&action=verify&badgeType=member`}
                          className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200"
                        >
                          Badge verification
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {!loading && primaryDomain && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tip: use <Link className="underline" to={`/license-status?domain=${encodeURIComponent(primaryDomain)}`}>License Status</Link> to confirm webhook-paid activation when testing Stripe checkout.
              </p>
            )}
          </section>
        </div>
      </section>
    </>
  );
}
