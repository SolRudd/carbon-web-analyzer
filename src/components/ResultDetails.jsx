import React from 'react';
import { Link } from 'react-router-dom';
import { FaLaptop, FaIndustry } from 'react-icons/fa';

export default function ResultDetails({
  carbonEstimate = 0,
  greenHost,
  reductionPct = 0,
  grade,
}) {
  // 1) CO₂ per view
  const co2 = Number(carbonEstimate).toFixed(2);

  // 2) Compute host savings %
  // Backend reductionPct is fraction (e.g. 0.09) if greenHosted, else 0
  const DEFAULT_POTENTIAL = 0.09; // 9% potential by switching
  const actualRaw = Number(reductionPct) || 0;
  const actualSavePct = Math.round(actualRaw <= 1 ? actualRaw * 100 : actualRaw);
  const potentialSavePct = Math.round(DEFAULT_POTENTIAL * 100);
  const savePct = greenHost ? actualSavePct : potentialSavePct;

  // 3) Grade thresholds → colours
  const THRESHOLDS = { 'A+': 0.095, A: 0.186, B: 0.341, C: 0.493, D: 0.656, E: 0.846 };
  let co2Grade = 'F';
  for (const [g, t] of Object.entries(THRESHOLDS)) {
    if (carbonEstimate <= t) {
      co2Grade = g;
      break;
    }
  }
  const gradeColourMap = {
    'A+': 'text-green-400', A: 'text-green-500', B: 'text-lime-400',
    C: 'text-yellow-400', D: 'text-orange-500', E: 'text-red-400', F: 'text-red-600',
  };
  const co2Class = gradeColourMap[co2Grade] || 'text-gray-600';

  // 4) Hosting text & icon colour
  const hostClass = greenHost
    ? 'text-greenbuzz dark:text-greenbuzz-light'
    : 'text-red-500';

  return (
    <section className="mt-12 max-w-4xl mx-auto px-4 space-y-12 text-slate-900 dark:text-white">
      {/* CO₂ per view */}
      <div className="flex items-center gap-6">
        <FaLaptop className="w-12 h-12 text-current" />
        <div>
          <h3 className="text-3xl sm:text-4xl font-bold">
            Oh my,&nbsp;
            <span className={co2Class}>{co2} g CO₂</span>
            &nbsp;is produced every time someone visits this page.
          </h3>
          <Link
            to="/how-it-works"
            className="underline mt-2 inline-block text-base text-blue-600 dark:text-blue-300"
          >
            How do we calculate this?
          </Link>
        </div>
      </div>

      {/* Hosting info */}
      <div className="flex items-center gap-6">
        <FaIndustry className={`w-9 h-9 ${hostClass}`} />
        <div>
          {greenHost ? (
            <>
              <h3 className={`text-3xl sm:text-4xl font-bold ${hostClass}`}>
                🎉 Great news! This site uses green hosting
              </h3>
              <p className="mt-1 text-lg">
                You’re saving&nbsp;
                <span className={`font-semibold ${hostClass}`}>{savePct}%</span>
                &nbsp;CO₂ compared to standard hosting.
              </p>
            </>
          ) : (
            <>
              <h3 className={`text-3xl sm:text-4xl font-bold ${hostClass}`}>
                ⚠️ Standard (non-green) hosting
              </h3>
              <p className="mt-1 text-lg">
                Switch to green hosting to save&nbsp;
                <span className={`font-semibold ${hostClass}`}>{savePct}%</span>
                &nbsp;CO₂.
              </p>
            </>
          )}
          <Link
            to="/how-it-works"
            className="underline mt-2 inline-block text-base text-blue-600 dark:text-blue-300"
          >
            How do we find this out?
          </Link>
        </div>
      </div>

      {/* Custom agency CTA */}
      <div className="text-center mt-8 space-y-2">
        <p className="font-bold text-2xl">Want to go deeper?</p>
        <p className="text-base text-slate-700 dark:text-slate-400">
          Contact us at{' '}
          <a
            href="https://buzzboost.co.uk"
            className="underline text-greenbuzz dark:text-greenbuzz-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            BuzzBoost Digital
          </a>
          &nbsp;for a bespoke carbon audit.
        </p>
      </div>
    </section>
  );
}
