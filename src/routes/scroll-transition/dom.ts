export const queryScrollTransitionDom = (root: HTMLElement) => ({
  texts: Array.from(root.querySelectorAll(".scroll-transition__text")),
  stage: root.querySelector(".scroll-transition__stage"),
  layers: root.querySelectorAll<SVGSVGElement>(".scroll-transition__layer"),
  progressFills: Array.from(
    root.querySelectorAll<HTMLElement>(".scroll-transition__fill"),
  ),
});
