import { component$, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import * as d3 from "d3";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

const styles = `
  .chart-wrapper {
    position: relative;
    margin: 0 auto;
    width: min(100%, 960px);
  }

  .chart-theme {
    --heat-cold-1: #0d3b66;
    --heat-cold-2: #266dd3;
    --heat-neutral-1: #f4f1de;
    --heat-warm-1: #f78c6b;
    --heat-warm-2: #f45d48;
    --heat-hot-1: #d62828;
    --heat-hot-2: #9d0208;
    --heat-border: color-mix(in srgb, var(--surface-border) 80%, transparent);
    --heat-shadow: color-mix(in srgb, var(--surface-shadow) 70%, transparent);
    --heat-legend-text: color-mix(in srgb, var(--text2) 90%, transparent);
  }

  svg {
    width: 100%;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--surface-glass-1) 78%, transparent) 0%,
      color-mix(in srgb, var(--surface-glass-2) 88%, transparent) 100%
    );
    border-radius: 1.5rem;
    border: 1px solid var(--surface-border);
    box-shadow: 0 24px 90px var(--surface-shadow);
    transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }

  :global([data-theme="dark"]) .chart-theme {
    --heat-cold-1: #1b4965;
    --heat-cold-2: #2c7da0;
    --heat-neutral-1: #13293d;
    --heat-warm-1: #ff6b6b;
    --heat-warm-2: #ff4d6d;
    --heat-hot-1: #c9184a;
    --heat-hot-2: #a4133c;
  }

  :global([data-theme="neon"]) .chart-theme {
    --heat-cold-1: #1a6eff;
    --heat-cold-2: #32c1ff;
    --heat-neutral-1: #6cf7ff;
    --heat-warm-1: #ffac41;
    --heat-warm-2: #ff6f91;
    --heat-hot-1: #ff427f;
    --heat-hot-2: #ff006e;
  }

  #tooltip {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    transform: translate(-50%, -100%) scale(0.96);
    transition: opacity 0.2s ease, transform 0.2s ease;
    min-width: 220px;
    max-width: min(320px, 80vw);
    padding: 1rem 1.125rem;
    border-radius: 1.125rem;
    border: 1px solid color-mix(in srgb, var(--primary) 26%, transparent);
    background: color-mix(in srgb, var(--surface1) 96%, transparent);
    box-shadow: 0 20px 70px var(--heat-shadow);
    backdrop-filter: blur(14px);
    color: var(--text1);
    line-height: 1.5;
    font-family: var(--font-medium);
  }

  #tooltip strong {
    font-family: var(--font-semibold);
  }

  .cell {
    stroke: color-mix(in srgb, var(--heat-border) 70%, transparent);
    stroke-width: 0.6px;
    transition: transform 0.18s ease, filter 0.18s ease;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .cell:hover,
  .cell:focus-visible {
    outline: none;
    transform: scale(1.05);
    filter: drop-shadow(0 12px 30px var(--heat-shadow));
  }

  .axis path,
  .axis line {
    stroke: color-mix(in srgb, var(--surface-border) 85%, transparent);
  }

  .axis text {
    fill: color-mix(in srgb, var(--text2) 92%, transparent);
    font-size: clamp(0.7rem, 0.66rem + 0.25vw, 0.85rem);
    font-family: var(--font-medium);
    letter-spacing: 0.02em;
  }

  #legend text {
    fill: var(--heat-legend-text);
    font-size: clamp(0.65rem, 0.62rem + 0.24vw, 0.8rem);
    font-family: var(--font-medium);
  }

  #legend rect {
    stroke: color-mix(in srgb, var(--surface-border) 78%, transparent);
  }

  .legend-axis path,
  .legend-axis line {
    stroke: color-mix(in srgb, var(--surface-border) 70%, transparent);
  }

  .legend-axis text {
    fill: var(--heat-legend-text);
    font-size: clamp(0.6rem, 0.58rem + 0.18vw, 0.72rem);
  }

  @media (max-width: 768px) {
    svg {
      border-radius: 1.25rem;
    }

    #tooltip {
      font-size: 0.95rem;
    }
  }
`;

const DATA_URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const FCC_TEST_SCRIPT_ID = "fcc-testable-projects";
const FCC_TEST_SCRIPT_SRC = "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js";

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

  // Load FCC testing bundle for manual verification when available
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const existingScript = document.getElementById(FCC_TEST_SCRIPT_ID);
    if (existingScript) {
      triggerDomContentLoaded();
      return;
    }

    const script = document.createElement("script");
    script.id = FCC_TEST_SCRIPT_ID;
    script.src = FCC_TEST_SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", triggerDomContentLoaded);
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    const svgElement = svgRef.value;
    const tooltipElement = tooltipRef.value;
    const wrapperElement = wrapperRef.value;

    if (!svgElement || !tooltipElement || !wrapperElement) {
      return;
    }

    const svg = d3.select(svgElement);
    const tooltip = d3.select(tooltipElement);
    let cleanupResize: (() => void) | undefined;

    try {
      const response = await fetch(DATA_URL);
      const payload: {
        baseTemperature: number;
        monthlyVariance: Array<{ year: number; month: number; variance: number }>;
      } = await response.json();

      const dataset: HeatmapDatum[] = payload.monthlyVariance.map((entry) => ({
        year: entry.year,
        monthIndex: entry.month - 1,
        variance: entry.variance,
        temp: payload.baseTemperature + entry.variance,
      }));

      heatmapData.value = dataset;

      const years = Array.from(new Set(dataset.map((d) => d.year))).sort((a, b) => a - b);
      const minTemp = d3.min(dataset, (d) => d.temp) ?? 0;
      const maxTemp = d3.max(dataset, (d) => d.temp) ?? 1;

      const step = (maxTemp - minTemp) / (colorPalette.length - 1 || 1);
      const thresholdDomain = d3.range(minTemp + step, maxTemp, step);

      const colorScale = d3
        .scaleThreshold<number, string>()
        .domain(thresholdDomain)
        .range(colorPalette);

      const legendStops = [minTemp, ...colorScale.domain(), maxTemp];

      const renderChart = () => {
        const measuredWidth = wrapperElement.clientWidth || 960;
        const width = Math.min(960, Math.max(measuredWidth, 360));
        const isCompact = width < 720;
        const height = isCompact ? 620 : 560;
        const margin = isCompact
          ? { top: 36, right: 28, bottom: 180, left: 110 }
          : { top: 48, right: 32, bottom: 160, left: 140 };
        const innerWidth = Math.max(width - margin.left - margin.right, 200);
        const innerHeight = Math.max(height - margin.top - margin.bottom, 240);

        svg.selectAll("*").remove();
        svg
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMidYMid meet");

        tooltip.style("opacity", 0).style("transform", "translate(-50%, -100%) scale(0.96)");

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

        const approxTickCount = isCompact ? 6 : 12;
        const tickStep = Math.max(1, Math.floor(years.length / approxTickCount));
        const tickYears = years.filter((_, index) => index % tickStep === 0);
        const lastYear = years[years.length - 1];
        if (tickYears[tickYears.length - 1] !== lastYear) {
          tickYears.push(lastYear);
        }

        const xAxis = d3.axisBottom<number>(xScale).tickValues(tickYears).tickFormat(d3.format("d"));

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
                `<div class="text-xs uppercase tracking-[0.32em] text-[var(--text3)]">${monthNames[d.monthIndex]} ${d.year}</div>` +
                  `<div class="mt-1 text-lg font-semibold text-[var(--text1)]">${formattedTemp}°C</div>` +
                  `<div class="text-sm text-[var(--text2)]">Variance: <strong>${formattedVariance}°C</strong></div>`
              )
              .style("left", `${x}px`)
              .style("top", `${y - tooltipOffset}px`);

            d3.select(this).raise();
          })
          .on("mousemove", function (event) {
            const [x, y] = d3.pointer(event, wrapperElement);
            tooltip.style("left", `${x}px`).style("top", `${y - tooltipOffset}px`);
          })
          .on("mouseleave", () => {
            tooltip.style("opacity", 0).style("transform", "translate(-50%, -100%) scale(0.96)");
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
                `<div class="text-xs uppercase tracking-[0.32em] text-[var(--text3)]">${monthNames[d.monthIndex]} ${d.year}</div>` +
                  `<div class="mt-1 text-lg font-semibold text-[var(--text1)]">${formattedTemp}°C</div>` +
                  `<div class="text-sm text-[var(--text2)]">Variance: <strong>${formattedVariance}°C</strong></div>`
              )
              .style("left", `${margin.left + rectX + cellWidth / 2}px`)
              .style("top", `${margin.top + rectY - tooltipOffset}px`);
          })
          .on("blur", () => {
            tooltip.style("opacity", 0).style("transform", "translate(-50%, -100%) scale(0.96)");
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

        const legendScale = d3.scaleLinear().domain([minTemp, maxTemp]).range([0, legendWidth]);

        const legendRects = legendGroup
          .selectAll<SVGRectElement, { color: string; start: number; end: number }>("rect")
          .data(
            colorPalette.map((color, index) => ({
              color,
              start: legendStops[index],
              end: legendStops[index + 1],
            })),
          )
          .join("rect")
          .attr("x", (d) => legendScale(d.start))
          .attr("y", 0)
          .attr("width", (d) => Math.max(1, legendScale(d.end) - legendScale(d.start)))
          .attr("height", isCompact ? 18 : 20)
          .attr("fill", (d) => d.color)
          .attr("rx", 6)
          .attr("ry", 6);

        if (legendRects.size() > 0) {
          legendRects
            .filter((_, index) => index === 0 || index === colorPalette.length - 1)
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
              .tickValues(legendStops)
              .tickFormat(d3.format(".1f")),
          );

        legendGroup
          .append("text")
          .attr("x", legendWidth / 2)
          .attr("y", legendHeight)
          .attr("text-anchor", "middle")
          .text("Temperature (°C)");
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
      console.error("Failed to load temperature data", error);
    }

    return () => {
      cleanupResize?.();
      svg.selectAll("*").remove();
    };
  });

  return (
    <section class="layout-shell mt-12 text-[var(--text1)] md:mt-20">
      <div class="mx-auto max-w-5xl text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--primary)]">Data Storytelling</p>
        <h1 class="mt-4 text-4xl font-semibold leading-tight md:text-5xl" id="title">
          Visualize Data with a Heat Map
        </h1>
        <p class="mt-4 text-base leading-relaxed text-[var(--text3)] md:text-lg" id="description">
          A D3-powered heat map charting monthly global land-surface temperatures from 1753 to 2015. Hover or focus any
          cell to inspect temperature variance against the historical baseline.
        </p>
      </div>

      <div ref={wrapperRef} class="chart-wrapper chart-theme mt-12 flex w-full flex-col items-center px-2 sm:px-4">
        <svg ref={svgRef} role="img" aria-labelledby="title description" />
        <div ref={tooltipRef} id="tooltip" class="font-medium" aria-hidden="true" />
      </div>

      {heatmapData.value.length === 0 && (
        <p class="mx-auto mt-10 max-w-3xl text-center text-sm text-[var(--text3)]">
          Loading temperature records… If the dataset takes a moment, please refresh the page or check your network
          connection.
        </p>
      )}
    </section>
  );
});

export const head = buildHead(
  `Project 013 - ${siteConfig.metadata.title}`,
  "Interactive D3 heat map visualizing historical global land-surface temperatures.",
);
