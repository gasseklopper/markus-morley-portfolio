import { component$, useVisibleTask$ } from "@builder.io/qwik";

export const LocalhostOutline = component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (import.meta.env.DEV) {
      document.body.style.outline = "8px solid red";
    }
  });

  return null;
});
