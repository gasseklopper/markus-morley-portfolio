import type { DocumentHead } from "@builder.io/qwik-city";
import { getPortfolioPage } from "~/config/portfolio";
import { siteMetadata } from "~/config/site";

/**
 * Helper to generate `DocumentHead` objects with the default site description.
 */
export function buildHead(
  title: string,
  description = siteMetadata.description,
): DocumentHead {
  return {
    title,
    meta: [
      {
        name: "description",
        content: description,
      },
    ],
  };
}

export function buildPortfolioHead(path: string): DocumentHead {
  const page = getPortfolioPage(path);

  return buildHead(
    page?.title ?? siteMetadata.title,
    page?.description ?? siteMetadata.description,
  );
}
