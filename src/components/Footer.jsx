// src/components/Footer.jsx
import React from "react";
import CarbonBadge from "./CarbonBadge";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-greenbuzz/20 text-slate-700 dark:text-slate-300 py-8 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* On mobile: flex-col & items-center; on md+: flex-row & items-center with justify-between */}
        <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center gap-6">
          {/* Address & Branding */}
          <div className="space-y-1 text-sm leading-snug text-center md:text-left">
            <p>BuzzBoost Digital, 26 Northview Drive</p>
            <p>Westcliff-on-Sea, Essex, SS0 9NG</p>
            <p>Company No: 15960977</p>
          </div>

          {/* Website Carbon Badge */}
          <CarbonBadge url="https://buzzboost.co.uk" />
        </div>

        {/* Footer Nav: center on mobile, left (start) on md+ */}
        <nav className="flex justify-center md:justify-start gap-6 text-sm mt-8">
          <a
            href="/how-it-works"
            className="text-greenbuzz hover:text-greenbuzz-light transition-colors"
          >
            How it works?
          </a>
          <a
            href="/privacy-policy"
            className="text-greenbuzz hover:text-greenbuzz-light transition-colors"
          >
            Privacy Policy
          </a>
        </nav>

        {/* Copyright centered always */}
        <p className="text-center text-sm text-slate-500 mt-6">
          © {year} BuzzBoost Digital
        </p>
      </div>
    </footer>
  );
}
