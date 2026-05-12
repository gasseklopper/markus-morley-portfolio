export const queryTreemapDom = (root: HTMLElement) => ({
  container: root.querySelector<HTMLDivElement>("#treemap-container"),
  legend: root.querySelector<HTMLDivElement>("#legend"),
  tooltip: root.querySelector<HTMLDivElement>("#tooltip"),
});
