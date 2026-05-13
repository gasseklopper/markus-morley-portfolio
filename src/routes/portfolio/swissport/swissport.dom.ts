export const querySwissportDom = (root: HTMLElement) => ({
  progressBar: root.querySelector<HTMLElement>("[data-progress]"),
  hero: root.querySelector<HTMLElement>("[data-hero]"),
  heroTitle: root.querySelector<HTMLElement>("[data-hero-title]"),
  heroLines: root.querySelectorAll<HTMLElement>("[data-hero-line]"),
  metaItems: root.querySelectorAll<HTMLElement>("[data-meta-item]"),
  sections: root.querySelectorAll<HTMLElement>("[data-section]"),
  revealItems: root.querySelectorAll<HTMLElement>("[data-reveal]"),
  numberItems: root.querySelectorAll<HTMLElement>("[data-number]"),
  mapSection: root.querySelector<HTMLElement>("[data-map-section]"),
  mapNodes: root.querySelectorAll<HTMLElement>("[data-map-node]"),
  routeLines: root.querySelectorAll<HTMLElement>("[data-route-line]"),
  reelSection: root.querySelector<HTMLElement>("[data-reel-section]"),
  reelTrack: root.querySelector<HTMLElement>("[data-reel-track]"),
  screenshots: root.querySelectorAll<HTMLElement>("[data-screenshot]"),
  finale: root.querySelector<HTMLElement>("[data-finale]"),
  finaleItems: root.querySelectorAll<HTMLElement>("[data-finale-item]"),
});

export type SwissportDom = ReturnType<typeof querySwissportDom>;
