import { $, component$, useSignal, useVisibleTask$, useStylesScoped$ } from "@builder.io/qwik";
import * as d3 from "d3";
import treemapStyles from "./treemap.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

const caseStudyStyles = `
  .project-page {
    gap: clamp(2rem, 4vw, 3rem);
    padding-block: clamp(2.5rem, 5vw, 4rem) clamp(4rem, 8vw, 6rem);
  }

  .case-study-content {
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
    width: min(1080px, 100%);
  }

  .case-study-intro {
    display: grid;
    gap: 1rem;
    justify-items: center;
    text-align: center;
  }

  .case-study-intro h1 {
    color: var(--text1, #f8fafc);
  }

  .case-study-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    color: var(--text3, #94a3b8);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.32em;
  }

  .case-study-description {
    font-size: clamp(1rem, 0.9rem + 0.4vw, 1.15rem);
    line-height: 1.7;
    color: var(--text2, #e2e8f0);
    max-width: 72ch;
  }

  .case-study-layout {
    display: grid;
    gap: clamp(2rem, 5vw, 3rem);
    grid-template-columns: minmax(0, 1fr);
  }

  .case-study-notes {
    display: grid;
    gap: 1.25rem;
    padding: clamp(1.5rem, 3vw, 2.25rem);
    border-radius: 1.5rem;
    border: 1px solid color-mix(in srgb, var(--surface-border, #1e293b) 55%, transparent);
    background: color-mix(in srgb, var(--surface-glass-1, #1e293b) 90%, transparent);
    box-shadow: 0 24px 90px rgba(15, 23, 42, 0.35);
  }

  .case-study-notes h2 {
    text-transform: uppercase;
    letter-spacing: 0.24em;
    font-size: 0.95rem;
    color: var(--text1, #f8fafc);
  }

  .case-study-notes p {
    text-align: left;
    max-width: none;
    color: var(--text2, #e2e8f0);
  }

  .open-demo-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    align-self: start;
    padding: 0.75rem 1.5rem;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--primary, #38bdf8) 85%, transparent);
    color: var(--brand-inverted, #0f172a);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    box-shadow: 0 18px 60px color-mix(in srgb, var(--primary, #38bdf8) 45%, transparent);
    transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  }

  .open-demo-link:hover,
  .open-demo-link:focus-visible {
    transform: translateY(-2px);
    background: color-mix(in srgb, var(--primary, #38bdf8) 95%, var(--brand-core, #0ea5e9) 5%);
    box-shadow: 0 24px 80px color-mix(in srgb, var(--primary, #38bdf8) 55%, transparent);
  }

  .visual-wrapper {
    justify-self: center;
    width: 100%;
  }
`;

interface TreeMapNode {
  name: string;
  category: string;
  value: number;
  children?: TreeMapNode[];
}

const DATASET_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const FCC_TEST_SCRIPT_ID = "fcc-testable-projects";
const FCC_TEST_SCRIPT_SRC = "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js";

const triggerDomContentLoaded = () => {
  if (document.readyState !== "loading") {
    document.dispatchEvent(new Event("DOMContentLoaded"));
  }
};

const COLOR_PALETTE = [
  "#38bdf8",
  "#22d3ee",
  "#a855f7",
  "#f472b6",
  "#f97316",
  "#facc15",
  "#4ade80",
  "#2dd4bf",
  "#818cf8",
  "#e879f9",
  "#fb7185",
  "#f59e0b",
];

export default component$(() => {
  useStylesScoped$(`${treemapStyles}\n${caseStudyStyles}`);

  const isLoading = useSignal(true);
  const errorMessage = useSignal<string | null>(null);
  const refreshCounter = useSignal(0);

  const handleRefresh = $(() => {
    isLoading.value = true;
    errorMessage.value = null;
    refreshCounter.value++;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => refreshCounter.value);

    const container = d3.select<HTMLElement, unknown>("#treemap-container");
    if (container.empty()) {
      isLoading.value = false;
      return;
    }

    let cleanupTestScript: (() => void) | undefined;
    const existingScript = document.getElementById(FCC_TEST_SCRIPT_ID);
    if (existingScript) {
      triggerDomContentLoaded();
    } else {
      const script = document.createElement("script");
      const handleLoad = () => {
        script.removeEventListener("load", handleLoad);
        triggerDomContentLoaded();
      };

      script.id = FCC_TEST_SCRIPT_ID;
      script.src = FCC_TEST_SCRIPT_SRC;
      script.async = true;
      script.addEventListener("load", handleLoad);
      document.body.append(script);

      cleanupTestScript = () => {
        script.removeEventListener("load", handleLoad);
        script.remove();
      };
    }

    try {
      isLoading.value = true;
      errorMessage.value = null;
      const response = await fetch(DATASET_URL, {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as TreeMapNode;

      const width = 960;
      const height = 600;

      const hierarchyRoot = d3
        .hierarchy<TreeMapNode>(data)
        .sum((d) => d.value)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

      const treemap = d3.treemap<TreeMapNode>().size([width, height]).paddingInner(2).round(true);

      const root = treemap(hierarchyRoot);

      const leaves = root.leaves();
      const categories = Array.from(new Set(leaves.map((leaf) => leaf.data.category)));

      const color = d3
        .scaleOrdinal<string, string>()
        .domain(categories)
        .range(COLOR_PALETTE.slice(0, Math.max(categories.length, 2)));

      container.selectAll("*").remove();

      const svg = container
        .append("svg")
        .attr("class", "treemap-svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-labelledby", "title description");

      const tooltip = d3.select<HTMLDivElement, unknown>("#tooltip");

      const tiles = svg
        .selectAll<SVGGElement, typeof leaves[number]>("g")
        .data(leaves)
        .join("g")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

      tiles
        .append("rect")
        .attr("class", "tile")
        .attr("data-name", (d) => d.data.name)
        .attr("data-category", (d) => d.data.category)
        .attr("data-value", (d) => d.data.value)
        .attr("width", (d) => Math.max(0, d.x1 - d.x0))
        .attr("height", (d) => Math.max(0, d.y1 - d.y0))
        .attr("fill", (d) => color(d.data.category))
        .on("mousemove", (event, d) => {
          const [x, y] = [event.clientX + 20, event.clientY - 28];
          tooltip
            .classed("visible", true)
            .style("left", `${x}px`)
            .style("top", `${y}px`)
            .attr("data-value", d.data.value)
            .html(
              `<strong>${d.data.name}</strong><br />Category: ${d.data.category}<br />Value: ${d.data.value.toLocaleString()}`,
            );
        })
        .on("mouseleave", () => {
          tooltip.classed("visible", false);
        });

      tiles
        .append("text")
        .attr("class", "tile-label")
        .selectAll("tspan")
        .data((d) => d.data.name.split(/\s+/g))
        .join("tspan")
        .attr("x", 6)
        .attr("y", (_d, i) => 16 + i * 12)
        .text((word) => word);

      const legendRoot = d3.select<HTMLElement, unknown>("#legend");
      legendRoot.selectAll("*").remove();

      const legendWidth = 720;
      const legendRectSize = 18;
      const legendPadding = 12;
      const itemsPerRow = Math.max(1, Math.floor(legendWidth / 180));

      const legendSvg = legendRoot
        .append("svg")
        .attr("width", "100%")
        .attr(
          "viewBox",
          `0 0 ${legendWidth} ${Math.ceil(categories.length / itemsPerRow) * 32}`,
        )
        .attr("role", "presentation");

      const legendItems = legendSvg
        .selectAll<SVGGElement, string>("g")
        .data(categories)
        .join("g")
        .attr("transform", (_category, index) => {
          const row = Math.floor(index / itemsPerRow);
          const col = index % itemsPerRow;
          return `translate(${col * (legendRectSize * 6)}, ${row * 32})`;
        });

      legendItems
        .append("rect")
        .attr("class", "legend-item")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("fill", (category) => color(category));

      legendItems
        .append("text")
        .attr("class", "legend-label")
        .attr("x", legendRectSize + legendPadding)
        .attr("y", legendRectSize - 4)
        .text((category) => category);
    } catch (error) {
      console.error("Failed to load treemap data", error);
      errorMessage.value = "Failed to load treemap data. Please try again.";
    } finally {
      isLoading.value = false;
    }

    return () => {
      cleanupTestScript?.();
      container.selectAll("*").remove();
    };
  });

  return (
    <div class="page project-page">
      <article class="case-study-content">
        <header class="case-study-intro">
          <div class="case-study-meta">
            <span>Data Storytelling</span>
            <span>Treemap Visualization</span>
            <span>Video Game Sales</span>
          </div>
          <h1 id="title">Arcade Universe Treemap</h1>
          <p id="description" class="case-study-description">
            Explore the landscape of the best-selling video games by genre. Each block reveals a title, its category,
            and the millions of copies sold. The layout scales proportionally to sales performance, spotlighting
            dominant franchises within each category.
          </p>
        </header>

        <section class="mx-auto w-full max-w-3xl rounded-3xl border border-[var(--surface-border, #1e293b)] bg-[var(--surface-glass-1, rgba(15,23,42,0.85))] p-6 text-center shadow-[0_18px_60px_rgba(15,23,42,0.45)]">
          <p class="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[var(--text3, #94a3b8)]">
            Data Visualization Projects
          </p>
          <p class="mt-3 text-sm leading-relaxed text-[var(--text2, #cbd5f5)]">
            The treemap consumes the FreeCodeCamp video game sales feed with fetch, shapes it into a D3 hierarchy, and applies
            the treemap layout to size every rectangle by revenue while tinting genres with a custom palette.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-[var(--text2, #cbd5f5)]">
            Tap the refresh-and-fetch control to rerun the AJAX call, rebuild the hierarchy, and regenerate tooltips so the
            interactive grid always reflects the live dataset.
          </p>
        </section>

        <div class="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 text-sm text-[var(--text2, #cbd5f5)]">
          <button
            type="button"
            onClick$={handleRefresh}
            class="inline-flex items-center gap-1.5 rounded-full border border-transparent bg-transparent px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-[var(--text3, #94a3b8)] transition-colors duration-200 hover:text-[var(--primary, #38bdf8)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary, #38bdf8)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1, #0f172a)] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoading.value}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class={`h-3.5 w-3.5 ${isLoading.value ? "animate-spin" : ""}`}
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-4.99m0 0L18.82 7.552A8.25 8.25 0 1 0 20.3 15.3"
              />
            </svg>
            {isLoading.value ? "Refreshing" : "Refresh data"}
          </button>
          <div aria-live="polite" class="min-h-[1.5rem] text-center text-xs uppercase tracking-[0.28em] text-[var(--text3, #94a3b8)]">
            {isLoading.value && <span>Loading dataset…</span>}
            {!isLoading.value && errorMessage.value && (
              <span class="text-[var(--primary, #38bdf8)]">{errorMessage.value}</span>
            )}
          </div>
        </div>

        <div class="case-study-layout">
          <div class="visual-wrapper">
            <section class="treemap-card">
              <div id="treemap-container" aria-live="polite" />
            </section>
            <section class="legend-card">
              <h2 class="sr-only">Legend</h2>
              <div id="legend" />
            </section>
          </div>
          <aside class="case-study-notes">
            <h2>Process Notes</h2>
            <p>
              The treemap is rendered with D3&apos;s hierarchy utilities, translating raw category totals into proportional
              rectangles. Hover states reveal individual titles via an accessible tooltip that mirrors the FreeCodeCamp
              test requirements.
            </p>
            <p>
              Color groupings are generated dynamically from the data set, ensuring each genre maintains a distinctive
              hue in both the legend and tile grid. Layout spacing and radius are tuned for readability within the
              portfolio aesthetic.
            </p>
            <a class="open-demo-link" href="#treemap-container">
              Jump to treemap
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="16" height="16">
                <path
                  fill-rule="evenodd"
                  d="M5.22 14.78a.75.75 0 0 1 0-1.06L10.94 8l-5.72-5.72a.75.75 0 0 1 1.06-1.06l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </aside>
        </div>
      </article>
      <div id="tooltip" role="tooltip" aria-hidden="true" />
    </div>
  );
});

export const head = buildHead(
  `Project 015 – Arcade Universe Treemap | ${siteConfig.metadata.title}`,
  "Interactive D3 treemap showcasing global video game sales by genre, built for the FreeCodeCamp data visualization certification.",
);
