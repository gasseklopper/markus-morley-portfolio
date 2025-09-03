import { component$, useVisibleTask$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const canvas = document.getElementById(
      "dripSortCanvas",
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 2;

    const w = canvas.width;
    const h = canvas.height;

    type Drip = {
      x: number;
      y: number;
      width: number;
      height: number;
      vy: number;
      shade: number;
    };

    const drips: Drip[] = [];
    const count = 60;

    const button = document.createElement("button");
    button.style.top = "110px";
    button.style.position = "fixed";
    button.style.left = "110px";
    button.style.zIndex = "100";
    button.style.width = "150px";
    button.style.height = "150px";
    button.style.borderRadius = "50%";
    button.style.backgroundColor = "transparent";
    button.style.border = "5px solid #000";
    button.style.cursor = "pointer";
    button.style.color = "black";
    button.style.fontSize = "30px";
    button.style.fontFamily = "Arial";
    button.style.fontWeight = "bold";
    button.innerText = "download";
    button.onclick = () => {
      const data = canvas.toDataURL();
      const link = document.createElement("a");
      link.download = "dripSort.png";
      link.href = data;
      link.click();
    };
    canvas.parentElement?.appendChild(button);

    const randomShade = () => Math.floor(Math.random() * 256);

    const createDrip = (): Drip => ({
      x: Math.random() * w,
      y: Math.random() * h - h,
      width: Math.random() * 20 + 10,
      height: Math.random() * 60 + 20,
      vy: Math.random() * 2 + 1,
      shade: randomShade(),
    });

    while (drips.length < count) {
      drips.push(createDrip());
    }

    const draw = () => {
      c.fillStyle = "white";
      c.fillRect(0, 0, w, h);

      drips.sort((a, b) => a.shade - b.shade);
      for (let i = 0; i < drips.length; i++) {
        const d = drips[i];
        const targetX = ((i + 0.5) * w) / drips.length;
        d.x += (targetX - d.x) * 0.05;
        d.y += d.vy;

        c.fillStyle = `rgb(${d.shade},${d.shade},${d.shade})`;
        c.fillRect(d.x, d.y, d.width, d.height);

        if (d.y - d.height > h) {
          drips[i] = createDrip();
          drips[i].y = -drips[i].height;
        }
      }

      requestAnimationFrame(draw);
    };

    draw();
  });

  return <canvas id="dripSortCanvas" />;
});

export const head = buildHead(
  `Dripping Sort Art - ${siteConfig.metadata.title}`,
  "Black and white dripping rectangles that continuously sort by shade.",
);
