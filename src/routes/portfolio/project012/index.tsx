import { component$, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
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
    transform: translate(-50%, -100%) scale(0.98);
    transition: opacity 0.2s ease, transform 0.2s ease;
    min-width: 220px;
    max-width: min(320px, 80vw);
    padding: 1rem;
    border-radius: 1rem;
    border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
    background: color-mix(in srgb, var(--surface1) 96%, transparent);
    box-shadow: 0 18px 60px color-mix(in srgb, var(--surface-shadow) 70%, transparent);
    backdrop-filter: blur(12px);
    color: var(--text1);
    line-height: 1.4;
  }

  .dot {
    stroke-width: 1.5px;
    transition: transform 0.2s ease, filter 0.2s ease;
    cursor: pointer;
  }

  .dot:focus-visible {
    outline: none;
    filter: drop-shadow(0 0 12px color-mix(in srgb, var(--primary) 50%, transparent));
  }

  .dot--doping {
    fill: color-mix(in srgb, var(--quaternary) 70%, transparent);
    stroke: color-mix(in srgb, var(--quaternary) 90%, transparent);
  }

  .dot--clean {
    fill: color-mix(in srgb, var(--primary) 70%, transparent);
    stroke: color-mix(in srgb, var(--primary) 90%, transparent);
  }

  .dot:hover {
    transform: scale(1.15);
    filter: drop-shadow(0 12px 30px color-mix(in srgb, var(--surface-shadow) 60%, transparent));
  }

  .axis path,
  .axis line {
    stroke: color-mix(in srgb, var(--surface-border) 85%, transparent);
  }

  .axis text {
    fill: color-mix(in srgb, var(--text2) 85%, transparent);
    font-size: 0.75rem;
  }

  #legend text {
    fill: color-mix(in srgb, var(--text2) 85%, transparent);
    font-size: 0.75rem;
  }
`;

const DATA_URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const FCC_TEST_SCRIPT_ID = "fcc-testable-projects";
const FCC_TEST_SCRIPT_SRC = "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js";

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

  // Load FCC testing bundle for manual verification when available
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (document.getElementById(FCC_TEST_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement("script");
    script.id = FCC_TEST_SCRIPT_ID;
    script.src = FCC_TEST_SCRIPT_SRC;
    script.async = true;
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

      const margin = { top: 80, right: 60, bottom: 60, left: 80 };
      const width = 960;
      const height = 520;
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const svg = d3.select(svgElement);
      svg.selectAll("*").remove();
      svg.attr("width", width).attr("height", height);

      const xExtent = d3.extent(dataset, (d) => d.year) as [number, number];
      const xScale = d3.scaleLinear().domain(xExtent).range([0, innerWidth]);

      const yExtent = d3.extent(dataset, (d) => d.time) as [Date, Date];
      const yScale = d3.scaleTime().domain(yExtent).range([innerHeight, 0]);

      const chartGroup = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const xAxis = d3
        .axisBottom<number>(xScale)
        .tickFormat(d3.format("d"))
        .ticks(width < 720 ? 6 : 10);

      const timeFormatter = d3.timeFormat("%M:%S");
      const yAxis = d3
        .axisLeft<Date | d3.NumberValue>(yScale)
        .tickFormat((value) => timeFormatter(value as Date))
        .ticks(8);

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

      const points = chartGroup
        .selectAll<SVGCircleElement, CyclistDatum>(".dot")
        .data(dataset)
        .join("circle")
        .attr("class", (d) => `dot ${d.doping ? "dot--doping" : "dot--clean"}`)
        .attr("r", 6)
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
          ? `<div class="mt-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-glass-2)] p-3 text-xs text-[var(--quaternary)]">${datum.doping}</div>`
          : "";

        tooltip
          .style("opacity", 1)
          .style("transform", "translate(-50%, -110%) scale(1)")
          .attr("data-year", datum.year.toString())
          .html(
            `<div class="text-xs uppercase tracking-[0.3em] text-[var(--text3)]">${datum.year} • ${datum.timeLabel}</div>` +
              `<div class="mt-1 text-lg font-semibold text-[var(--text1)]">${datum.name}</div>` +
              `<div class="text-sm text-[var(--text2)]">${datum.nationality}</div>` +
              dopingInfo,
          )
          .style("left", `${x}px`)
          .style("top", `${y - 32}px`);
      };

      const hideTooltip = () => {
        tooltip.style("opacity", 0).style("transform", "translate(-50%, -100%) scale(0.98)");
      };

      points
        .on("mouseenter", function (event, d) {
          showTooltip(event as MouseEvent, d);
          d3.select(this).raise();
        })
        .on("mousemove", function (event, d) {
          showTooltip(event as MouseEvent, d);
        })
        .on("mouseleave", () => {
          hideTooltip();
        })
        .on("focus", function (event, d) {
          showTooltip(event as FocusEvent, d);
          d3.select(this).raise();
        })
        .on("blur", () => {
          hideTooltip();
        });

      chartGroup
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", -36)
        .attr("text-anchor", "middle")
        .attr("id", "title")
        .attr("fill", "var(--text1)")
        .attr("font-size", "1.75rem")
        .attr("font-weight", "600")
        .text("Professional Cyclist Performance");

      chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -56)
        .attr("text-anchor", "middle")
        .attr("fill", "var(--text2)")
        .attr("font-size", "0.85rem")
        .text("Race Time (minutes)");

      chartGroup
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 44)
        .attr("text-anchor", "middle")
        .attr("fill", "var(--text2)")
        .attr("font-size", "0.85rem")
        .text("Year");

      const legend = svg
        .append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${width - margin.right - 220}, ${margin.top - 30})`);

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
        .attr("r", 6)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("class", (d) => `dot ${d.className}`);

      legendGroup
        .append("text")
        .attr("x", 16)
        .attr("y", 4)
        .text((d) => d.label);
    } catch (error) {
      console.error("Failed to load cyclist data", error);
    }
  });

  return (
    <section class="layout-shell mt-12 text-[var(--text1)] md:mt-20">
      <div class="mx-auto max-w-5xl text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--primary)]">
          Data Storytelling
        </p>
        <h1 class="mt-4 text-4xl font-semibold md:text-5xl">Visualize Data with a Scatterplot Graph</h1>
        <p class="mt-4 text-base text-[var(--text3)] md:text-lg">
          A D3 scatterplot plotting professional cycling times against the year of competition. Hover to explore doping
          allegations, nationalities, and performance patterns.
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
  `Project 012 - ${siteConfig.metadata.title}`,
  "Interactive D3 scatterplot visualizing professional cyclist times and doping allegations.",
);
