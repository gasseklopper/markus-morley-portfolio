import type { RequestHandler } from "@builder.io/qwik-city";
import siteConfig from "~/config/siteConfig.json";
import portfolioPages from "~/config/portfolio-pages.json";

export const onGet: RequestHandler = ({ url, headers, send }) => {
  const base = url.origin;
  const allRoutes = [...siteConfig.routes, ...portfolioPages];
  const urls = allRoutes
    .map((r: { path: string }) => `<url><loc>${base}${r.path}</loc></url>`)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  headers.set("Content-Type", "application/xml");
  send(200, xml);
};
