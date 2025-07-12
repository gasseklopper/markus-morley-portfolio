import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import siteConfig from "./../../config/siteConfig.json";

export default component$(() => {
  return (
    <div class="page">
      <h1>{siteConfig.page_404.title}</h1>
      <p>{siteConfig.page_404.description}</p>
      <p>
        <Link href={siteConfig.page_404.link.url}>{siteConfig.page_404.link.text}</Link>
      </p>
    </div>
  );
});

export const head: DocumentHead = {
  title: siteConfig.page_404.title,
  meta: [
    {
      name: "description",
      content: siteConfig.page_404.description,
    },
  ],
};
