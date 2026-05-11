import {
  $,
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import * as d3 from "d3";
import styles from "./project013.scss?inline";
import { siteMetadata } from "~/config/site";
import {
  FCC_TEST_SCRIPT_ID,
  FCC_TEST_SCRIPT_SRC,
  resetFccTestSuiteUI,
} from "~/utils/fcc-test-suite";
import { buildHead } from "~/utils/head";

const DATA_URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const triggerDomContentLoaded = () => {
  if (document.readyState !== "loading") {
    document.dispatchEvent(new Event("DOMContentLoaded"));
  }
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const colorPalette = [
  "var(--heat-cold-1)",
  "var(--heat-cold-2)",
  "var(--heat-neutral-1)",
  "var(--heat-warm-1)",
  "var(--heat-warm-2)",
  "var(--heat-hot-1)",
  "var(--heat-hot-2)",
];

type HeatmapDatum = {
  year: number;
  monthIndex: number;
  temp: number;
  variance: number;
};

export default component$(() => {
  useStylesScoped$(styles);

  const svgRef = useSignal<SVGSVGElement>();
  const tooltipRef = useSignal<HTMLDivElement>();
  const wrapperRef = useSignal<HTMLDivElement>();
  const heatmapData = useSignal<HeatmapDatum[]>([]);
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

      const payload: {
        baseTemperature: number;
        monthlyVariance: Array<{
          year: number;
          month: number;
          variance: number;
        }>;
      } = await response.json();

      const dataset: HeatmapDatum[] = payload.monthlyVariance.map((entry) => ({
        year: entry.year,
        monthIndex: entry.month - 1,
        variance: entry.variance,
        temp: payload.baseTemperature + entry.variance,
      }));

      heatmapData.value = dataset;

      const years = Array.from(new Set(dataset.map((d) => d.year))).sort(
        (a, b) => a - b,
      );
      const minTemp = d3.min(dataset, (d) => d.temp) ?? 0;
      const maxTemp = d3.max(dataset, (d) => d.temp) ?? 1;

      const step = (maxTemp - minTemp) / Math.max(1, colorPalette.length);
      const thresholdDomain = Array.from(
        { length: colorPalette.length - 1 },
        (_, index) => minTemp + step * (index + 1),
      );

      const colorScale = d3
        .scaleThreshold<number, string>()
        .domain(thresholdDomain)
        .range(colorPalette);

      const legendBins = colorPalette.map((color, index) => ({
        color,
        start: index === 0 ? minTemp : thresholdDomain[index - 1],
        end:
          index === colorPalette.length - 1 ? maxTemp : thresholdDomain[index],
      }));

      const renderChart = () => {
        const measuredWidth = wrapperElement.clientWidth || 960;
        const width = Math.min(960, Math.max(measuredWidth, 300));
        const isCompact = width < 720;
        const height = isCompact ? 600 : 560;
        const margin = isCompact
          ? { top: 32, right: 16, bottom: 172, left: 82 }
          : { top: 48, right: 32, bottom: 160, left: 140 };
        const innerWidth = Math.max(width - margin.left - margin.right, 200);
        const innerHeight = Math.max(height - margin.top - margin.bottom, 240);

        svg.selectAll("*").remove();
        svg
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMidYMid meet");

        tooltip
          .style("opacity", 0)
          .style("transform", "translate(-50%, -100%) scale(0.96)");

        const xScale = d3
          .scaleBand<number>()
          .domain(years)
          .range([0, innerWidth])
          .padding(0);

        const yScale = d3
          .scaleBand<number>()
          .domain(d3.range(0, 12))
          .range([0, innerHeight])
          .padding(0);

        const chartGroup = svg
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        const tickYears = isCompact
          ? Array.from({ length: 5 }, (_, index) => {
              const yearIndex = Math.round((index * (years.length - 1)) / 4);
              return years[yearIndex];
            }).filter((year): year is number => year !== undefined)
          : years.filter(
              (_, index) =>
                index % Math.max(1, Math.floor(years.length / 12)) === 0,
            );

        const xAxis = d3
          .axisBottom<number>(xScale)
          .tickValues(tickYears)
          .tickFormat(d3.format("d"));

        const yAxis = d3
          .axisLeft<number>(yScale)
          .tickValues(d3.range(0, 12))
          .tickFormat((monthIndex) => monthNames[Number(monthIndex)]);

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

        const cellWidth = Math.max(1, xScale.bandwidth());
        const cellHeight = Math.max(12, yScale.bandwidth());
        const tooltipOffset = isCompact ? 52 : 40;

        chartGroup
          .selectAll<SVGRectElement, HeatmapDatum>(".cell")
          .data(dataset)
          .join("rect")
          .attr("class", "cell")
          .attr("data-year", (d) => d.year.toString())
          .attr("data-month", (d) => d.monthIndex.toString())
          .attr("data-temp", (d) => d.temp.toString())
          .attr("x", (d) => xScale(d.year) ?? 0)
          .attr("y", (d) => yScale(d.monthIndex) ?? 0)
          .attr("width", cellWidth)
          .attr("height", cellHeight)
          .attr("fill", (d) => colorScale(d.temp))
          .attr("rx", Math.min(8, cellWidth / 2))
          .attr("ry", Math.min(8, cellHeight / 2))
          .attr("tabindex", 0)
          .on("mouseenter", function (event, d) {
            const [x, y] = d3.pointer(event, wrapperElement);
            const formattedTemp = d3.format(".2f")(d.temp);
            const formattedVariance = d3.format("+.2f")(d.variance);

            tooltip
              .style("opacity", 1)
              .style("transform", "translate(-50%, -110%) scale(1)")
              .attr("data-year", d.year.toString())
              .html(
                `<div class="project013__tooltip-meta">${monthNames[d.monthIndex]} ${d.year}</div>` +
                  `<div class="project013__tooltip-temp">${formattedTemp}&deg;C</div>` +
                  `<div class="project013__tooltip-variance">Variance: <strong>${formattedVariance}&deg;C</strong></div>`,
              )
              .style("left", `${x}px`)
              .style("top", `${y - tooltipOffset}px`);

            d3.select(this).raise();
          })
          .on("mousemove", function (event) {
            const [x, y] = d3.pointer(event, wrapperElement);
            tooltip
              .style("left", `${x}px`)
              .style("top", `${y - tooltipOffset}px`);
          })
          .on("mouseleave", () => {
            tooltip
              .style("opacity", 0)
              .style("transform", "translate(-50%, -100%) scale(0.96)");
          })
          .on("focus", function (event, d) {
            const target = event.target as SVGRectElement | null;
            const rectX = Number(target?.getAttribute("x") ?? 0);
            const rectY = Number(target?.getAttribute("y") ?? 0);
            const formattedTemp = d3.format(".2f")(d.temp);
            const formattedVariance = d3.format("+.2f")(d.variance);

            tooltip
              .style("opacity", 1)
              .style("transform", "translate(-50%, -110%) scale(1)")
              .attr("data-year", d.year.toString())
              .html(
                `<div class="project013__tooltip-meta">${monthNames[d.monthIndex]} ${d.year}</div>` +
                  `<div class="project013__tooltip-temp">${formattedTemp}&deg;C</div>` +
                  `<div class="project013__tooltip-variance">Variance: <strong>${formattedVariance}&deg;C</strong></div>`,
              )
              .style("left", `${margin.left + rectX + cellWidth / 2}px`)
              .style("top", `${margin.top + rectY - tooltipOffset}px`);
          })
          .on("blur", () => {
            tooltip
              .style("opacity", 0)
              .style("transform", "translate(-50%, -100%) scale(0.96)");
          });

        const legendWidth = Math.min(innerWidth, 520);
        const legendHeight = isCompact ? 60 : 66;
        const legendGroup = svg
          .append("g")
          .attr("id", "legend")
          .attr(
            "transform",
            `translate(${margin.left + (innerWidth - legendWidth) / 2}, ${margin.top + innerHeight + (isCompact ? 70 : 82)})`,
          );

        const legendScale = d3
          .scaleLinear()
          .domain([minTemp, maxTemp])
          .range([0, legendWidth]);
        const legendTicks = [minTemp, ...thresholdDomain, maxTemp].filter(
          (value) => Number.isFinite(value),
        );

        const legendRects = legendGroup
          .selectAll<
            SVGRectElement,
            { color: string; start: number; end: number }
          >("rect")
          .data(legendBins)
          .join("rect")
          .attr("x", (d) => legendScale(d.start))
          .attr("y", 0)
          .attr("width", (d) => {
            const start = legendScale(d.start);
            const end = legendScale(d.end);

            return Number.isFinite(start) && Number.isFinite(end)
              ? Math.max(1, end - start)
              : 1;
          })
          .attr("height", isCompact ? 18 : 20)
          .attr("fill", (d) => d.color)
          .attr("rx", 6)
          .attr("ry", 6);

        if (legendRects.size() > 0) {
          legendRects
            .filter(
              (_, index) => index === 0 || index === colorPalette.length - 1,
            )
            .attr("rx", 12)
            .attr("ry", 12);
        }

        legendGroup
          .append("g")
          .attr("transform", `translate(0, ${isCompact ? 24 : 26})`)
          .attr("class", "legend-axis")
          .call(
            d3
              .axisBottom(legendScale)
              .tickValues(legendTicks)
              .tickFormat(d3.format(".1f")),
          );

        legendGroup
          .append("text")
          .attr("x", legendWidth / 2)
          .attr("y", legendHeight)
          .attr("text-anchor", "middle")
          .text("Temperature (deg C)");
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
        cleanupResize = () =>
          window.removeEventListener("resize", handleResize);
      }
    } catch (error) {
      console.error("Failed to load temperature data", error);
      errorMessage.value = "Failed to load temperature data. Please try again.";
    } finally {
      isLoading.value = false;
    }

    return () => {
      cleanupResize?.();
      svg.selectAll("*").remove();
    };
  });

  return (
    <section class="layout-shell project013">
      <div class="project013__hero">
        <p class="project013__eyebrow">Data Storytelling</p>
        <h1 class="project013__title" id="title">
          Visualize Data with a Heat Map
        </h1>
        <p class="project013__lead" id="description">
          A D3-powered heat map charting monthly global land-surface
          temperatures from 1753 to 2015. Hover or focus any cell to inspect
          temperature variance against the historical baseline.
        </p>
      </div>

      <div class="project013__note">
        <p class="project013__note-title">Data Visualization Projects</p>
        <p class="project013__note-copy">
          The heat map ingests the NASA temperature dataset via fetch, then
          leans on D3 band scales and threshold color ramps to position each
          month while encoding variance with an accessible tooltip and keyboard
          support.
        </p>
        <p class="project013__note-copy">
          Trigger the refresh-and-fetch control to repeat the AJAX workflow,
          recompute the legend, and redraw the grid so the visualization
          reflects the latest payload end-to-end.
        </p>
      </div>

      <div class="project013__controls">
        <button
          type="button"
          onClick$={handleRefresh}
          class="project013__refresh"
          disabled={isLoading.value}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class={`project013__refresh-icon${isLoading.value ? "project013__refresh-icon--spinning" : ""}`}
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
        <div aria-live="polite" class="project013__status">
          {isLoading.value && <span>Loading dataset...</span>}
          {!isLoading.value && errorMessage.value && (
            <span class="project013__error">{errorMessage.value}</span>
          )}
        </div>
      </div>

      <div ref={wrapperRef} class="project013__chart project013__chart-theme">
        <svg ref={svgRef} role="img" aria-labelledby="title description" />
        <div
          ref={tooltipRef}
          id="tooltip"
          class="project013__tooltip"
          aria-hidden="true"
        />
      </div>

      {!isLoading.value && heatmapData.value.length === 0 && (
        <p class="project013__empty">
          Temperature records are unavailable right now. Try refreshing the
          dataset or checking your connection.
        </p>
      )}
    </section>
  );
});

export const head = buildHead(
  `Project 013 - ${siteMetadata.title}`,
  "Interactive D3 heat map visualizing historical global land-surface temperatures.",
);
