import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page">
      <h1>About</h1>
      <p>This page gives information about the site.</p>
    </div>
  );
});

export const head = buildHead(`About - ${siteConfig.metadata.title}`);
