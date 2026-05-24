export const GRADE_ORDER = ["A+", "A", "B", "C", "D", "E", "F"];

export const GRADE_CONFIG = {
  "A+": {
    score: 96,
    tone: "green",
    label: "Excellent",
    impact: "Ultra low impact",
    color: "#00d084",
    accent: "#4dd8ff",
  },
  A: {
    score: 88,
    tone: "green",
    label: "Excellent",
    impact: "Very low impact",
    color: "#00d084",
    accent: "#4dd8ff",
  },
  B: {
    score: 74,
    tone: "teal",
    label: "Good",
    impact: "Low impact",
    color: "#00a19d",
    accent: "#4dd8ff",
  },
  C: {
    score: 58,
    tone: "amber",
    label: "Average",
    impact: "Moderate impact",
    color: "#f5b84b",
    accent: "#00d084",
  },
  D: {
    score: 42,
    tone: "amber",
    label: "Needs work",
    impact: "Elevated impact",
    color: "#f59e0b",
    accent: "#f5b84b",
  },
  E: {
    score: 26,
    tone: "red",
    label: "High impact",
    impact: "High impact",
    color: "#ff7a59",
    accent: "#f5b84b",
  },
  F: {
    score: 12,
    tone: "red",
    label: "Heavy impact",
    impact: "Heavy impact",
    color: "#ff5f57",
    accent: "#f5b84b",
  },
};

export const TRAFFIC_VOLUME_PRESETS = [
  { label: "1 view", value: 1 },
  { label: "100 views", value: 100 },
  { label: "1,000 views", value: 1000 },
  { label: "100,000 views", value: 100000 },
];

export const TRAFFIC_IMPACT_CONSTANTS = {
  smartphoneChargeGCo2e: 5,
  laptopHourGCo2e: 20,
  drivingKmGCo2e: 170,
};

export const CARBON_GAUGE_ARC = {
  cx: 130,
  cy: 126,
  radius: 92,
  startAngle: 150,
  endAngle: 390,
};

const ACTIVE_LICENSE_STATUSES = new Set([
  "active",
  "trial",
  "charity",
  "partner",
  "internal",
  "non_profit",
  "nonprofit",
  "community",
  "manual_lifetime",
]);

const numberFormatter = new Intl.NumberFormat(undefined);
const compactFormatter = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});

function normalizeStatus(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
}

export function normalizeDomain(raw) {
  try {
    const value = String(raw || "").trim();
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return url.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return String(raw || "")
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0]
      .toLowerCase();
  }
}

export function normalizeMetricNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function clampPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

export function formatNumber(value, options = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "Unavailable";
  return new Intl.NumberFormat(undefined, options).format(number);
}

export function formatCompactNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "Unavailable";
  return Math.abs(number) >= 10000 ? compactFormatter.format(number) : numberFormatter.format(number);
}

export function formatCarbonValue(value) {
  const metric = normalizeMetricNumber(value);
  if (metric === null) return "Unavailable";
  if (metric === 0) return "0.00";
  if (metric < 0.01) return metric.toFixed(3);
  if (metric < 10) return metric.toFixed(2);
  return metric.toFixed(1);
}

export function formatCarbonTotal(grams) {
  const value = normalizeMetricNumber(grams);
  if (value === null) return "Unavailable";
  if (value < 1000) return `${formatCarbonValue(value)}g CO₂e`;
  const kg = value / 1000;
  if (kg < 1000) {
    return `${kg < 10 ? kg.toFixed(2) : kg.toFixed(1)}kg CO₂e`;
  }
  return `${(kg / 1000).toFixed(2)}t CO₂e`;
}

export function formatScanDate(value) {
  if (!value) return "Unavailable";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Unavailable";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getGradeLabel(grade) {
  const value = String(grade || "").trim().toUpperCase();
  return GRADE_CONFIG[value] ? value : "N/A";
}

export function getGradeConfig(grade) {
  return GRADE_CONFIG[getGradeLabel(grade)] || {
    score: 0,
    tone: "neutral",
    label: "Unavailable",
    impact: "Impact unavailable",
    color: "#8fa6b8",
    accent: "#4dd8ff",
  };
}

export function getGaugeScore({ grade, percentile } = {}) {
  const percentileNumber = Number(percentile);
  if (Number.isFinite(percentileNumber)) return clampPercent(percentileNumber);
  return getGradeConfig(grade).score;
}

export function getGaugeAngle(score, arc = CARBON_GAUGE_ARC) {
  const clampedScore = clampPercent(score);
  return arc.startAngle + (clampedScore / 100) * (arc.endAngle - arc.startAngle);
}

export function getGaugePoint(score, arc = CARBON_GAUGE_ARC, radius = arc.radius) {
  const angle = getGaugeAngle(score, arc);
  const radians = (angle * Math.PI) / 180;

  return {
    x: arc.cx + radius * Math.cos(radians),
    y: arc.cy + radius * Math.sin(radians),
  };
}

export function getGaugeArcPath(fromScore = 0, toScore = 100, arc = CARBON_GAUGE_ARC, radius = arc.radius) {
  const startScore = clampPercent(fromScore);
  const endScore = clampPercent(toScore);

  if (startScore === endScore) return "";

  const startAngle = getGaugeAngle(startScore, arc);
  const endAngle = getGaugeAngle(endScore, arc);
  const start = getGaugePoint(startScore, arc, radius);
  const end = getGaugePoint(endScore, arc, radius);
  const sweep = endAngle - startAngle;
  const largeArcFlag = Math.abs(sweep) > 180 ? 1 : 0;
  const sweepFlag = sweep >= 0 ? 1 : 0;

  return [
    `M ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
  ].join(" ");
}

export function getGradeTone(grade, score) {
  const config = getGradeConfig(grade);
  if (config.tone !== "neutral") return config.tone;
  const metric = clampPercent(score);
  if (metric >= 75) return "green";
  if (metric >= 60) return "teal";
  if (metric >= 40) return "amber";
  if (metric > 0) return "red";
  return "neutral";
}

export function getHostingDisplayStatus(greenHost) {
  if (greenHost === true) {
    return {
      key: "detected",
      label: "Green detected",
      shortLabel: "Green",
      badgeLabel: "Available",
      detail: "Hosting evidence supports the Green Hosting badge.",
      tone: "green",
    };
  }

  return {
    key: "not_detected",
    label: "Not detected",
    shortLabel: "Not detected",
    badgeLabel: "Not available",
    detail: "No green-hosting claim should be published from this report.",
    tone: "amber",
  };
}

export function getVerifiedDisplayStatus(input = {}) {
  const publicStatus = normalizeStatus(input.publicStatus);
  const explicitVerifiedStatus = normalizeStatus(input.verifiedStatus || input.verificationStatus || input.badgeStatus);
  const rawStatus = publicStatus || explicitVerifiedStatus || normalizeStatus(input.status);

  if (
    ["verified", "active", "approved"].includes(rawStatus) &&
    (
      publicStatus ||
      explicitVerifiedStatus ||
      input.source === "verified" ||
      input.badgeType === "greentracer_verified" ||
      input.verificationUrl ||
      input.directoryUrl
    )
  ) {
    return {
      key: "verified",
      label: "Verified Active",
      badgeLabel: "Verified Active",
      tone: "green",
      actionLabel: "Manage verified badge",
      actionTo: "/dashboard",
    };
  }

  if (["pending", "needs_review", "review", "unverified"].includes(rawStatus)) {
    return {
      key: "pending",
      label: "Verification Pending",
      badgeLabel: "Verification Pending",
      tone: "amber",
      actionLabel: "Manage verified badge",
      actionTo: "/dashboard",
    };
  }

  if (
    [
      "unavailable",
      "license_unavailable",
      "licence_unavailable",
      "token_invalid",
      "domain_mismatch",
      "unknown",
    ].includes(rawStatus) ||
    input.unavailable
  ) {
    return {
      key: "unavailable",
      label: "Verification Unavailable",
      badgeLabel: "Verification Unavailable",
      tone: "neutral",
      actionLabel: "View verified plans",
      actionTo: "/pricing",
    };
  }

  if (input.licensed || ACTIVE_LICENSE_STATUSES.has(rawStatus)) {
    return {
      key: "pending",
      label: "Verification Pending",
      badgeLabel: "Verification Pending",
      tone: "amber",
      actionLabel: "Manage verified badge",
      actionTo: "/dashboard",
    };
  }

  return {
    key: "inactive",
    label: "Verified Not Active",
    badgeLabel: "Verified Not Active",
    tone: "neutral",
    actionLabel: "Upgrade to Verified",
    actionTo: "/pricing",
  };
}

export function calculateTrafficImpact(carbonPerView, views, constants = TRAFFIC_IMPACT_CONSTANTS) {
  const carbon = normalizeMetricNumber(carbonPerView) ?? 0;
  const traffic = Math.max(1, Math.round(Number(views) || 1));
  const totalGCo2e = carbon * traffic;

  return {
    views: traffic,
    carbonPerView: carbon,
    totalGCo2e,
    smartphoneCharges: totalGCo2e / constants.smartphoneChargeGCo2e,
    laptopHours: totalGCo2e / constants.laptopHourGCo2e,
    drivingKm: totalGCo2e / constants.drivingKmGCo2e,
  };
}

export function formatSmartphoneCharges(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "Unavailable";
  if (number < 0.01) return "<0.01 charges";
  if (number < 1) return `${(number * 100).toFixed(number < 0.1 ? 1 : 0)}%`;
  return `${number < 10 ? number.toFixed(2) : number.toFixed(1)} charges`;
}

export function formatLaptopUsage(hours) {
  const number = Number(hours);
  if (!Number.isFinite(number)) return "Unavailable";
  const seconds = number * 3600;
  if (seconds < 1) return "<1 second";
  if (seconds < 60) return `${seconds.toFixed(seconds < 10 ? 1 : 0)} seconds`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(minutes < 10 ? 1 : 0)} minutes`;
  return `${number.toFixed(number < 10 ? 1 : 0)} hours`;
}

export function formatDrivingDistance(km) {
  const number = Number(km);
  if (!Number.isFinite(number)) return "Unavailable";
  if (number < 1) return `${Math.max(0.01, number * 1000).toFixed(number * 1000 < 10 ? 1 : 0)} meters`;
  return `${number.toFixed(number < 10 ? 2 : 1)} km`;
}
