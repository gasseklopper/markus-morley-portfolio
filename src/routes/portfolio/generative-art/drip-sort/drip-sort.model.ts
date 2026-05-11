import { dripSortConfig } from "./drip-sort.config";

export type Drip = {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  shade: number;
};

export const randomShade = () =>
  Math.floor(Math.random() * dripSortConfig.shadeMax);

export const createDrip = (width: number, height: number): Drip => ({
  x: Math.random() * width,
  y: Math.random() * height - height,
  width: Math.random() * 20 + 10,
  height: Math.random() * 60 + 20,
  vy: Math.random() * 2 + 1,
  shade: randomShade(),
});

export const advanceDrip = (
  drip: Drip,
  sortedIndex: number,
  totalDrips: number,
  canvasWidth: number,
) => {
  const targetX = ((sortedIndex + 0.5) * canvasWidth) / totalDrips;
  drip.x += (targetX - drip.x) * 0.05;
  drip.y += drip.vy;
};

export const shouldRecycleDrip = (drip: Drip, canvasHeight: number) =>
  drip.y - drip.height > canvasHeight;
