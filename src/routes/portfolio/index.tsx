import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page">
      <h1>Portfolio</h1>
      <p>A selection of recent work.</p>
    </div>
  );
});

export const head: DocumentHead = {
  title: `Portfolio - ${siteConfig.metadata.title}`,
  meta: [
    {
      name: "description",
      content: siteConfig.metadata.description,
    },
  ],
};
