import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page">
      <h1>Impressum</h1>
      <p>Angaben gemäß § 5 TMG</p>
      <p>
        Markus Morley
        <br />
        Webentwickler
      </p>
      <p>
        Kontakt:
        <br />
        E-Mail:{" "}
        <a href="mailto:kontakt@markusmorley.de">kontakt@markusmorley.de</a>
      </p>
      <p>
        Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
        <br />
        Markus Morley
      </p>
    </div>
  );
});

export const head = buildHead(`Impressum - ${siteConfig.metadata.title}`);
