import type p5 from "p5";
import {
  colorPaletteConfig,
  type ColorPaletteImageKey,
} from "./color-palette.config";
import { queryColorPaletteDom } from "./color-palette.dom";
import {
  compareColors,
  getSortModeForKey,
  getTileCount,
  type ColorSortMode,
} from "./color-palette.model";

export const setupColorPaletteSketch = async (root: HTMLElement) => {
  const { container } = queryColorPaletteDom(root);
  if (!container) return undefined;

  const { default: P5 } = await import("p5");
  const sketch = (p: p5) => {
    let img: p5.Image;
    let colors: p5.Color[] = [];
    let sortMode: ColorSortMode | null = null;

    p.preload = () => {
      img = p.loadImage(colorPaletteConfig.defaultImagePath);
    };

    p.setup = () => {
      const canvas = p.createCanvas(
        colorPaletteConfig.canvasSize,
        colorPaletteConfig.canvasSize,
      );
      canvas.parent(colorPaletteConfig.containerId);
      p.noCursor();
      p.noStroke();
    };

    p.draw = () => {
      const tileCount = getTileCount(p.width, p.mouseX);
      const rectSize = p.width / tileCount;

      img.loadPixels();
      colors = [];

      for (let gridY = 0; gridY < tileCount; gridY++) {
        for (let gridX = 0; gridX < tileCount; gridX++) {
          const px = p.int(gridX * rectSize);
          const py = p.int(gridY * rectSize);
          const color = img.get(px, py) as number[];
          colors.push(p.color(color[0], color[1], color[2], color[3]));
        }
      }

      if (sortMode) {
        colors.sort((a, b) => compareColors(p, sortMode, a, b));
      }

      let colorIndex = 0;
      for (let gridY = 0; gridY < tileCount; gridY++) {
        for (let gridX = 0; gridX < tileCount; gridX++) {
          p.fill(colors[colorIndex]);
          p.rect(gridX * rectSize, gridY * rectSize, rectSize, rectSize);
          colorIndex++;
        }
      }
    };

    p.keyReleased = () => {
      if (p.key === "s" || p.key === "S") {
        p.saveCanvas(colorPaletteConfig.saveFileName, "png");
      }

      if (p.key in colorPaletteConfig.imagePaths) {
        img = p.loadImage(
          colorPaletteConfig.imagePaths[p.key as ColorPaletteImageKey],
        );
      }

      const nextSortMode = getSortModeForKey(p.key);
      if (nextSortMode !== undefined) {
        sortMode = nextSortMode;
      }
    };
  };

  const sketchInstance: p5 = new P5(sketch);
  return () => {
    sketchInstance.remove();
  };
};
