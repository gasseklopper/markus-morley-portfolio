import { component$ } from "@builder.io/qwik";
import { PortfolioShowcase } from "~/components/portfolio-showcase/PortfolioShowcase";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  return <PortfolioShowcase />;
});

export const head = buildHead(
  `Portfolio Showcase - ${siteConfig.metadata.title}`,
  "Retro pixel-style portfolio showcase",
);
