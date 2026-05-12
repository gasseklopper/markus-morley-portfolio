export const cyclistScatterplotConfig = {
  dataUrl:
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
  maxWidth: 960,
  minWidth: 320,
  compactBreakpoint: 720,
  compactHeight: 480,
  fullHeight: 520,
  minInnerWidth: 200,
  compactMargin: { top: 72, right: 40, bottom: 136, left: 68 },
  fullMargin: { top: 84, right: 60, bottom: 124, left: 80 },
  compactDotRadius: 5,
  fullDotRadius: 6,
  compactTooltipOffset: 40,
  fullTooltipOffset: 32,
  legendGap: 28,
} as const;
