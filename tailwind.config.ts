import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  safelist: [
    "bg-[var(--brand)]",
    "bg-[var(--brand-core)]",
    "bg-[var(--brand-inverted)]",
    "bg-[var(--brand-inverted-highlight1)]",
    "bg-[var(--brand-inverted-highlight2)]",
    "bg-[var(--primary)]",
    "bg-[var(--secondary)]",
    "bg-[var(--tertiary)]",
    "bg-[var(--quaternary)]",
    "bg-[var(--text1)]",
    "bg-[var(--text2)]",
    "bg-[var(--text3)]",
    "bg-[var(--text4)]",
    "bg-[var(--surface1)]",
    "bg-[var(--surface2)]",
    "bg-[var(--surface3)]",
    "bg-[var(--surface4)]",
    "bg-[var(--surface5)]",
    "bg-[var(--surface6)]",
    "bg-[var(--surface7)]",
    "bg-[var(--surface8)]",
    "bg-[var(--surface-shadow)]",
    "bg-[var(--shadow-strength)]",
    "bg-[var(--color-bg)]",
    "bg-[var(--color-text)]",
    "bg-[var(--color-primary)]",
    "bg-[var(--cursor-color)]",
  ],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        "brand-core": "var(--brand-core)",
        "brand-inverted": "var(--brand-inverted)",
        "brand-inverted-highlight1": "var(--brand-inverted-highlight1)",
        "brand-inverted-highlight2": "var(--brand-inverted-highlight2)",

        primary: "var(--primary)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        quaternary: "var(--quaternary)",

        text1: "var(--text1)",
        text2: "var(--text2)",
        text3: "var(--text3)",
        text4: "var(--text4)",

        surface1: "var(--surface1)",
        surface2: "var(--surface2)",
        surface3: "var(--surface3)",
        surface4: "var(--surface4)",
        surface5: "var(--surface5)",
        surface6: "var(--surface6)",
        surface7: "var(--surface7)",
        surface8: "var(--surface8)",

        "surface-shadow": "var(--surface-shadow)",
      },
      boxShadow: {
        token:
          "0 10px 30px calc(var(--shadow-strength, 0.1)*1px) var(--surface-shadow)",
      },
    },
  },
  plugins: [],
} as Config;
