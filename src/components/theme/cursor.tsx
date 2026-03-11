import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { gsap } from "gsap";

/**
 * Animated cursor that follows the mouse. Visibility is controlled via
 * the `data-cursor` attribute on the document root which is toggled by the
 * preferences component.
 */
export const Cursor = component$(() => {
  const cursorRef = useSignal<HTMLDivElement>();
  const enabled = useSignal(true);

  // Observe changes to the `data-cursor` attribute and update the signal
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const update = () => {
      enabled.value =
        document.documentElement.getAttribute("data-cursor") !== "false";
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-cursor"],
    });
    cleanup(() => observer.disconnect());
  });

  // Track mouse movement on the client when enabled
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup, track }) => {
    track(() => enabled.value);
    const cursorEl = cursorRef.value;
    if (!cursorEl || !enabled.value) return;

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
    const particleEls = Array.from(
      cursorEl.querySelectorAll<HTMLElement>(".cursor__particle")
    );
    const burstParticles = () => {
      particleEls.forEach((particle, index) => {
        const angle = (Math.PI * 2 * index) / particleEls.length
        const distance = 14 + Math.random() * 16

        gsap.killTweensOf(particle)

        gsap.set(particle, {
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0,
        })

        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          scale: 4,
          opacity: 1,
          duration: 0.18,
          ease: "power2.out",
        })

        gsap.to(particle, {
          x: Math.cos(angle) * (distance + 8),
          y: Math.sin(angle) * (distance + 8),
          scale: 0,
          opacity: 0,
          duration: 0.35,
          delay: 0.08,
          ease: "power3.out",
        })
      })
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

    const growCursor = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()

      const paddingX = 16
      const paddingY = 8

      gsap.to(cursorEl, {
        width: rect.width + paddingX,
        height: rect.height + paddingY,
        duration: 0.25,
        ease: "power3.out",
      })

      burstParticles();
    };

    const resetCursor = () => {
      gsap.to(cursorEl, {
        width: 6,
        height: 6,
        duration: 0.25,
        ease: "power3.out",
      })
    }

    const hoverTargets = document.querySelectorAll(
      "a, button, [data-cursor-hover]"
    )

    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", growCursor)
      el.addEventListener("mouseleave", resetCursor)

      cleanup(() => {
        el.removeEventListener("mouseenter", growCursor)
        el.removeEventListener("mouseleave", resetCursor)
      })
    });

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);
    cleanup(() => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    });
  });



  return enabled.value ? (
    <div ref={cursorRef} class="cursor">
      <span class="cursor__particle" />
      <span class="cursor__particle" />
      <span class="cursor__particle" />
      <span class="cursor__particle" />
      <span class="cursor__particle" />
      <span class="cursor__particle" />
    </div>
  ) : null
});

export default Cursor;
