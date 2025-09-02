import { component$, $, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { themeStorageKey } from "../../theme/preference-scripts";

const themes = ["light", "dark", "neon", "pastell"] as const;
type Theme = typeof themes[number];

export const ThemeToggle = component$(() => {
  const current = useSignal<Theme>("light");

  const applyTheme = $( (name: Theme) => {
    current.value = name;
    document.documentElement.setAttribute("data-theme", name);
    localStorage.setItem(themeStorageKey, name);
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const stored = localStorage.getItem(themeStorageKey) as Theme | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const theme = stored && themes.includes(stored) ? stored : preferred;
    applyTheme(theme);
  });

  const toggle$ = $(() => {
    const idx = themes.indexOf(current.value);
    const next = themes[(idx + 1) % themes.length];
    applyTheme(next);
  });

  return (
    <button type="button" onClick$={toggle$}>
      {current.value.charAt(0).toUpperCase() + current.value.slice(1)} Mode
    </button>
  );
});

export default ThemeToggle;
