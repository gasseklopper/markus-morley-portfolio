import { component$ } from "@builder.io/qwik";

/** Overlay component that covers the screen when `data-overlay="on"` is set on
 * the document root. The element itself ignores pointer events. */
export const Overlay = component$(() => {
  return <div class="overlay" />;
});

export default Overlay;
