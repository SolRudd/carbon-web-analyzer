/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ Required for class-based dark mode
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "3rem",
          xl: "4rem",
          "2xl": "5rem",
        },
        screens: {
          "2xl": "1440px",
        },
      },

      // ✅ Optional: add custom green if you want more control later
      colors: {
        greenbuzz: {
          DEFAULT: "#00c471",
          light: "#1de29d",
          dark: "#009c5d",
        },
      },

      // ✅ Optional: radial & glow utility for full control
      backgroundImage: {
        'glow-green': "radial-gradient(circle at center, rgba(0, 196, 113, 0.2) 0%, transparent 70%)",
      },
      boxShadow: {
        'green-glow': "0 0 60px rgba(0, 196, 113, 0.15)",
      },
    },
  },
  plugins: [],
};
