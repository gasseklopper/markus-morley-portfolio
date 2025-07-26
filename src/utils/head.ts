import type { DocumentHead } from "@builder.io/qwik-city";
import siteConfig from "~/config/siteConfig.json";

/**
 * Helper to generate `DocumentHead` objects with the default site description.
 */
export function buildHead(title: string, description = siteConfig.metadata.description): DocumentHead {
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
