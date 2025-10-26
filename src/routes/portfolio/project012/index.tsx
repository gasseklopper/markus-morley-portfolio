import {
  $,
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import * as d3 from "d3";
import siteConfig from "~/config/siteConfig.json";
import { FCC_TEST_SCRIPT_ID, FCC_TEST_SCRIPT_SRC, resetFccTestSuiteUI } from "~/utils/fcc-test-suite";
import { buildHead } from "~/utils/head";

const styles = `
  .scatterplot-page {
    display: grid;
    gap: clamp(2.25rem, 5vw, 3rem);
    padding: clamp(2.5rem, 5vw, 5rem) clamp(1.5rem, 6vw, 6rem) clamp(4rem, 8vw, 6rem);
    color: var(--text1);
    background:
      radial-gradient(circle at top left, color-mix(in srgb, var(--primary) 14%, transparent) 0%, transparent 60%),
      radial-gradient(circle at bottom right, color-mix(in srgb, var(--secondary) 12%, transparent) 0%, transparent 65%),
      var(--surface1);
    min-height: 100vh;
    grid-template-columns: minmax(0, 1fr);
  }

  .scatterplot-content {
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
    align-content: start;
  }

  .scatterplot-content header {
    display: grid;
    gap: 1rem;
    max-width: 720px;
    text-align: center;
    margin: 0 auto;
  }

  .scatterplot-content #title {
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-family: var(--font-semibold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .scatterplot-content #description {
    font-size: clamp(0.95rem, 1vw + 0.5rem, 1.125rem);
    color: var(--text2);
    line-height: 1.65;
    margin: 0 auto;
    max-width: 60ch;
  }

  .scatterplot-summary,
  .scatterplot-actions {
    margin: 0 auto;
    width: min(1040px, 100%);
  }

  .scatterplot-summary {
    border-radius: 2.25rem;
    border: 1px solid var(--surface-border);
    background: color-mix(in srgb, var(--surface-glass-1) 88%, transparent);
    padding: clamp(1.75rem, 3vw, 2.75rem);
    text-align: center;
    box-shadow: 0 24px 100px var(--surface-shadow);
  }

  .scatterplot-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
    font-size: 0.85rem;
    color: var(--text2);
  }

  .scatterplot-actions button {
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

  .scatterplot-actions button:hover,
  .scatterplot-actions button:focus-visible {
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
    background: radial-gradient(circle, color-mix(in srgb, var(--primary) 24%, transparent) 0%, transparent 70%);
    opacity: 0.25;
    pointer-events: none;
    filter: blur(8px);
  }

  .chart-theme {
    --chart-bg-1: color-mix(in srgb, var(--surface-glass-1) 82%, transparent);
    --chart-bg-2: color-mix(in srgb, var(--surface-glass-2) 88%, transparent);
    --chart-dot-doping-fill: color-mix(in srgb, var(--primary) 86%, #ffffff 14%);
    --chart-dot-doping-stroke: color-mix(in srgb, var(--primary) 98%, #ffffff 2%);
    --chart-dot-clean-fill: color-mix(in srgb, var(--secondary) 82%, #ffffff 18%);
    --chart-dot-clean-stroke: color-mix(in srgb, var(--secondary) 96%, #ffffff 4%);
  }

  svg {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--chart-bg-1) 0%, var(--chart-bg-2) 100%);
    border-radius: 1.5rem;
    border: 1px solid var(--surface-border);
    box-shadow: 0 24px 80px var(--surface-shadow);
    transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }

  :global([data-theme="dark"]) .chart-theme {
    --chart-bg-1: color-mix(in srgb, var(--surface2) 72%, rgba(148, 163, 184, 0.25) 28%);
    --chart-bg-2: color-mix(in srgb, var(--surface3) 82%, rgba(148, 163, 184, 0.18) 18%);
    --chart-dot-doping-fill: color-mix(in srgb, var(--primary) 88%, #f8fafc 12%);
    --chart-dot-doping-stroke: color-mix(in srgb, var(--primary) 96%, #f8fafc 4%);
    --chart-dot-clean-fill: color-mix(in srgb, var(--secondary) 88%, #f8fafc 12%);
    --chart-dot-clean-stroke: color-mix(in srgb, var(--secondary) 96%, #f8fafc 4%);
  }

  :global([data-theme="neon"]) .chart-theme {
    --chart-bg-1: color-mix(in srgb, #062438 70%, rgba(57, 255, 20, 0.12) 30%);
    --chart-bg-2: color-mix(in srgb, #092f47 82%, rgba(0, 229, 255, 0.16) 18%);
    --chart-dot-doping-fill: color-mix(in srgb, var(--primary) 90%, #ffffff 10%);
    --chart-dot-doping-stroke: color-mix(in srgb, var(--primary) 98%, #ffffff 2%);
    --chart-dot-clean-fill: color-mix(in srgb, var(--secondary) 90%, #ffffff 10%);
    --chart-dot-clean-stroke: color-mix(in srgb, var(--secondary) 98%, #ffffff 2%);
  }

  #tooltip {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    transform: translate(-50%, -100%) scale(0.96);
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
    line-height: 1.5;
    font-family: var(--font-medium);
  }

  .dot {
    stroke-width: 1.5px;
    transition: transform 0.2s ease, filter 0.2s ease;
    cursor: pointer;
  }

  .legend-dot {
    stroke-width: 1.5px;
  }

  .dot:focus-visible {
    outline: none;
    filter: drop-shadow(0 0 12px color-mix(in srgb, var(--primary) 50%, transparent));
  }

  .dot--doping {
    fill: var(--chart-dot-doping-fill);
    stroke: var(--chart-dot-doping-stroke);
  }

  .dot--clean {
    fill: var(--chart-dot-clean-fill);
    stroke: var(--chart-dot-clean-stroke);
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
    fill: color-mix(in srgb, var(--text2) 92%, transparent);
    font-size: clamp(0.75rem, 0.7rem + 0.25vw, 0.9rem);
    font-family: var(--font-medium);
    letter-spacing: 0.04em;
  }

  #legend text {
    fill: color-mix(in srgb, var(--text2) 92%, transparent);
    font-size: clamp(0.75rem, 0.72rem + 0.2vw, 0.9rem);
    font-family: var(--font-medium);
  }

  .scatterplot-mobile-table {
    grid-column: 1 / -1;
  }

  @media (min-width: 1200px) {
    .scatterplot-page {
      grid-template-columns: minmax(320px, 440px) minmax(0, 1fr);
      align-items: start;
      padding: clamp(2.5rem, 5vw, 5rem) clamp(3.5rem, 6vw, 7rem) clamp(3rem, 6vw, 4.5rem);
    }

    .scatterplot-content {
      position: sticky;
      top: clamp(2.5rem, 4vw, 5rem);
      max-width: 440px;
      text-align: left;
      margin: 0;
    }

    .scatterplot-content header,
    .scatterplot-summary,
    .scatterplot-actions {
      margin: 0;
      text-align: left;
    }

    .scatterplot-actions {
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

    #tooltip {
      font-size: 0.95rem;
    }
  }
`;

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
        const bounds = wrapperElement.getBoundingClientRect();
        const width = bounds.width > 0 ? bounds.width : 960;
        const isCompact = width < 720;
        const fallbackHeight = isCompact ? 480 : 540;
        const height = bounds.height > 0 ? bounds.height : fallbackHeight;
        const margin = isCompact
          ? { top: 72, right: 40, bottom: 136, left: 68 }
          : { top: 84, right: 60, bottom: 124, left: 80 };
        const innerWidth = Math.max(width - margin.left - margin.right, 200);
        const innerHeight = Math.max(height - margin.top - margin.bottom, 240);

        svg.selectAll("*").remove();
        svg
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMidYMid meet");

        tooltip.style("opacity", 0).style("transform", "translate(-50%, -100%) scale(0.96)");

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
            ? `<div class="mt-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-glass-2)] p-3 text-sm leading-snug text-[var(--chart-dot-doping-stroke)]">${datum.doping}</div>`
            : "";

          tooltip
            .style("opacity", 1)
            .style("transform", "translate(-50%, -110%) scale(1)")
            .attr("data-year", datum.year.toString())
            .html(
              `<div class="text-xs uppercase tracking-[0.28em] text-[var(--text3)]">${datum.year} • ${datum.timeLabel}</div>` +
                `<div class="mt-1 text-lg font-semibold text-[var(--text1)]">${datum.name}</div>` +
                `<div class="text-sm text-[var(--text2)]">${datum.nationality}</div>` +
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
          .attr("y", isCompact ? -28 : -36)
          .attr("text-anchor", "middle")
          .attr("id", "title")
          .attr("fill", "var(--text1)")
          .attr("font-size", isCompact ? "1.6rem" : "1.85rem")
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
    <div class="page scatterplot-page">
      <div class="scatterplot-content">
        <header>
          <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--primary)]">Data Storytelling</p>
          <h1 id="title">Visualize Data with a Scatterplot Graph</h1>
          <p id="description">
            A D3 scatterplot plotting professional cycling times against the year of competition. Hover or focus on each
            racer to explore doping allegations, nationalities, and performance patterns.
          </p>
        </header>

        <section class="scatterplot-summary chart-theme">
          <p class="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[var(--text3)]">
            Data Visualization Projects
          </p>
          <p class="mt-3 text-sm leading-relaxed text-[var(--text2)]">
            Here we fetch the professional cycling dataset, parse each rider&apos;s record, and map it onto D3 linear and time
            scales to draw the scatterplot while color-coding doping allegations and wiring up focusable tooltips.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-[var(--text2)]">
            Hit the refresh-and-fetch button to issue a fresh AJAX request, rebuild the SVG marks, and explore how the legend
            and interactions respond to the live dataset.
          </p>
        </section>

        <div class="scatterplot-actions">
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

      <section ref={wrapperRef} class="chart-shell chart-theme">
        <svg ref={svgRef} role="img" aria-labelledby="title description" />
        <div
          ref={tooltipRef}
          id="tooltip"
          class="font-medium"
          aria-hidden="true"
        />
      </section>

      {cyclists.value.length > 0 && (
        <div class="scatterplot-mobile-table mt-10 w-full md:hidden">
          <div class="chart-theme mx-auto max-w-5xl px-2 sm:px-4">
            <h2 class="text-left text-2xl font-semibold text-[var(--text1)]">Race leaderboard</h2>
            <p class="mt-2 text-sm leading-relaxed text-[var(--text3)]">
              Scroll the mobile table to compare finishing times and see which riders carried doping allegations.
            </p>
            <div class="mt-4 overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] shadow-[0_18px_60px_var(--surface-shadow)]">
              <div class="max-h-[480px] overflow-y-auto">
                <table class="min-w-full divide-y divide-[var(--surface-border)] text-left text-sm">
                  <caption class="sr-only">Cyclist finishing times with doping allegation status</caption>
                  <thead class="bg-[var(--surface-glass-2)] text-[0.7rem] uppercase tracking-[0.32em] text-[var(--text3)]">
                    <tr>
                      <th scope="col" class="px-4 py-3 text-left font-semibold">Year</th>
                      <th scope="col" class="px-4 py-3 text-left font-semibold">Athlete</th>
                      <th scope="col" class="px-4 py-3 text-left font-semibold">Time</th>
                      <th scope="col" class="px-4 py-3 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[var(--surface-border)] text-[var(--text2)]">
                    {cyclists.value.map((rider) => (
                      <tr
                        key={`${rider.year}-${rider.name}`}
                        class="transition-colors hover:bg-[var(--surface-glass-2)] focus-within:bg-[var(--surface-glass-2)]"
                      >
                        <th scope="row" class="whitespace-nowrap px-4 py-3 text-sm font-semibold text-[var(--text1)]">
                          {rider.year}
                        </th>
                        <td class="px-4 py-3">
                          <div class="font-semibold text-[var(--text1)]">{rider.name}</div>
                          <div class="text-xs uppercase tracking-[0.24em] text-[var(--text3)]">{rider.nationality}</div>
                        </td>
                        <td class="whitespace-nowrap px-4 py-3 text-sm font-medium text-[var(--text2)]">{rider.timeLabel}</td>
                        <td class="px-4 py-3">
                          <span
                            class={`inline-flex items-center rounded-full border px-3 py-1 text-[0.7rem] font-semibold tracking-[0.22em] ${
                              rider.doping
                                ? "border-[var(--chart-dot-doping-stroke)] text-[var(--chart-dot-doping-stroke)]"
                                : "border-[var(--chart-dot-clean-stroke)] text-[var(--chart-dot-clean-stroke)]"
                            }`}
                            title={rider.doping || undefined}
                          >
                            {rider.doping ? "ALLEGED" : "CLEAR"}
                          </span>
                          {rider.doping && (
                            <p class="mt-2 text-xs leading-snug text-[var(--text3)]">{rider.doping}</p>
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
    </div>
  );
});

export const head = buildHead(
  `Project 012 - ${siteConfig.metadata.title}`,
  "Interactive D3 scatterplot visualizing professional cyclist times and doping allegations.",
);
