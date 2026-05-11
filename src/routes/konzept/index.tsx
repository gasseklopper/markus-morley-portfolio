import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "../index.scss?inline";
import { siteMetadata } from "~/config/site";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page">
      <h1>Konzept</h1>
      <p>This page is only visible when the konzept feature flag is enabled.</p>
    </div>
  );
});

export const head = buildHead(`Konzept - ${siteMetadata.title}`);
