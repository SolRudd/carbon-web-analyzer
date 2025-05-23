/** @type {import('tailwindcss').Config} */
module.exports = {
  // We use class-based dark mode so that light is the default
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm:      "2rem",
          lg:      "3rem",
          xl:      "4rem",
          "2xl":   "5rem",
        },
        screens: {
          "2xl": "1440px",
        },
      },
      colors: {
        // Your greenbuzz branding
        greenbuzz: {
          DEFAULT: "#00c471",
          light:   "#1de29d",
          dark:    "#009c5d",
        },
      },
      backgroundImage: {
        "glow-green": "radial-gradient(circle at center, rgba(0, 196, 113, 0.2) 0%, transparent 70%)",
      },
      boxShadow: {
        "green-glow": "0 0 60px rgba(0, 196, 113, 0.15)",
      },
    },
  },

  plugins: [
    // e.g. require("@tailwindcss/forms"),
  ],
};
