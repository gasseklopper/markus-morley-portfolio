import { createCleanupBag, on } from "~/utils/browserClient";
import { loadGsap } from "~/utils/gsapClient";

export const setupDynamicButtons = async (root: HTMLElement) => {
  const { gsap } = await loadGsap({
    scrollTrigger: false,
    customEase: true,
    customWiggle: true,
  });

  const zones = Array.from(
    root.querySelectorAll<HTMLElement>(".dynamic-buttons__mag-zone"),
  );
  const cleanupBag = createCleanupBag();
  const strength = 0.4;
  const labelStrength = 0.24;
  const wiggles: any[] = [];

  zones.forEach((zone) => {
    const btn = zone.querySelector<HTMLElement>(".dynamic-buttons__mag-btn");
    const label = zone.querySelector<HTMLElement>(".dynamic-buttons__label");
    if (!btn || !label) return;

    const mode = zone.dataset.mode ?? "auto";
    const overwrite =
      mode === "true" ? true : mode === "false" ? false : "auto";
    const isFalse = mode === "false";
    const hasWiggle = zone.dataset.wiggle === "true";

    if (hasWiggle) {
      wiggles.push(
        gsap.to(btn, {
          rotation: 12,
          duration: 1.5,
          repeat: -1,
          ease: "wiggle({wiggles:8,type:easeOut})",
        }),
      );
    }

    const move = (event: MouseEvent) => {
      const rect = zone.getBoundingClientRect();
      const mapX = gsap.utils.mapRange(
        rect.left,
        rect.right,
        -rect.width / 2,
        rect.width / 2,
        event.clientX,
      );
      const mapY = gsap.utils.mapRange(
        rect.top,
        rect.bottom,
        -rect.height / 2,
        rect.height / 2,
        event.clientY,
      );

      gsap.to(btn, {
        x: mapX * strength,
        y: mapY * strength,
        duration: isFalse ? 1.5 : 0.4,
        ease: "power2.out",
        overwrite,
      });

      gsap.to(label, {
        x: mapX * labelStrength,
        y: mapY * labelStrength,
        duration: isFalse ? 1.5 : 0.4,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const leave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: isFalse ? 0.5 : 0.7,
        ease: isFalse ? "power2.out" : "elastic.out(1,0.4)",
        overwrite,
      });

      gsap.to(label, {
        x: 0,
        y: 0,
        duration: isFalse ? 0.5 : 0.7,
        ease: isFalse ? "power2.out" : "elastic.out(1,0.4)",
        overwrite: true,
      });
    };

    cleanupBag.add(on(zone, "mousemove", move));
    cleanupBag.add(on(zone, "mouseleave", leave));
  });

  return () => {
    cleanupBag.run();
    wiggles.forEach((tween) => tween.kill());
    zones.forEach((zone) => {
      const btn = zone.querySelector<HTMLElement>(".dynamic-buttons__mag-btn");
      const label = zone.querySelector<HTMLElement>(".dynamic-buttons__label");
      if (btn) gsap.killTweensOf(btn);
      if (label) gsap.killTweensOf(label);
    });
  };
};
