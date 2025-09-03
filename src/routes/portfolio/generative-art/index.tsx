import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";
import type p5 from "p5";

export default component$(() => {
  const containerRef = useSignal<HTMLDivElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    if (!containerRef.value) return;
    const P5 = (await import("p5")).default;
    new P5((sk: p5) => {
      sk.setup = () => {
        sk.createCanvas(400, 400);
        sk.noLoop();
      };
      sk.draw = () => {
        sk.background(255);
        for (let i = 0; i < 50; i++) {
          sk.fill(sk.random(255), sk.random(255), sk.random(255), 150);
          sk.noStroke();
          sk.circle(sk.random(sk.width), sk.random(sk.height), sk.random(10, 40));
        }
      };
    }, containerRef.value);
  });

  return <div ref={containerRef} />;
});

export const head = buildHead(
  `Generative Art - ${siteConfig.metadata.title}`,
  "Example generative art using p5."
);
