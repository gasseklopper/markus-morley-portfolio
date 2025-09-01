/** @type {import('tailwindcss').Config} */
const path = require("path");
module.exports = {
  content: [
    path.join(__dirname, "index.html"),
    path.join(__dirname, "src/**/*.{ts,tsx,js,jsx,html,css,scss}"),
  ],
  theme: {
    extend: {
      screens: {
        xxl: "1536px",
      },
      colors: {
        blue: {
          500: "#3b82f6",
        },
        white: "#ffffff",
      },
      spacing: {
        4: "1rem",
        8: "2rem",
      },
    },
  },
  safelist: [
    "bg-blue-500",
    "text-white",
    "p-4",
    "mt-8",
    "gap-4",
    "grid",
    "grid-cols-1",
    "xxl:grid-cols-4",
  ],
  plugins: [],
};
