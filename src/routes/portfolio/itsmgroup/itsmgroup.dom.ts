export const queryItsmgroupDom = (root: HTMLElement) => ({
  progressBar: root.querySelector<HTMLElement>("[data-progress]"),
  hero: root.querySelector<HTMLElement>("[data-hero]"),
  heroTitle: root.querySelector<HTMLElement>("[data-hero-title]"),
  heroLines: root.querySelectorAll<HTMLElement>("[data-hero-line]"),
  heroPanels: root.querySelectorAll<HTMLElement>("[data-hero-panel]"),
  revealItems: root.querySelectorAll<HTMLElement>("[data-reveal]"),
  sections: root.querySelectorAll<HTMLElement>("[data-process-section]"),
  numbers: root.querySelectorAll<HTMLElement>("[data-number]"),
  systemNodes: root.querySelectorAll<HTMLElement>("[data-system-node]"),
  systemLines: root.querySelectorAll<HTMLElement>("[data-system-line]"),
  stackCards: root.querySelectorAll<HTMLElement>("[data-stack-card]"),
  reelSection: root.querySelector<HTMLElement>("[data-reel-section]"),
  reelTrack: root.querySelector<HTMLElement>("[data-reel-track]"),
  finale: root.querySelector<HTMLElement>("[data-finale]"),
  finaleItems: root.querySelectorAll<HTMLElement>("[data-finale-item]"),
});

export type ItsmgroupDom = ReturnType<typeof queryItsmgroupDom>;
