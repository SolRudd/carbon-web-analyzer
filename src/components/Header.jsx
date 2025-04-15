// src/components/Header.jsx
import React from "react";

const Header = () => (
  <header className="w-full bg-[#020f1e] text-white py-5 px-6 border-b border-slate-800 shadow-sm">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        🌿 <span className="text-green-400">Carbon Web Checker</span>
      </h1>
      <nav className="space-x-6 text-sm font-medium">
        <a href="#" className="text-slate-300 hover:text-white transition">Home</a>
        <a href="#" className="text-slate-300 hover:text-white transition">How it Works</a>
        <a href="#" className="text-slate-300 hover:text-white transition">About</a>
      </nav>
    </div>
  </header>
);

export default Header;



