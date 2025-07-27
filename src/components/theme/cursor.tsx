import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

/**
 * Animated cursor that follows the mouse. Visibility is controlled via
 * the `data-cursor` attribute on the document root which is toggled by the
 * preferences component.
 */
export const Cursor = component$(() => {
  const x = useSignal(0);
  const y = useSignal(0);

  // Track mouse movement on the client
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const handleMove = (e: MouseEvent) => {
      x.value = e.clientX;
      y.value = e.clientY;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  });

  return (
    <div
      class="cursor"
      style={{ transform: `translate3d(${x.value}px, ${y.value}px, 0)` }}
    />
  );
});

export default Cursor;
