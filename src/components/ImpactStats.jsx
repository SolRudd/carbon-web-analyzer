// src/components/ImpactStats.jsx
import React, { useState } from "react";
import {
  FaCoffee,
  FaBolt,
  FaMobileAlt,
  FaTree,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const VIEW_OPTIONS = [1, 100, 1_000, 10_000, 100_000, 1_000_000];

export default function ImpactStats({ carbonPerView, siteUrl, grade }) {
  const [idx, setIdx] = useState(0); // default: 1 view/mo
  const monthlyViews = VIEW_OPTIONS[idx];

  // 1) Annual CO₂ in grams
  const annualCO2gRaw = carbonPerView * monthlyViews * 12;

  // 2) Display in g if <1000g, else kg
  const isKg = annualCO2gRaw >= 1000;
  const displayValue = isKg
    ? `${(annualCO2gRaw / 1000).toFixed(2)} kg`
    : `${Math.round(annualCO2gRaw)} g`;

  // 3) Equivalencies
  const cupsTea      = Math.round(annualCO2gRaw / 47.88);   // g per cup
  const kwhEnergy    = Math.round(annualCO2gRaw / 233);     // g per kWh
  const phoneCharges = Math.round(annualCO2gRaw / 11);      // g per phone charge
  const treesAbsorb  = Math.round(annualCO2gRaw / 21770);   // 21.77 kg = 21770 g

  // 4) Grade→colour map
  const colourMap = {
    "A+": "text-green-400",
    A:    "text-green-500",
    B:    "text-lime-400",
    C:    "text-yellow-400",
    D:    "text-orange-500",
    E:    "text-red-400",
    F:    "text-red-600",
  };
  const co2Class = colourMap[grade] || "text-gray-600";

  // 5) Pagination
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(VIEW_OPTIONS.length - 1, i + 1));

  return (
    <div className="mt-12 rounded-3xl p-8 bg-white dark:bg-slate-800 transition-colors">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        🌍 Your Annual Climate Impact
      </h2>

      {/* Selector */}
      <div className="flex items-center justify-center mb-8 space-x-4">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          <FaChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {monthlyViews.toLocaleString()} view{monthlyViews !== 1 && "s"} / month
        </div>
        <button
          onClick={next}
          disabled={idx === VIEW_OPTIONS.length - 1}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          <FaChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
      </div>

      {/* Main copy */}
      <div className="text-center mb-8">
        <p className="text-lg text-gray-800 dark:text-gray-200">
          Over a year, with{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {monthlyViews.toLocaleString()}
          </span>{' '}
          monthly page view{monthlyViews !== 1 && 's'},
        </p>
        <p className="text-lg text-gray-800 dark:text-gray-200">
          <a
            href={siteUrl}
            target="_blank"
            rel="noreferrer"
            className="underline text-blue-600 dark:text-blue-400"
          >
            {new URL(siteUrl).hostname}
          </a>{' '}
          produces
        </p>
        <p className={`text-3xl font-bold mt-2 ${co2Class}`}>{displayValue} CO₂</p>
      </div>

      {/* Equivalencies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col items-center">
          <FaCoffee className="w-12 h-12 text-yellow-400 mb-2" />
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            {cupsTea}
          </span>
          <span className="text-sm text-gray-700 dark:text-gray-300">cups of tea</span>
        </div>
        <div className="flex flex-col items-center">
          <FaBolt className="w-12 h-12 text-blue-500 mb-2" />
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            {kwhEnergy}
          </span>
          <span className="text-sm text-gray-700 dark:text-gray-300">kWh of energy</span>
        </div>
        <div className="flex flex-col items-center">
          <FaMobileAlt className="w-12 h-12 text-purple-500 mb-2" />
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            {phoneCharges}
          </span>
          <span className="text-sm text-gray-700 dark:text-gray-300">full phone charges</span>
        </div>
        <div className="flex flex-col items-center">
          <FaTree className="w-12 h-12 text-green-500 mb-2" />
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            {treesAbsorb}
          </span>
          <span className="text-sm text-gray-700 dark:text-gray-300">trees’ annual uptake</span>
        </div>
      </div>
    </div>
  );
}
