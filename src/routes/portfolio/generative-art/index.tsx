import { component$, useVisibleTask$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    console.log("Color Stripes");
    const canvas = document.getElementById(
      "morleyDotsCanvas",
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 2;

    const w = canvas.width;
    const h = canvas.height;

    const initBubbles = 100;
    const minBubbles = 55;

    type Bubble = {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      color: string;
      highlight: string;
    };

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
      const data = canvas.toDataURL();
      const link = document.createElement("a");
      link.download = "morleyDots.png";
      link.href = data;
      link.click();
    };
    canvas.parentElement?.appendChild(button);

    const randomColor = () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r + 20}, ${g + 10}, ${b + 10})`;
    };

    const createBubble = (): Bubble => {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 33 + 5;
      const vx = Math.random() * 2 - 1;
      const vy = Math.random() * 2 - 1;
      return {
        x,
        y,
        r,
        vx,
        vy,
        color: randomColor(),
        highlight: randomColor(),
      };
    };

    const drawBubble = (b: Bubble) => {
      c.beginPath();
      c.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
      c.fillStyle = b.color;
      c.fill();
      c.closePath();

      c.beginPath();
      c.arc(b.x - b.r / 3, b.y - b.r / 3, b.r / 3, 0, Math.PI * 2, false);
      c.fillStyle = b.highlight;
      c.fill();
      c.closePath();
    };

    const draw = () => {
      c.fillStyle = randomColor();

      for (let i = 0; i < bubbles.length; i++) {
        const current = bubbles[i];
        current.r = current.r + (0.06 % current.r);
        current.x += current.vx;
        current.y += current.vy;
        drawBubble(current);

        if (
          current.x + current.r > w ||
          current.x - current.r < 0 ||
          current.y - current.r < 10 ||
          current.r > 180
        ) {
          bubbles.splice(i, 1);
          if (bubbles.length < minBubbles) {
            bubbles.splice(i, 0, createBubble());
          }
        }
      }
      requestAnimationFrame(draw);
    };

    while (bubbles.length < initBubbles) {
      bubbles.push(createBubble());
    }
    draw();
  });

  return <canvas id="morleyDotsCanvas" />;
});

export const head = buildHead(
  `Generative Art - ${siteConfig.metadata.title}`,
  "Interactive generative color stripes example.",
);
