import React, { useMemo } from "react";
import { Activity } from "lucide-react";
import {
  CARBON_GAUGE_ARC,
  formatCarbonValue,
  getGaugeArcPath,
  getGaugePoint,
  getGaugeScore,
  getGradeConfig,
  getGradeLabel,
} from "../../lib/reportDisplay";

const LABEL_SCORES = [0, 100];

function ScaleLabel({ score }) {
  const point = getGaugePoint(score, CARBON_GAUGE_ARC, CARBON_GAUGE_ARC.radius + 22);

  return (
    <text
      x={point.x}
      y={point.y}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="rgba(245,251,255,0.7)"
      fontSize="10"
      fontFamily="Inter, sans-serif"
      fontWeight="500"
    >
      {score}
    </text>
  );
}

export default function CarbonScoreGauge({
  grade,
  carbonPerView,
  percentile,
  className = "",
}) {
  const gradeLabel = getGradeLabel(grade);
  const config = getGradeConfig(gradeLabel);
  const score = getGaugeScore({ grade: gradeLabel, percentile });
  const fullArcPath = useMemo(() => getGaugeArcPath(0, 100), []);
  const activeArcPath = useMemo(() => getGaugeArcPath(0, score), [score]);
  const marker = useMemo(() => getGaugePoint(score), [score]);
  const gradientId = `gt-carbon-trace-${String(gradeLabel).replace(/\W/g, "").toLowerCase() || "na"}`;

  return (
    <aside
      className={`relative overflow-hidden rounded-[1.75rem] border border-[rgba(132,204,200,0.2)] bg-[linear-gradient(145deg,rgba(7,20,35,0.96),rgba(1,7,13,0.94))] p-5 shadow-[0_24px_90px_-54px_rgba(0,208,132,0.78)] ${className}`}
      aria-label={`Carbon grade ${gradeLabel}, score ${score} out of 100, ${config.impact}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,208,132,0.22),transparent_36%),radial-gradient(circle_at_82%_62%,rgba(77,216,255,0.12),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(132,204,200,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(132,204,200,0.055)_1px,transparent_1px)] [background-size:22px_22px]" />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-55" viewBox="0 0 420 320" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${gradientId}-signal`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4dd8ff" stopOpacity="0.02" />
            <stop offset="50%" stopColor="#00d084" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#00a19d" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <g fill="none" stroke={`url(#${gradientId}-signal)`} strokeWidth="1.1">
          <path d="M32 252 C88 202 132 196 188 218 S292 260 388 170" />
          <path d="M40 82 C112 120 174 108 236 78 S338 54 410 102" opacity="0.72" />
          <path d="M64 278 L132 222 L206 238 L278 178 L356 196" opacity="0.58" />
        </g>
        <g fill="#00d084">
          <circle cx="132" cy="222" r="2.2" opacity="0.48" />
          <circle cx="206" cy="238" r="2" opacity="0.32" />
          <circle cx="278" cy="178" r="2.4" opacity="0.42" />
          <circle cx="356" cy="196" r="1.8" opacity="0.28" />
        </g>
      </svg>

      <div className="relative z-10 flex items-center justify-between gap-4">
        <p className="gt-report-mono inline-flex items-center gap-2 rounded-full border border-[rgba(0,218,180,0.26)] bg-[#00d084]/10 px-3 py-1 text-[0.68rem] font-medium uppercase text-[#8df8ce]">
          <Activity size={13} aria-hidden="true" />
          Carbon intelligence
        </p>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-semibold tabular-nums text-[#b7c6d4]">
          {score}/100
        </span>
      </div>

      <div className="relative z-10 mx-auto mt-3 aspect-[1.08/1] w-full max-w-[390px]">
        <svg viewBox="0 0 260 238" className="h-full w-full" role="img" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="40" y1="180" x2="220" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={config.accent} />
              <stop offset="52%" stopColor={config.color} />
              <stop offset="100%" stopColor={config.color} />
            </linearGradient>
            <filter id={`${gradientId}-glow`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="130" cy="126" r="64" fill="rgba(2,11,19,0.62)" stroke="rgba(0,208,132,0.14)" />
          <circle cx="130" cy="126" r="77" fill="none" stroke="rgba(77,216,255,0.09)" strokeDasharray="2 7" />
          <circle cx="130" cy="126" r="46" fill="none" stroke="rgba(0,208,132,0.11)" strokeDasharray="3 8" />
          <path
            d="M 76 126 H 184"
            stroke="rgba(0,208,132,0.12)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M 130 72 V 180"
            stroke="rgba(0,208,132,0.12)"
            strokeWidth="1"
            strokeLinecap="round"
          />

          <path
            d={fullArcPath}
            fill="none"
            stroke="rgba(95,114,133,0.18)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {activeArcPath && (
            <path
              d={activeArcPath}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="18"
              strokeLinecap="round"
              filter={`url(#${gradientId}-glow)`}
            />
          )}

          {LABEL_SCORES.map((labelScore) => (
            <ScaleLabel key={labelScore} score={labelScore} />
          ))}

          <circle cx={marker.x} cy={marker.y} r="6.2" fill="#9effd8" />
          <circle cx={marker.x} cy={marker.y} r="13" fill={config.color} opacity="0.18" />
        </svg>

        <div className="pointer-events-none absolute inset-x-0 top-[37%] flex -translate-y-1/2 justify-center text-center">
          <p className="gt-report-mono rounded-full border border-white/10 bg-[#020b13]/70 px-3 py-1 text-[0.68rem] font-medium uppercase text-[#8fa6b8]">
            Carbon grade
          </p>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-[55%] flex -translate-y-1/2 justify-center text-center">
          <p
            className="text-5xl font-semibold leading-none sm:text-6xl xl:text-7xl"
            style={{ color: config.color }}
          >
            {gradeLabel}
          </p>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-[76%] flex -translate-y-1/2 flex-col items-center text-center">
          <p className="text-base font-semibold text-[#f5fbff]">{config.impact}</p>
          <p className="mt-1 text-sm text-[#8fa6b8]">
            {formatCarbonValue(carbonPerView)}g CO₂e per page view
          </p>
        </div>
      </div>
    </aside>
  );
}
