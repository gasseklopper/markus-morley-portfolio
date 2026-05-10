import {
  $, 
  component$,
  useSignal,
  useVisibleTask$,
  useStylesScoped$,
} from "@builder.io/qwik";
import * as d3 from "d3";
import styles from "./project011.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { FCC_TEST_SCRIPT_ID, FCC_TEST_SCRIPT_SRC, resetFccTestSuiteUI } from "~/utils/fcc-test-suite";
import { buildHead } from "~/utils/head";

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

      const payload: { data: [string, number][] } = await response.json();

      const dataset: GdpDatum[] = payload.data.map(([date, gdp]) => ({
        date: new Date(date),
        rawDate: date,
        gdp,
      }));

      const dateExtent = d3.extent(dataset, (d) => d.date);
      const minDate = dateExtent[0];
      const maxDate = dateExtent[1];

      if (!minDate || !maxDate) {
        throw new Error("Unable to determine date range from dataset.");
      }

      const maxGdp = d3.max(dataset, (d) => d.gdp) ?? 0;
      const lastDatePlusQuarter = d3.timeMonth.offset(maxDate, 3);

      const renderChart = () => {
        const measuredWidth =
          wrapperElement.clientWidth || svgElement.getBoundingClientRect().width || 960;
        const width = Math.max(measuredWidth, 360);
        const isCompact = width < 768;
        const isVeryWide = width > 1200;
        const height = Math.max(
          isCompact ? Math.round(width * 0.72) : Math.round(width * (isVeryWide ? 0.5 : 0.58)),
          isCompact ? 420 : 560,
        );
        const margin = isCompact
          ? { top: 64, right: 24, bottom: 68, left: 76 }
          : isVeryWide
          ? { top: 112, right: 64, bottom: 92, left: 132 }
          : { top: 92, right: 40, bottom: 80, left: 108 };

        const innerWidth = Math.max(width - margin.left - margin.right, 280);
        const innerHeight = Math.max(height - margin.top - margin.bottom, isCompact ? 260 : 320);

        svg
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMidYMid meet");

        svg.selectAll("*").remove();

        tooltip.style("opacity", 0).style("transform", "translate(-50%, -100%) scale(0.96)");

        const xScale = d3
          .scaleTime()
          .domain([minDate, lastDatePlusQuarter])
          .range([0, innerWidth]);

        const yScale = d3
          .scaleLinear()
          .domain([0, maxGdp])
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

        const tickCount = Math.min(14, Math.max(6, Math.floor(innerWidth / 80)));
        const xAxis = d3.axisBottom<Date>(xScale).ticks(tickCount);
        const yAxis = d3.axisLeft<number>(yScale).ticks(isCompact ? 6 : 10);

        chartGroup
          .append("g")
          .attr("id", "x-axis")
          .attr("class", "project011__axis")
          .attr("transform", `translate(0,${innerHeight})`)
          .call(xAxis);

        chartGroup.append("g").attr("id", "y-axis").attr("class", "project011__axis").call(yAxis);

        const tooltipOffset = isCompact ? 32 : 48;
        const clampVertical = (value: number) =>
          Math.min(Math.max(value, margin.top + 12), margin.top + innerHeight - 12);

        const showTooltip = (datum: GdpDatum) => {
          const barCenter =
            margin.left + (xScale(datum.date) ?? 0) + getBarWidth(datum.date) / 2;
          const barTop = margin.top + (yScale(datum.gdp) ?? innerHeight);
          tooltip
            .style("opacity", 1)
            .style("transform", "translate(-50%, -100%) scale(1)")
            .attr("data-date", datum.rawDate)
            .html(
              `<div class="project011__tooltip-date">${datum.date.toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              })}</div>` +
                `<div class="project011__tooltip-value">$${datum.gdp.toLocaleString("en-US", {
                  minimumFractionDigits: 1,
                })} Billion</div>`,
            )
            .style("left", `${barCenter}px`)
            .style("top", `${clampVertical(barTop) - tooltipOffset}px`);
        };

        chartGroup
          .selectAll<SVGRectElement, GdpDatum>(".project011__bar")
          .data(dataset)
          .join("rect")
          .attr("class", "project011__bar")
          .attr("data-date", (d) => d.rawDate)
          .attr("data-gdp", (d) => d.gdp.toString())
          .attr("x", (d) => xScale(d.date) ?? 0)
          .attr("y", (d) => yScale(d.gdp))
          .attr("width", (d) => getBarWidth(d.date))
          .attr("height", (d) => Math.max(0, innerHeight - yScale(d.gdp)))
          .attr("rx", (d) => Math.min(6, getBarWidth(d.date) / 2))
          .attr("ry", (d) => Math.min(6, Math.max(0, innerHeight - yScale(d.gdp)) / 2))
          .attr("tabindex", 0)
          .on("mouseenter", function (event, datum) {
            showTooltip(datum);
            d3.select(this).attr("fill", "var(--primary)");
          })
          .on("mousemove", function (event, datum) {
            const [, pointerY] = d3.pointer(event, wrapperElement);
            const barCenter =
              margin.left + (xScale(datum.date) ?? 0) + getBarWidth(datum.date) / 2;
            tooltip
              .style("left", `${barCenter}px`)
              .style("top", `${clampVertical(pointerY) - tooltipOffset}px`);
          })
          .on("mouseleave", function () {
            tooltip
              .style("opacity", 0)
              .style("transform", "translate(-50%, -100%) scale(0.98)");
            d3.select(this).attr("fill", null);
          })
          .on("focus", function (_event, datum) {
            showTooltip(datum);
            d3.select(this).attr("fill", "var(--primary)");
          })
          .on("blur", function () {
            tooltip
              .style("opacity", 0)
              .style("transform", "translate(-50%, -100%) scale(0.96)");
            d3.select(this).attr("fill", null);
          });

        chartGroup
          .append("text")
          .attr("x", innerWidth / 2)
          .attr("y", -Math.max(32, isCompact ? 28 : 40))
          .attr("text-anchor", "middle")
          .attr("id", "title")
          .attr("fill", "var(--text1)")
          .attr("font-size", isCompact ? "1.5rem" : "1.85rem")
          .attr("font-weight", "600")
          .text("United States GDP (1947 - 2015)");

        chartGroup
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -innerHeight / 2)
          .attr("y", -Math.max(56, margin.left - 48))
          .attr("text-anchor", "middle")
          .attr("fill", "var(--text2)")
          .attr("font-size", "0.85rem")
          .text("Gross Domestic Product (Billion USD)");
      };

      renderChart();

      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(() => {
          renderChart();
        });
        observer.observe(wrapperElement);
        cleanupResize = () => observer.disconnect();
      } else {
        const handleResize = () => {
          renderChart();
        };
        window.addEventListener("resize", handleResize);
        cleanupResize = () => window.removeEventListener("resize", handleResize);
      }
    } catch (error) {
      console.error("Failed to load GDP data", error);
      errorMessage.value = "Failed to load GDP data. Please try again.";
    } finally {
      isLoading.value = false;
    }

    return () => {
      cleanupResize?.();
      svg.selectAll("*").remove();
      tooltip.style("opacity", 0);
    };
  });

  return (
    <section class="layout-shell project011">
      <div class="project011__intro">
        <div class="project011__hero">
          <p class="project011__eyebrow">Data Storytelling</p>
          <h1 class="project011__title">Visualize Data with a Bar Chart</h1>
          <p class="project011__lead">
            An interactive D3 visualization of the United States Gross Domestic Product, showcasing over six decades of quarterly
            economic data with custom styling and responsive tooltips.
          </p>
        </div>

        <div class="project011__aside">
          <div class="project011__note">
            <p class="project011__note-title">
              Data Visualization Projects
            </p>
            <p class="project011__note-copy">
              This build streams the Federal Reserve GDP archive through fetch, then channels the JSON into D3 time and linear
              scales to plot each quarter with precise axes, transitions, and accessible tooltips.
            </p>
            <p class="project011__note-copy">
              The refresh-and-fetch button reruns the AJAX request on demand, rebuilding the SVG so you can watch the data
              pipeline power this certification project in real time.
            </p>
          </div>

          <div class="project011__controls">
            <button
              type="button"
              onClick$={handleRefresh}
              class="project011__refresh"
              disabled={isLoading.value}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                class={`project011__refresh-icon${isLoading.value ? " project011__refresh-icon--spinning" : ""}`}
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
            <div aria-live="polite" class="project011__status">
              {isLoading.value && <span>Loading dataset…</span>}
              {!isLoading.value && errorMessage.value && (
                <span class="project011__error">{errorMessage.value}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div ref={wrapperRef} class="project011__chart">
        <svg ref={svgRef} role="img" aria-labelledby="title" />
        <div
          ref={tooltipRef}
          id="tooltip"
          class="project011__tooltip"
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
