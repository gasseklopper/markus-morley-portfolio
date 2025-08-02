import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { gsap } from "gsap";

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

    // Use gsap.quickTo for smoother updates without creating a new tween
    const toX = gsap.quickTo(cursorEl, "x", {
      duration: 0.2,
      ease: "power3.out",
    });
    const toY = gsap.quickTo(cursorEl, "y", {
      duration: 0.2,
      ease: "power3.out",
    });

    const handleMove = (e: MouseEvent) => {
      toX(e.clientX);
      toY(e.clientY);
    };

    const handleLeave = () => {
      toX(window.innerWidth / 2);
      toY(window.innerHeight / 2);
    };

    const handleEnter = (e: MouseEvent) => {
      toX(e.clientX);
      toY(e.clientY);
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);
    cleanup(() => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    });
  });

  return <div ref={cursorRef} class="cursor" />;
});

export default Cursor;
