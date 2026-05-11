import { component$, useStyles$ } from "@builder.io/qwik";
import { Malkasten } from "~/components/malkasten/Malkasten";
import { siteMetadata } from "~/config/site";
import { buildHead } from "~/utils/head";
import styles from "./farbkasten.scss?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <section class="farbkasten-page">
      <header class="farbkasten-page__header">
        <h1>Farbkasten</h1>
        <p>Paint over the portrait using the brand color.</p>
      </header>
      <Malkasten />
    </section>
  );
});

export const head = buildHead(
  `Farbkasten - ${siteMetadata.title}`,
  "Draw on the image with the brand color.",
);
