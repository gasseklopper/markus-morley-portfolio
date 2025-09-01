import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page">
      <h1 class="title_barlowBold">Hi 👋 barlowBold</h1>
      <h2 class="title_barlowMedium">Hi 👋 barlowMedium</h2>
      <h3 class="title_barlowLight">Hi 👋 barlowLight</h3>
      <h4 class="title_barlowSemibold">Hi 👋 barlowSemibold</h4>
      <div>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </div>

      <div class="xxl:grid-cols-4 mt-8 grid grid-cols-1 gap-4">
        <div class="bg-blue-500 p-4 text-white">Item 1</div>
        <div class="bg-blue-500 p-4 text-white">Item 2</div>
        <div class="bg-blue-500 p-4 text-white">Item 3</div>
        <div class="bg-blue-500 p-4 text-white">Item 4</div>
      </div>
    </div>
  );
});

export const head = buildHead(siteConfig.metadata.title);
