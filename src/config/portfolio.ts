import { siteMetadata } from "./site";
import type { PortfolioPage } from "./types";

type PortfolioPageInput = Omit<PortfolioPage, "title">;

const createPortfolioTitle = (name: string) => `${name} - ${siteMetadata.title}`;

const portfolioPageEntries = [
  {
    name: "Color Theme",
    path: "/portfolio/color-theme",
    description: "Color swatches for light, dark, neon and pastel themes.",
    variation: "clean",
    image: {
      src: "/assets/portfolio/color-theme/preview.png",
      alt: "Color Theme Preview",
    },
  },
  {
    name: "Farbkasten",
    path: "/portfolio/farbkasten",
    description: "Draw on a portrait using the brand color.",
    variation: "primary",
    image: {
      src: "/assets/portfolio/farbkasten/preview.png",
      alt: "Farbkasten Preview",
    },
  },
  {
    name: "Project 011",
    path: "/portfolio/project011",
    description: "Interactive D3 bar chart visualizing US GDP.",
    image: {
      src: "/assets/portfolio/project011/preview.png",
      alt: "Project 011 Preview",
    },
  },
  {
    name: "Test Codex",
    path: "/portfolio/test-codex",
    description:
      "Photographic GSAP motion art direction study with ScrollTrigger, masked reveals, and micro interactions.",
    variation: "secondary",
    image: {
      src: "/assets/images/photography/black/Template_index_014.jpg",
      alt: "Test Codex photographic motion study preview",
    },
  },
  {
    name: "Project 012",
    path: "/portfolio/project012",
    description:
      "Interactive D3 scatterplot visualizing professional cycling times.",
    variation: "primary",
    image: {
      src: "/assets/portfolio/project012/preview.png",
      alt: "Project 012 Preview",
    },
  },
  {
    name: "Project 013",
    path: "/portfolio/project013",
    description:
      "Interactive D3 heat map visualizing global temperature variance.",
    variation: "clean",
    image: {
      src: "/assets/portfolio/project013/preview.png",
      alt: "Project 013 Preview",
    },
  },
  {
    name: "Project 014",
    path: "/portfolio/project014",
    description:
      "Interactive D3 choropleth highlighting education attainment across U.S. counties.",
    variation: "clean",
    image: {
      src: "/assets/portfolio/project014/preview.png",
      alt: "Project 014 Preview",
    },
  },
  {
    name: "Project 015",
    path: "/portfolio/project015",
    description:
      "Interactive D3 treemap illustrating video game sales by genre with responsive legend and tooltips.",
    variation: "clean",
    image: {
      src: "/assets/portfolio/project015/preview.png",
      alt: "Project 015 Preview",
    },
  },
  {
    name: "Project 016",
    path: "/portfolio/project016",
    description:
      "Scroll-triggered GSAP and Lenis gallery inspired by the Gently concept with floating imagery and sticky hero.",
    variation: "secondary",
  },
  {
    name: "Project 017",
    path: "/portfolio/project017",
    description:
      "Brutalist password generator featuring ASCII-safe defaults, clipboard copy, and configurable strength controls.",
    variation: "clean",
    image: {
      src: "/assets/portfolio/project017/preview.png",
      alt: "Project 017 Preview",
    },
  },
  {
    name: "Project 018",
    path: "/portfolio/project018",
    description:
      "Bold brutal shopping list atelier with offline storage, date-tagged lists, and adjustable frequent topic suggestions.",
    variation: "clean",
    image: {
      src: "/assets/portfolio/project018/preview.png",
      alt: "Project 018 Preview",
    },
  },
  {
    name: "Roman Numeral Converter",
    path: "/portfolio/roman-numeral-converter",
    description:
      "Roman numeral converter with live validation, history log, and subtractive pair legend.",
    variation: "primary",
    image: {
      src: "/assets/portfolio/roman-numeral-converter/preview.png",
      alt: "Roman Numeral Converter Preview",
    },
  },
  {
    name: "Generative Art",
    path: "/portfolio/generative-art",
    description: "Interactive generative art example.",
    variation: "clean",
    image: {
      src: "/assets/portfolio/generative-art/preview.png",
      alt: "Generative Art Preview",
    },
  },
  {
    name: "Drip Sort",
    path: "/portfolio/generative-art/drip-sort",
    description: "Black-and-white rectangles dripping downward while sorting.",
    variation: "clean",
    image: {
      src: "/assets/portfolio/drip-sort/preview.png",
      alt: "Drip Sort Preview",
    },
  },
  {
    name: "Color Palette",
    path: "/portfolio/generative-art/color-palette",
    description: "Extract and sort colors from images using p5.js.",
    variation: "primary",
    image: {
      src: "/assets/portfolio/color-palette/preview.png",
      alt: "Color Palette Preview",
    },
  },
  {
    name: "Crayon - the Qwik.js way",
    path: "/portfolio/generative-art/crayon",
    description:
      "Interactive p5.brush sketch that responds to motion and gesture.",
    variation: "clean",
  },
  {
    name: "Connected Agents",
    path: "/portfolio/generative-art/connected-agents",
    description: "Form morphing process by connected random agents.",
    variation: "clean",
    image: {
      src: "/assets/portfolio/connected-agents/preview.png",
      alt: "Connected Agents Preview",
    },
  },
] as const satisfies readonly PortfolioPageInput[];

export const portfolioPages: readonly PortfolioPage[] = portfolioPageEntries.map(
  (page) => ({
    ...page,
    title: createPortfolioTitle(page.name),
  }),
);

export const portfolioRoutes = portfolioPages.map(({ name, path, flag }) => ({
  name,
  path,
  ...(flag ? { flag } : {}),
}));

export const getPortfolioPage = (path: string) =>
  portfolioPages.find((page) => page.path === path);

export type { PortfolioPage };
