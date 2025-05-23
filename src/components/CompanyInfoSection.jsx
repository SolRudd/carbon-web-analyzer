// src/components/CompanyInfoSection.jsx
import React from "react";
import BuzzBoostImg from "../assets/buzzboost.svg";

export default function CompanyInfoSection() {
  return (
    <section
      id="company-info"
      className="py-20 px-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_5fr] items-center gap-8 md:gap-16">
        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <a
            href="https://buzzboost.co.uk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={BuzzBoostImg}
              alt="BuzzBoost Digital"
              className="h-24 md:h-28 w-auto"
            />
          </a>
        </div>

        {/* Text */}
        <div className="text-center md:text-left space-y-4 text-lg md:text-xl font-medium leading-relaxed">
          <p>
            This carbon calculator has been developed by{' '}
            <a
              href="https://buzzboost.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 font-semibold text-greenbuzz hover:text-greenbuzz-light transition-colors"
            >
              BuzzBoost Digital
            </a>{' '}
            to help inspire and educate users on creating a zero-carbon internet. It is hosted entirely on renewable energy.
          </p>
        </div>
      </div>
    </section>
  );
}
