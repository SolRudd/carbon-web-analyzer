import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  Globe2,
  Leaf,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";
import {
  formatCarbonValue,
  formatCompactNumber,
  formatScanDate,
  normalizeMetricNumber,
} from "../lib/reportDisplay";

const ACTIVE_STATUSES = new Set(["active", "trial", "charity", "partner", "internal", "non_profit", "nonprofit", "community", "manual_lifetime"]);
const VERIFIED_BADGE_TYPE = "greentracer_verified";

const SECTION_LINKS = [
  ["overview", "Overview"],
  ["domains", "Domains"],
  ["reports", "Reports"],
  ["badges", "Badges"],
  ["verified", "Verified"],
  ["billing", "Billing"],
  ["settings", "Settings"],
];

const BADGE_INSTALL_STYLES = {
  active: "border-[#00d084]/30 bg-[#00d084]/10 text-[#8df8ce]",
  pending: "border-[#f5b84b]/30 bg-[#f5b84b]/10 text-[#ffd88a]",
  badge_missing: "border-white/10 bg-white/[0.04] text-[#b7c6d4]",
  domain_mismatch: "border-[#ff8a4c]/30 bg-[#ff8a4c]/10 text-[#ffc09c]",
  licence_inactive: "border-[#ff5f57]/30 bg-[#ff5f57]/10 text-[#ffb2ad]",
  unknown_domain: "border-[#4dd8ff]/24 bg-[#4dd8ff]/10 text-[#b8edff]",
  unavailable: "border-white/10 bg-white/[0.04] text-[#b7c6d4]",
};

const BADGE_INSTALL_LABELS = {
  active: "Installed",
  pending: "Pending",
  badge_missing: "Not Seen Yet",
  domain_mismatch: "Domain Mismatch",
  licence_inactive: "Verified Not Active",
  unknown_domain: "Unknown Domain",
  unavailable: "Status Unavailable",
};

const BADGE_STATE_LABELS = {
  active: "Active",
  pending: "Verification Pending",
  not_active: "Verified Not Active",
  green_hosting_not_detected: "Hosting Not Confirmed",
  domain_mismatch: "Domain Mismatch",
  licence_inactive: "Verified Not Active",
  unavailable: "Verification Unavailable",
};

function normalizeDomainInput(value) {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("/")[0]
    .toLowerCase();
}

function formatDateTime(value) {
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
  const state = String(badge?.install?.state || badge?.install?.status || badge?.badgeInstall?.state || badge?.badgeInstall?.status || badge?.state || badge?.status || "badge_missing").toLowerCase();
  return BADGE_INSTALL_LABELS[state] ? state : "unavailable";
}

function getBadgeState(badge) {
  const state = String(badge?.status || "unavailable").toLowerCase();
  return BADGE_STATE_LABELS[state] ? state : "unavailable";
}

function getReportHref(report) {
  return report?.slug ? `/result/${encodeURIComponent(report.slug)}` : "";
}

function getDomainReport(entry) {
  return entry?.latestResult || null;
}

function getGradeValue(grade) {
  const value = String(grade || "").trim().toUpperCase();
  const order = { "A+": 7, A: 6, B: 5, C: 4, D: 3, E: 2, F: 1 };
  return order[value] || 0;
}

function getAverageGrade(reports) {
  const values = reports.map((report) => getGradeValue(report.grade)).filter(Boolean);
  if (values.length === 0) return "Unavailable";
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (average >= 6.5) return "A+";
  if (average >= 5.5) return "A";
  if (average >= 4.5) return "B";
  if (average >= 3.5) return "C";
  if (average >= 2.5) return "D";
  if (average >= 1.5) return "E";
  return "F";
}

function getNextAction({ domains, reports, activeVerifiedCount, installedBadgeCount }) {
  if (domains.length === 0) return { label: "Add your first domain", to: "#domains" };
  if (reports.length === 0) return { label: "Run a scan", to: "#domains" };
  if (installedBadgeCount === 0) return { label: "Install a report badge", to: "#badges" };
  if (activeVerifiedCount === 0) return { label: "Set up GreenTracer Verified", to: "#verified" };
  return { label: "Review latest report", to: getReportHref(reports[0]) || "#reports" };
}

function StatusPill({ state = "unavailable", children }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${BADGE_INSTALL_STYLES[state] || BADGE_INSTALL_STYLES.unavailable}`}>
      {children || BADGE_INSTALL_LABELS[state] || BADGE_INSTALL_LABELS.unavailable}
    </span>
  );
}

function Panel({ id, eyebrow, title, description, children, action }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-[1.5rem] border border-[rgba(132,204,200,0.16)] bg-[linear-gradient(145deg,rgba(7,20,35,0.84),rgba(1,7,13,0.66))] p-5 shadow-[0_24px_80px_-70px_rgba(0,208,132,0.8)] sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow && <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#00d084]">{eyebrow}</p>}
          <h2 className="mt-1 text-xl font-semibold text-[#f5fbff]">{title}</h2>
          {description && <p className="mt-1 max-w-3xl text-sm leading-6 text-[#8fa6b8]">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone = "green" }) {
  const toneClass = tone === "cyan" ? "text-[#4dd8ff] bg-[#4dd8ff]/10 border-[#4dd8ff]/20" : tone === "amber" ? "text-[#f5b84b] bg-[#f5b84b]/10 border-[#f5b84b]/20" : "text-[#00d084] bg-[#00d084]/10 border-[#00d084]/20";
  return (
    <div className="rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[#020b13]/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#5f7285]">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[#f5fbff]">{value}</p>
        </div>
        <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${toneClass}`}>
          {React.createElement(Icon, { size: 19, "aria-hidden": true })}
        </span>
      </div>
      {detail && <p className="mt-3 text-sm leading-5 text-[#8fa6b8]">{detail}</p>}
    </div>
  );
}

function EmptyState({ title, body, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-[rgba(132,204,200,0.22)] bg-white/[0.025] p-5">
      <p className="font-semibold text-[#f5fbff]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[#8fa6b8]">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function PrimaryButton({ children, ...props }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#00d084] px-4 text-sm font-semibold text-[#02110b] transition hover:bg-[#1de29d] disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}

function LinkButton({ to, children, variant = "secondary" }) {
  const className = variant === "primary"
    ? "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#00d084] px-4 text-sm font-semibold text-[#02110b] transition hover:bg-[#1de29d]"
    : "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[rgba(132,204,200,0.22)] px-4 text-sm font-semibold text-[#dbe8ef] transition hover:border-[#00d084]/45 hover:bg-white/[0.03]";
  return <Link to={to} className={className}>{children}</Link>;
}

function CopyButton({ code, copyKey, copiedKey, onCopy, children }) {
  return (
    <PrimaryButton disabled={!code} onClick={() => onCopy(code, copyKey)}>
      <Copy size={15} aria-hidden="true" />
      {copiedKey === copyKey ? "Copied" : children}
    </PrimaryButton>
  );
}

export default function Dashboard() {
  const { user, configured, getValidAccessToken, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [domains, setDomains] = useState([]);
  const [reports, setReports] = useState([]);
  const [badge, setBadge] = useState(null);
  const [domainInput, setDomainInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingDomain, setUpdatingDomain] = useState("");
  const [copiedBadge, setCopiedBadge] = useState("");
  const [scanningDomain, setScanningDomain] = useState("");

  const displayEmail = user?.email || "Signed-in user";
  const totalDomains = domains.length;
  const activeVerifiedDomains = domains.filter((entry) => ACTIVE_STATUSES.has(String(entry?.license?.status || "").toLowerCase()) && !!entry?.license?.licensed);
  const activeVerifiedCount = activeVerifiedDomains.length;
  const allReportRows = reports.length > 0 ? reports : domains.map(getDomainReport).filter(Boolean);
  const latestReport = allReportRows[0] || null;
  const latestDomain = latestReport ? normalizeDomainInput(latestReport.domain || latestReport.url) : domains[0]?.domain || "";
  const averageGrade = getAverageGrade(allReportRows);
  const installedBadgeCount = domains.reduce((total, entry) => {
    const familyCount = ["carbon_tested", "green_hosting", VERIFIED_BADGE_TYPE].filter((type) => getInstallState(entry?.badges?.[type]?.install) === "active").length;
    return total + familyCount;
  }, 0);
  const nextAction = getNextAction({ domains, reports: allReportRows, activeVerifiedCount, installedBadgeCount });

  const billingSummary = useMemo(() => {
    const licenses = domains.map((entry) => entry.license).filter(Boolean);
    const active = licenses.find((license) => license?.licensed) || licenses[0] || null;
    return {
      plan: active?.plan || active?.licenseType || "Free",
      status: active?.subscriptionStatus || active?.status || "No paid plan",
      renewalDate: active?.renewalDate || active?.endDate || null,
      cancelAtPeriodEnd: Boolean(active?.cancelAtPeriodEnd),
      hasPaidPlan: Boolean(active?.licensed),
    };
  }, [domains]);

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
      throw new Error(`Failed to fetch ${method} ${url}. Check backend availability/CORS. ${networkErr?.message || ""}`.trim());
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
      setReports([]);
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
      setReports(Array.isArray(data.reports) ? data.reports : []);
      setBadge(data.badge || null);
    } catch (err) {
      if (/invalid or expired auth token|missing bearer token|session expired/i.test(String(err.message || ""))) {
        await logout();
        return;
      }
      setDomains([]);
      setReports([]);
      setBadge(null);
      setError(toFriendlyDashboardError(err.message));
    } finally {
      setLoading(false);
    }
  }, [configured, getValidAccessToken, logout]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const addDomain = async (event) => {
    event.preventDefault();
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
          content="Manage GreenTracer domains, reports, badges, verification, and billing from your account dashboard."
        />
        <link rel="canonical" href="https://www.greentracer.org/dashboard" />
      </Helmet>

      <section className="relative min-h-[calc(100vh-140px)] overflow-hidden bg-[#020b13] px-4 py-10 text-[#f5fbff] sm:px-6">
        <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(to_right,rgba(132,204,200,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(132,204,200,0.045)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,208,132,0.13),transparent_68%)] blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl space-y-6">
          <header className="rounded-[1.75rem] border border-[rgba(132,204,200,0.18)] bg-[linear-gradient(145deg,rgba(7,20,35,0.9),rgba(1,7,13,0.74))] p-5 shadow-[0_30px_110px_-82px_rgba(0,208,132,0.9)] sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#00d084]/24 bg-[#00d084]/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8df8ce]">
                  <Activity size={13} aria-hidden="true" />
                  Account control centre
                </p>
                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">
                  GreenTracer dashboard
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#8fa6b8] sm:text-base">
                  Manage domains, public reports, badge installs, verification, and future billing from one account workspace.
                </p>
                <p className="mt-2 text-sm text-[#5f7285]">{displayEmail}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <PrimaryButton disabled={loading || saving} onClick={() => fetchDashboard({ clearNotice: false })}>
                  <RefreshCw size={15} aria-hidden="true" />
                  {loading ? "Refreshing" : "Refresh"}
                </PrimaryButton>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-[rgba(132,204,200,0.22)] px-4 text-sm font-semibold text-[#dbe8ef] transition hover:border-[#00d084]/45 hover:bg-white/[0.03]"
                >
                  Sign out
                </button>
              </div>
            </div>

            <nav className="mt-6 flex gap-2 overflow-x-auto pb-1" aria-label="Dashboard sections">
              {SECTION_LINKS.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="inline-flex h-9 shrink-0 items-center rounded-full border border-[rgba(132,204,200,0.18)] bg-white/[0.03] px-3 text-xs font-semibold text-[#b7c6d4] hover:border-[#00d084]/40 hover:text-white"
                >
                  {label}
                </a>
              ))}
            </nav>
          </header>

          {error && (
            <div className="rounded-2xl border border-[#ff5f57]/28 bg-[#ff5f57]/10 px-4 py-3 text-sm text-[#ffb2ad]">
              {error}
            </div>
          )}
          {notice && (
            <div className="rounded-2xl border border-[#00d084]/24 bg-[#00d084]/10 px-4 py-3 text-sm text-[#8df8ce]">
              {notice}
            </div>
          )}
          {!configured && (
            <div className="rounded-2xl border border-[#f5b84b]/24 bg-[#f5b84b]/10 px-4 py-3 text-sm text-[#ffd88a]">
              Auth config missing. Set frontend and backend Supabase env vars before using dashboard APIs.
            </div>
          )}

          <Panel id="overview" eyebrow="Overview" title="Account snapshot" description="A quick read on scan coverage, report freshness, badge installs, and the next useful action.">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <MetricCard icon={Globe2} label="Scanned domains" value={totalDomains} detail={totalDomains === 1 ? "1 linked domain" : `${totalDomains} linked domains`} />
              <MetricCard icon={CalendarDays} label="Latest scan" value={latestReport ? formatScanDate(latestReport.createdAt || latestReport.created_at) : "None"} detail={latestDomain || "Run a scan to create the first report."} tone="cyan" />
              <MetricCard icon={BarChart3} label="Average grade" value={averageGrade} detail={allReportRows.length ? `${allReportRows.length} saved report${allReportRows.length === 1 ? "" : "s"}` : "No reports yet"} />
              <MetricCard icon={BadgeCheck} label="Badge installs" value={installedBadgeCount} detail="Install pings seen across badge families." tone="cyan" />
              <MetricCard icon={ShieldCheck} label="Verified status" value={activeVerifiedCount ? "Active" : "Not active"} detail={activeVerifiedCount ? `${activeVerifiedCount} verified domain${activeVerifiedCount === 1 ? "" : "s"}` : "Verified is separate from report grades."} tone={activeVerifiedCount ? "green" : "amber"} />
            </div>
            <div className="mt-4 rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[#020b13]/50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#f5fbff]">Next recommended action</p>
                  <p className="mt-1 text-sm text-[#8fa6b8]">{nextAction.label}</p>
                </div>
                <LinkButton to={nextAction.to} variant="primary">
                  Continue
                  <ExternalLink size={14} aria-hidden="true" />
                </LinkButton>
              </div>
            </div>
          </Panel>

          <Panel id="domains" eyebrow="Domains" title="Managed domains" description="Add domains you manage, scan them, and track their latest public sustainability signal.">
            <form onSubmit={addDomain} className="mb-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <label className="sr-only" htmlFor="dashboard-domain">Domain</label>
              <input
                id="dashboard-domain"
                type="text"
                value={domainInput}
                onChange={(event) => setDomainInput(event.target.value)}
                placeholder="example.com"
                className="h-11 rounded-xl border border-[rgba(132,204,200,0.22)] bg-[#020b13]/70 px-3 text-sm text-[#f5fbff] outline-none placeholder:text-[#5f7285] focus:border-[#00d084]/50"
              />
              <PrimaryButton type="submit" disabled={saving || !configured}>
                {saving ? "Saving" : "Add domain"}
              </PrimaryButton>
            </form>

            {loading ? (
              <EmptyState title="Loading domains" body="Fetching linked domains, latest reports, and badge install summaries." />
            ) : domains.length === 0 ? (
              <EmptyState
                title="No domains linked yet"
                body="Add a domain you manage, then run a scan to create the first public Carbon Result report."
                action={<LinkButton to="/pricing">View verification plans</LinkButton>}
              />
            ) : (
              <div className="grid gap-3">
                {domains.map((entry) => {
                  const latestResult = getDomainReport(entry);
                  const carbon = normalizeMetricNumber(latestResult?.carbonEstimate ?? latestResult?.carbon_estimate);
                  const verifiedState = getBadgeState(entry?.badges?.[VERIFIED_BADGE_TYPE] || {});
                  const badgeInstallState = getInstallState(entry?.badges?.[VERIFIED_BADGE_TYPE]?.install || {});
                  const isScanning = scanningDomain === entry.domain;
                  return (
                    <article key={entry.domain} className="rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[#020b13]/46 p-4">
                      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr_0.8fr_auto] lg:items-center">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#f5fbff]">{entry.domain}</p>
                          <p className="mt-1 text-xs text-[#5f7285]">Last scanned: {formatScanDate(latestResult?.createdAt || latestResult?.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5f7285]">Grade</p>
                          <p className="mt-1 font-semibold text-[#f5fbff]">{latestResult?.grade || "Unavailable"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5f7285]">Carbon</p>
                          <p className="mt-1 font-semibold text-[#f5fbff]">{carbon === null ? "Unavailable" : `${formatCarbonValue(carbon)}g/view`}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5f7285]">Hosting</p>
                          <p className="mt-1 font-semibold text-[#f5fbff]">{latestResult?.greenHost || latestResult?.green_host ? "Detected" : "Not confirmed"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-[#5f7285]">Badge status</p>
                          <StatusPill state={badgeInstallState}>{BADGE_STATE_LABELS[verifiedState] || BADGE_INSTALL_LABELS[badgeInstallState]}</StatusPill>
                        </div>
                        <div className="flex flex-wrap gap-2 lg:justify-end">
                          <PrimaryButton disabled={isScanning || saving} onClick={() => runDashboardScan(entry.domain)}>
                            {isScanning ? "Scanning" : "Run scan"}
                          </PrimaryButton>
                          {latestResult?.slug && <LinkButton to={`/result/${encodeURIComponent(latestResult.slug)}`}>Report</LinkButton>}
                          <button
                            type="button"
                            onClick={() => removeDomain(entry.domain)}
                            disabled={saving}
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-[rgba(132,204,200,0.22)] px-4 text-sm font-semibold text-[#dbe8ef] disabled:opacity-50"
                          >
                            {saving && updatingDomain === entry.domain ? "Removing" : "Remove"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel id="reports" eyebrow="Reports" title="Saved public reports" description="Reports come from saved GreenTracer scans. Open a report to export PDF or copy report-backed badges.">
            {allReportRows.length === 0 ? (
              <EmptyState title="No saved reports yet" body="Run a dashboard scan from a managed domain to create a saved public report." />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[rgba(132,204,200,0.14)]">
                <div className="hidden grid-cols-[1.2fr_0.65fr_0.7fr_0.8fr_auto] gap-4 border-b border-[rgba(132,204,200,0.12)] bg-white/[0.03] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#5f7285] md:grid">
                  <span>Report</span>
                  <span>Date</span>
                  <span>Grade</span>
                  <span>Carbon/page view</span>
                  <span>Actions</span>
                </div>
                <div className="divide-y divide-[rgba(132,204,200,0.1)]">
                  {allReportRows.slice(0, 12).map((report) => {
                    const href = getReportHref(report);
                    return (
                      <div key={report.slug || `${report.url}-${report.createdAt}`} className="grid gap-3 px-4 py-4 md:grid-cols-[1.2fr_0.65fr_0.7fr_0.8fr_auto] md:items-center">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#f5fbff]">{normalizeDomainInput(report.domain || report.url) || "Unknown domain"}</p>
                          <p className="mt-1 truncate text-xs text-[#5f7285]">{report.url || report.slug}</p>
                        </div>
                        <p className="text-sm text-[#b7c6d4]">{formatScanDate(report.createdAt || report.created_at)}</p>
                        <p className="text-sm font-semibold text-[#f5fbff]">{report.grade || "Unavailable"}</p>
                        <p className="text-sm text-[#b7c6d4]">{formatCarbonValue(report.carbonEstimate ?? report.carbon_estimate)}g CO2e</p>
                        <div className="flex flex-wrap gap-2 md:justify-end">
                          {href && <LinkButton to={href}>View report</LinkButton>}
                          {href && <LinkButton to={href}>Export PDF from report</LinkButton>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Panel>

          <Panel id="badges" eyebrow="Badges" title="Badge installs and snippets" description="Track report-backed badges and GreenTracer Verified separately. Install tracking is best-effort and never blocks badge rendering.">
            {domains.length === 0 ? (
              <EmptyState title="No badge data yet" body="Add a domain and run a scan to generate Carbon Result and Green Hosting badge options." />
            ) : (
              <div className="grid gap-4 lg:grid-cols-3">
                {domains.flatMap((entry) => {
                  const latestResult = getDomainReport(entry);
                  const families = [
                    ["carbon_tested", "Carbon Result", "Report-backed", "Grade", latestResult?.grade ? `Grade ${latestResult.grade}` : "Unavailable"],
                    ["green_hosting", "Green Hosting", "Report-backed", "Evidence", latestResult?.greenHost || latestResult?.green_host ? "Detected" : "Not confirmed"],
                    [VERIFIED_BADGE_TYPE, "GreenTracer Verified", "Supporter/member", "State", BADGE_STATE_LABELS[getBadgeState(entry?.badges?.[VERIFIED_BADGE_TYPE])] || "Verification Unavailable"],
                  ];
                  return families.map(([type, label, scope, valueLabel, value]) => {
                    const badgeData = entry?.badges?.[type] || {};
                    const install = badgeData.install || {};
                    const installState = getInstallState(install);
                    const copyKey = `${entry.domain}:${type}`;
                    const manageHref = type === VERIFIED_BADGE_TYPE
                      ? `/license-status?domain=${encodeURIComponent(entry.domain)}`
                      : (latestResult?.slug ? `/result/${encodeURIComponent(latestResult.slug)}#badge-options` : `/badge?type=${type}&domain=${encodeURIComponent(entry.domain)}`);
                    return (
                      <article key={`${entry.domain}:${type}`} className="flex min-h-[300px] flex-col rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[#020b13]/46 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f7285]">{scope}</p>
                            <h3 className="mt-1 text-lg font-semibold text-[#f5fbff]">{label}</h3>
                            <p className="mt-1 text-sm text-[#8fa6b8]">{entry.domain}</p>
                          </div>
                          <StatusPill state={installState} />
                        </div>
                        <dl className="mt-5 grid gap-3 text-sm">
                          <div className="flex justify-between gap-3">
                            <dt className="text-[#5f7285]">{valueLabel}</dt>
                            <dd className="text-right font-semibold text-[#f5fbff]">{value}</dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-[#5f7285]">First seen</dt>
                            <dd className="text-right text-[#b7c6d4]">{formatDateTime(install.firstSeenAt)}</dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-[#5f7285]">Last seen</dt>
                            <dd className="text-right text-[#b7c6d4]">{formatDateTime(install.lastSeenAt)}</dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-[#5f7285]">Loads</dt>
                            <dd className="text-right text-[#b7c6d4]">{formatCompactNumber(install.loadCount || 0)}</dd>
                          </div>
                        </dl>
                        <div className="mt-auto grid gap-2 pt-5">
                          <CopyButton code={badgeData.embedCode} copyKey={copyKey} copiedKey={copiedBadge} onCopy={copyBadgeCode}>
                            Copy badge
                          </CopyButton>
                          <LinkButton to={manageHref}>Manage badge</LinkButton>
                        </div>
                      </article>
                    );
                  });
                })}
              </div>
            )}
          </Panel>

          <Panel id="verified" eyebrow="Verified / Directory" title="GreenTracer Verified and directory" description="Verified is a supporter/member signal, not a claim of perfect carbon performance. It can support a managed public profile and badge state.">
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[#020b13]/46 p-5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#00d084]/20 bg-[#00d084]/10 text-[#00d084]">
                    <ShieldCheck size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#f5fbff]">Verified profile status</h3>
                    <p className="mt-1 text-sm leading-6 text-[#8fa6b8]">
                      {badge?.state === "active" ? "GreenTracer Verified is active for your account domain." : "GreenTracer Verified is not active yet. Add a domain, activate a supporter/member plan, and verify the domain."}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <LinkButton to="/pricing" variant={badge?.state === "active" ? "secondary" : "primary"}>
                    {badge?.state === "active" ? "View verified plans" : "Upgrade to Verified"}
                  </LinkButton>
                  <LinkButton to={badge?.domain ? `/license-status?domain=${encodeURIComponent(badge.domain)}` : "/license-status"}>
                    Manage verification
                  </LinkButton>
                </div>
              </div>

              <div className="rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[#020b13]/46 p-5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#4dd8ff]/20 bg-[#4dd8ff]/10 text-[#4dd8ff]">
                    <Sparkles size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#f5fbff]">Directory visibility</h3>
                    <p className="mt-1 text-sm leading-6 text-[#8fa6b8]">
                      Public profile URLs are prepared for verified domains. Fuller directory controls are a planned account feature.
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  {domains.map((entry) => {
                    const directoryUrl = entry?.badges?.[VERIFIED_BADGE_TYPE]?.directoryUrl;
                    return (
                      <div key={entry.domain} className="flex flex-col gap-2 rounded-xl border border-[rgba(132,204,200,0.1)] bg-white/[0.025] px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm text-[#dbe8ef]">{entry.domain}</span>
                        {directoryUrl ? (
                          <LinkButton to={directoryUrl.replace(/^https?:\/\/[^/]+/i, "")}>Open profile</LinkButton>
                        ) : (
                          <span className="text-xs text-[#5f7285]">Profile pending</span>
                        )}
                      </div>
                    );
                  })}
                  {domains.length === 0 && <p className="text-sm text-[#8fa6b8]">Add a domain to prepare a directory profile path.</p>}
                </div>
              </div>
            </div>
          </Panel>

          <Panel id="billing" eyebrow="Billing" title="Plan and billing" description="Prepared for Stripe-backed account billing. This section only shows safe license and subscription fields already available.">
            <div className="grid gap-4 lg:grid-cols-3">
              <MetricCard icon={CreditCard} label="Current plan" value={billingSummary.plan || "Free"} detail={billingSummary.hasPaidPlan ? "Paid or approved supporter/member access." : "No paid supporter/member plan detected."} />
              <MetricCard icon={CheckCircle2} label="Subscription status" value={billingSummary.status || "Unavailable"} detail={billingSummary.cancelAtPeriodEnd ? "Set to cancel at period end." : "Status comes from current license data."} tone={billingSummary.hasPaidPlan ? "green" : "amber"} />
              <MetricCard icon={CalendarDays} label="Renewal date" value={billingSummary.renewalDate ? formatScanDate(billingSummary.renewalDate) : "Unavailable"} detail="Shown when the billing or licence record includes a renewal date." tone="cyan" />
            </div>
            <div className="mt-4 rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[#020b13]/46 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-[#8fa6b8]">
                  Billing portal management is not wired in this dashboard yet. Use pricing or licence status until the Stripe portal route is available.
                </p>
                <div className="flex flex-wrap gap-2">
                  <LinkButton to="/pricing" variant="primary">{billingSummary.hasPaidPlan ? "View plans" : "Upgrade"}</LinkButton>
                  <LinkButton to={domains[0]?.domain ? `/license-status?domain=${encodeURIComponent(domains[0].domain)}` : "/license-status"}>Licence status</LinkButton>
                </div>
              </div>
            </div>
          </Panel>

          <Panel id="settings" eyebrow="Settings" title="Account settings" description="Basic account metadata and planned preferences. No private tokens or billing identifiers are shown here.">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[#020b13]/46 p-4">
                <div className="flex items-center gap-3">
                  <Settings className="text-[#00d084]" size={20} aria-hidden="true" />
                  <h3 className="font-semibold text-[#f5fbff]">Account</h3>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-[#5f7285]">Email</dt>
                    <dd className="mt-1 break-all text-[#dbe8ef]">{displayEmail}</dd>
                  </div>
                  <div>
                    <dt className="text-[#5f7285]">Company name</dt>
                    <dd className="mt-1 text-[#dbe8ef]">Not set</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[#020b13]/46 p-4">
                <div className="flex items-center gap-3">
                  <Globe2 className="text-[#4dd8ff]" size={20} aria-hidden="true" />
                  <h3 className="font-semibold text-[#f5fbff]">Defaults</h3>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-[#5f7285]">Default domain</dt>
                    <dd className="mt-1 text-[#dbe8ef]">{domains[0]?.domain || "Not set"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#5f7285]">Default badge family</dt>
                    <dd className="mt-1 text-[#dbe8ef]">Carbon Result</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[#020b13]/46 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-[#f5b84b]" size={20} aria-hidden="true" />
                  <h3 className="font-semibold text-[#f5fbff]">Preferences</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#8fa6b8]">
                  Notification preferences and company profile editing are planned settings. No backend preference store is wired yet.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </section>
    </>
  );
}
