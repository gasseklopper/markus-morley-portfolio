import { siteMetadata } from "./site";
import type { NavItem, PortfolioPage, SitemapRoute } from "./types";

type PortfolioPageInput = Omit<PortfolioPage, "title" | "image">;

type PortfolioContentIssue = {
  path: string;
  issue: "missing-description" | "missing-preview";
  message: string;
};

const createPortfolioTitle = (name: string) =>
  `${name} - ${siteMetadata.title}`;

const portfolioPageEntries = [
  {
    name: "Color Theme",
    path: "/portfolio/color-theme",
    description: "Color swatches for light, dark, neon and pastel themes.",
    badge: "Design Tokens",
    date: "2024",
    category: "Design Systems",
    status: "Live",
    tech: ["Qwik", "SCSS", "Design Tokens"],
    order: 10,
    variation: "clean",
    preview: {
      image: {
        src: "/assets/portfolio/color-theme/preview.png",
        alt: "Color Theme preview",
      },
    },
  },
  {
    name: "Farbkasten",
    path: "/portfolio/farbkasten",
    description: "Draw on a portrait using the brand color.",
    badge: "Creative Coding",
    date: "2024",
    category: "Creative Coding",
    status: "Live",
    tech: ["Qwik", "Canvas", "SCSS"],
    order: 20,
    variation: "primary",
    preview: {
      image: {
        src: "/assets/portfolio/farbkasten/preview.png",
        alt: "Farbkasten preview",
      },
    },
  },
  {
    name: "US GDP Bar Chart",
    path: "/portfolio/project011",
    description: "Interactive D3 bar chart visualizing US GDP.",
    badge: "Data Viz",
    date: "2024",
    category: "Data Visualization",
    status: "Live",
    tech: ["Qwik", "D3", "SVG"],
    order: 30,
    preview: {
      image: {
        src: "/assets/portfolio/project011/preview.png",
        alt: "US GDP bar chart preview",
      },
    },
  },
  {
    name: "Markus Morley CV Story",
    path: "/portfolio/test-codex",
    description:
      "Animated CV storytelling page for Markus Morley, focused on product engineering, frontend architecture, UX, and design systems.",
    badge: "CV Story",
    date: "2026",
    category: "Frontend Prototype",
    status: "Study",
    tech: ["Qwik", "GSAP", "TypeScript"],
    order: 40,
    variation: "secondary",
    preview: {
      image: {
        src: "/assets/images/photography/black/Template_index_014.jpg",
        alt: "Markus Morley CV storytelling preview",
      },
    },
  },
  {
    name: "Oststern 121",
    path: "/portfolio/oststern",
    description:
      "Process-led case study for the Oststern 121 real-estate microsite, showcasing planning, design thinking, customer integration, GSAP motion, responsive frontend delivery, and Netlify deployment.",
    badge: "Case Study",
    date: "2026",
    category: "Frontend Prototype",
    status: "Live",
    tech: ["Qwik", "GSAP", "Netlify", "Responsive UI"],
    order: 45,
    variation: "clean",
    preview: {
      image: {
        src: "/assets/portfolio/oststern/preview.jpg",
        alt: "Oststern 121 case study preview",
      },
    },
  },
  {
    name: "Swissport",
    path: "/portfolio/swissport",
    description:
      "Editorial case study for Swissport.com, showcasing planning, design thinking, customer integration, design systems, custom map cluster thinking, GSAP motion, QA, and deployment.",
    badge: "Case Study",
    date: "2026",
    category: "Frontend Prototype",
    status: "Study",
    tech: ["Qwik", "GSAP", "Google Maps", "Design System", "Deployment"],
    order: 46,
    variation: "secondary",
    preview: {
      image: {
        src: "/assets/portfolio/swissport/preview.jpg",
        alt: "Swissport editorial case study preview",
      },
    },
  },
  {
    name: "iTSM Group",
    path: "/portfolio/itsmgroup",
    description:
      "Motion-led portfolio case study for itsmgroup.com, presenting planning, design thinking, customer integration, design systems, information architecture, GSAP animation, QA, and deployment.",
    badge: "Case Study",
    date: "2026",
    category: "Frontend Prototype",
    status: "Study",
    tech: ["Qwik", "GSAP", "Service Design", "Design System"],
    order: 47,
    variation: "clean",
    preview: {
      image: {
        src: "/assets/portfolio/itsmgroup/preview.svg",
        alt: "iTSM Group portfolio case study preview",
      },
    },
  },
  {
    name: "Cycling Scatterplot",
    path: "/portfolio/project012",
    description:
      "Interactive D3 scatterplot visualizing professional cycling times.",
    badge: "Data Viz",
    date: "2024",
    category: "Data Visualization",
    status: "Live",
    tech: ["Qwik", "D3", "SVG"],
    order: 50,
    variation: "primary",
    preview: {
      image: {
        src: "/assets/portfolio/project012/preview.png",
        alt: "Cycling scatterplot preview",
      },
    },
  },
  {
    name: "Global Temperature Heat Map",
    path: "/portfolio/project013",
    description:
      "Interactive D3 heat map visualizing global temperature variance.",
    badge: "Data Viz",
    date: "2024",
    category: "Data Visualization",
    status: "Live",
    tech: ["Qwik", "D3", "SVG"],
    order: 60,
    variation: "clean",
    preview: {
      image: {
        src: "/assets/portfolio/project013/preview.png",
        alt: "Global temperature heat map preview",
      },
    },
  },
  {
    name: "Education Choropleth",
    path: "/portfolio/project014",
    description:
      "Interactive D3 choropleth highlighting education attainment across U.S. counties.",
    badge: "Data Viz",
    date: "2024",
    category: "Data Visualization",
    status: "Live",
    tech: ["Qwik", "D3", "TopoJSON"],
    order: 70,
    variation: "clean",
    preview: {
      image: {
        src: "/assets/portfolio/project014/preview.png",
        alt: "Education choropleth preview",
      },
    },
  },
  {
    name: "Arcade Universe Treemap",
    path: "/portfolio/project015",
    description:
      "Interactive D3 treemap illustrating video game sales by genre with responsive legend and tooltips.",
    badge: "Data Viz",
    date: "2024",
    category: "Data Visualization",
    status: "Live",
    tech: ["Qwik", "D3", "SVG"],
    order: 80,
    variation: "clean",
    preview: {
      image: {
        src: "/assets/portfolio/project015/preview.png",
        alt: "Arcade Universe treemap preview",
      },
    },
  },
  {
    name: "Gently Scroll Gallery",
    path: "/portfolio/project016",
    description:
      "Scroll-triggered GSAP and Lenis gallery inspired by the Gently concept with floating imagery and sticky hero.",
    badge: "Motion Prototype",
    date: "2025",
    category: "Frontend Prototype",
    status: "Study",
    tech: ["Qwik", "GSAP", "Lenis"],
    order: 90,
    variation: "secondary",
    preview: {
      image: null,
      missingReason: "Preview artwork has not been exported yet.",
    },
  },
  {
    name: "ASCII Password Forge",
    path: "/portfolio/project017",
    description:
      "Brutalist password generator featuring ASCII-safe defaults, clipboard copy, and configurable strength controls.",
    badge: "Utility",
    date: "2025",
    category: "Utility",
    status: "Live",
    tech: ["Qwik", "TypeScript", "Local State"],
    order: 100,
    variation: "clean",
    preview: {
      image: {
        src: "/assets/portfolio/project017/preview.png",
        alt: "ASCII Password Forge preview",
      },
    },
  },
  {
    name: "Shopping Ledger Atelier",
    path: "/portfolio/project018",
    description:
      "Bold brutal shopping list atelier with offline storage, date-tagged lists, and adjustable frequent topic suggestions.",
    badge: "Utility",
    date: "2025",
    category: "Utility",
    status: "Live",
    tech: ["Qwik", "TypeScript", "Local Storage"],
    order: 110,
    variation: "clean",
    preview: {
      image: {
        src: "/assets/portfolio/project018/preview.png",
        alt: "Shopping Ledger Atelier preview",
      },
    },
  },
  {
    name: "Roman Numeral Converter",
    path: "/portfolio/roman-numeral-converter",
    description:
      "Roman numeral converter with live validation, history log, and subtractive pair legend.",
    badge: "Utility",
    date: "2025",
    category: "Utility",
    status: "Live",
    tech: ["Qwik", "TypeScript", "Validation"],
    order: 120,
    variation: "primary",
    preview: {
      image: {
        src: "/assets/portfolio/roman-numeral-converter/preview.png",
        alt: "Roman Numeral Converter preview",
      },
    },
  },
  {
    name: "Generative Art",
    path: "/portfolio/generative-art",
    description: "Interactive generative art example.",
    badge: "Generative Hub",
    date: "2024",
    category: "Creative Coding",
    status: "Live",
    tech: ["Qwik", "p5.js", "Canvas"],
    order: 130,
    variation: "clean",
    preview: {
      image: {
        src: "/assets/portfolio/generative-art/preview.png",
        alt: "Generative Art preview",
      },
    },
  },
  {
    name: "Drip Sort",
    path: "/portfolio/generative-art/drip-sort",
    description: "Black-and-white rectangles dripping downward while sorting.",
    badge: "Experiment",
    date: "2024",
    category: "Creative Coding",
    status: "Prototype",
    tech: ["Qwik", "p5.js", "Canvas"],
    order: 140,
    variation: "clean",
    preview: {
      image: {
        src: "/assets/portfolio/drip-sort/preview.png",
        alt: "Drip Sort preview",
      },
    },
  },
  {
    name: "Color Palette",
    path: "/portfolio/generative-art/color-palette",
    description: "Extract and sort colors from images using p5.js.",
    badge: "Experiment",
    date: "2024",
    category: "Creative Coding",
    status: "Prototype",
    tech: ["Qwik", "p5.js", "Color Analysis"],
    order: 150,
    variation: "primary",
    preview: {
      image: {
        src: "/assets/portfolio/color-palette/preview.png",
        alt: "Color Palette preview",
      },
    },
  },
  {
    name: "Crayon Brush Playground",
    path: "/portfolio/generative-art/crayon",
    description:
      "Interactive p5.brush sketch that responds to motion and gesture.",
    badge: "Experiment",
    date: "2024",
    category: "Creative Coding",
    status: "Prototype",
    tech: ["Qwik", "p5.js", "p5.brush"],
    order: 160,
    variation: "clean",
    preview: {
      image: null,
      missingReason: "Preview artwork has not been captured yet.",
    },
  },
  {
    name: "Connected Agents",
    path: "/portfolio/generative-art/connected-agents",
    description: "Form morphing process by connected random agents.",
    badge: "Experiment",
    date: "2024",
    category: "Creative Coding",
    status: "Prototype",
    tech: ["Qwik", "p5.js", "Generative Systems"],
    order: 170,
    variation: "clean",
    preview: {
      image: {
        src: "/assets/portfolio/connected-agents/preview.png",
        alt: "Connected Agents preview",
      },
    },
  },
] as const satisfies readonly PortfolioPageInput[];

export const portfolioPages: readonly PortfolioPage[] = [
  ...portfolioPageEntries,
]
  .sort((a, b) => a.order - b.order)
  .map((page) => ({
    ...page,
    image: page.preview.image ?? undefined,
    title: createPortfolioTitle(page.name),
  }));

export const portfolioRoutes: readonly SitemapRoute[] = portfolioPages.map(
  ({ name, path, flag }) => ({
    name,
    path,
    ...(flag ? { flag } : {}),
  }),
);

export const portfolioNavItems: readonly NavItem[] = portfolioPages.map(
  ({ name, path, flag }) => ({
    name,
    link: path,
    ...(flag ? { flag } : {}),
  }),
);

export const portfolioContentIssues: readonly PortfolioContentIssue[] =
  portfolioPages.flatMap((page) => {
    const issues: PortfolioContentIssue[] = [];

    if (!page.description.trim()) {
      issues.push({
        path: page.path,
        issue: "missing-description",
        message: "Portfolio entry needs a card and SEO description.",
      });
    }

    if (!page.preview.image) {
      issues.push({
        path: page.path,
        issue: "missing-preview",
        message: page.preview.missingReason,
      });
    }

    return issues;
  });

export const getPortfolioPage = (path: string) =>
  portfolioPages.find((page) => page.path === path);

export type { PortfolioPage };
