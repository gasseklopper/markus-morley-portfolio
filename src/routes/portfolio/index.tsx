import { component$, useStyles$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import portfolioPages from "~/config/portfolio-pages.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <h1>Portfolio</h1>
      <p>A selection of recent work.</p>
      <ul>
        {portfolioPages.map((p) => (
          <li key={p.path}>
            <Link href={p.path}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
});

export const head = buildHead(`Portfolio - ${siteConfig.metadata.title}`);
