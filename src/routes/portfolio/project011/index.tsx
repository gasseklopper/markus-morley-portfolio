import { component$, useSignal, useVisibleTask$, useStylesScoped$ } from "@builder.io/qwik";
import * as d3 from "d3";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

const styles = `
  .chart-wrapper {
    position: relative;
    margin: 0 auto;
    max-width: 960px;
  }

  svg {
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--surface-glass-1) 75%, transparent) 0%,
      color-mix(in srgb, var(--surface-glass-2) 85%, transparent) 100%
    );
    border-radius: 1.5rem;
    border: 1px solid var(--surface-border);
    box-shadow: 0 24px 80px var(--surface-shadow);
  }

  #tooltip {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    transform: translate(-50%, -100%);
    transition: opacity 0.2s ease, transform 0.2s ease;
    min-width: 200px;
    padding: 1rem;
    border-radius: 1rem;
    border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
    background: color-mix(in srgb, var(--surface1) 96%, transparent);
    box-shadow: 0 18px 60px color-mix(in srgb, var(--surface-shadow) 70%, transparent);
    backdrop-filter: blur(12px);
    color: var(--text1);
  }

  .bar {
    fill: color-mix(in srgb, var(--primary) 70%, transparent);
    transition: fill 0.2s ease;
  }

  .bar:hover,
  .bar:focus {
    fill: var(--primary);
  }

  .axis path,
  .axis line {
    stroke: color-mix(in srgb, var(--surface-border) 85%, transparent);
  }

  .axis text {
    fill: color-mix(in srgb, var(--text2) 85%, transparent);
    font-size: 0.75rem;
  }
`;

const DATA_URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const FCC_TEST_SCRIPT_ID = "fcc-testable-projects";
const FCC_TEST_SCRIPT_SRC = "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js";

const triggerDomContentLoaded = () => {
  if (document.readyState !== "loading") {
    document.dispatchEvent(new Event("DOMContentLoaded"));
  }
};

interface GdpDatum {
  date: Date;
  rawDate: string;
  gdp: number;
}

export default component$(() => {
  useStylesScoped$(styles);

  const svgRef = useSignal<SVGSVGElement>();
  const tooltipRef = useSignal<HTMLDivElement>();
  const wrapperRef = useSignal<HTMLDivElement>();

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

    try {
      const response = await fetch(DATA_URL);
      const payload: { data: [string, number][] } = await response.json();

      const dataset: GdpDatum[] = payload.data.map(([date, gdp]) => ({
        date: new Date(date),
        rawDate: date,
        gdp,
      }));

      const margin = { top: 80, right: 40, bottom: 50, left: 80 };
      const width = 960;
      const height = 520;
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const svg = d3.select(svgElement);
      svg.selectAll("*").remove();
      svg.attr("width", width).attr("height", height);

      const xAxisScale = d3
        .scaleTime()
        .domain(d3.extent(dataset, (d) => d.date) as [Date, Date])
        .range([0, innerWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d.gdp)!])
        .nice()
        .range([innerHeight, 0]);

      const xScale = d3
        .scaleBand<string>()
        .domain(dataset.map((d) => d.rawDate))
        .range([0, innerWidth])
        .paddingInner(0)
        .paddingOuter(0);

      const barWidth = xScale.bandwidth() || innerWidth / dataset.length;

      const chartGroup = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const xAxis = d3.axisBottom<Date>(xAxisScale).ticks(width < 720 ? 6 : 12);
      const yAxis = d3.axisLeft<number>(yScale);

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

      const tooltip = d3.select(tooltipElement);

      chartGroup
        .selectAll<SVGRectElement, GdpDatum>(".bar")
        .data(dataset)
        .join("rect")
        .attr("class", "bar")
        .attr("data-date", (d) => d.rawDate)
        .attr("data-gdp", (d) => d.gdp.toString())
        .attr("x", (d) => xScale(d.rawDate) ?? 0)
        .attr("y", (d) => yScale(d.gdp))
        .attr("width", barWidth)
        .attr("height", (d) => innerHeight - yScale(d.gdp))
        .attr("rx", Math.min(6, barWidth / 2))
        .attr("ry", (d) => Math.min(6, (innerHeight - yScale(d.gdp)) / 2))
        .on("mouseenter", function (event, d) {
          const [x, y] = d3.pointer(event, wrapperElement);
          tooltip
            .style("opacity", 1)
            .style("transform", "translate(-50%, -100%) scale(1)")
            .attr("data-date", d.rawDate)
            .html(
              `<div class="text-xs uppercase tracking-[0.3em] text-[var(--text3)]">${d.date.toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              })}</div><div class="mt-1 text-lg font-semibold text-[var(--text1)]">$${d.gdp.toLocaleString("en-US", {
                minimumFractionDigits: 1,
              })} Billion</div>`,
            )
            .style("left", `${x}px`)
            .style("top", `${y - 24}px`);

          d3.select(this).attr("fill", "var(--primary)");
        })
        .on("mouseleave", function () {
          tooltip.style("opacity", 0).style("transform", "translate(-50%, -100%) scale(0.98)");
          d3.select(this).attr("fill", null);
        });

      chartGroup
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", -32)
        .attr("text-anchor", "middle")
        .attr("id", "title")
        .attr("fill", "var(--text1)")
        .attr("font-size", "1.75rem")
        .attr("font-weight", "600")
        .text("United States GDP (1947 - 2015)");

      chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -56)
        .attr("text-anchor", "middle")
        .attr("fill", "var(--text2)")
        .attr("font-size", "0.85rem")
        .text("Gross Domestic Product (Billion USD)");
    } catch (error) {
      console.error("Failed to load GDP data", error);
    }
  });

  return (
    <section class="layout-shell mt-12 text-[var(--text1)] md:mt-20">
      <div class="mx-auto max-w-5xl text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--primary)]">
          Data Storytelling
        </p>
        <h1 class="mt-4 text-4xl font-semibold md:text-5xl">Visualize Data with a Bar Chart</h1>
        <p class="mt-4 text-base text-[var(--text3)] md:text-lg">
          An interactive D3 visualization of the United States Gross Domestic Product, showcasing over six decades of quarterly
          economic data with custom styling and responsive tooltips.
        </p>
      </div>

      <div ref={wrapperRef} class="chart-wrapper mt-12 flex flex-col items-center">
        <svg ref={svgRef} role="img" aria-labelledby="title" />
        <div
          ref={tooltipRef}
          id="tooltip"
          class="font-medium"
          aria-hidden="true"
        />
      </div>
    </section>
  );
});

export const head = buildHead(
  `Project 011 - ${siteConfig.metadata.title}`,
  "Interactive D3 bar chart visualizing United States GDP from 1947 to 2015.",
);
