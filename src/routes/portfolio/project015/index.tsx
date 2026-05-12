import {
  component$,
  useSignal,
  useVisibleTask$,
  useStylesScoped$,
} from "@builder.io/qwik";
import treemapStyles from "./treemap.scss?inline";
import { buildPortfolioHead } from "~/utils/head";
import { useDemoLoadState, useFccTestLoader } from "~/utils/portfolio-demo";
import { setupTreemap } from "./treemap.client";
import { treemapCaseStudyStyles } from "./treemap.config";

export default component$(() => {
  useStylesScoped$(`${treemapStyles}\n${treemapCaseStudyStyles}`);

  const rootRef = useSignal<HTMLDivElement>();
  const { isLoading, errorMessage, refreshCounter, handleRefresh } =
    useDemoLoadState();

  useFccTestLoader();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => refreshCounter.value);

    const root = rootRef.value;
    if (!root) {
      isLoading.value = false;
      return;
    }

    try {
      isLoading.value = true;
      errorMessage.value = null;
      const cleanupTreemap = await setupTreemap(root);
      return () => cleanupTreemap?.();
    } catch (error) {
      console.error("Failed to load treemap data", error);
      errorMessage.value = "Failed to load treemap data. Please try again.";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="page project-page" ref={rootRef}>
      <article class="case-study-content">
        <header class="case-study-intro">
          <div class="case-study-meta">
            <span>Data Storytelling</span>
            <span>Treemap Visualization</span>
            <span>Video Game Sales</span>
          </div>
          <h1 id="title">Arcade Universe Treemap</h1>
          <p id="description" class="case-study-description">
            Explore the landscape of the best-selling video games by genre. Each
            block reveals a title, its category, and the millions of copies
            sold. The layout scales proportionally to sales performance,
            spotlighting dominant franchises within each category.
          </p>
        </header>

        <section class="border-[var(--surface-border, #1e293b)] bg-[var(--surface-glass-1, rgba(15,23,42,0.85))] mx-auto w-full max-w-3xl rounded-3xl border p-6 text-center shadow-[0_18px_60px_rgba(15,23,42,0.45)]">
          <p class="text-[var(--text3, #94a3b8)] text-[0.7rem] font-semibold tracking-[0.32em] uppercase">
            Data Visualization Projects
          </p>
          <p class="text-[var(--text2, #cbd5f5)] mt-3 text-sm leading-relaxed">
            The treemap consumes the FreeCodeCamp video game sales feed with
            fetch, shapes it into a D3 hierarchy, and applies the treemap layout
            to size every rectangle by revenue while tinting genres with a
            custom palette.
          </p>
          <p class="text-[var(--text2, #cbd5f5)] mt-3 text-sm leading-relaxed">
            Tap the refresh-and-fetch control to rerun the AJAX call, rebuild
            the hierarchy, and regenerate tooltips so the interactive grid
            always reflects the live dataset.
          </p>
        </section>

        <div class="text-[var(--text2, #cbd5f5)] mx-auto flex w-full max-w-3xl flex-col items-center gap-3 text-sm">
          <button
            type="button"
            onClick$={handleRefresh}
            class="text-[var(--text3, #94a3b8)] hover:text-[var(--primary, #38bdf8)] focus-visible:ring-[var(--primary, #38bdf8)] focus-visible:ring-offset-[var(--surface1, #0f172a)] inline-flex items-center gap-1.5 rounded-full border border-transparent bg-transparent px-3 py-1.5 text-[0.6rem] font-medium tracking-[0.22em] uppercase transition-colors duration-200 focus:outline-none focus-visible:ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
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
          <div
            aria-live="polite"
            class="text-[var(--text3, #94a3b8)] min-h-[1.5rem] text-center text-xs tracking-[0.28em] uppercase"
          >
            {isLoading.value && <span>Loading dataset…</span>}
            {!isLoading.value && errorMessage.value && (
              <span class="text-[var(--primary, #38bdf8)]">
                {errorMessage.value}
              </span>
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
              The treemap is rendered with D3&apos;s hierarchy utilities,
              translating raw category totals into proportional rectangles.
              Hover states reveal individual titles via an accessible tooltip
              that mirrors the FreeCodeCamp test requirements.
            </p>
            <p>
              Color groupings are generated dynamically from the data set,
              ensuring each genre maintains a distinctive hue in both the legend
              and tile grid. Layout spacing and radius are tuned for readability
              within the portfolio aesthetic.
            </p>
            <a class="open-demo-link" href="#treemap-container">
              Jump to treemap
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                width="16"
                height="16"
              >
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

export const head = buildPortfolioHead("/portfolio/project015");
