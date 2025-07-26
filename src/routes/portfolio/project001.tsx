import { component$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import portfolioPages from "~/config/portfolio-pages.json";
import { PortfolioPage } from "~/components/portfolio/portfolio-page";
import { buildHead } from "~/utils/head";

const page = portfolioPages.find((p) => p.path === "/portfolio/project001/")!;

export default component$(() => {
  return <PortfolioPage title={page.title} description={page.description} />;
});

export const head = buildHead(
  `${page.title} - ${siteConfig.metadata.title}`,
  page.description,
);
