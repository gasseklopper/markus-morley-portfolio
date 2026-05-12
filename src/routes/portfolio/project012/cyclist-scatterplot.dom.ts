export const queryCyclistScatterplotDom = (root: HTMLElement) => ({
  svg: root.querySelector<SVGSVGElement>(".project012__chart svg"),
  tooltip: root.querySelector<HTMLDivElement>(".project012__tooltip"),
  wrapper: root.querySelector<HTMLDivElement>(".project012__chart"),
});
