import { createCleanupBag, prefersReducedMotion } from "~/utils/browserClient";
import { loadGsap } from "~/utils/gsapClient";
import { cleanupDynamicButtons } from "./cleanup";
import { queryDynamicButtonDom } from "./dom";
import { bindDynamicButtonEvents } from "./events";
import { createDynamicButtonsState } from "./state";

export const setupDynamicButtons = async (root: HTMLElement) => {
  if (prefersReducedMotion()) {
    return () => undefined;
  }

  const { gsap } = await loadGsap({
    scrollTrigger: false,
    customEase: true,
    customWiggle: true,
  });

  const zones = queryDynamicButtonDom(root);
  const cleanupBag = createCleanupBag();
  const state = createDynamicButtonsState();

  bindDynamicButtonEvents(gsap, zones, state, cleanupBag);

  return () => {
    cleanupBag.run();
    cleanupDynamicButtons(gsap, zones, state);
  };
};
