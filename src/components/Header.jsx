/* src/components/Header.jsx */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/GreenTraceLogo.svg";
import { Menu, X, Sun, Moon } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/faq", label: "FAQ" },
  { to: "/badge", label: "Get Badge" },
  { to: "/api-access", label: "API Access" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-50 bg-white/60 dark:bg-[#020f1e]/60 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Desktop nav links */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          {navLinks.slice(0, 3).map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="GreenTrace Logo" className="w-44 h-auto" />
        </Link>

        {/* Actions group */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle always visible (neutral color) */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="
              p-2 rounded-full
              text-slate-700 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800
              focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-30
              transition-colors duration-200
            "
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/badge"
              className="
                relative inline-flex items-center px-3 py-2 text-sm font-medium
                text-greenbuzz border border-greenbuzz rounded-full
                hover:bg-greenbuzz/10 hover:text-white
                focus:outline-none focus:ring-2 focus:ring-greenbuzz focus:ring-opacity-20
                transition-all duration-200
              "
            >
              Get Badge
              <span className="absolute inset-0 rounded-full shadow-[0_0_12px_rgba(0,196,113,0.2)] opacity-0 hover:opacity-100 transition-opacity duration-200" />
            </Link>
            <Link
              to="/api-access"
              className="
                bg-greenbuzz hover:bg-greenbuzz/90 text-white
                px-3 py-2 rounded-full text-sm shadow-md
                transition-colors duration-200
              "
            >
              API Access
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden bg-white dark:bg-[#020f1e] border-t border-slate-200 dark:border-slate-800 shadow-lg rounded-b-lg transition-colors duration-300">
          <div className="px-6 py-5 space-y-3">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="
                  block text-base font-medium text-slate-900 dark:text-slate-300
                  px-4 py-2 rounded-md
                  hover:bg-slate-100 dark:hover:bg-slate-700
                  transition-colors duration-200
                "
              >
                {label}
              </Link>
            ))}

            {/* Mobile theme toggle */}
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                setMenuOpen(false);
              }}
              className="
                mt-4 flex w-full justify-center items-center gap-2 text-base
                bg-greenbuzz hover:bg-greenbuzz/90 text-white
                px-3 py-2 rounded-md transition-colors duration-200
              "
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>Toggle Theme</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
