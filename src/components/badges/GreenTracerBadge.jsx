import React from "react";
import {
  OFFICIAL_BADGE_SIZE,
  getBadgeColors,
  getBadgeLabel,
  getBadgeVisibleLabel,
  normalizePublicBadgeStatus,
} from "../../lib/badges/formatters";

const GREEN_TRACER_MARK_PATH =
  "M 251.546875 177.761719 C 231.953125 152.234375 216.277344 142.207031 187.519531 140.015625 C 142.855469 136.558594 104.1875 173.613281 104.1875 225.308594 C 104.1875 270.257812 136.285156 305.011719 170.171875 304.550781 C 202.273438 304.089844 219.273438 287.546875 227.800781 260.40625 L 228.378906 248.707031 L 207.285156 248.707031 C 192.648438 248.707031 187.75 265.476562 177.605469 287.546875 C 164.929688 261.328125 164.582031 250.839844 141.933594 231.359375 C 131.789062 222.425781 132.078125 196.894531 148.792969 196.894531 C 160.894531 196.894531 172.652344 216.664062 176.683594 234.703125 L 176.683594 251.875 L 178.527344 251.875 C 183.773438 230.726562 184.347656 225.597656 178.816406 208.191406 C 174.550781 193.898438 172.074219 179.894531 182.792969 179.605469 C 194.894531 179.320312 203.597656 190.097656 199.621094 202.542969 C 196.222656 213.898438 187.460938 223.695312 185.328125 233.492188 L 184.347656 241.15625 L 185.90625 240.234375 C 195.472656 228.304688 196.105469 226.863281 207.632812 216.03125 C 216.910156 207.386719 218.753906 188.539062 218.753906 188.539062 C 229.992188 188.539062 218.464844 219.082031 201.464844 231.648438 C 191.898438 238.734375 188.152344 245.476562 184.117188 255.96875 L 183.484375 258.789062 L 184.753906 258.789062 C 192.648438 246.804688 200.542969 236.832031 216.277344 236.832031 L 256.273438 236.832031 L 256.273438 325.007812 L 229.359375 325.007812 L 229.359375 304.894531 C 212.933594 323.453125 194.609375 331.175781 164.292969 330.253906 C 107.875 328.40625 69.203125 280.804688 69.203125 227.84375 C 69.203125 167.679688 119.34375 120.710938 167.695312 120.996094 L 173.574219 120.996094 C 212.933594 120.710938 237.425781 135.636719 255.0625 166.46875 Z M 251.546875 177.761719";

function GreenTracerMark({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="60 112 205 226"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d={GREEN_TRACER_MARK_PATH} />
    </svg>
  );
}

export default function GreenTracerBadge({
  status = "active",
  badgeType = "greentracer_verified",
  domain = "",
  href = "",
  label = "",
  valueText = "",
  customColors = null,
  className = "",
  cornerRadius = 10,
  borderStyle = "solid",
  showIcon = true,
  ariaLabel = "",
}) {
  const publicStatus = normalizePublicBadgeStatus(status);
  const colors = getBadgeColors(publicStatus, badgeType, customColors || {});
  const visibleLabel = label || getBadgeVisibleLabel(publicStatus, badgeType);
  const resolvedLabel = valueText && publicStatus === "active" ? `${visibleLabel} - ${valueText}` : visibleLabel;
  const fullLabel = getBadgeLabel(publicStatus, badgeType);
  const title = ariaLabel || `${fullLabel}${domain ? ` for ${domain}` : ""}`;
  const safeRadius = Math.min(18, Math.max(6, Number(cornerRadius) || 10));
  const resolvedBorderStyle = borderStyle === "dashed" || borderStyle === "none" ? borderStyle : "solid";

  const frame = (
    <span
      className={`inline-flex max-w-full items-center overflow-hidden border shadow-[0_12px_28px_-24px_rgba(2,6,23,0.95)] ${className}`}
      style={{
        width: `min(${OFFICIAL_BADGE_SIZE.width}px, 100%)`,
        height: OFFICIAL_BADGE_SIZE.height,
        backgroundColor: colors.background,
        borderColor: resolvedBorderStyle === "none" ? "transparent" : colors.border,
        borderStyle: resolvedBorderStyle,
        color: colors.text,
        letterSpacing: 0,
        borderRadius: safeRadius,
        padding: showIcon ? "0 12px 0 10px" : "0 14px",
        gap: showIcon ? 12 : 0,
        boxSizing: "border-box",
      }}
      aria-label={title}
      role="img"
    >
      {showIcon && (
        <span
          className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] leading-none"
          style={{
            backgroundColor: colors.accent,
            color: colors.markText,
            boxShadow: colors.markText === "#f8fafc"
              ? "inset 0 0 0 1px rgba(248, 250, 252, 0.22)"
              : "inset 0 0 0 1px rgba(7, 17, 31, 0.18)",
          }}
          aria-hidden="true"
        >
          <GreenTracerMark className="h-[18px] w-[18px]" />
        </span>
      )}
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
