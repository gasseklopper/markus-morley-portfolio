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
  plugins: [],
};
