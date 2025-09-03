import { component$, useStyles$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import portfolioPages from "~/config/portfolio-pages.json";
import { buildHead } from "~/utils/head";

const hotTopics = [
  "Design Systems",
  "Accessibility",
  "AI Frontend",
  "Web Performance",
];

export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <h1>Portfolio</h1>
      <p>A selection of recent work.</p>

      <section class="mt-6">
        <h2 class="mb-2 text-xl font-semibold">Hot Topics</h2>
        <ul class="flex flex-wrap gap-2">
          {hotTopics.map((topic) => (
            <li
              key={topic}
              class="rounded bg-[var(--text1)] px-3 py-1 text-sm text-[var(--surface1)]"
            >
              {topic}
            </li>
          ))}
        </ul>
      </section>

      <section class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portfolioPages.map((p) => (
          <Link
            href={p.path}
            key={p.path}
            class="block border border-[var(--text1)] p-4 transition-colors hover:bg-[var(--text1)] hover:text-[var(--surface1)]"
          >
            <h3 class="text-lg font-semibold">{p.name}</h3>
            <p class="mt-2 text-sm">{p.description}</p>
          </Link>
        ))}
      </section>
    </>
  );
});

export const head = buildHead(`Portfolio - ${siteConfig.metadata.title}`);
