import { on, type CleanupBag } from "~/utils/browserClient";
import type { HomeHeroPatternKey } from "./home-hero.patterns";

export const bindHomeHeroEffectEvents = (
  effectLinks: HTMLAnchorElement[],
  setEffect: (effect: HomeHeroPatternKey) => void,
  cleanupBag: CleanupBag,
) => {
  const onEffectClick = (event: MouseEvent) => {
    event.preventDefault();
    const target = event.currentTarget as HTMLAnchorElement | null;
    if (!target) return;
    effectLinks.forEach((link) => link.classList.remove("active"));
    target.classList.add("active");
    setEffect(target.dataset.effect as HomeHeroPatternKey);
  };

  effectLinks.forEach((link) =>
    cleanupBag.add(on(link, "click", onEffectClick)),
  );
};
