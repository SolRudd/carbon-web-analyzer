/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepblue: "#020f1e",
        buzzgreen: "#00c471", // Your green
      },
      fontFamily: {
        outfit: ["'Outfit'", "sans-serif"],
      },
    },
  },
  plugins: [],
};


  