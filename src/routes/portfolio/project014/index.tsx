import {
  $,
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import * as d3 from "d3";
import { feature, mesh } from "topojson-client";
import type {
  Feature,
  FeatureCollection,
  Geometry,
  MultiLineString,
} from "geojson";
import type { GeoPermissibleObjects } from "d3";
import type { GeometryCollection, Topology } from "topojson-specification";
import styles from "./project014.scss?inline";
import { siteMetadata } from "~/config/site";
import {
  FCC_TEST_SCRIPT_ID,
  FCC_TEST_SCRIPT_SRC,
  resetFccTestSuiteUI,
} from "~/utils/fcc-test-suite";
import { buildHead } from "~/utils/head";

const COUNTY_DATA_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const EDUCATION_DATA_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

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
    let cleanup: (() => void) | undefined;

    try {
      isLoading.value = true;
      errorMessage.value = null;
      const [educationResponse, countyResponse] = await Promise.all([
        fetch(EDUCATION_DATA_URL, {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }),
        fetch(COUNTY_DATA_URL, {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }),
      ]);

      if (!educationResponse.ok || !countyResponse.ok) {
        throw new Error("Failed to load datasets");
      }

      const educationData: EducationDatum[] = await educationResponse.json();
      const countyTopology =
        (await countyResponse.json()) as Topology<CountyObjects>;

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
      const step =
        (maxEducation - minEducation) / (colorPalette.length - 1 || 1);
      const thresholdDomain = d3.range(minEducation + step, maxEducation, step);
      const colorScale = d3
        .scaleThreshold<number, string>()
        .domain(thresholdDomain)
        .range(colorPalette);
      const legendStops = [minEducation, ...colorScale.domain(), maxEducation];

      const renderChart = () => {
        const { width: rawWidth, height: rawHeight } =
          wrapperElement.getBoundingClientRect();
        const measuredWidth = rawWidth || wrapperElement.clientWidth || 960;
        const measuredHeight =
          rawHeight || wrapperElement.clientHeight || measuredWidth * 0.65;
        const width = Math.max(360, measuredWidth);
        const height = Math.max(420, measuredHeight);
        const margin =
          width > 1280
            ? { top: 72, right: 64, bottom: 120, left: 64 }
            : width > 960
              ? { top: 64, right: 56, bottom: 110, left: 56 }
              : width > 720
                ? { top: 56, right: 40, bottom: 100, left: 40 }
                : { top: 48, right: 28, bottom: 110, left: 32 };

        svg.selectAll("*").remove();

        svg
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", `0 0 ${width} ${height}`);

        const chartGroup = svg
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        const mapWidth = width - margin.left - margin.right;
        const legendSpace = width > 960 ? 120 : width > 720 ? 110 : 130;
        const mapHeight = Math.max(
          260,
          height - margin.top - margin.bottom - legendSpace,
        );
        const projection = d3
          .geoIdentity()
          .fitSize(
            [mapWidth, mapHeight],
            countyFeatures as unknown as GeoPermissibleObjects,
          );
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

            d3.select<SVGPathElement, Feature<Geometry, { id: string }>>(
              this,
            ).raise();
          })
          .on("mousemove", function (event) {
            const [clientX, clientY] = d3.pointer(event, wrapperElement);
            tooltip
              .style("left", `${clientX}px`)
              .style("top", `${clientY - 12}px`);
          })
          .on("mouseleave blur", () => {
            tooltip
              .style("opacity", 0)
              .style("transform", "translate(-50%, -100%) scale(0.96)");
          });

        if (stateMesh) {
          const statePath = geoPath(
            stateMesh as unknown as GeoPermissibleObjects,
          );
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

        const legendScale = d3
          .scaleLinear()
          .domain([minEducation, maxEducation])
          .range([0, legendWidth]);

        const legendGroup = chartGroup
          .append("g")
          .attr("id", "legend")
          .attr("transform", `translate(${legendX},${legendY})`);

        const legendStepWidth = legendWidth / colorPalette.length;

        legendGroup
          .selectAll("rect")
          .data(colorPalette)
          .join("rect")
          .attr("x", (_, index) => index * legendStepWidth)
          .attr("y", 0)
          .attr("width", legendStepWidth)
          .attr("height", 16)
          .attr("fill", (d) => d);

        const legendAxis = d3
          .axisBottom(legendScale)
          .tickValues(legendStops)
          .tickFormat((value) => `${value}%`);

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
      errorMessage.value =
        "Failed to load county education data. Please try again.";
    } finally {
      isLoading.value = false;
    }

    return () => {
      cleanup?.();
    };
  });

  return (
    <div class="page choropleth-page">
      <div class="choropleth-content">
        <header class="choropleth-header">
          <p class="choropleth-eyebrow">Data Visualization Studio</p>
          <h1 id="title" class="choropleth-title">
            United States Education Attainment
          </h1>
          <p id="description" class="choropleth-description">
            Choropleth view that explores the percentage of adults aged 25 and
            older with a bachelor&apos;s degree or above across U.S. counties.
            Hover to reveal local insights and watch the legend adapt
            responsively to the canvas.
          </p>
        </header>

        <section class="choropleth-summary">
          <p class="choropleth-summary-title">Data Visualization Projects</p>
          <p class="choropleth-summary-copy">
            This choropleth pulls TopoJSON county shapes and education stats
            with parallel fetch calls, converts them with topojson-client
            helpers, and renders the map through D3 geo paths, threshold color
            scales, and layered state meshes.
          </p>
          <p class="choropleth-summary-copy">
            Use the refresh-and-fetch button to fire both AJAX requests again,
            recompute the legend, and redraw the projection so the map stays
            synced with the latest dataset.
          </p>
        </section>

        <div class="choropleth-actions">
          <button
            type="button"
            onClick$={handleRefresh}
            class="choropleth-refresh"
            disabled={isLoading.value}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class={
                isLoading.value
                  ? "choropleth-refresh-icon choropleth-refresh-icon--spinning"
                  : "choropleth-refresh-icon"
              }
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
          <div aria-live="polite" class="choropleth-status">
            {isLoading.value && <span>Loading dataset...</span>}
            {!isLoading.value && errorMessage.value && (
              <span class="choropleth-error">{errorMessage.value}</span>
            )}
          </div>
        </div>
      </div>

      <section class="map-shell" ref={wrapperRef}>
        <svg ref={svgRef} role="img" aria-labelledby="title description" />
        <div
          id="tooltip"
          ref={tooltipRef}
          aria-hidden="true"
          data-education=""
        />
      </section>
    </div>
  );
});

export const head = buildHead(`${siteMetadata.title} - Choropleth Map`);
