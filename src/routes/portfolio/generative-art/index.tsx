import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { buildPortfolioHead } from "~/utils/head";
import { createMountedClientEffect } from "~/utils/browserClient";
import { generativeArtConfig } from "./generative-art.config";
import { setupGenerativeArt } from "./generative-art.client";

export default component$(() => {
  const rootRef = useSignal<HTMLElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    await createMountedClientEffect(cleanup, () => {
      const root = rootRef.value;
      return root ? setupGenerativeArt(root) : undefined;
    });
  });

  return (
    <div ref={rootRef}>
      <canvas id={generativeArtConfig.canvasId} />
    </div>
  );
});

export const head = buildPortfolioHead("/portfolio/generative-art");
