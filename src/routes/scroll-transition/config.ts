export const scrollTransitionConfig = {
  svgNamespace: "http://www.w3.org/2000/svg",
  touchPointerQuery: "(pointer: coarse)",
  resizeDebounce: 250,
} as const;

export const getScrollTransitionGridCols = () => {
  if (window.innerWidth <= 599) return 6;
  if (window.innerWidth <= 1024) return 10;
  return 14;
};
