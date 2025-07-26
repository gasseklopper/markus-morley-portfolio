import { component$, $, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export const ThemeToggle = component$(() => {
  const isDark = useSignal(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      isDark.value = true;
      document.documentElement.classList.add("dark");
    }
  });

  const toggle$ = $(() => {
    isDark.value = !isDark.value;
    if (isDark.value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  return (
    <button type="button" onClick$={toggle$}>
      {isDark.value ? "Light" : "Dark"} Mode
    </button>
  );
});

export default ThemeToggle;
