import { on, type CleanupBag } from "~/utils/browserClient";

export const bindTestCodexPointerEvents = (
  root: HTMLElement,
  gsap: typeof import("gsap").gsap,
  microCards: NodeListOf<HTMLElement>,
  cleanupBag: CleanupBag,
) => {
  const updatePointer = (event: PointerEvent) => {
    root.style.setProperty("--pointer-x", `${event.clientX}px`);
    root.style.setProperty("--pointer-y", `${event.clientY}px`);
  };

  cleanupBag.add(on(root, "pointermove", updatePointer));

  microCards.forEach((card) => {
    const image = card.querySelector<HTMLElement>("img");

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      gsap.to(card, {
        rotateX: y * -6,
        rotateY: x * 8,
        duration: 0.45,
        ease: "power2.out",
      });

      if (image) {
        gsap.to(image, {
          xPercent: x * -4,
          yPercent: y * -4,
          scale: 1.06,
          duration: 0.55,
          ease: "power2.out",
        });
      }
    };

    const handlePointerLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.65,
        ease: "elastic.out(1, 0.55)",
      });
      if (image) {
        gsap.to(image, {
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          duration: 0.65,
          ease: "power3.out",
        });
      }
    };

    cleanupBag.add(on(card, "pointermove", handlePointerMove));
    cleanupBag.add(on(card, "pointerleave", handlePointerLeave));
  });
};
