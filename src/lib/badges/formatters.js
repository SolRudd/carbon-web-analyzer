export const BADGE_TYPES = [
  "carbon_tested",
  "green_hosting",
  "greentracer_verified",
];

const BADGE_TYPE_ALIASES = {
  carbon: "carbon_tested",
  carbon_tested: "carbon_tested",
  tested: "carbon_tested",
  hosting: "green_hosting",
  "green-hosting": "green_hosting",
  green_hosting: "green_hosting",
  green_hosting_checked: "green_hosting",
  member: "greentracer_verified",
  verified: "greentracer_verified",
  greentracer_verified: "greentracer_verified",
};

export const PUBLIC_BADGE_STATUSES = [
  "active",
  "pending",
  "not_active",
  "green_hosting_not_detected",
  "licence_inactive",
  "domain_mismatch",
  "unavailable",
];

export const BADGE_LABELS = {
  pending: "Verification Pending",
  not_active: "Verified Not Active",
  green_hosting_not_detected: "Green Hosting",
  licence_inactive: "Verified Not Active",
  domain_mismatch: "Domain Mismatch",
  unavailable: "Verification Unavailable",
};

export const BADGE_TYPE_LABELS = {
  carbon_tested: {
    active: "Carbon Result",
    unavailable: "Carbon Result Unavailable",
    fullActive: "Carbon result by GreenTracer",
  },
  green_hosting: {
    active: "Green Hosting Detected",
    unavailable: "Hosting Not Confirmed",
    fullActive: "Green hosting evidence detected by GreenTracer",
  },
  greentracer_verified: {
    active: "GreenTracer Verified",
    unavailable: "Verification Unavailable",
    fullActive: "GreenTracer Verified",
  },
};

export const OFFICIAL_BADGE_SIZE = {
  width: 240,
  height: 44,
};

export function normalizePublicBadgeStatus(status) {
  const value = String(status || "").toLowerCase();
  if (value === "verified") return "active";
  if (value === "inactive") return "licence_inactive";
  if (value === "not-verified" || value === "not verified" || value === "not_verified") return "not_active";
  if (value === "green-hosting-not-detected" || value === "green hosting not detected") return "green_hosting_not_detected";
  return PUBLIC_BADGE_STATUSES.includes(value) ? value : "unavailable";
}

export function normalizeBadgeType(type) {
  const value = String(type || "").trim().toLowerCase().replace(/-/g, "_");
  return BADGE_TYPE_ALIASES[value] || "greentracer_verified";
}

export function getBadgeLabel(status, type = "greentracer_verified") {
  const publicStatus = normalizePublicBadgeStatus(status);
  const badgeType = normalizeBadgeType(type);
  if (publicStatus === "active") {
    return BADGE_TYPE_LABELS[badgeType]?.fullActive || BADGE_TYPE_LABELS.greentracer_verified.fullActive;
  }
  if (badgeType === "green_hosting" && publicStatus === "green_hosting_not_detected") {
    return "Green hosting checked by GreenTracer; evidence not confirmed";
  }
  if (badgeType === "carbon_tested") {
    return "Carbon result unavailable";
  }
  if (badgeType === "green_hosting") {
    return "Green hosting evidence not confirmed";
  }
  return BADGE_LABELS[publicStatus] || BADGE_LABELS.unavailable;
}

export function getBadgeVisibleLabel(status, type = "greentracer_verified") {
  const publicStatus = normalizePublicBadgeStatus(status);
  const badgeType = normalizeBadgeType(type);
  if (publicStatus === "active") {
    return BADGE_TYPE_LABELS[badgeType]?.active || BADGE_TYPE_LABELS.greentracer_verified.active;
  }
  if (badgeType === "green_hosting" && publicStatus === "green_hosting_not_detected") {
    return "Green Hosting Checked";
  }
  if (badgeType === "carbon_tested") {
    return BADGE_TYPE_LABELS.carbon_tested.unavailable;
  }
  if (badgeType === "green_hosting") {
    return BADGE_TYPE_LABELS.green_hosting.unavailable;
  }
  return BADGE_LABELS[publicStatus] || BADGE_LABELS.unavailable;
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

function normalizeHexColor(value) {
  const raw = String(value || "").trim();
  const short = raw.match(/^#?([0-9a-f]{3})$/i);
  if (short) {
    return `#${short[1].split("").map((char) => char + char).join("")}`.toLowerCase();
  }
  const long = raw.match(/^#?([0-9a-f]{6})$/i);
  return long ? `#${long[1].toLowerCase()}` : "";
}

function hexToRgb(hex) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return null;
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

function relativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const values = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * values[0]) + (0.7152 * values[1]) + (0.0722 * values[2]);
}

function contrastRatio(first, second) {
  const firstLum = relativeLuminance(first);
  const secondLum = relativeLuminance(second);
  if (firstLum === null || secondLum === null) return 0;
  const lighter = Math.max(firstLum, secondLum);
  const darker = Math.min(firstLum, secondLum);
  return (lighter + 0.05) / (darker + 0.05);
}

function getReadableTextColor(background) {
  return contrastRatio(background, "#f8fafc") >= contrastRatio(background, "#07111f") ? "#f8fafc" : "#07111f";
}

function mixHex(base, overlay, amount = 0.2) {
  const a = hexToRgb(base);
  const b = hexToRgb(overlay);
  if (!a || !b) return base;
  const mix = (from, to) => Math.round((from * (1 - amount)) + (to * amount));
  return `#${[mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function applyColorOverrides(baseColors, overrides = {}) {
  const background = normalizeHexColor(
    overrides.backgroundColor ||
    overrides.bgColor ||
    overrides.bg ||
    overrides.background
  );
  const accent = normalizeHexColor(overrides.accentColor || overrides.accent);
  const next = { ...baseColors };

  if (background) {
    const text = getReadableTextColor(background);
    if (contrastRatio(background, text) >= 4.5) {
      next.background = background;
      next.text = text;
      next.mutedText = text === "#f8fafc" ? "#a8b3c7" : "#475569";
      next.border = mixHex(background, text, text === "#f8fafc" ? 0.26 : 0.18);
    }
  }

  if (accent) {
    next.accent = accent;
    next.markText = getReadableTextColor(accent);
  }

  return next;
}

export function getBadgeColors(status = "active", type = "greentracer_verified", overrides = {}) {
  const publicStatus = normalizePublicBadgeStatus(status);
  const badgeType = normalizeBadgeType(type);
  let colors;
  if (publicStatus === "active" && badgeType === "carbon_tested") {
    colors = {
      background: "#07111f",
      border: "#075985",
      accent: "#38bdf8",
      text: "#f8fafc",
      mutedText: "#a8b3c7",
      markText: "#082f49",
    };
  } else if (publicStatus === "active" && badgeType === "green_hosting") {
    colors = {
      background: "#07111f",
      border: "#047857",
      accent: "#34d399",
      text: "#f8fafc",
      mutedText: "#a8b3c7",
      markText: "#03251a",
    };
  } else if (publicStatus === "active") {
    colors = {
      background: "#07111f",
      border: "#1f5f46",
      accent: "#22c55e",
      text: "#f8fafc",
      mutedText: "#a8b3c7",
      markText: "#03130d",
    };
  } else if (publicStatus === "pending") {
    colors = {
      background: "#07111f",
      border: "#7c5f24",
      accent: "#f59e0b",
      text: "#f8fafc",
      mutedText: "#a8b3c7",
      markText: "#111827",
    };
  } else if (publicStatus === "domain_mismatch") {
    colors = {
      background: "#111827",
      border: "#7c2d12",
      accent: "#f97316",
      text: "#f8fafc",
      mutedText: "#a8b3c7",
      markText: "#111827",
    };
  } else if (publicStatus === "licence_inactive") {
    colors = {
      background: "#111827",
      border: "#475569",
      accent: "#94a3b8",
      text: "#f8fafc",
      mutedText: "#a8b3c7",
      markText: "#0f172a",
    };
  } else if (publicStatus === "green_hosting_not_detected") {
    colors = {
      background: "#111827",
      border: "#475569",
      accent: "#94a3b8",
      text: "#f8fafc",
      mutedText: "#a8b3c7",
      markText: "#0f172a",
    };
  } else {
    colors = {
      background: "#111827",
      border: "#334155",
      accent: "#64748b",
      text: "#e2e8f0",
      mutedText: "#94a3b8",
      markText: "#f8fafc",
    };
  }

  return applyColorOverrides(colors, overrides);
}

export function getDefaultBadgeAccent(type = "greentracer_verified") {
  const badgeType = normalizeBadgeType(type);
  if (badgeType === "carbon_tested") return "#38bdf8";
  if (badgeType === "green_hosting") return "#34d399";
  return "#22c55e";
}
