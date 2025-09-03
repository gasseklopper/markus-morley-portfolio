import { component$, useVisibleTask$ } from "@builder.io/qwik";
import p5 from "p5";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    let sketchInstance: p5;
    const sketch = (p: p5) => {
      let img: p5.Image;
      let colors: p5.Color[] = [];
      let sortMode: string | null = null;

      const loadInitial = () => {
        img = p.loadImage("/assets/images/heros/image003.png");
      };

      const sortColors = () => {
        if (!sortMode) return;
        colors.sort((a, b) => {
          switch (sortMode) {
            case "HUE":
              return p.hue(a) - p.hue(b);
            case "SATURATION":
              return p.saturation(a) - p.saturation(b);
            case "BRIGHTNESS":
              return p.brightness(a) - p.brightness(b);
            case "GRAYSCALE":
              const grayA = p.red(a) * 0.222 + p.green(a) * 0.707 + p.blue(a) * 0.071;
              const grayB = p.red(b) * 0.222 + p.green(b) * 0.707 + p.blue(b) * 0.071;
              return grayA - grayB;
            default:
              return 0;
          }
        });
      };

      p.preload = loadInitial;

      p.setup = () => {
        const canvas = p.createCanvas(600, 600);
        canvas.parent("p5-container");
        p.noCursor();
        p.noStroke();
      };

      p.draw = () => {
        const tileCount = p.floor(p.width / Math.max(p.mouseX, 5));
        const rectSize = p.width / tileCount;

        img.loadPixels();
        colors = [];

        for (let gridY = 0; gridY < tileCount; gridY++) {
          for (let gridX = 0; gridX < tileCount; gridX++) {
            const px = p.int(gridX * rectSize);
            const py = p.int(gridY * rectSize);
            const c = img.get(px, py) as number[];
            colors.push(p.color(c[0], c[1], c[2], c[3]));
          }
        }

        sortColors();

        let i = 0;
        for (let gridY = 0; gridY < tileCount; gridY++) {
          for (let gridX = 0; gridX < tileCount; gridX++) {
            p.fill(colors[i]);
            p.rect(gridX * rectSize, gridY * rectSize, rectSize, rectSize);
            i++;
          }
        }
      };

      p.keyReleased = () => {
        if (p.key === "s" || p.key === "S") p.saveCanvas("palette", "png");
        if (p.key === "1") img = p.loadImage("/assets/images/heros/image003.png");
        if (p.key === "2") img = p.loadImage("/assets/images/heros/image001.png");
        if (p.key === "3") img = p.loadImage("/assets/images/heros/image002.png");
        if (p.key === "4") img = p.loadImage("/assets/images/heros/image005.png");
        if (p.key === "5") sortMode = null;
        if (p.key === "6") sortMode = "HUE";
        if (p.key === "7") sortMode = "SATURATION";
        if (p.key === "8") sortMode = "BRIGHTNESS";
        if (p.key === "9") sortMode = "GRAYSCALE";
      };
    };

    sketchInstance = new p5(sketch);
    return () => {
      sketchInstance.remove();
    };
  });

  return <div id="p5-container" />;
});

export const head = buildHead(
  `Color Palette - ${siteConfig.metadata.title}`,
  "Extract and sort color palette from images with p5.js.",
);
