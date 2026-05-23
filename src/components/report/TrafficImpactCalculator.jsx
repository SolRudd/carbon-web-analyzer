import React, { useMemo, useState } from "react";
import { Car, Laptop, Leaf, ShieldCheck, Smartphone } from "lucide-react";
import {
  TRAFFIC_VOLUME_PRESETS,
  calculateTrafficImpact,
  clampPercent,
  formatCarbonTotal,
  formatCompactNumber,
  formatDrivingDistance,
  formatLaptopUsage,
  formatSmartphoneCharges,
} from "../../lib/reportDisplay";

function EquivalentCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-[rgba(132,204,200,0.14)] bg-[linear-gradient(145deg,rgba(11,27,44,0.82),rgba(7,20,35,0.6))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,208,132,0.42),transparent)]" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#f5fbff]">{label}</h3>
          <p className="mt-1 text-xs leading-5 text-[#8fa6b8]">{detail}</p>
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#00d084]/20 bg-[#00d084]/10 text-[#00d084]">
          {React.createElement(Icon, { size: 18, "aria-hidden": true })}
        </span>
      </div>
      <p className="mt-4 text-xl font-semibold tabular-nums text-white">
        {value}
      </p>
    </article>
  );
}

export default function TrafficImpactCalculator({
  carbonPerView,
  percentile,
  className = "",
}) {
  const [selectedVolume, setSelectedVolume] = useState(1);
  const impact = useMemo(
    () => calculateTrafficImpact(carbonPerView, selectedVolume),
    [carbonPerView, selectedVolume]
  );
  const percentileValue = clampPercent(percentile);

  return (
    <section
      id="traffic-impact"
      className={`relative overflow-hidden rounded-[1.75rem] border border-[rgba(132,204,200,0.2)] bg-[linear-gradient(145deg,rgba(7,20,35,0.84),rgba(1,7,13,0.66))] p-5 shadow-[0_24px_80px_-58px_rgba(77,216,255,0.55)] sm:p-6 ${className}`}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-36 w-72 bg-[radial-gradient(circle_at_70%_20%,rgba(0,208,132,0.14),transparent_62%)]" />
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#00d084]/25 bg-[#00d084]/10 text-[#00d084]">
              <ShieldCheck size={23} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-[#f5fbff]">
                Model impact by traffic volume
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#8fa6b8]">
                See how this page-level estimate scales across different traffic volumes.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:max-w-[620px]">
          <p className="gt-report-mono mb-2 text-xs font-medium uppercase text-[#5f7285]">
            Traffic volume
          </p>
          <div className="-mx-1 flex gap-1 overflow-x-auto rounded-2xl border border-[rgba(132,204,200,0.16)] bg-[#020b13]/62 p-1" role="group" aria-label="Traffic volume">
            {TRAFFIC_VOLUME_PRESETS.map((preset) => {
              const active = selectedVolume === preset.value;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setSelectedVolume(preset.value)}
                  className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d084]/45 ${
                    active
                      ? "bg-[#00d084] text-[#02110b] shadow-[0_12px_34px_-24px_rgba(0,208,132,0.95)]"
                      : "text-[#b7c6d4] hover:bg-white/[0.04] hover:text-[#f5fbff]"
                  }`}
                  aria-pressed={active}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#02110b]" : "bg-[#00d084]/35"}`} />
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5 grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[1.35rem] border border-[#00d084]/18 bg-[linear-gradient(180deg,rgba(2,11,19,0.8),rgba(7,20,35,0.52))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="gt-report-mono text-[0.68rem] font-medium uppercase text-[#8fa6b8]">
                Estimated impact
              </p>
              <p className="mt-1 text-sm text-[#5f7285]">
                Based on this report's page-view estimate
              </p>
            </div>
            <span className="w-fit rounded-full border border-[rgba(132,204,200,0.16)] bg-[#071423]/72 px-3 py-1 text-xs font-semibold tabular-nums text-[#dbe8ef]">
              {formatCompactNumber(impact.views)} {impact.views === 1 ? "view" : "views"}
            </span>
          </div>

          <p className="mt-5 text-4xl font-semibold tabular-nums text-white sm:text-5xl">
            {formatCarbonTotal(impact.totalGCo2e)}
          </p>
          <div className="mt-4 grid gap-2 rounded-2xl border border-[rgba(132,204,200,0.12)] bg-[#020b13]/44 p-3 sm:grid-cols-2">
            <p className="text-sm text-[#8fa6b8]">
              <span className="block text-xs text-[#5f7285]">Per page view</span>
              <span className="font-semibold tabular-nums text-[#f5fbff]">{formatCarbonTotal(impact.carbonPerView)}</span>
            </p>
            <p className="text-sm text-[#8fa6b8]">
              <span className="block text-xs text-[#5f7285]">Modelled traffic</span>
              <span className="font-semibold tabular-nums text-[#f5fbff]">{formatCompactNumber(impact.views)} {impact.views === 1 ? "view" : "views"}</span>
            </p>
          </div>

          <div className="mt-3 inline-flex max-w-full items-center gap-3 rounded-full border border-[#00d084]/18 bg-[#00d084]/8 px-3 py-2">
            <Leaf className="shrink-0 text-[#00d084]" size={18} aria-hidden="true" />
            <p className="text-sm text-[#8fa6b8]">
              Cleaner than <span className="font-semibold tabular-nums text-[#f5fbff]">{percentileValue}%</span> of tested pages
            </p>
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-[rgba(132,204,200,0.14)] bg-[#020b13]/34 p-4">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="gt-report-mono text-[0.68rem] font-medium uppercase text-[#8fa6b8]">
                Equivalent approximations
              </p>
              <p className="mt-1 text-sm text-[#5f7285]">
                Contextual comparisons for the selected traffic volume.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <EquivalentCard
              icon={Smartphone}
              label="Smartphone charge"
              value={formatSmartphoneCharges(impact.smartphoneCharges)}
              detail={impact.smartphoneCharges < 1 ? "of a full charge" : "full charge equivalent"}
            />
            <EquivalentCard
              icon={Laptop}
              label="Laptop usage"
              value={formatLaptopUsage(impact.laptopHours)}
              detail="of use"
            />
            <EquivalentCard
              icon={Car}
              label="Driving"
              value={formatDrivingDistance(impact.drivingKm)}
              detail="in a typical car"
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-[#5f7285]">
            Equivalent values are approximate and provided for context, based on this report's page-view estimate.
          </p>
        </div>
      </div>
    </section>
  );
}
