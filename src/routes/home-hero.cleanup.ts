import type { TrailImage } from "./home-hero.state";

export const cleanupHomeHeroTrail = (trail: TrailImage[]) => {
  trail.forEach((item) => item.element.remove());
  trail.length = 0;
};
