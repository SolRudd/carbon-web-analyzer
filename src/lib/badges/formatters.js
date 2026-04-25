export const PUBLIC_BADGE_STATUSES = ["verified", "pending", "inactive", "unavailable"];

export const BADGE_LABELS = {
  verified: "GreenTracer Verified",
  pending: "GreenTracer Pending",
  inactive: "GreenTracer Inactive",
  unavailable: "GreenTracer Unavailable",
};

export function normalizePublicBadgeStatus(status) {
  const value = String(status || "").toLowerCase();
  return PUBLIC_BADGE_STATUSES.includes(value) ? value : "unavailable";
}

export function getBadgeLabel(status) {
  return BADGE_LABELS[normalizePublicBadgeStatus(status)];
}

export function normalizeMetricValue(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function formatCo2PerPage(value) {
  const metric = normalizeMetricValue(value);
  if (metric === null) return null;
  return `${metric.toFixed(metric >= 10 ? 1 : 2)}g CO₂/page`;
}
