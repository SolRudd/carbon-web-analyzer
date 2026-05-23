import React from "react";
import {
  OFFICIAL_BADGE_SIZE,
  getBadgeColors,
  getBadgeLabel,
  getBadgeVisibleLabel,
  normalizePublicBadgeStatus,
} from "../../lib/badges/formatters";

export default function GreenTracerBadge({
  status = "active",
  badgeType = "greentracer_verified",
  domain = "",
  href = "",
  label = "",
  valueText = "",
  customColors = null,
  className = "",
  ariaLabel = "",
}) {
  const publicStatus = normalizePublicBadgeStatus(status);
  const colors = getBadgeColors(publicStatus, badgeType, customColors || {});
  const visibleLabel = label || getBadgeVisibleLabel(publicStatus, badgeType);
  const resolvedLabel = valueText && publicStatus === "active" ? `${visibleLabel} - ${valueText}` : visibleLabel;
  const fullLabel = getBadgeLabel(publicStatus, badgeType);
  const title = ariaLabel || `${fullLabel}${domain ? ` for ${domain}` : ""}`;

  const frame = (
    <span
      className={`inline-flex max-w-full items-center overflow-hidden border shadow-[0_12px_28px_-24px_rgba(2,6,23,0.95)] ${className}`}
      style={{
        width: `min(${OFFICIAL_BADGE_SIZE.width}px, 100%)`,
        height: OFFICIAL_BADGE_SIZE.height,
        backgroundColor: colors.background,
        borderColor: colors.border,
        color: colors.text,
        letterSpacing: 0,
        borderRadius: 10,
        padding: "0 12px 0 10px",
        gap: 12,
        boxSizing: "border-box",
      }}
      aria-label={title}
      role="img"
    >
      <span
        className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] text-[8.5px] font-extrabold leading-none"
        style={{
          backgroundColor: colors.accent,
          color: colors.markText,
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          boxShadow: colors.markText === "#f8fafc"
            ? "inset 0 0 0 1px rgba(248, 250, 252, 0.22)"
            : "inset 0 0 0 1px rgba(7, 17, 31, 0.18)",
        }}
        aria-hidden="true"
      >
        GT
      </span>
      <span className="flex min-w-0 flex-col justify-center leading-none">
        <span
          className="truncate text-[9px] font-bold leading-[1.05]"
          style={{ color: colors.mutedText, letterSpacing: 0 }}
        >
          GreenTracer
        </span>
        <span className="mt-1 truncate text-[12.5px] font-bold leading-[1.05]">
          {resolvedLabel}
        </span>
      </span>
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
