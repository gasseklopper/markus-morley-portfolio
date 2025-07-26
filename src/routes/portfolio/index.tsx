import { component$, useStyles$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <h1>Portfolio</h1>
      <p>A selection of recent work.</p>
      <ul>
        {Array.from({ length: 10 }, (_, i) => {
          const num = String(i + 1).padStart(3, "0");
          return (
            <li key={num}>
              <Link href={`/portfolio/project${num}`}>Project {num}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
});

export const head = buildHead(`Portfolio - ${siteConfig.metadata.title}`);
