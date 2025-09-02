import { component$ } from "@builder.io/qwik";

/** Overlay component that covers the screen when `data-overlay="on"` is set on
 * the document root. The element itself ignores pointer events. */
export const Overlay = component$(() => {
  return (
    <div class="pointer-events-none fixed inset-0 z-[100] hidden bg-black/10 data-[overlay=on]:block" />
  );
});

export default Overlay;
