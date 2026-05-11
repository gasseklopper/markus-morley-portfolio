export const queryHomeHeroDom = (root: HTMLElement) => ({
  heroSection: root.querySelector<HTMLElement>(".hero-section"),
  speedIndicator: root.querySelector<HTMLElement>(".speed-indicator"),
  effectLinks: Array.from(
    root.querySelectorAll<HTMLAnchorElement>("[data-effect]"),
  ),
});
