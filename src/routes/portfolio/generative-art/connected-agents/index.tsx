import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type p5 from "p5";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    const { default: P5 } = await import("p5");
    const sketch = (p: p5) => {
      const formResolution = 15;
      const stepSize = 2;
      const initRadius = 150;
      let centerX = 0;
      let centerY = 0;
      const x: number[] = [];
      const y: number[] = [];
      let filled = false;
      let freeze = false;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent("p5-container");

        centerX = p.width / 2;
        centerY = p.height / 2;
        const angle = p.radians(360 / formResolution);
        for (let i = 0; i < formResolution; i++) {
          x.push(p.cos(angle * i) * initRadius);
          y.push(p.sin(angle * i) * initRadius);
        }

        p.stroke(0, 50);
        p.strokeWeight(0.75);
        p.background(255);
      };

      p.draw = () => {
        centerX += (p.mouseX - centerX) * 0.01;
        centerY += (p.mouseY - centerY) * 0.01;

        for (let i = 0; i < formResolution; i++) {
          x[i] += p.random(-stepSize, stepSize);
          y[i] += p.random(-stepSize, stepSize);
        }

        if (filled) {
          p.fill(p.random(255));
        } else {
          p.noFill();
        }

        p.beginShape();
        p.curveVertex(
          x[formResolution - 1] + centerX,
          y[formResolution - 1] + centerY,
        );
        for (let i = 0; i < formResolution; i++) {
          p.curveVertex(x[i] + centerX, y[i] + centerY);
        }
        p.curveVertex(x[0] + centerX, y[0] + centerY);
        p.curveVertex(x[1] + centerX, y[1] + centerY);
        p.endShape();
      };

      p.mousePressed = () => {
        centerX = p.mouseX;
        centerY = p.mouseY;
        const angle = p.radians(360 / formResolution);
        const radius = initRadius * p.random(0.5, 1);
        for (let i = 0; i < formResolution; i++) {
          x[i] = p.cos(angle * i) * radius;
          y[i] = p.sin(angle * i) * radius;
        }
      };

      p.keyReleased = () => {
        if (p.key === "s" || p.key === "S") p.saveCanvas("connected-agents", "png");
        if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) p.background(255);
        if (p.key === "1") filled = false;
        if (p.key === "2") filled = true;
        if (p.key === "f" || p.key === "F") {
          freeze = !freeze;
          if (freeze) {
            p.noLoop();
          } else {
            p.loop();
          }
        }
      };
    };

    const sketchInstance: p5 = new P5(sketch);
    return () => {
      sketchInstance.remove();
    };
  });

  return <div id="p5-container" />;
});

export const head = buildHead(
  `Connected Agents - ${siteConfig.metadata.title}`,
  "Form morphing process by connected random agents.",
);

