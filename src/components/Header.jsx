import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="w-full bg-[#020f1e] text-white py-5 px-4 border-b border-slate-800 shadow-sm">
    <div className="max-w-[1400px] mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        🌿 <span className="text-green-400">Carbon Web Checker</span>
      </h1>
      <nav className="space-x-6 text-sm font-medium">
        <Link to="/" className="text-slate-300 hover:text-white transition">
          Home
        </Link>
        <Link to="/how-it-works" className="text-slate-300 hover:text-white transition">
          How it Works
        </Link>
        <Link to="/faq" className="text-slate-300 hover:text-white transition">
  FAQ
</Link> 
<Link to="/badge" className="text-slate-300 hover:text-white transition">Badge</Link>
<Link to="/api-access" className="text-slate-300 hover:text-white transition">
  API Access
</Link>

      </nav>
    </div>
  </header>
);

export default Header;





