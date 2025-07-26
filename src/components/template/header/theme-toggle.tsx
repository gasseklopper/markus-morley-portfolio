import { component$, useContext } from "@builder.io/qwik";
import { ThemeContext } from "~/context/theme-context";

export const ThemeToggle = component$(() => {
  const theme = useContext(ThemeContext);
  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick$={() =>
        (theme.value = theme.value === 'dark' ? 'light' : 'dark')
      }
    >
      {theme.value === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  );
});

export default ThemeToggle;
