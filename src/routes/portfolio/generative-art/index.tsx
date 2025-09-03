import { component$, useVisibleTask$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    console.log("Color Stripes");
    const morleyDotsCanvas = document.getElementById(
      "morleyDotsCanvas",
    ) as HTMLCanvasElement | null;
    if (!morleyDotsCanvas) return;

    const c = morleyDotsCanvas.getContext("2d");
    if (!c) return;

    morleyDotsCanvas.width = window.innerWidth;
    morleyDotsCanvas.height = window.innerHeight * 2;

    const w = morleyDotsCanvas.width;
    const h = morleyDotsCanvas.height;

    const initBubbles = 100;
    const minBubbles = 55;
    const bubbles: Bubble[] = [];

    const button = document.createElement("button");
    button.style.top = "110px";
    button.style.position = "fixed";
    button.style.left = "110px";
    button.style.zIndex = "100";
    button.style.width = "150px";
    button.style.height = "150px";
    button.style.borderRadius = "50%";
    button.style.backgroundColor = "transparent";
    button.style.border = "5px solid #fff";
    button.style.cursor = "pointer";
    button.style.color = "white";
    button.style.fontSize = "30px";
    button.style.fontFamily = "Arial";
    button.style.fontWeight = "bold";
    button.innerText = "download";
    button.onclick = () => {
      const data = morleyDotsCanvas.toDataURL();
      const link = document.createElement("a");
      link.download = "morleyDots.png";
      link.href = data;
      link.click();
    };
    morleyDotsCanvas.parentElement?.appendChild(button);

    window.addEventListener("load", init);

    function init() {
      while (bubbles.length < initBubbles) {
        bubbles.push(createBubbles());
      }
      draw();
    }

    class Bubble {
      constructor(
        public x: number,
        public y: number,
        public r: number,
        public vx: number,
        public vy: number,
        public color = randomColor(),
        public colorHighLight = randomColor(),
      ) {}

      draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();

        c.beginPath();
        c.arc(
          this.x - this.r / 3,
          this.y - this.r / 3,
          this.r / 3,
          0,
          Math.PI * 2,
          false,
        );
        c.fillStyle = this.colorHighLight;
        c.fill();
        c.closePath();
      }
    }

    function createBubbles(): Bubble {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 33 + 5;
      const vx = Math.random() * 2 - 1;
      const vy = Math.random() * 2 - 1;
      return new Bubble(x, y, r, vx, vy);
    }

    function randomColor(): string {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r + 20}, ${g + 10}, ${b + 10})`;
    }

    function draw() {
      c.fillStyle = randomColor();

      for (let i = 0; i < bubbles.length; i++) {
        const currentBubble = bubbles[i];
        currentBubble.r = currentBubble.r + (0.06 % currentBubble.r);
        currentBubble.x += currentBubble.vx;
        currentBubble.y += currentBubble.vy;
        currentBubble.draw();

        if (
          currentBubble.x + currentBubble.r > w ||
          currentBubble.x - currentBubble.r < 0 ||
          currentBubble.y - currentBubble.r < 10 ||
          currentBubble.r > 180
        ) {
          bubbles.splice(i, 1);
          if (bubbles.length < minBubbles) {
            bubbles.splice(i, 0, createBubbles());
          }
        }
      }
      requestAnimationFrame(draw);
    }
  });

  return <canvas id="morleyDotsCanvas" />;
});

export const head = buildHead(
  `Generative Art - ${siteConfig.metadata.title}`,
  "Interactive generative color stripes example.",
);
