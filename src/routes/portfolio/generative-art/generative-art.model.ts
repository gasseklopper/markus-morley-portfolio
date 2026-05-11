import { generativeArtConfig } from "./generative-art.config";

export type Bubble = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
  highlight: string;
};

export const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r + 20}, ${g + 10}, ${b + 10})`;
};

export const createBubble = (width: number, height: number): Bubble => ({
  x: Math.random() * width,
  y: Math.random() * height,
  r: Math.random() * 33 + 5,
  vx: Math.random() * 2 - 1,
  vy: Math.random() * 2 - 1,
  color: randomColor(),
  highlight: randomColor(),
});

export const shouldRecycleBubble = (
  bubble: Bubble,
  width: number,
  height: number,
) =>
  bubble.x + bubble.r > width ||
  bubble.x - bubble.r < 0 ||
  bubble.y - bubble.r < 10 ||
  bubble.y + bubble.r > height ||
  bubble.r > generativeArtConfig.maxBubbleRadius;

export const advanceBubble = (bubble: Bubble) => {
  bubble.r = bubble.r + (generativeArtConfig.bubbleGrowth % bubble.r);
  bubble.x += bubble.vx;
  bubble.y += bubble.vy;
};
