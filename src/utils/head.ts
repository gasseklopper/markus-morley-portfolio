import type { DocumentHead } from "@builder.io/qwik-city";
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
