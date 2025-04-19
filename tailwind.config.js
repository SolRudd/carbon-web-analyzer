/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ Enable class-based dark mode!
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
          "2xl": "1440px", // 💡 set your global max width here
        },
      },
    },
  },
  plugins: [],
};
