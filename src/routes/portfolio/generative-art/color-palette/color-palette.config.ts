export const colorPaletteConfig = {
  containerId: "p5-container",
  canvasSize: 600,
  defaultImagePath: "/assets/images/heros/image003.png",
  imagePaths: {
    "1": "/assets/images/heros/image003.png",
    "2": "/assets/images/heros/image001.png",
    "3": "/assets/images/heros/image002.png",
    "4": "/assets/images/heros/image005.png",
  },
  saveFileName: "palette",
} as const;

export type ColorPaletteImageKey = keyof typeof colorPaletteConfig.imagePaths;
