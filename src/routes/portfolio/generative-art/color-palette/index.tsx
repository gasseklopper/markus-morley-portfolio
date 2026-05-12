import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { buildPortfolioHead } from "~/utils/head";
import { setupColorPaletteSketch } from "./color-palette.client";

export default component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    const teardown = await setupColorPaletteSketch(document.body);
    cleanup(() => teardown?.());
  });

  return <div id="p5-container" />;
});

export const head = buildPortfolioHead(
  "/portfolio/generative-art/color-palette",
);
