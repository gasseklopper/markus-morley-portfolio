/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,html,css,scss}"],
  theme: {
    extend: {
      screens: {
        xxl: "1536px",
      },
    },
  },
  plugins: [],
};
