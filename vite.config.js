import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward any /api/* calls to your Express backend
      "/api": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
    },
  },
});
