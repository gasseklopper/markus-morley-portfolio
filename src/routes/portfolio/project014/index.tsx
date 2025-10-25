import {
  $,
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import * as d3 from "d3";
import { feature, mesh } from "topojson-client";
import type { Feature, FeatureCollection, Geometry, MultiLineString } from "geojson";
import type { GeoPermissibleObjects } from "d3";
import type { GeometryCollection, Topology } from "topojson-specification";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

const styles = `
  .choropleth-page {
    display: grid;
    gap: clamp(2rem, 5vw, 3rem);
    padding: clamp(2.5rem, 4vw, 5rem) clamp(1.5rem, 6vw, 6rem) clamp(4rem, 8vw, 6rem);
    color: var(--text1);
    background:
      radial-gradient(circle at top left, color-mix(in srgb, var(--primary) 16%, transparent) 0%, transparent 60%),
      radial-gradient(circle at bottom right, color-mix(in srgb, var(--tertiary) 12%, transparent) 0%, transparent 65%),
      var(--surface1);
    min-height: 100vh;
  }

  .choropleth-page .map-shell {
    position: relative;
    margin: 0 auto;
    width: min(1040px, 100%);
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
  }

  .choropleth-page .map-shell::after {
    content: "";
    position: absolute;
    inset: 10% 15% auto auto;
    width: clamp(180px, 28%, 240px);
    height: clamp(180px, 28%, 240px);
    background: radial-gradient(circle, color-mix(in srgb, var(--primary) 30%, transparent) 0%, transparent 68%);
    opacity: 0.28;
    pointer-events: none;
    filter: blur(6px);
  }

  .choropleth-page header {
    display: grid;
    gap: 1rem;
    max-width: 720px;
  }

  .choropleth-page #title {
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-family: var(--font-semibold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .choropleth-page #description {
    font-size: clamp(0.95rem, 1vw + 0.5rem, 1.125rem);
    color: var(--text2);
    line-height: 1.65;
    max-width: 56ch;
  }

  .choropleth-page svg {
    width: 100%;
    height: auto;
    border-radius: 1.5rem;
    border: 1px solid color-mix(in srgb, var(--surface-border) 70%, transparent);
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--surface2) 84%, transparent) 0%,
      color-mix(in srgb, var(--surface3) 64%, transparent) 100%
    );
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--surface-border) 40%, transparent);
  }

  .choropleth-page .county {
    stroke: color-mix(in srgb, var(--surface-border) 55%, transparent);
    stroke-width: 0.4px;
    transition: transform 0.18s ease, filter 0.18s ease, stroke-width 0.18s ease;
    transform-origin: center;
    cursor: pointer;
  }

  .choropleth-page .county:hover,
  .choropleth-page .county:focus-visible {
    stroke-width: 1.2px;
    filter: drop-shadow(0 12px 18px color-mix(in srgb, var(--surface-shadow) 60%, transparent));
  }

  .choropleth-page .state-boundary {
    fill: none;
    stroke: color-mix(in srgb, var(--surface-border) 96%, transparent);
    stroke-width: 1.2px;
    pointer-events: none;
  }

  .choropleth-page #legend {
    font-family: var(--font-medium);
    fill: color-mix(in srgb, var(--text2) 90%, transparent);
  }

  .choropleth-page #legend rect {
    stroke: color-mix(in srgb, var(--surface-border) 75%, transparent);
    stroke-width: 0.5px;
    rx: 6px;
  }

  .choropleth-page .legend-axis path,
  .choropleth-page .legend-axis line {
    stroke: color-mix(in srgb, var(--surface-border) 70%, transparent);
  }

  .choropleth-page .legend-axis text {
    fill: color-mix(in srgb, var(--text3) 96%, transparent);
    font-size: clamp(0.65rem, 0.6rem + 0.22vw, 0.8rem);
  }

  .choropleth-page #tooltip {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    min-width: clamp(180px, 40vw, 260px);
    padding: 1rem 1.25rem;
    border-radius: 1.25rem;
    background: color-mix(in srgb, var(--surface1) 94%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary) 25%, transparent);
    box-shadow: 0 22px 60px color-mix(in srgb, var(--surface-shadow) 70%, transparent);
    transform: translate(-50%, -100%) scale(0.96);
    transition: opacity 0.18s ease, transform 0.18s ease;
    backdrop-filter: blur(10px);
    color: var(--text1);
    line-height: 1.45;
    z-index: 10;
  }

  .choropleth-page #tooltip strong {
    font-family: var(--font-semibold);
  }

  @media (max-width: 768px) {
    .choropleth-page .map-shell {
      border-radius: 1.75rem;
    }

    .choropleth-page svg {
      border-radius: 1.25rem;
    }
  }
`;

const COUNTY_DATA_URL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const EDUCATION_DATA_URL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const FCC_TEST_SCRIPT_ID = "fcc-testable-projects";
const FCC_TEST_SCRIPT_SRC = "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js";

const triggerDomContentLoaded = () => {
  if (document.readyState !== "loading") {
    document.dispatchEvent(new Event("DOMContentLoaded"));
  }
};

type EducationDatum = {
  fips: number;
  state: string;
  area_name: string;
  bachelorsOrHigher: number;
};

type CountyObjects = {
  counties: GeometryCollection;
  states: GeometryCollection;
};

const colorPalette = [
  "#f1f5ff",
  "#dbeafe",
  "#bfdbfe",
  "#93c5fd",
  "#60a5fa",
  "#3b82f6",
];

export default component$(() => {
  useStyles$(styles);

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

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const existing = document.getElementById(FCC_TEST_SCRIPT_ID);
    if (existing) {
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
    let cleanup: (() => void) | undefined;

    try {
      isLoading.value = true;
      errorMessage.value = null;
      const [educationResponse, countyResponse] = await Promise.all([
        fetch(EDUCATION_DATA_URL),
        fetch(COUNTY_DATA_URL),
      ]);

      if (!educationResponse.ok || !countyResponse.ok) {
        throw new Error("Failed to load datasets");
      }

      const educationData: EducationDatum[] = await educationResponse.json();
      const countyTopology = (await countyResponse.json()) as Topology<CountyObjects>;

      const countyFeatures = feature(
        countyTopology,
        countyTopology.objects.counties,
      ) as FeatureCollection<Geometry, { id: string }>;

      const stateMesh = mesh(
        countyTopology,
        countyTopology.objects.states,
        (a, b) => a !== b,
      ) as MultiLineString | null;

      const educationByFips = new Map<number, EducationDatum>();
      const educationValues: number[] = [];

      for (const entry of educationData) {
        educationByFips.set(entry.fips, entry);
        educationValues.push(entry.bachelorsOrHigher);
      }

      const minEducation = d3.min(educationValues) ?? 0;
      const maxEducation = d3.max(educationValues) ?? 100;
      const step = (maxEducation - minEducation) / (colorPalette.length - 1 || 1);
      const thresholdDomain = d3.range(minEducation + step, maxEducation, step);
      const colorScale = d3.scaleThreshold<number, string>().domain(thresholdDomain).range(colorPalette);
      const legendStops = [minEducation, ...colorScale.domain(), maxEducation];

      const renderChart = () => {
        const measuredWidth = wrapperElement.clientWidth || 960;
        const width = Math.min(960, Math.max(360, measuredWidth));
        const height = width > 720 ? 640 : 600;
        const margin = width > 720
          ? { top: 60, right: 48, bottom: 90, left: 48 }
          : { top: 48, right: 28, bottom: 110, left: 32 };

        svg.selectAll("*").remove();

        svg.attr("width", width).attr("height", height).attr("viewBox", `0 0 ${width} ${height}`);

        const chartGroup = svg
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        const mapWidth = width - margin.left - margin.right;
        const legendSpace = width > 720 ? 110 : 130;
        const mapHeight = height - margin.top - margin.bottom - legendSpace;
        const projection = d3
          .geoIdentity()
          .fitSize([mapWidth, mapHeight], countyFeatures as unknown as GeoPermissibleObjects);
        const geoPath = d3.geoPath(projection);

        const mapGroup = chartGroup
          .append("g")
          .attr("transform", `translate(0, 0)`)
          .attr("role", "presentation");

        const countiesGroup = mapGroup.append("g");
        const statesGroup = mapGroup.append("g");

        countiesGroup
          .selectAll<SVGPathElement, Feature<Geometry, { id: string }>>("path")
          .data(countyFeatures.features)
          .join("path")
          .attr("class", "county")
          .attr("d", geoPath)
          .attr("data-fips", (d) => d.id ?? "")
          .attr("data-education", (d) => {
            const fips = Number(d.id);
            const edu = educationByFips.get(fips);
            return edu ? edu.bachelorsOrHigher : 0;
          })
          .attr("fill", (d) => {
            const edu = educationByFips.get(Number(d.id));
            return colorScale(edu ? edu.bachelorsOrHigher : minEducation);
          })
          .on("mouseenter focus", function (event, datum) {
            const fips = Number(datum.id);
            const edu = educationByFips.get(fips);
            if (!edu) {
              return;
            }

            const [clientX, clientY] = d3.pointer(event, wrapperElement);
            tooltip
              .attr("data-education", edu.bachelorsOrHigher)
              .html(
                `<strong>${edu.area_name}, ${edu.state}</strong><br />` +
                  `${edu.bachelorsOrHigher.toFixed(1)}% of adults with bachelor's degree or higher`,
              )
              .style("opacity", 1)
              .style("transform", "translate(-50%, -100%) scale(1)")
              .style("left", `${clientX}px`)
              .style("top", `${clientY - 12}px`);

            d3.select<SVGPathElement, Feature<Geometry, { id: string }>>(this).raise();
          })
          .on("mousemove", function (event) {
            const [clientX, clientY] = d3.pointer(event, wrapperElement);
            tooltip.style("left", `${clientX}px`).style("top", `${clientY - 12}px`);
          })
          .on("mouseleave blur", () => {
            tooltip.style("opacity", 0).style("transform", "translate(-50%, -100%) scale(0.96)");
          });

        if (stateMesh) {
          const statePath = geoPath(stateMesh as unknown as GeoPermissibleObjects);
          if (statePath) {
            statesGroup
              .append("path")
              .attr("class", "state-boundary")
              .attr("d", statePath);
          }
        }

        const legendWidth = Math.min(mapWidth, 520);
        const legendX = (mapWidth - legendWidth) / 2;
        const legendY = mapHeight + 40;

        const legendScale = d3.scaleLinear().domain([minEducation, maxEducation]).range([0, legendWidth]);

        const legendGroup = chartGroup
          .append("g")
          .attr("id", "legend")
          .attr("transform", `translate(${legendX},${legendY})`);

        const legendStepWidth = legendWidth / (colorPalette.length);

        legendGroup
          .selectAll("rect")
          .data(colorPalette)
          .join("rect")
          .attr("x", (_, index) => index * legendStepWidth)
          .attr("y", 0)
          .attr("width", legendStepWidth)
          .attr("height", 16)
          .attr("fill", (d) => d);

        const legendAxis = d3.axisBottom(legendScale).tickValues(legendStops).tickFormat((value) => `${value}%`);

        legendGroup
          .append("g")
          .attr("class", "legend-axis")
          .attr("transform", "translate(0,20)")
          .call(legendAxis);

        legendGroup
          .append("text")
          .attr("x", legendWidth / 2)
          .attr("y", 52)
          .attr("text-anchor", "middle")
          .text("Adults with bachelor's degree or higher");
      };

      renderChart();

      const resizeObserver = new ResizeObserver(() => {
        renderChart();
      });

      resizeObserver.observe(wrapperElement);

      cleanup = () => {
        resizeObserver.disconnect();
        svg.selectAll("*").remove();
      };
    } catch (error) {
      console.error(error);
      errorMessage.value = "Failed to load county education data. Please try again.";
    } finally {
      isLoading.value = false;
    }

    return () => {
      cleanup?.();
    };
  });

  return (
    <div class="page choropleth-page">
      <header>
        <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--primary)]">Data Visualization Studio</p>
        <h1 id="title">United States Education Attainment</h1>
        <p id="description">
          Choropleth view that explores the percentage of adults aged 25 and older with a bachelor&apos;s degree or above across
          U.S. counties. Hover to reveal local insights and watch the legend adapt responsively to the canvas.
        </p>
      </header>

      <section class="mx-auto w-full max-w-3xl rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-6 text-center shadow-[0_18px_60px_var(--surface-shadow)]">
        <p class="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[var(--text3)]">
          Data Visualization Projects
        </p>
        <p class="mt-3 text-sm leading-relaxed text-[var(--text2)]">
          Now that you learned how to work with D3, APIs, and AJAX technologies, put your skills to the test with these 5 Data
          Visualization projects.
        </p>
        <p class="mt-3 text-sm leading-relaxed text-[var(--text2)]">
          In these projects, you&apos;ll need to fetch data and parse a dataset, then use D3 to create different data visualizations.
          Finish them all to earn your Data Visualization certification.
        </p>
      </section>

      <div class="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 text-sm text-[var(--text2)]">
        <button
          type="button"
          onClick$={handleRefresh}
          class="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-2)] px-6 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-colors duration-300 hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isLoading.value}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class={`h-4 w-4 ${isLoading.value ? "animate-spin" : ""}`}
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

      <section class="map-shell" ref={wrapperRef}>
        <svg ref={svgRef} role="img" aria-labelledby="title description" />
        <div id="tooltip" ref={tooltipRef} aria-hidden="true" data-education="" />
      </section>
    </div>
  );
});

export const head = buildHead(`${siteConfig.metadata.title} — Choropleth Map`);
