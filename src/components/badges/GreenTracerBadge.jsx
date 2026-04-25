import React from "react";
import { AlertCircle, Check, Clock, Minus } from "lucide-react";
import {
  formatCo2PerPage,
  getBadgeLabel,
  normalizeMetricValue,
  normalizePublicBadgeStatus,
} from "../../lib/badges/formatters";

const VARIANT_STYLES = {
  compact: {
    width: 248,
    height: 40,
    icon: 18,
    label: "text-[12.5px]",
    metric: "text-[11px]",
    gap: "gap-2",
    px: "px-[14px]",
  },
  standard: {
    width: 310,
    height: 50,
    icon: 22,
    label: "text-sm",
    metric: "text-[12.5px]",
    gap: "gap-3",
    px: "px-[17px]",
  },
};

const STATUS_STYLES = {
  verified: {
    iconBg: "bg-emerald-500",
    iconText: "text-emerald-950",
    border: "border-emerald-400/45",
  },
  pending: {
    iconBg: "bg-amber-500",
    iconText: "text-amber-950",
    border: "border-amber-400/40",
  },
  inactive: {
    iconBg: "bg-slate-500",
    iconText: "text-white",
    border: "border-slate-500/40",
  },
  unavailable: {
    iconBg: "bg-slate-600",
    iconText: "text-slate-100",
    border: "border-slate-600/50",
  },
};

function StatusIcon({ status, size }) {
  const iconSize = Math.max(12, Math.round(size * 0.62));
  if (status === "verified") return <Check size={iconSize} strokeWidth={2.4} aria-hidden="true" />;
  if (status === "pending") return <Clock size={iconSize} strokeWidth={2.2} aria-hidden="true" />;
  if (status === "inactive") return <Minus size={iconSize} strokeWidth={2.4} aria-hidden="true" />;
  return <AlertCircle size={iconSize} strokeWidth={2.1} aria-hidden="true" />;
}

export default function GreenTracerBadge({
  variant = "compact",
  status = "verified",
  metric = null,
  metricText = "",
  domain = "",
  href = "",
  label = "",
  showMetric = true,
  className = "",
  ariaLabel = "",
}) {
  const normalizedStatus = normalizePublicBadgeStatus(status);
  const config = VARIANT_STYLES[variant] || VARIANT_STYLES.compact;
  const visual = STATUS_STYLES[normalizedStatus] || STATUS_STYLES.unavailable;
  const metricValue = normalizeMetricValue(metric);
  const resolvedMetricText = metricText || formatCo2PerPage(metricValue);
  const shouldShowMetric = Boolean(showMetric && normalizedStatus === "verified" && resolvedMetricText);
  const resolvedLabel = label || getBadgeLabel(normalizedStatus);
  const title = ariaLabel || `${resolvedLabel}${domain ? ` for ${domain}` : ""}`;

  const frame = (
    <span
      className={[
        "inline-flex max-w-full items-center overflow-hidden rounded-full border bg-[#07111f] text-slate-50 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.9)]",
        "bg-[linear-gradient(135deg,#0d1b2e_0%,#07111f_58%,#081a18_100%)]",
        visual.border,
        config.px,
        config.gap,
        className,
      ].join(" ")}
      style={{
        width: config.width,
        height: config.height,
        letterSpacing: 0,
      }}
      aria-label={title}
    >
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full ${visual.iconBg} ${visual.iconText}`}
        style={{ width: config.icon, height: config.icon }}
      >
        <StatusIcon status={normalizedStatus} size={config.icon} />
      </span>

      <span className={`min-w-0 flex-1 truncate font-semibold leading-none ${config.label}`}>
        {resolvedLabel}
      </span>

      {shouldShowMetric && (
        <>
          <span className="h-[18px] w-px shrink-0 bg-slate-600/70" aria-hidden="true" />
          <span className={`shrink-0 whitespace-nowrap font-medium leading-none text-slate-300 ${config.metric}`}>
            {resolvedMetricText}
          </span>
        </>
      )}
    </span>
  );

  if (!href) return frame;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full no-underline"
      aria-label={title}
      title={title}
    >
      {frame}
    </a>
  );
}
