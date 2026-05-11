import type { SitemapRoute } from "./types";

export const publicRoutes: readonly SitemapRoute[] = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Portfolio",
    path: "/portfolio",
  },
  {
    name: "Todos",
    path: "/todos",
  },
  {
    name: "Impressum",
    path: "/impressum",
  },
  {
    name: "Datenschutz",
    path: "/datenschutz",
  },
  {
    name: "Konzept",
    path: "/konzept",
    flag: "konzept",
  },
] as const;

export const sitemapRoutes = publicRoutes;
