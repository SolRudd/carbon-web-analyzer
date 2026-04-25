import React from "react";

const DEFAULT_ACCENT = "#16A34A";
const DEFAULT_BG = "#FFFFFF";
const DEFAULT_TEXT = "#0F172A";

const isValidHexColor = (value) => /^#[0-9A-Fa-f]{6}$/.test(String(value || "").trim());

const hexToRgba = (hex, alpha) => {
  if (!isValidHexColor(hex)) return null;
  const clean = hex.trim().slice(1);
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function Checkmark({ accentColor }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M2 6.5L4.8 9.3L10 3"
        stroke={accentColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CompactTrustBadge({
  href = "",
  label,
  value,
  accentColor = DEFAULT_ACCENT,
  bgColor = DEFAULT_BG,
  textColor = DEFAULT_TEXT,
  className = "",
  ariaLabel = "GreenTracer badge",
}) {
  const cleanAccent = isValidHexColor(accentColor) ? accentColor.trim() : DEFAULT_ACCENT;
  const cleanBg = isValidHexColor(bgColor) ? bgColor.trim() : DEFAULT_BG;
  const cleanText = isValidHexColor(textColor) ? textColor.trim() : DEFAULT_TEXT;
  const borderColor = hexToRgba(cleanAccent, 0.28) || cleanAccent;
  const rightBg = hexToRgba(cleanAccent, 0.08) || "rgba(22, 163, 74, 0.08)";
  const labelColor = hexToRgba(cleanText, 0.5) || "rgba(15, 23, 42, 0.5)";

  const frame = (
    <div
      className={`inline-flex overflow-hidden rounded-[10px] border shadow-[0_4px_18px_-6px_rgba(15,23,42,0.14)] ${className}`}
      style={{ borderColor }}
    >
      <div
        className="flex flex-col gap-[2px] px-[13px] py-[8px]"
        style={{ backgroundColor: cleanBg, color: cleanText }}
      >
        <span
          className="whitespace-nowrap text-[7.5px] font-semibold uppercase tracking-[0.14em]"
          style={{
            color: labelColor,
            fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {label}
        </span>
        <div className="flex items-center gap-[5px] whitespace-nowrap text-[12px] font-medium tracking-[-0.01em]">
          <Checkmark accentColor={cleanAccent} />
          <span>{value}</span>
        </div>
      </div>

      <div
        className="flex items-center justify-center border-l px-[11px]"
        style={{ backgroundColor: rightBg, borderColor }}
      >
        <img
          src="/GreenTraceLogo.png"
          alt="GreenTracer"
          className="block h-[14px] w-auto"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );

  if (!href) {
    return <div aria-label={ariaLabel}>{frame}</div>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="inline-block no-underline"
      title={ariaLabel}
    >
      {frame}
    </a>
  );
}
