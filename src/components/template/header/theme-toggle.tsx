import { component$, $, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { themeStorageKey } from "../../theme/preference-scripts";
import siteConfig from "~/config/siteConfig.json";

export const ThemeToggle = component$(() => {
  const isDark = useSignal(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const stored = localStorage.getItem(themeStorageKey);
    if (stored === siteConfig.theme_preferences.dark) {
      isDark.value = true;
    }
    if (stored) {
      document.documentElement.setAttribute("data-theme", stored);
    }
  });

  const toggle$ = $(() => {
    isDark.value = !isDark.value;
    const newTheme = isDark.value
      ? siteConfig.theme_preferences.dark
      : siteConfig.theme_preferences.light;
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem(themeStorageKey, newTheme);
  });

  return (
    <button type="button" onClick$={toggle$}>
      {isDark.value ? "Light" : "Dark"} Mode
    </button>
  );
});

export default ThemeToggle;
