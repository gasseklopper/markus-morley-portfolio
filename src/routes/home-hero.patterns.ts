import type { HomeHeroConfig } from "./home-hero.config";

export type Fragment = {
  element: HTMLElement;
  index: number;
  reveal: () => void;
  collapse: () => void;
};

export type Pattern = {
  name: string;
  create: (
    container: HTMLElement,
    imageSrc: string,
    size: number,
  ) => Fragment[];
  revealTiming: (index: number, total: number) => number;
  collapseTiming: (index: number, total: number) => number;
};

export const createHomeHeroPatterns = (config: HomeHeroConfig) =>
  ({
    flame: {
      name: "Flame Trail",
      create: (_container, imageSrc, size) => {
        void size;
        const img = document.createElement("img");
        img.className = "trail-img";
        img.src = imageSrc;
        img.width = img.height = 0;
        return [
          {
            element: img,
            index: 0,
            reveal: () => undefined,
            collapse: () => undefined,
          },
        ];
      },
      revealTiming: () => 0,
      collapseTiming: () => 0,
    },
    venetian: {
      name: "Venetian Blinds",
      create: (_container, imageSrc, size) => {
        void size;
        const fragments: Fragment[] = [];
        const stripCount = 12;
        const stripHeight = 100 / stripCount;
        for (let i = 0; i < stripCount; i++) {
          const fragment = document.createElement("div");
          fragment.className = "image-fragment";
          const bg = document.createElement("div");
          bg.className = "fragment-bg";
          bg.style.backgroundImage = `url(${imageSrc})`;
          const y = i * stripHeight;
          fragment.style.cssText = `
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform: translate3d(0, 0, 0) rotateX(90deg);
            transform-origin: 50% ${y + stripHeight / 2}%;
            clip-path: polygon(0% ${y}%, 100% ${y}%, 100% ${y + stripHeight}%, 0% ${y + stripHeight}%);
            transition: transform ${config.inDuration}ms ${config.easing.reveal};
          `;
          fragment.appendChild(bg);
          fragments.push({
            element: fragment,
            index: i,
            reveal: () => {
              fragment.style.transform = "translate3d(0, 0, 0) rotateX(0deg)";
            },
            collapse: () => {
              fragment.style.transform = "translate3d(0, 0, 0) rotateX(-90deg)";
            },
          });
        }
        return fragments;
      },
      revealTiming: (i, total) => Math.abs(i - total / 2) * 0.08,
      collapseTiming: (i) => i * 0.04,
    },
    liquid: {
      name: "Liquid Drops",
      create: (_container, imageSrc, size) => {
        void size;
        const fragments: Fragment[] = [];
        [
          { x: 25, y: 20, r: 16 },
          { x: 70, y: 15, r: 12 },
          { x: 45, y: 35, r: 18 },
          { x: 15, y: 55, r: 14 },
          { x: 80, y: 45, r: 15 },
          { x: 55, y: 70, r: 20 },
          { x: 30, y: 80, r: 13 },
          { x: 75, y: 75, r: 17 },
        ].forEach((pos, i) => {
          const fragment = document.createElement("div");
          fragment.className = "image-fragment";
          const bg = document.createElement("div");
          bg.className = "fragment-bg";
          bg.style.backgroundImage = `url(${imageSrc})`;
          fragment.style.cssText = `
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            clip-path: circle(0% at ${pos.x}% ${pos.y}%);
            transition: clip-path ${config.inDuration}ms ${config.easing.reveal};
          `;
          fragment.appendChild(bg);
          fragments.push({
            element: fragment,
            index: i,
            reveal: () => {
              fragment.style.clipPath = `circle(${pos.r}% at ${pos.x}% ${pos.y}%)`;
            },
            collapse: () => {
              fragment.style.clipPath = `circle(0% at ${pos.x}% ${pos.y}%)`;
            },
          });
        });
        return fragments;
      },
      revealTiming: (i, total) => (i / total) * 0.4,
      collapseTiming: (i, total) => ((total - 1 - i) / total) * 0.25,
    },
    curtain: {
      name: "Curtain Sweep",
      create: (_container, imageSrc, size) => {
        void size;
        const fragments: Fragment[] = [];
        const stripCount = 10;
        for (let i = 0; i < stripCount; i++) {
          const fragment = document.createElement("div");
          fragment.className = "image-fragment";
          const bg = document.createElement("div");
          bg.className = "fragment-bg";
          bg.style.backgroundImage = `url(${imageSrc})`;
          const x = (i / stripCount) * 100;
          const w = 100 / stripCount;
          fragment.style.cssText = `
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            clip-path: polygon(${x + w / 2}% 0%, ${x + w / 2}% 0%, ${x + w / 2}% 100%, ${x + w / 2}% 100%);
            transition: clip-path ${config.inDuration}ms ${config.easing.reveal};
          `;
          fragment.appendChild(bg);
          fragments.push({
            element: fragment,
            index: i,
            reveal: () => {
              fragment.style.clipPath = `polygon(${x}% 0%, ${x + w}% 0%, ${x + w}% 100%, ${x}% 100%)`;
            },
            collapse: () => {
              fragment.style.clipPath = `polygon(${x + w / 2}% 0%, ${x + w / 2}% 0%, ${x + w / 2}% 100%, ${x + w / 2}% 100%)`;
            },
          });
        }
        return fragments;
      },
      revealTiming: (i, total) => (i / total) * 0.6,
      collapseTiming: (i, total) => ((total - 1 - i) / total) * 0.3,
    },
    hexagon: {
      name: "Hexagon Bloom",
      create: (_container, imageSrc, size) => {
        void size;
        const fragments: Fragment[] = [];
        [
          { x: 50, y: 50, size: 20 },
          { x: 25, y: 25, size: 15 },
          { x: 75, y: 25, size: 15 },
          { x: 85, y: 50, size: 15 },
          { x: 75, y: 75, size: 15 },
          { x: 25, y: 75, size: 15 },
          { x: 15, y: 50, size: 15 },
        ].forEach((hex, i) => {
          const fragment = document.createElement("div");
          fragment.className = "image-fragment";
          const bg = document.createElement("div");
          bg.className = "fragment-bg";
          bg.style.backgroundImage = `url(${imageSrc})`;
          const s = hex.size;
          const x = hex.x;
          const y = hex.y;
          const hexShape = `polygon(${x - s * 0.5}% ${y - s * 0.87}%, ${x + s * 0.5}% ${y - s * 0.87}%, ${x + s}% ${y}%, ${x + s * 0.5}% ${y + s * 0.87}%, ${x - s * 0.5}% ${y + s * 0.87}%, ${x - s}% ${y}%)`;
          fragment.style.cssText = `
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            clip-path: polygon(${x}% ${y}%, ${x}% ${y}%, ${x}% ${y}%);
            transition: clip-path ${config.inDuration}ms ${config.easing.reveal};
          `;
          fragment.appendChild(bg);
          fragments.push({
            element: fragment,
            index: i,
            reveal: () => {
              fragment.style.clipPath = hexShape;
            },
            collapse: () => {
              fragment.style.clipPath = `polygon(${x}% ${y}%, ${x}% ${y}%, ${x}% ${y}%)`;
            },
          });
        });
        return fragments;
      },
      revealTiming: (i) => (i === 0 ? 0 : 0.2 + (i - 1) * 0.06),
      collapseTiming: (i) => (i === 0 ? 0.3 : (i - 1) * 0.04),
    },
    zoomsplit: {
      name: "Zoom Split",
      create: (_container, imageSrc, size) => {
        void size;
        const fragments: Fragment[] = [];
        const gridSize = 3;
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const fragment = document.createElement("div");
            fragment.className = "image-fragment";
            const bg = document.createElement("div");
            bg.className = "fragment-bg";
            bg.style.backgroundImage = `url(${imageSrc})`;
            const x = (col / gridSize) * 100;
            const y = (row / gridSize) * 100;
            const w = 100 / gridSize;
            const h = 100 / gridSize;
            fragment.style.cssText = `
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              clip-path: polygon(${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%);
              transition: clip-path ${config.inDuration}ms ${config.easing.scale};
            `;
            fragment.appendChild(bg);
            fragments.push({
              element: fragment,
              index: row * gridSize + col,
              reveal: () => {
                fragment.style.clipPath = `polygon(${x}% ${y}%, ${x + w}% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`;
              },
              collapse: () => {
                fragment.style.clipPath = `polygon(${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%)`;
              },
            });
          }
        }
        return fragments;
      },
      revealTiming: (i, total) => {
        const gridSize = Math.sqrt(total);
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        return (
          Math.hypot(col - (gridSize - 1) / 2, row - (gridSize - 1) / 2) * 0.15
        );
      },
      collapseTiming: (i, total) => {
        const gridSize = Math.sqrt(total);
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        return (
          Math.hypot(col - (gridSize - 1) / 2, row - (gridSize - 1) / 2) * 0.08
        );
      },
    },
  }) satisfies Record<
    "flame" | "venetian" | "liquid" | "curtain" | "hexagon" | "zoomsplit",
    Pattern
  >;

export type HomeHeroPatterns = ReturnType<typeof createHomeHeroPatterns>;
export type HomeHeroPatternKey = keyof HomeHeroPatterns;
