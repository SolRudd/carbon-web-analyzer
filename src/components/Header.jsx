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
      <div className="max-w-[1400px] mx-auto px-4 py-3 grid grid-cols-3 items-center">
        {/* Left Nav */}
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

        {/* Center Logo */}
        <Link to="/" className="flex justify-center">
          <img src={logo} alt="GreenTrace Logo" className="w-44 h-auto" />
        </Link>

        {/* Right Nav & Actions */}
        <div className="hidden md:flex justify-end items-center space-x-4">
          {/* Badge CTA */}
          <Link
            to="/badge"
            className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-green-400 dark:text-green-600 border border-green-600 rounded-full transition-all duration-200 hover:bg-green-600/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-20"
          >
            Get Badge
            <span className="absolute inset-0 rounded-full shadow-[0_0_12px_rgba(0,196,113,0.2)] opacity-0 hover:opacity-100 transition-opacity duration-200" />
          </Link>

          {/* API Access */}
          <Link
            to="/api-access"
            className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-full text-sm shadow-md transition-colors duration-200"
          >
            API Access
          </Link>

          {/* Theme Toggle */}
          <button
  onClick={() => setDarkMode(!darkMode)}
  className="
    p-2 rounded-full 
    bg-transparent 
    text-green-600 dark:text-green-400 
    hover:bg-green-600/10 dark:hover:bg-green-400/10 
    focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-30 
    transition-colors duration-200
  "
>
  {darkMode 
    ? <Sun  className="w-5 h-5" /> 
    : <Moon className="w-5 h-5" />
  }
</button>


          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-700 dark:text-slate-300" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="md:hidden bg-white dark:bg-[#020f1e] text-slate-900 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block text-base font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                setMenuOpen(false);
              }}
              className="mt-2 flex items-center gap-2 text-base bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-md transition-colors duration-200"
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