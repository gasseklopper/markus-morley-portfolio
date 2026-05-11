import type { Fragment, HomeHeroPatternKey } from "./home-hero.patterns";

export type TrailImage = {
  element: HTMLElement;
  rotation?: number;
  removeTime: number;
  isFlame?: boolean;
  fragments?: Fragment[];
  pattern?: HomeHeroPatternKey;
};

export const createHomeHeroState = () => ({
  trail: [] as TrailImage[],
  imagePool: [] as HTMLElement[],
});
