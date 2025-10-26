import { component$, useStyles$, type Component } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import ImgHeroPortrait from "~/media/assets/images/heros/image.png?jsx";
import ImgCaseStudyCard from "~/media/assets/images/portfolio/case-study.svg?jsx";
import ImgColorThemeCard from "~/media/assets/images/portfolio/color-theme.svg?jsx";
import ImgDataVizCard from "~/media/assets/images/portfolio/data-viz.svg?jsx";
import ImgFarbkastenCard from "~/media/assets/images/portfolio/farbkasten.svg?jsx";
import ImgGenerativeArtCard from "~/media/assets/images/portfolio/generative-art.svg?jsx";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import portfolioPages from "~/config/portfolio-pages.json";
import { buildHead } from "~/utils/head";

const hotTopics = [
  "Design Systems",
  "Accessibility",
  "AI Frontend",
  "Web Performance",
  "Creative Coding",
  "Design Tokens",
];

const heroHighlights = [
  { label: "Role", value: "Senior Frontend Engineer" },
  { label: "Experience", value: "10+ Years in Product Teams" },
  { label: "Location", value: "Frankfurt am Main, Germany" },
];

type PortfolioPage = (typeof portfolioPages)[number];

type ProjectMediaComponent = Component<{
  alt?: string;
  class?: string;
  loading?: "eager" | "lazy";
}>;

type ProjectMedia = {
  component: ProjectMediaComponent;
  alt: string;
  overlayClass: string;
};

const projectLayoutMap: Record<string, { card: string; media?: string }> = {
  "/portfolio/color-theme": {
    card: "md:col-span-2 md:row-span-2 lg:col-span-2",
    media: "md:aspect-auto md:h-full",
  },
  "/portfolio/farbkasten": {
    card: "md:row-span-2",
    media: "md:aspect-auto md:h-full",
  },
  "/portfolio/project002": {
    card: "md:col-span-2",
    media: "md:aspect-[16/9]",
  },
  "/portfolio/project006": {
    card: "md:col-span-2 lg:col-span-1",
  },
  "/portfolio/project010": {
    card: "md:col-span-2",
    media: "md:aspect-[16/9]",
  },
  "/portfolio/project011": {
    card: "md:col-span-2 md:row-span-2",
    media: "md:aspect-auto md:h-full",
  },
  "/portfolio/generative-art": {
    card: "md:col-span-2 md:row-span-2",
    media: "md:aspect-auto md:h-full",
  },
};

const defaultLayout = { card: "", media: "" };

const getCardLayout = (page: PortfolioPage) => ({
  ...defaultLayout,
  ...projectLayoutMap[page.path],
});

const getProjectMedia = (page: PortfolioPage): ProjectMedia => {
  if (page.path === "/portfolio/color-theme") {
    return {
      component: ImgColorThemeCard,
      alt: "Color system interface with swatch palettes",
      overlayClass:
        "bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.3)_0%,_rgba(15,23,42,0.1)_55%,_rgba(9,9,11,0.9)_100%)]",
    };
  }

  if (page.path === "/portfolio/farbkasten") {
    return {
      component: ImgFarbkastenCard,
      alt: "Interactive painting interface with expressive brush strokes",
      overlayClass:
        "bg-[radial-gradient(circle_at_top_right,_rgba(236,72,153,0.32)_0%,_rgba(9,9,11,0.65)_60%,_transparent_100%)]",
    };
  }

  if (page.path.startsWith("/portfolio/generative-art")) {
    return {
      component: ImgGenerativeArtCard,
      alt: "Generative art orbit made of luminous particles",
      overlayClass:
        "bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.26)_0%,_rgba(34,211,238,0.12)_40%,_rgba(2,6,23,0.85)_100%)]",
    };
  }

  if (
    ["011", "012", "013", "014", "015"].some((suffix) =>
      page.path.includes(`project${suffix}`)
    )
  ) {
    return {
      component: ImgDataVizCard,
      alt: "Dashboard visualizing line and bar charts",
      overlayClass:
        "bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.28)_0%,_rgba(15,23,42,0.78)_65%,_rgba(3,7,18,0.92)_100%)]",
    };
  }

  return {
    component: ImgCaseStudyCard,
    alt: "Interface layouts showing modular product surfaces",
    overlayClass:
      "bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.24)_0%,_rgba(15,23,42,0.82)_60%,_rgba(3,7,18,0.92)_100%)]",
  };
};

const getProjectBadge = (page: PortfolioPage) => {
  if (page.path === "/portfolio/color-theme") {
    return "Design Tokens";
  }

  if (page.path === "/portfolio/farbkasten") {
    return "Creative Coding";
  }

  if (page.path.startsWith("/portfolio/generative-art")) {
    return page.path === "/portfolio/generative-art" ? "Generative Hub" : "Experiment";
  }

  if (page.name.toLowerCase().includes("project")) {
    return "Case Study";
  }

  return "Case Study";
};

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/markus-morley/",
    abbr: "Li",
  },
  { name: "GitHub", href: "https://github.com/gasseklopper", abbr: "Gh" },
  {
    name: "Instagram",
    href: "https://www.instagram.com/yelrom_/",
    abbr: "In",
  },
];

export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <section class="layout-shell relative mt-10 text-[var(--text1)] md:mt-16">
        <div class="relative w-full overflow-hidden rounded-[2.5rem] border border-[var(--surface-border)] bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--surface2)_92%,transparent)_0%,_var(--surface1)_68%,_color-mix(in_srgb,var(--surface3)_88%,transparent)_100%)] px-6 py-12 shadow-[0_32px_120px_var(--surface-shadow)] transition-colors duration-300 md:px-12">
          <div
            aria-hidden="true"
            class="pointer-events-none absolute -left-24 -top-32 h-64 w-64 rounded-full bg-[radial-gradient(circle,_color-mix(in_srgb,var(--primary)_40%,transparent)_0%,_transparent_70%)] opacity-70 blur-3xl md:-left-28 md:-top-40 md:h-80 md:w-80"
          />
          <div
            aria-hidden="true"
            class="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,_color-mix(in_srgb,var(--tertiary)_32%,transparent)_0%,_transparent_70%)] opacity-50 blur-3xl md:-right-36 md:h-96 md:w-96"
          />

          <div class="relative grid gap-8 md:grid-cols-3 lg:grid-cols-[320px_1fr]">
            <aside class="flex flex-col gap-6 rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-8 text-[var(--text2)] shadow-[0_24px_80px_var(--surface-shadow)] backdrop-blur-xl transition-colors duration-300">
              <div class="relative mx-auto flex aspect-square w-40 items-center justify-center overflow-hidden rounded-[2.5rem] border border-[color-mix(in_srgb,var(--surface-border)_65%,transparent)] bg-[var(--surface1)] shadow-[0_20px_60px_var(--surface-shadow)]">
                <div class="absolute inset-0 rounded-[2.5rem] border border-[color-mix(in_srgb,var(--primary)_35%,transparent)] opacity-70" />
                <ImgHeroPortrait
                  alt="Portrait of Markus Morley"
                  class="relative h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div class="text-center text-[var(--text1)]">
                <h1 class="text-3xl font-semibold md:text-4xl">Portfolio</h1>
                <p class="mt-2 text-xs font-semibold uppercase tracking-[0.38em] text-[var(--text3)]">
                  Crafted interfaces & design systems
                </p>
              </div>
              <div class="flex flex-col gap-4">
                {heroHighlights.map((highlight) => (
                  <div
                    key={highlight.label}
                    class="flex flex-col gap-1 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-2)] p-4 text-left text-[var(--text2)] shadow-[0_16px_50px_var(--surface-shadow)] transition-colors duration-300"
                  >
                    <span class="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[var(--text3)]">
                      {highlight.label}
                    </span>
                    <span class="text-sm font-semibold text-[var(--text1)]">
                      {highlight.value}
                    </span>
                  </div>
                ))}
              </div>
              <div class="flex flex-col items-center gap-3">
                <Link
                  href="/about#download-cv"
                  class="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.34em] text-[var(--brand-inverted)] shadow-[0_18px_50px_var(--brand-glow)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,_var(--primary)_85%,_var(--brand-core)_15%)] hover:shadow-[0_24px_70px_var(--brand-glow)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
                >
                  Download CV
                </Link>
                <div class="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Follow Markus Morley on ${social.name}`}
                      class="grid h-10 w-10 place-items-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-2)] text-[var(--text2)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,_var(--surface1)_35%,_transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
                    >
                      <span class="text-xs font-semibold uppercase tracking-[0.36em]">
                        {social.abbr}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            <div class="flex flex-col justify-between gap-10 rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-8 text-[var(--text2)] shadow-[0_24px_80px_var(--surface-shadow)] backdrop-blur-xl transition-colors duration-300 md:col-span-2 lg:col-span-1">
              <div class="flex flex-col gap-6">
                <span class="inline-flex w-fit items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-2)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-[var(--text3)] shadow-[0_12px_36px_var(--surface-shadow)]">
                  Selected works 2021—2024
                </span>
                <p class="max-w-2xl text-lg leading-relaxed text-[var(--text2)] md:text-xl">
                  A curated view of digital products, brand experiments, and immersive experiences that balance accessibility with expressive aesthetics. Each case study demonstrates how design tokens, component systems, and performance-minded engineering meet to deliver premium user journeys.
                </p>
                <div class="flex flex-wrap items-center gap-4">
                  <Link
                    href="/about"
                    class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.34em] text-[var(--primary)] transition-transform transition-colors duration-300 hover:-translate-y-0.5 hover:text-[var(--brand-core)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
                  >
                    About the process
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.22 14.78a.75.75 0 0 1 0-1.06L10.94 8l-5.72-5.72a.75.75 0 1 1 1.06-1.06l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
              <div>
                <h2 class="text-sm font-semibold uppercase tracking-[0.4em] text-[var(--text3)]">
                  Hot topics
                </h2>
                <ul class="mt-4 flex flex-wrap gap-3">
                  {hotTopics.map((topic) => (
                    <li key={topic}>
                      <span class="inline-flex items-center gap-2 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-2)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)]">
                        {topic}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="layout-shell relative mt-16 pb-12 text-[var(--text1)] md:mt-24">
        <div class="w-full">
          <header class="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--primary)]">
                Case studies
              </p>
              <h2 class="text-3xl font-semibold md:text-4xl">Project Library</h2>
            </div>
            <p class="max-w-2xl text-sm text-[var(--text3)] md:text-base">
              Explore how modular systems, inclusive design, and generative aesthetics translate into real-world launches. Each project card opens a deep dive with process notes, component inventories, and outcomes.
            </p>
          </header>
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(280px,_1fr)]">
            {portfolioPages.map((p) => {
              const { card: cardLayout, media: mediaLayout } = getCardLayout(p);
              const { component: MediaComponent, alt, overlayClass } = getProjectMedia(p);

              return (
                <Link
                  href={p.path}
                  key={p.path}
                  aria-label={`Open portfolio project ${p.name}`}
                  class={`group relative flex h-full flex-col gap-6 overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-6 text-[var(--text2)] shadow-[0_24px_80px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_32px_110px_var(--surface-shadow)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)] ${cardLayout}`}
                >
                  <div
                    class={`project-card-media relative overflow-hidden rounded-[1.5rem] border border-[color-mix(in_srgb,var(--surface-border)_60%,transparent)] bg-[var(--surface-glass-2)] shadow-[0_20px_60px_var(--surface-shadow)] ${mediaLayout}`}
                  >
                    <div
                      aria-hidden="true"
                      class={`absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100 ${overlayClass}`}
                    />
                    <MediaComponent
                      alt={alt}
                      class="relative h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div class="flex flex-col gap-4">
                    <span class="inline-flex w-fit items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-2)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-[var(--text3)] transition-colors duration-300 group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]">
                      {getProjectBadge(p)}
                    </span>
                    <div class="flex flex-col gap-3">
                      <h3 class="text-2xl font-semibold text-[var(--text1)] transition-colors duration-300 group-hover:text-[var(--primary)]">
                        {p.name}
                      </h3>
                      <p class="text-sm leading-relaxed text-[var(--text2)] md:text-base">
                        {p.description}
                      </p>
                    </div>
                  </div>
                  <span class="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--primary)] transition-all duration-300 group-hover:gap-3 group-hover:text-[var(--brand-core)]">
                    View details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.22 14.78a.75.75 0 0 1 0-1.06L10.94 8l-5.72-5.72a.75.75 0 1 1 1.06-1.06l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
});

export const head = buildHead(`Portfolio - ${siteConfig.metadata.title}`);
