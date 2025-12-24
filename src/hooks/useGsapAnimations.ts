// src/hooks/useGsapAnimations.ts
import { useVisibleTask$ } from "@builder.io/qwik";
import { loadGsap } from "~/utils/gsapClient";

export const useGsapAnimations = () => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    // accessibility first
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { gsap, ScrollTrigger } = await loadGsap();
    const animations: any[] = [];

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-anim]"),
    );

    elements.forEach((el) => {
      const type = el.dataset.anim;

      // defaults
      const start = el.dataset.start ?? "top 85%";
      const end = el.dataset.end ?? "top 55%";
      const duration = Number(el.dataset.duration ?? 0.55);

      if (type === "reveal") {
        const y = Number(el.dataset.y ?? 18);

        animations.push(
          gsap.fromTo(
            el,
            { autoAlpha: 0, y },
            {
              autoAlpha: 1,
              y: 0,
              duration,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start,
                end,
                toggleActions: "play none play reverse",
              },
            },
          ),
        );
      }

      if (type === "fade") {
        animations.push(
          gsap.fromTo(
            el,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration,
              ease: "power1.out",
              scrollTrigger: {
                trigger: el,
                start,
                end,
                toggleActions: "play none play reverse",
              },
            },
          ),
        );
      }
    });

    cleanup(() => {
      animations.forEach((a) => a.kill());
      ScrollTrigger.getAll().forEach((t: { kill: () => any }) => t.kill());
    });
  });
};
