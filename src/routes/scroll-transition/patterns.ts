import { getScrollTransitionGridCols, scrollTransitionConfig } from "./config";

export type BlindSet = {
  cells: SVGRectElement[];
  rows: number;
  cols: number;
};

export const createBlinds = (group: SVGGElement | null): BlindSet | null => {
  if (!group) return null;

  group.innerHTML = "";

  const width = window.innerWidth;
  const height = window.innerHeight;
  const vbWidth = 100;
  const vbHeight = (height / width) * 100;
  const cols = getScrollTransitionGridCols();
  const rows = Math.max(1, Math.round(cols * (vbHeight / vbWidth)));
  const cellW = vbWidth / cols;
  const cellH = vbHeight / rows;
  const cells: SVGRectElement[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const rect = document.createElementNS(
        scrollTransitionConfig.svgNamespace,
        "rect",
      );
      rect.setAttribute("x", String(x * cellW));
      rect.setAttribute("y", String(y * cellH));
      rect.setAttribute("width", String(cellW));
      rect.setAttribute("height", String(cellH));
      rect.setAttribute("fill", "white");
      rect.setAttribute("shape-rendering", "crispEdges");
      rect.setAttribute("opacity", "0");

      group.appendChild(rect);
      cells.push(rect);
    }
  }

  return { cells, rows, cols };
};
