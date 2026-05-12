import {
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./project012.scss?inline";
import { buildPortfolioHead } from "~/utils/head";
import { useDemoLoadState, useFccTestLoader } from "~/utils/portfolio-demo";
import { setupCyclistScatterplot } from "./cyclist-scatterplot.client";
import type { CyclistDatum } from "./cyclist-scatterplot.model";

export default component$(() => {
  useStylesScoped$(styles);

  const rootRef = useSignal<HTMLElement>();
  const cyclists = useSignal<CyclistDatum[]>([]);
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
      const runtime = await setupCyclistScatterplot(root);
      cyclists.value = runtime?.cyclists ?? [];
      return () => runtime?.cleanup();
    } catch (error) {
      console.error("Failed to load cyclist data", error);
      errorMessage.value = "Failed to load cyclist data. Please try again.";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <section class="layout-shell project012" ref={rootRef}>
      <div class="project012__hero">
        <p class="project012__eyebrow">Data Storytelling</p>
        <h1 class="project012__title">
          Visualize Data with a Scatterplot Graph
        </h1>
        <p class="project012__lead">
          A D3 scatterplot plotting professional cycling times against the year
          of competition. Hover or focus on each racer to explore doping
          allegations, nationalities, and performance patterns.
        </p>
      </div>

      <div class="project012__note">
        <p class="project012__note-title">Data Visualization Projects</p>
        <p class="project012__note-copy">
          Here we fetch the professional cycling dataset, parse each
          rider&apos;s record, and map it onto D3 linear and time scales to draw
          the scatterplot while color-coding doping allegations and wiring up
          focusable tooltips.
        </p>
        <p class="project012__note-copy">
          Hit the refresh-and-fetch button to issue a fresh AJAX request,
          rebuild the SVG marks, and explore how the legend and interactions
          respond to the live dataset.
        </p>
      </div>

      <div class="project012__controls">
        <button
          type="button"
          onClick$={handleRefresh}
          class="project012__refresh"
          disabled={isLoading.value}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class={`project012__refresh-icon${isLoading.value ? "project012__refresh-icon--spinning" : ""}`}
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
        <div aria-live="polite" class="project012__status">
          {isLoading.value && <span>Loading dataset…</span>}
          {!isLoading.value && errorMessage.value && (
            <span class="project012__error">{errorMessage.value}</span>
          )}
        </div>
      </div>

      <div class="project012__chart project012__chart-theme">
        <svg role="img" aria-labelledby="title" />
        <div id="tooltip" class="project012__tooltip" aria-hidden="true" />
      </div>

      {cyclists.value.length > 0 && (
        <div class="project012__leaderboard project012__chart-theme">
          <div class="project012__leaderboard-inner">
            <h2>Race leaderboard</h2>
            <p>
              Scroll the mobile table to compare finishing times and see which
              riders carried doping allegations.
            </p>
            <div class="project012__table-shell">
              <div class="project012__table-scroll">
                <table class="project012__table">
                  <caption class="project012__sr-only">
                    Cyclist finishing times with doping allegation status
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Year</th>
                      <th scope="col">Athlete</th>
                      <th scope="col">Time</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cyclists.value.map((rider) => (
                      <tr key={`${rider.year}-${rider.name}`}>
                        <th scope="row" class="project012__table-year">
                          {rider.year}
                        </th>
                        <td>
                          <div class="project012__table-name">{rider.name}</div>
                          <div class="project012__table-nationality">
                            {rider.nationality}
                          </div>
                        </td>
                        <td class="project012__table-time">
                          {rider.timeLabel}
                        </td>
                        <td>
                          <span
                            class={`project012__status-pill ${
                              rider.doping
                                ? "project012__status-pill--doping"
                                : "project012__status-pill--clean"
                            }`}
                            title={rider.doping || undefined}
                          >
                            {rider.doping ? "ALLEGED" : "CLEAR"}
                          </span>
                          {rider.doping && (
                            <p class="project012__table-doping">
                              {rider.doping}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

export const head = buildPortfolioHead("/portfolio/project012");
