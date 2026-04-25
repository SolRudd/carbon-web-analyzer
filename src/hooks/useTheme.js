import { useCallback, useLayoutEffect, useState } from "react";

const THEME_STORAGE_KEY = "theme";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getPreferredTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }
  } catch {
    return window.matchMedia?.(DARK_MEDIA_QUERY).matches ? "dark" : "light";
  }

  return window.matchMedia?.(DARK_MEDIA_QUERY).matches ? "dark" : "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  const root = document.documentElement;

  root.classList.toggle("dark", isDark);
  root.dataset.theme = theme;
  root.style.colorScheme = isDark ? "dark" : "light";

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    return;
  }
}

export default function useTheme() {
  const [theme, setTheme] = useState(getPreferredTheme);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-changing");

    applyTheme(theme);

    const frame = window.requestAnimationFrame(() => {
      root.classList.remove("theme-changing");
    });

    return () => {
      window.cancelAnimationFrame(frame);
      root.classList.remove("theme-changing");
    };
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  return { isDark: theme === "dark", theme, toggle };
}
