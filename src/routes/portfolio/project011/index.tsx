import {
  $, 
  component$,
  useSignal,
  useVisibleTask$,
  useStylesScoped$,
} from "@builder.io/qwik";
import * as d3 from "d3";
import siteConfig from "~/config/siteConfig.json";
import { FCC_TEST_SCRIPT_ID, FCC_TEST_SCRIPT_SRC, resetFccTestSuiteUI } from "~/utils/fcc-test-suite";
import { buildHead } from "~/utils/head";

const styles = `
  .bar-chart-page {
    display: grid;
    gap: clamp(2.25rem, 5vw, 3rem);
    padding: clamp(2.5rem, 5vw, 5rem) clamp(1.5rem, 6vw, 6rem) clamp(4rem, 8vw, 6rem);
    color: var(--text1);
    background:
      radial-gradient(circle at top left, color-mix(in srgb, var(--primary) 14%, transparent) 0%, transparent 60%),
      radial-gradient(circle at bottom right, color-mix(in srgb, var(--tertiary) 12%, transparent) 0%, transparent 65%),
      var(--surface1);
    min-height: 100vh;
    grid-template-columns: minmax(0, 1fr);
  }

  .bar-chart-content {
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
    align-content: start;
  }

  .bar-chart-content header {
    display: grid;
    gap: 1rem;
    max-width: 720px;
    text-align: center;
    margin: 0 auto;
  }

  .bar-chart-content #title {
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-family: var(--font-semibold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .bar-chart-content #description {
    font-size: clamp(0.95rem, 1vw + 0.5rem, 1.125rem);
    color: var(--text2);
    line-height: 1.65;
    margin: 0 auto;
    max-width: 58ch;
  }

  .bar-chart-summary,
  .bar-chart-actions {
    margin: 0 auto;
    width: min(1040px, 100%);
  }

  .bar-chart-summary {
    border-radius: 2.25rem;
    border: 1px solid var(--surface-border);
    background: color-mix(in srgb, var(--surface-glass-1) 88%, transparent);
    padding: clamp(1.75rem, 3vw, 2.75rem);
    text-align: center;
    box-shadow: 0 24px 100px var(--surface-shadow);
  }

  .bar-chart-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
    font-size: 0.85rem;
    color: var(--text2);
  }

  .bar-chart-actions button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border-radius: 9999px;
    border: 1px solid color-mix(in srgb, var(--surface-border) 60%, transparent);
    background: color-mix(in srgb, var(--surface-glass-1) 76%, transparent);
    padding: 0.55rem 1.5rem;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  }

  .bar-chart-actions button:hover,
  .bar-chart-actions button:focus-visible {
    border-color: color-mix(in srgb, var(--primary) 40%, transparent);
    color: var(--primary);
    outline: none;
  }

  .chart-shell {
    position: relative;
    margin: 0 auto;
    width: min(1120px, 100%);
    border-radius: 2.25rem;
    padding: clamp(1.75rem, 3vw, 2.75rem);
    background:
      linear-gradient(
        145deg,
        color-mix(in srgb, var(--surface-glass-1) 88%, transparent) 0%,
        color-mix(in srgb, var(--surface-glass-2) 82%, transparent) 100%
      );
    border: 1px solid var(--surface-border);
    box-shadow: 0 30px 120px var(--surface-shadow);
    overflow: hidden;
    height: clamp(520px, 72vh, 880px);
  }

  .chart-shell::after {
    content: "";
    position: absolute;
    inset: 12% 18% auto auto;
    width: clamp(160px, 24%, 220px);
    height: clamp(160px, 24%, 220px);
    background: radial-gradient(circle, color-mix(in srgb, var(--primary) 28%, transparent) 0%, transparent 70%);
    opacity: 0.25;
    pointer-events: none;
    filter: blur(8px);
  }

  svg {
    width: 100%;
    height: 100%;
    border-radius: 1.5rem;
    border: 1px solid color-mix(in srgb, var(--surface-border) 70%, transparent);
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--surface2) 84%, transparent) 0%,
      color-mix(in srgb, var(--surface3) 64%, transparent) 100%
    );
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--surface-border) 40%, transparent);
  }

  #tooltip {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    transform: translate(-50%, -100%) scale(0.96);
    transition: opacity 0.2s ease, transform 0.2s ease;
    min-width: clamp(180px, 40vw, 260px);
    padding: 1rem 1.25rem;
    border-radius: 1.25rem;
    border: 1px solid color-mix(in srgb, var(--primary) 22%, transparent);
    background: color-mix(in srgb, var(--surface1) 96%, transparent);
    box-shadow: 0 20px 70px color-mix(in srgb, var(--surface-shadow) 72%, transparent);
    backdrop-filter: blur(10px);
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

  @media (min-width: 1200px) {
    .bar-chart-page {
      grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
      align-items: start;
      padding: clamp(2.5rem, 5vw, 5rem) clamp(3.5rem, 6vw, 7rem) clamp(3rem, 6vw, 4.5rem);
    }

    .bar-chart-content {
      position: sticky;
      top: clamp(2.5rem, 4vw, 5rem);
      max-width: 420px;
      margin: 0;
      text-align: left;
    }

    .bar-chart-content header,
    .bar-chart-summary,
    .bar-chart-actions {
      margin: 0;
      text-align: left;
    }

    .bar-chart-actions {
      align-items: flex-start;
    }

    .chart-shell {
      margin: 0;
      width: 100%;
      height: clamp(640px, calc(100vh - 6rem), 1040px);
    }
  }

  @media (max-width: 768px) {
    .chart-shell {
      border-radius: 1.75rem;
    }

    svg {
      border-radius: 1.25rem;
    }
  }
`;

const DATA_URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
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

      const payload: { data: [string, number][] } = await response.json();

      const dataset: GdpDatum[] = payload.data.map(([date, gdp]) => ({
        date: new Date(date),
        rawDate: date,
        gdp,
      }));

      const margin = { top: 80, right: 40, bottom: 50, left: 80 };
      const bounds = wrapperElement.getBoundingClientRect();
      const measuredWidth = Math.floor(bounds.width);
      const measuredHeight = Math.floor(bounds.height);
      const width = measuredWidth > 0 ? measuredWidth : 960;
      const height = measuredHeight > 0 ? measuredHeight : 520;
      const innerWidth = Math.max(1, width - margin.left - margin.right);
      const innerHeight = Math.max(1, height - margin.top - margin.bottom);

      const svg = d3.select(svgElement);
      svg.selectAll("*").remove();
      svg.attr("width", width).attr("height", height);

      const dateExtent = d3.extent(dataset, (d) => d.date);
      const minDate = dateExtent[0];
      const maxDate = dateExtent[1];

      if (!minDate || !maxDate) {
        return;
      }

      const lastDatePlusQuarter = d3.timeMonth.offset(maxDate, 3);

      const xScale = d3
        .scaleTime()
        .domain([minDate, lastDatePlusQuarter])
        .range([0, innerWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d.gdp)!])
        .nice()
        .range([innerHeight, 0]);

      const getBarWidth = (date: Date) => {
        const currentX = xScale(date) ?? 0;
        const nextQuarter = d3.timeMonth.offset(date, 3);
        const nextX = xScale(nextQuarter) ?? innerWidth;
        return Math.max(0, nextX - currentX);
      };

      const chartGroup = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const xAxis = d3.axisBottom<Date>(xScale).ticks(width < 720 ? 6 : 12);
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
        .attr("x", (d) => xScale(d.date) ?? 0)
        .attr("y", (d) => yScale(d.gdp))
        .attr("width", (d) => getBarWidth(d.date))
        .attr("height", (d) => innerHeight - yScale(d.gdp))
        .attr("rx", (d) => Math.min(6, getBarWidth(d.date) / 2))
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
      errorMessage.value = "Failed to load GDP data. Please try again.";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="page bar-chart-page">
      <div class="bar-chart-content">
        <header>
          <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--primary)]">Data Storytelling</p>
          <h1 id="title">Visualize Data with a Bar Chart</h1>
          <p id="description">
            An interactive D3 visualization of the United States Gross Domestic Product, showcasing over six decades of
            quarterly economic data with custom styling and responsive tooltips.
          </p>
        </header>

        <section class="bar-chart-summary">
          <p class="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[var(--text3)]">
            Data Visualization Projects
          </p>
          <p class="mt-3 text-sm leading-relaxed text-[var(--text2)]">
            This build streams the Federal Reserve GDP archive through fetch, then channels the JSON into D3 time and linear
            scales to plot each quarter with precise axes, transitions, and accessible tooltips.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-[var(--text2)]">
            The refresh-and-fetch button reruns the AJAX request on demand, rebuilding the SVG so you can watch the data
            pipeline power this certification project in real time.
          </p>
        </section>

        <div class="bar-chart-actions">
          <button
            type="button"
            onClick$={handleRefresh}
            disabled={isLoading.value}
            class={`focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)] ${
              isLoading.value ? "opacity-80" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class={`h-[0.75rem] w-[0.75rem] ${isLoading.value ? "animate-spin" : ""}`}
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
          <div aria-live="polite" class="min-h-[1.5rem] text-xs uppercase tracking-[0.28em] text-[var(--text3)]">
            {isLoading.value && <span>Loading dataset…</span>}
            {!isLoading.value && errorMessage.value && (
              <span class="text-[var(--primary)]">{errorMessage.value}</span>
            )}
          </div>
        </div>
      </div>

      <section ref={wrapperRef} class="chart-shell">
        <svg ref={svgRef} role="img" aria-labelledby="title description" />
        <div
          ref={tooltipRef}
          id="tooltip"
          class="font-medium"
          aria-hidden="true"
        />
      </section>
    </div>
  );
});

export const head = buildHead(
  `Project 011 - ${siteConfig.metadata.title}`,
  "Interactive D3 bar chart visualizing United States GDP from 1947 to 2015.",
);
