import type { RequestHandler } from "@builder.io/qwik-city";
import { portfolioPages } from "~/config/portfolio";
import { sitemapRoutes } from "~/config/routes";
import { isFeatureEnabled, type FeatureFlag } from "~/utils/feature-flags";

export const onGet: RequestHandler = ({ url, headers, send }) => {
  const base = url.origin;
  const allRoutes = [...sitemapRoutes, ...portfolioPages].filter(
    (r) => !("flag" in r) || isFeatureEnabled(r.flag as FeatureFlag),
  );
  const urls = allRoutes
    .map((r) => `<url><loc>${base}${r.path}</loc></url>`)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  headers.set("Content-Type", "application/xml");
  send(200, xml);
};
