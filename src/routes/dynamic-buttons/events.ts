import { on, type CleanupBag } from "~/utils/browserClient";
import { dynamicButtonConfig } from "./config";
import type { DynamicButtonZone } from "./dom";
import type { DynamicButtonsState } from "./state";

export const bindDynamicButtonEvents = (
  gsap: typeof import("gsap").gsap,
  zones: DynamicButtonZone[],
  state: DynamicButtonsState,
  cleanupBag: CleanupBag,
) => {
  zones.forEach(({ zone, button, label }) => {
    const mode = zone.dataset.mode ?? "auto";
    const overwrite =
      mode === "true" ? true : mode === "false" ? false : "auto";
    const isFalse = mode === "false";
    const hasWiggle = zone.dataset.wiggle === "true";

    if (hasWiggle) {
      state.wiggles.push(
        gsap.to(button, {
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

      gsap.to(button, {
        x: mapX * dynamicButtonConfig.strength,
        y: mapY * dynamicButtonConfig.strength,
        duration: isFalse ? 1.5 : 0.4,
        ease: "power2.out",
        overwrite,
      });

      gsap.to(label, {
        x: mapX * dynamicButtonConfig.labelStrength,
        y: mapY * dynamicButtonConfig.labelStrength,
        duration: isFalse ? 1.5 : 0.4,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const leave = () => {
      gsap.to(button, {
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
};
