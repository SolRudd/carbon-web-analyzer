export const API_BASE =
  import.meta.env.VITE_API_URL?.trim()
    ? import.meta.env.VITE_API_URL
    : "https://carbon-web-analyzer-cisn.onrender.com";