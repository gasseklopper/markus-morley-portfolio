export const queryOststernDom = (root: HTMLElement) => ({
  progressBar: root.querySelector<HTMLElement>("[data-progress]"),
  hero: root.querySelector<HTMLElement>("[data-hero]"),
  heroTitle: root.querySelector<HTMLElement>("[data-hero-title]"),
  heroLines: root.querySelectorAll<HTMLElement>("[data-hero-line]"),
  metaItems: root.querySelectorAll<HTMLElement>("[data-meta-item]"),
  revealItems: root.querySelectorAll<HTMLElement>("[data-reveal]"),
  steps: root.querySelectorAll<HTMLElement>("[data-step]"),
  showcase: root.querySelector<HTMLElement>("[data-showcase]"),
  reelTrack: root.querySelector<HTMLElement>("[data-reel-track]"),
  devices: root.querySelectorAll<HTMLElement>("[data-device]"),
  parallaxItems: root.querySelectorAll<HTMLElement>("[data-parallax]"),
  finale: root.querySelector<HTMLElement>("[data-finale]"),
  finaleItems: root.querySelectorAll<HTMLElement>("[data-finale-item]"),
});

export type OststernDom = ReturnType<typeof queryOststernDom>;
