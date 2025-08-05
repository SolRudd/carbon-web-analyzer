// src/config.js
// Pull from VITE_API_URL / VITE_RESULTS_URL or fall back to prod URLs.
export const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "https://api.greentracer.org"
).trim();

export const RESULTS_BASE = (
  import.meta.env.VITE_RESULTS_URL ||
  "https://www.greentracer.org"
).trim();