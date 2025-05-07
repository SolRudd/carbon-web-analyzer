// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-greenbuzz/20 text-slate-700 dark:text-slate-300 transition-colors duration-300 py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Left side: company info */}
          <div className="space-y-1 text-sm leading-snug">
            <p>BuzzBoost Digital, 26 Northview Drive</p>
            <p>Westcliff-on-Sea, Essex, United Kingdom SS0 9NG</p>
            <p>Company No: 15960977</p>
            <p>© {currentYear} BuzzBoost Digital</p>
          </div>

          {/* Right side: links */}
          <nav className="flex space-x-6 text-sm">
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
        </div>
      </div>
    </footer>
  );
}
