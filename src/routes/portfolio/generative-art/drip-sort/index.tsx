import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { buildPortfolioHead } from "~/utils/head";
import { setupDripSort } from "./drip-sort.client";

export default component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const teardown = setupDripSort(document.body);
    cleanup(() => teardown?.());
  });

  return <canvas id="dripSortCanvas" />;
});

export const head = buildPortfolioHead("/portfolio/generative-art/drip-sort");
