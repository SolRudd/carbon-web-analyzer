import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#020f1e] text-slate-400 text-sm py-10">
      <div className="max-w-[1400px] mx-auto px-4 text-center">
        <p>
          © {new Date().getFullYear()} <strong>Carbon Web Checker</strong>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;



  

