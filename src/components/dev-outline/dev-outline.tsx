import { component$, useVisibleTask$ } from "@builder.io/qwik";

export const LocalhostOutline = component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (import.meta.env.DEV) {
      document.body.style.boxShadow = "inset 0 0 0 8px red";
    }
  });

  return null;
});
