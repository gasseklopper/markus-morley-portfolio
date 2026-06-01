import type { ThemePreferences } from "./types";

export const themePreferences = {
  light: "light",
  dark: "dark",
  theme: "miami",
  cursor: "true",
  layout: "fullwidth",
  layoutDirection: "ltr",
  overlay: "off",
  motion: "normal",
} as const satisfies ThemePreferences;
