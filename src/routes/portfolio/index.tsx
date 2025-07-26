import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page">
      <h1>Portfolio</h1>
      <p>A selection of recent work.</p>
    </div>
  );
});

export const head = buildHead(`Portfolio - ${siteConfig.metadata.title}`);
