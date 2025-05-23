import { useState, useEffect } from "react";

export default function useTheme() {
  // On first render: try reading localStorage; fallback to light
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  const toggle = () => setIsDark(d => !d);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  return { isDark, toggle };
}
