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
    let toX = gsap.quickTo(cursorEl, "x", {
      duration: 0.2,
      ease: "power3.out",
    });
    let toY = gsap.quickTo(cursorEl, "y", {
      duration: 0.2,
      ease: "power3.out",
    });

    const resetQuickTo = () => {
      toX = gsap.quickTo(cursorEl, "x", {
        duration: 0.2,
        ease: "power3.out",
      });
      toY = gsap.quickTo(cursorEl, "y", {
        duration: 0.2,
        ease: "power3.out",
      });
    };

    const handleMove = (e: MouseEvent) => {
      toX(e.clientX);
      toY(e.clientY);
    };

    const handleLeave = () => {
      gsap.to(cursorEl, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        duration: 0.6,
        ease: "power3.inOut",
      });
    };

    const handleEnter = () => {
      toX = gsap.quickTo(cursorEl, "x", {
        duration: 0.6,
        ease: "power3.inOut",
      });
      toY = gsap.quickTo(cursorEl, "y", {
        duration: 0.6,
        ease: "power3.inOut",
      });
      gsap.delayedCall(0.6, resetQuickTo);
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
