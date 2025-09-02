import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
} satisfies Config;
