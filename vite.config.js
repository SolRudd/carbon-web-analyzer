// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr'; // ✅ Make sure this line is added

export default defineConfig({
  plugins: [react(), svgr()], // ✅ Add svgr here
});

