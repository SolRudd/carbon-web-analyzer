import React from "react";

const Footer = () => (
  <footer
    className="
      w-full 
      bg-white dark:bg-[#020f1e] 
      text-slate-700 dark:text-slate-400 
      text-sm py-10 
      transition-colors duration-300
    "
  >
    <div className="max-w-[1400px] mx-auto px-4 text-center">
      <p>
        © {new Date().getFullYear()} <strong>Carbon Web Checker</strong>. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;



  

