/* src/components/Header.jsx */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/GreenTraceLogo.svg";
import { Menu, X, Sun, Moon } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-50 w-full
      bg-white dark:bg-[#020f1e]
      text-slate-900 dark:text-white
      border-b border-slate-200 dark:border-slate-800
      shadow-md backdrop-blur
      transition-colors duration-300
    ">
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left Nav */}
        <div className="hidden md:flex space-x-6 text-sm font-medium">
          <Link to="/" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">Home</Link>
          <Link to="/how-it-works" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">How it Works</Link>
          <Link to="/faq" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">FAQ</Link>
        </div>

        {/* Center Logo */}
        <Link to="/" className="flex items-center justify-center">
          <img src={logo} alt="GreenTrace Logo" className="w-24 h-auto" />
        </Link>

        {/* Right Nav + Theme Toggle */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/badge" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm transition-colors duration-200">Badge</Link>
          <Link to="/api-access" className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-md text-sm shadow-md transition-colors duration-200">API Access</Link>
          <button onClick={() => setDarkMode(!darkMode)} className="text-xl p-2 text-slate-900 dark:text-white transition-colors duration-200">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-slate-900 dark:text-white transition-colors duration-200" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden
          bg-white dark:bg-[#031322]
          text-slate-900 dark:text-slate-300
          px-4 pb-4 space-y-4 text-sm font-medium
          transition-colors duration-300
        ">
          <Link to="/" className="block hover:text-slate-900 dark:hover:text-white transition-colors duration-200">Home</Link>
          <Link to="/how-it-works" className="block hover:text-slate-900 dark:hover:text-white transition-colors duration-200">How it Works</Link>
          <Link to="/faq" className="block hover:text-slate-900 dark:hover:text-white transition-colors duration-200">FAQ</Link>
          <Link to="/badge" className="block hover:text-slate-900 dark:hover:text-white transition-colors duration-200">Badge</Link>
          <Link to="/api-access" className="block bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-center shadow-sm transition-colors duration-200">API Access</Link>
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex justify-center text-lg text-slate-900 dark:text-white transition-colors duration-200">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
