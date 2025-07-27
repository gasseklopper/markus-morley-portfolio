import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

/**
 * Animated cursor that follows the mouse. Visibility is controlled via
 * the `data-cursor` attribute on the document root which is toggled by the
 * preferences component.
 */
export const Cursor = component$(() => {
  const cursorRef = useSignal<HTMLDivElement>();

  // Track mouse movement on the client
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const cursorEl = cursorRef.value;
    if (!cursorEl) return;

    const handleMove = (e: MouseEvent) => {
      cursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("mousemove", handleMove);
    cleanup(() => window.removeEventListener("mousemove", handleMove));
  });

  return <div ref={cursorRef} class="cursor" />;
});

export default Cursor;
