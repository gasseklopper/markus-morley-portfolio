import type p5 from "p5";

export type ColorSortMode = "HUE" | "SATURATION" | "BRIGHTNESS" | "GRAYSCALE";

export const getSortModeForKey = (key: string): ColorSortMode | null | undefined => {
  switch (key) {
    case "5":
      return null;
    case "6":
      return "HUE";
    case "7":
      return "SATURATION";
    case "8":
      return "BRIGHTNESS";
    case "9":
      return "GRAYSCALE";
    default:
      return undefined;
  }
};

export const compareColors = (
  p: p5,
  sortMode: ColorSortMode | null,
  a: p5.Color,
  b: p5.Color,
) => {
  switch (sortMode) {
    case "HUE":
      return p.hue(a) - p.hue(b);
    case "SATURATION":
      return p.saturation(a) - p.saturation(b);
    case "BRIGHTNESS":
      return p.brightness(a) - p.brightness(b);
    case "GRAYSCALE": {
      const grayA = p.red(a) * 0.222 + p.green(a) * 0.707 + p.blue(a) * 0.071;
      const grayB = p.red(b) * 0.222 + p.green(b) * 0.707 + p.blue(b) * 0.071;
      return grayA - grayB;
    }
    default:
      return 0;
  }
};

export const getTileCount = (canvasWidth: number, pointerX: number) =>
  Math.floor(canvasWidth / Math.max(pointerX, 5));
