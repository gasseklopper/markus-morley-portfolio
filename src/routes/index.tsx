import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from "./index.scss?inline";
import siteConfig from "./../config/siteConfig.json";

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
    </div>
  );
});

export const head: DocumentHead = {
  title: siteConfig.metadata.title,
  meta: [
    {
      name: "description",
      content: siteConfig.metadata.description,
    },
  ],
};
