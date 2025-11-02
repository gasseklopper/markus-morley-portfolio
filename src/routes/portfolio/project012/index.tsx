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
  .chart-wrapper {
    position: relative;
    margin: 0 auto;
    width: min(100%, 960px);
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

  @media (max-width: 768px) {
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
    <section class="layout-shell mt-12 text-[var(--text1)] md:mt-20">
      <div class="mx-auto max-w-5xl text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--primary)]">Data Storytelling</p>
        <h1 class="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
          Visualize Data with a Scatterplot Graph
        </h1>
        <p class="mt-4 text-base leading-relaxed text-[var(--text3)] md:text-lg">
          A D3 scatterplot plotting professional cycling times against the year of competition. Hover or focus on each
          racer to explore doping allegations, nationalities, and performance patterns.
        </p>
      </div>

      <div class="mx-auto mt-8 max-w-3xl rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-6 text-center shadow-[0_18px_60px_var(--surface-shadow)]">
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
      </div>

      <div class="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-3 text-sm text-[var(--text2)]">
        <button
          type="button"
          onClick$={handleRefresh}
          class="inline-flex items-center gap-1.5 rounded-full border border-transparent bg-transparent px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-[var(--text3)] transition-colors duration-200 hover:text-[var(--primary)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)] disabled:cursor-not-allowed disabled:opacity-70"
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
        <div aria-live="polite" class="min-h-[1.5rem] text-center text-xs uppercase tracking-[0.28em] text-[var(--text3)]">
          {isLoading.value && <span>Loading dataset…</span>}
          {!isLoading.value && errorMessage.value && (
            <span class="text-[var(--primary)]">{errorMessage.value}</span>
          )}
        </div>
      </div>

      <div ref={wrapperRef} class="chart-wrapper chart-theme mt-12 flex w-full flex-col items-center px-2 sm:px-4">
        <svg ref={svgRef} role="img" aria-labelledby="title" />
        <div
          ref={tooltipRef}
          id="tooltip"
          class="font-medium"
          aria-hidden="true"
        />
      </div>

      {cyclists.value.length > 0 && (
        <div class="mt-10 w-full md:hidden">
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
    </section>
  );
});

export const head = buildHead(
  `Project 012 - ${siteConfig.metadata.title}`,
  "Interactive D3 scatterplot visualizing professional cyclist times and doping allegations.",
);
