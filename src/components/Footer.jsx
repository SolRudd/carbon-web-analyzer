// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#020f1e] text-slate-400 text-sm py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>
          © {new Date().getFullYear()} <strong>Carbon Web Checker</strong>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;


  

