// src/components/Footer.jsx
import React from "react";
import CarbonBadge from "./CarbonBadge";
import { Link } from "react-router-dom";

// import your optimized assets (generated earlier)
import logoPng from "../assets/GreenTraceLogo.png";
import logoWebp from "../assets/GreenTraceLogo.webp";
import logoAvif from "../assets/GreenTraceLogo.avif";

export default function Footer() {
  const year = new Date().getFullYear();

  // Safe in SSR/prerender too:
  const siteUrl =
    typeof window !== "undefined" && window.location
      ? window.location.origin
      : "";
  const badgeToken = import.meta.env.VITE_GREENTRACER_BADGE_TOKEN || "";

  return (
    <footer
      className="w-full bg-slate-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-12 transition-colors duration-300"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Top section with brand and badge */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand logo (linked to home) */}
          <Link
            to="/"
            aria-label="Go to homepage"
            className="justify-center md:justify-start inline-flex items-center"
          >
            <picture>
              <source srcSet={logoAvif} type="image/avif" />
              <source srcSet={logoWebp} type="image/webp" />
              <img
                src={logoPng}
                alt="GreenTrace"
                className="h-10 md:h-12 w-auto"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
              />
            </picture>
          </Link>

          <div className="min-h-[40px] flex items-center justify-center md:justify-end">
            <CarbonBadge url={siteUrl} token={badgeToken} variant="compact" />
          </div>
        </div>

        {/* Divider */}
        <hr className="my-10 border-green-700/20 dark:border-green-400/20" />

        {/* Footer navigation and copyright */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-6 text-sm"
          >
            <Link
              to="/how-it-works"
              className="hover:underline text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/license-status"
              className="hover:underline text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              License Status
            </Link>
            <Link
              to="/blog"
              className="hover:underline text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/faq"
              className="hover:underline text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/pricing"
              className="hover:underline text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:underline text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/badge"
              className="hover:underline text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              Badge
            </Link>
          </nav>

          <p className="text-center md:text-right text-xs text-gray-400 dark:text-gray-500">
            &copy; {year} GreenTrace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
