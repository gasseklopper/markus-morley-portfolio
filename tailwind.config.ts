import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,html,css,scss}"],
  theme: {
    extend: {
      screens: {
        xxl: "1536px",
      },
    },
  },
  plugins: [],
} satisfies Config;
