// src/components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/GreenTraceLogo.svg";
import { Menu, X, Sun, Moon } from "lucide-react";
import useTheme from "../hooks/useTheme";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/faq", label: "FAQ" },
  { to: "/badge", label: "Get Badge" },
  { to: "/api-access", label: "API Access" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  return (
    <>
      {/* Announcement Bar */}
      <div className="
        w-full bg-greenbuzz text-white text-center
        px-2 py-1 text-sm
        md:px-4 md:py-2 md:text-base
      ">
        {/* Mobile */}
        <span className="block md:hidden">
          New rating system — 
          <Link
            to="/rating"
            className="underline font-semibold hover:text-green-200"
          >
            learn more
          </Link>
        </span>
        {/* Desktop */}
        <span className="hidden md:block">
          We’ve added GreenTracer’s new rating system —{" "}
          <Link
            to="/rating"
            className="underline font-semibold hover:text-green-200"
          >
            read about it here
          </Link>
        </span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/60 dark:bg-[#020f1e]/60 backdrop-blur
                         border-b border-slate-200 dark:border-slate-800
                         transition-colors duration-300">
        <div className="relative max-w-[1400px] mx-auto flex items-center justify-between
                        px-4 py-3">
          {/* Mobile: logo on left */}
          <Link to="/" className="md:hidden flex-shrink-0">
            <img src={logo} alt="GreenTrace Logo" className="h-12" />
          </Link>

          {/* Desktop: left nav */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            {navLinks.slice(0, 3).map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-slate-700 dark:text-slate-300
                           hover:text-slate-900 dark:hover:text-white
                           transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop: centered logo */}
          <Link
            to="/"
            className="hidden md:block absolute left-1/2 top-1/2 transform
                       -translate-x-1/2 -translate-y-1/2"
          >
            <img src={logo} alt="GreenTrace Logo" className="h-12" />
          </Link>

          {/* Right controls */}
          <div className="flex items-center space-x-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-slate-700 dark:text-slate-300
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         transition-colors duration-200"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Desktop: CTAs */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/badge"
                className="relative inline-flex items-center px-3 py-2 text-sm font-medium
                           text-greenbuzz border border-greenbuzz rounded-full
                           hover:bg-greenbuzz hover:text-white
                           transition-colors duration-200"
              >
                Get Badge
                <span className="absolute inset-0 rounded-full
                                 shadow-[0_0_12px_rgba(0,196,113,0.2)]
                                 opacity-0 hover:opacity-100
                                 transition-opacity duration-200" />
              </Link>
              <Link
                to="/api-access"
                className="bg-greenbuzz hover:bg-greenbuzz/90 text-white
                           px-3 py-2 rounded-full text-sm shadow-md
                           transition-colors duration-200"
              >
                API Access
              </Link>
            </div>

            {/* Mobile: menu toggle */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-full text-slate-700 dark:text-slate-300
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav className="md:hidden bg-white dark:bg-[#020f1e]
                          border-t border-slate-200 dark:border-slate-800
                          shadow-lg rounded-b-lg">
            <div className="px-6 py-5 space-y-3">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="block text-base font-medium text-slate-900 dark:text-slate-300
                             px-4 py-2 rounded-md"
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => {
                  toggle();
                  setMenuOpen(false);
                }}
                className="mt-4 w-full flex justify-center items-center gap-2
                           bg-greenbuzz hover:bg-greenbuzz/90 text-white
                           px-3 py-2 rounded-md transition-colors duration-200"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                Toggle Theme
              </button>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
