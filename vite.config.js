// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // forward all /api/* to your backend
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      // if you ever load the badge script locally
      "/greentrace-badge.js": {
        target: "http://localhost:8080",
        changeOrigin: true,
      }
    },
  },
});
