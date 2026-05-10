import {
  $,
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import * as d3 from "d3";
import styles from "./project012.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { FCC_TEST_SCRIPT_ID, FCC_TEST_SCRIPT_SRC, resetFccTestSuiteUI } from "~/utils/fcc-test-suite";
import { buildHead } from "~/utils/head";

const DATA_URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const triggerDomContentLoaded = () => {
  if (document.readyState !== "loading") {
    document.dispatchEvent(new Event("DOMContentLoaded"));
  }
};

interface CyclistDatum {
  name: string;
  nationality: string;
  year: number;
  time: Date;
  timeLabel: string;
  doping: string;
}

export default component$(() => {
  useStylesScoped$(styles);

  const svgRef = useSignal<SVGSVGElement>();
  const tooltipRef = useSignal<HTMLDivElement>();
  const wrapperRef = useSignal<HTMLDivElement>();
  const cyclists = useSignal<CyclistDatum[]>([]);
  const isLoading = useSignal(true);
  const errorMessage = useSignal<string | null>(null);
  const refreshCounter = useSignal(0);

  const handleRefresh = $(() => {
    isLoading.value = true;
    errorMessage.value = null;
    refreshCounter.value++;
  });

  // Load FCC testing bundle for manual verification when available
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    resetFccTestSuiteUI();

    const existingScript = document.getElementById(
      FCC_TEST_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    const handleLoad = () => {
      triggerDomContentLoaded();
    };

    const script = existingScript ?? document.createElement("script");
    const createdScript = existingScript === null;

    if (existingScript) {
      triggerDomContentLoaded();
    } else {
      script.id = FCC_TEST_SCRIPT_ID;
      script.src = FCC_TEST_SCRIPT_SRC;
      script.async = true;
      script.addEventListener("load", handleLoad);
      document.body.appendChild(script);
    }

    return () => {
      if (createdScript) {
        script.removeEventListener("load", handleLoad);
      }
      if (script.isConnected) {
        script.remove();
      }
      resetFccTestSuiteUI();
    };
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => refreshCounter.value);

    const svgElement = svgRef.value;
    const tooltipElement = tooltipRef.value;
    const wrapperElement = wrapperRef.value;

    if (!svgElement || !tooltipElement || !wrapperElement) {
      isLoading.value = false;
      return;
    }

    const svg = d3.select(svgElement);
    const tooltip = d3.select(tooltipElement);
    let cleanupResize: (() => void) | undefined;

    try {
      isLoading.value = true;
      errorMessage.value = null;
      const response = await fetch(DATA_URL, {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload: Array<{
        Name: string;
        Nationality: string;
        Year: number;
        Time: string;
        Doping: string;
      }> = await response.json();

      const dataset: CyclistDatum[] = payload.map((item) => {
        const [minutes, seconds] = item.Time.split(":").map(Number);
        const time = new Date(Date.UTC(1970, 0, 1, 0, minutes, seconds));

        return {
          name: item.Name,
          nationality: item.Nationality,
          year: item.Year,
          time,
          timeLabel: item.Time,
          doping: item.Doping,
        };
      });

      cyclists.value = dataset;

      const renderChart = () => {
        const measuredWidth = wrapperElement.clientWidth || 960;
        const width = Math.min(960, Math.max(measuredWidth, 320));
        const isCompact = width < 720;
        const height = isCompact ? 480 : 520;
        const margin = isCompact
          ? { top: 72, right: 40, bottom: 136, left: 68 }
          : { top: 84, right: 60, bottom: 124, left: 80 };
        const innerWidth = Math.max(width - margin.left - margin.right, 200);
        const innerHeight = height - margin.top - margin.bottom;

        svg.selectAll("*").remove();
        svg
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMidYMid meet");

        tooltip.style("opacity", 0).style("transform", "translate(-50%, -100%) scale(0.98)");

        const xExtent = d3.extent(dataset, (d) => d.year) as [number, number];
        const yExtent = d3.extent(dataset, (d) => d.time) as [Date, Date];

        const xScale = d3.scaleLinear().domain(xExtent).range([0, innerWidth]);
        const yScale = d3.scaleTime().domain(yExtent).range([innerHeight, 0]);

        const chartGroup = svg
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        const xAxis = d3
          .axisBottom<number>(xScale)
          .tickFormat(d3.format("d"))
          .ticks(isCompact ? Math.max(5, Math.floor(innerWidth / 80)) : 10);

        const timeFormatter = d3.timeFormat("%M:%S");
        const yAxis = d3
          .axisLeft<Date | d3.NumberValue>(yScale)
          .tickFormat((value) => timeFormatter(value as Date))
          .ticks(isCompact ? 6 : 8);

        chartGroup
          .append("g")
          .attr("id", "x-axis")
          .attr("class", "axis")
          .attr("transform", `translate(0,${innerHeight})`)
          .call(xAxis);

        chartGroup
          .append("g")
          .attr("id", "y-axis")
          .attr("class", "axis")
          .call(yAxis);

        const dotRadius = isCompact ? 5 : 6;
        const tooltipOffset = isCompact ? 40 : 32;

        const points = chartGroup
          .selectAll<SVGCircleElement, CyclistDatum>(".dot")
          .data(dataset)
          .join("circle")
          .attr("class", (d) => `dot ${d.doping ? "dot--doping" : "dot--clean"}`)
          .attr("fill", (d) =>
            d.doping ? "var(--chart-dot-doping-fill)" : "var(--chart-dot-clean-fill)"
          )
          .attr("stroke", (d) =>
            d.doping ? "var(--chart-dot-doping-stroke)" : "var(--chart-dot-clean-stroke)"
          )
          .attr("r", dotRadius)
          .attr("cx", (d) => xScale(d.year))
          .attr("cy", (d) => yScale(d.time))
          .attr("data-xvalue", (d) => d.year)
          .attr("data-yvalue", (d) => d.time.toISOString())
          .attr("tabindex", 0);

        const showTooltip = (event: MouseEvent | FocusEvent, datum: CyclistDatum) => {
          let x: number;
          let y: number;

          if (event instanceof MouseEvent) {
            [x, y] = d3.pointer(event, wrapperElement);
          } else {
            const target = event.target as SVGCircleElement | null;
            const cx = Number(target?.getAttribute("cx") ?? 0);
            const cy = Number(target?.getAttribute("cy") ?? 0);
            x = margin.left + cx;
            y = margin.top + cy;
          }

          const dopingInfo = datum.doping
            ? `<div class="project012__tooltip-doping">${datum.doping}</div>`
            : "";

          tooltip
            .style("opacity", 1)
            .style("transform", "translate(-50%, -110%) scale(1)")
            .attr("data-year", datum.year.toString())
            .html(
              `<div class="project012__tooltip-meta">${datum.year} - ${datum.timeLabel}</div>` +
                `<div class="project012__tooltip-name">${datum.name}</div>` +
                `<div class="project012__tooltip-nationality">${datum.nationality}</div>` +
                dopingInfo,
            )
            .style("left", `${x}px`)
            .style("top", `${y - tooltipOffset}px`);
        };

        const hideTooltip = () => {
          tooltip.style("opacity", 0).style("transform", "translate(-50%, -100%) scale(0.98)");
        };

        points
          .on("mouseenter", function (event, d) {
            showTooltip(event as MouseEvent, d);
            d3.select(this).raise().attr("r", dotRadius + 2);
          })
          .on("mousemove", function (event, d) {
            showTooltip(event as MouseEvent, d);
          })
          .on("mouseleave", () => {
            hideTooltip();
            points.attr("r", dotRadius);
          })
          .on("focus", function (event, d) {
            showTooltip(event as FocusEvent, d);
            d3.select(this).raise().attr("r", dotRadius + 2);
          })
          .on("blur", () => {
            hideTooltip();
            points.attr("r", dotRadius);
          });

        chartGroup
          .append("text")
          .attr("x", innerWidth / 2)
          .attr("y", isCompact ? -28 : -36)
          .attr("text-anchor", "middle")
          .attr("id", "title")
          .attr("fill", "var(--text1)")
          .attr("font-size", isCompact ? "1.28rem" : "1.85rem")
          .attr("font-family", "var(--font-semibold)")
          .attr("letter-spacing", "0.02em")
          .text("Professional Cyclist Performance");

        chartGroup
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -innerHeight / 2)
          .attr("y", isCompact ? -52 : -58)
          .attr("text-anchor", "middle")
          .attr("fill", "var(--text2)")
          .attr("font-size", isCompact ? "0.8rem" : "0.85rem")
          .attr("font-family", "var(--font-medium)")
          .text("Race Time (minutes)");

        chartGroup
          .append("text")
          .attr("x", innerWidth / 2)
          .attr("y", innerHeight + (isCompact ? 56 : 48))
          .attr("text-anchor", "middle")
          .attr("fill", "var(--text2)")
          .attr("font-size", isCompact ? "0.8rem" : "0.85rem")
          .attr("font-family", "var(--font-medium)")
          .text("Year");

        const legendYOffset = innerHeight + (isCompact ? 96 : 80);
        const legendXOffset = 0;

        const legend = chartGroup
          .append("g")
          .attr("id", "legend")
          .attr("transform", `translate(${legendXOffset}, ${legendYOffset})`);

        const legendItems: Array<{ label: string; className: string }> = [
          { label: "Riders with doping allegations", className: "dot--doping" },
          { label: "No doping allegations", className: "dot--clean" },
        ];

        const legendGroup = legend
          .selectAll<SVGGElement, { label: string; className: string }>("g")
          .data(legendItems)
          .join("g")
          .attr("transform", (_, index) => `translate(0, ${index * 28})`);

        legendGroup
          .append("circle")
          .attr("r", dotRadius)
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("class", (d) => `legend-dot ${d.className}`)
          .attr("fill", (d) =>
            d.className === "dot--doping"
              ? "var(--chart-dot-doping-fill)"
              : "var(--chart-dot-clean-fill)"
          )
          .attr("stroke", (d) =>
            d.className === "dot--doping"
              ? "var(--chart-dot-doping-stroke)"
              : "var(--chart-dot-clean-stroke)"
          );

        legendGroup
          .append("text")
          .attr("x", dotRadius + 10)
          .attr("y", 4)
          .text((d) => d.label);
      };

      renderChart();

      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(() => {
          renderChart();
        });
        observer.observe(wrapperElement);
        cleanupResize = () => observer.disconnect();
      } else {
        const handleResize = () => renderChart();
        window.addEventListener("resize", handleResize);
        cleanupResize = () => window.removeEventListener("resize", handleResize);
      }
    } catch (error) {
      console.error("Failed to load cyclist data", error);
      errorMessage.value = "Failed to load cyclist data. Please try again.";
    } finally {
      isLoading.value = false;
    }

    return () => {
      cleanupResize?.();
      svg.selectAll("*").remove();
    };
  });

  return (
    <section class="layout-shell project012">
      <div class="project012__hero">
        <p class="project012__eyebrow">Data Storytelling</p>
        <h1 class="project012__title">
          Visualize Data with a Scatterplot Graph
        </h1>
        <p class="project012__lead">
          A D3 scatterplot plotting professional cycling times against the year of competition. Hover or focus on each
          racer to explore doping allegations, nationalities, and performance patterns.
        </p>
      </div>

      <div class="project012__note">
        <p class="project012__note-title">
          Data Visualization Projects
        </p>
        <p class="project012__note-copy">
          Here we fetch the professional cycling dataset, parse each rider&apos;s record, and map it onto D3 linear and time
          scales to draw the scatterplot while color-coding doping allegations and wiring up focusable tooltips.
        </p>
        <p class="project012__note-copy">
          Hit the refresh-and-fetch button to issue a fresh AJAX request, rebuild the SVG marks, and explore how the legend
          and interactions respond to the live dataset.
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
            class={`project012__refresh-icon${isLoading.value ? " project012__refresh-icon--spinning" : ""}`}
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

      <div ref={wrapperRef} class="project012__chart project012__chart-theme">
        <svg ref={svgRef} role="img" aria-labelledby="title" />
        <div
          ref={tooltipRef}
          id="tooltip"
          class="project012__tooltip"
          aria-hidden="true"
        />
      </div>

      {cyclists.value.length > 0 && (
        <div class="project012__leaderboard project012__chart-theme">
          <div class="project012__leaderboard-inner">
            <h2>Race leaderboard</h2>
            <p>
              Scroll the mobile table to compare finishing times and see which riders carried doping allegations.
            </p>
            <div class="project012__table-shell">
              <div class="project012__table-scroll">
                <table class="project012__table">
                  <caption class="project012__sr-only">Cyclist finishing times with doping allegation status</caption>
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
                      <tr
                        key={`${rider.year}-${rider.name}`}
                      >
                        <th scope="row" class="project012__table-year">
                          {rider.year}
                        </th>
                        <td>
                          <div class="project012__table-name">{rider.name}</div>
                          <div class="project012__table-nationality">{rider.nationality}</div>
                        </td>
                        <td class="project012__table-time">{rider.timeLabel}</td>
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
                            <p class="project012__table-doping">{rider.doping}</p>
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

export const head = buildHead(
  `Project 012 - ${siteConfig.metadata.title}`,
  "Interactive D3 scatterplot visualizing professional cyclist times and doping allegations.",
);
