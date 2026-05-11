import type { DynamicButtonZone } from "./dom";
import type { DynamicButtonsState } from "./state";

export const cleanupDynamicButtons = (
  gsap: typeof import("gsap").gsap,
  zones: DynamicButtonZone[],
  state: DynamicButtonsState,
) => {
  state.wiggles.forEach((tween) => tween.kill());
  zones.forEach(({ button, label }) => {
    gsap.killTweensOf(button);
    gsap.killTweensOf(label);
  });
};
