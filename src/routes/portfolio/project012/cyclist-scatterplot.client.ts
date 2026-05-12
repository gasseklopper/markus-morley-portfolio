import * as d3 from "d3";
import { bindResponsiveChart, fetchJson } from "~/utils/portfolio-demo";
import { cyclistScatterplotConfig } from "./cyclist-scatterplot.config";
import { queryCyclistScatterplotDom } from "./cyclist-scatterplot.dom";
import {
  getScatterplotDimensions,
  parseCyclistData,
  scatterplotLegendItems,
  type CyclistDatum,
  type RawCyclistDatum,
} from "./cyclist-scatterplot.model";

export interface CyclistScatterplotRuntime {
  cyclists: CyclistDatum[];
  cleanup: () => void;
}

export const setupCyclistScatterplot = async (
  root: HTMLElement,
): Promise<CyclistScatterplotRuntime | undefined> => {
  const {
    svg: svgElement,
    tooltip: tooltipElement,
    wrapper: wrapperElement,
  } = queryCyclistScatterplotDom(root);

  if (!svgElement || !tooltipElement || !wrapperElement) {
    return undefined;
  }

  const svg = d3.select(svgElement);
  const tooltip = d3.select(tooltipElement);
  const payload = await fetchJson<RawCyclistDatum[]>(
    cyclistScatterplotConfig.dataUrl,
  );
  const dataset = parseCyclistData(payload);

  const renderChart = () => {
    const { width, height, isCompact } = getScatterplotDimensions(
      wrapperElement.clientWidth || cyclistScatterplotConfig.maxWidth,
      cyclistScatterplotConfig.maxWidth,
      cyclistScatterplotConfig.minWidth,
      cyclistScatterplotConfig.compactBreakpoint,
      cyclistScatterplotConfig.compactHeight,
      cyclistScatterplotConfig.fullHeight,
    );
    const margin = isCompact
      ? cyclistScatterplotConfig.compactMargin
      : cyclistScatterplotConfig.fullMargin;
    const innerWidth = Math.max(
      width - margin.left - margin.right,
      cyclistScatterplotConfig.minInnerWidth,
    );
    const innerHeight = height - margin.top - margin.bottom;

    svg.selectAll("*").remove();
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    tooltip
      .style("opacity", 0)
      .style("transform", "translate(-50%, -100%) scale(0.98)");

    const xExtent = d3.extent(dataset, (datum) => datum.year) as [
      number,
      number,
    ];
    const yExtent = d3.extent(dataset, (datum) => datum.time) as [Date, Date];

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

    const dotRadius = isCompact
      ? cyclistScatterplotConfig.compactDotRadius
      : cyclistScatterplotConfig.fullDotRadius;
    const tooltipOffset = isCompact
      ? cyclistScatterplotConfig.compactTooltipOffset
      : cyclistScatterplotConfig.fullTooltipOffset;

    const points = chartGroup
      .selectAll<SVGCircleElement, CyclistDatum>(".dot")
      .data(dataset)
      .join("circle")
      .attr(
        "class",
        (datum) => `dot ${datum.doping ? "dot--doping" : "dot--clean"}`,
      )
      .attr("fill", (datum) =>
        datum.doping
          ? "var(--chart-dot-doping-fill)"
          : "var(--chart-dot-clean-fill)",
      )
      .attr("stroke", (datum) =>
        datum.doping
          ? "var(--chart-dot-doping-stroke)"
          : "var(--chart-dot-clean-stroke)",
      )
      .attr("r", dotRadius)
      .attr("cx", (datum) => xScale(datum.year))
      .attr("cy", (datum) => yScale(datum.time))
      .attr("data-xvalue", (datum) => datum.year)
      .attr("data-yvalue", (datum) => datum.time.toISOString())
      .attr("tabindex", 0);

    const showTooltip = (
      event: MouseEvent | FocusEvent,
      datum: CyclistDatum,
    ) => {
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
        ? `<div class="project012__tooltip-doping">${datum.doping}</div>`
        : "";

      tooltip
        .style("opacity", 1)
        .style("transform", "translate(-50%, -110%) scale(1)")
        .attr("data-year", datum.year.toString())
        .html(
          `<div class="project012__tooltip-meta">${datum.year} - ${datum.timeLabel}</div>` +
            `<div class="project012__tooltip-name">${datum.name}</div>` +
            `<div class="project012__tooltip-nationality">${datum.nationality}</div>` +
            dopingInfo,
        )
        .style("left", `${x}px`)
        .style("top", `${y - tooltipOffset}px`);
    };

    const hideTooltip = () => {
      tooltip
        .style("opacity", 0)
        .style("transform", "translate(-50%, -100%) scale(0.98)");
    };

    points
      .on("mouseenter", function (event, datum) {
        showTooltip(event as MouseEvent, datum);
        d3.select(this)
          .raise()
          .attr("r", dotRadius + 2);
      })
      .on("mousemove", function (event, datum) {
        showTooltip(event as MouseEvent, datum);
      })
      .on("mouseleave", () => {
        hideTooltip();
        points.attr("r", dotRadius);
      })
      .on("focus", function (event, datum) {
        showTooltip(event as FocusEvent, datum);
        d3.select(this)
          .raise()
          .attr("r", dotRadius + 2);
      })
      .on("blur", () => {
        hideTooltip();
        points.attr("r", dotRadius);
      });

    chartGroup
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", isCompact ? -28 : -36)
      .attr("text-anchor", "middle")
      .attr("id", "title")
      .attr("fill", "var(--text1)")
      .attr("font-size", isCompact ? "1.28rem" : "1.85rem")
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

    const legend = chartGroup
      .append("g")
      .attr("id", "legend")
      .attr(
        "transform",
        `translate(0, ${innerHeight + (isCompact ? 96 : 80)})`,
      );

    const legendGroup = legend
      .selectAll<SVGGElement, (typeof scatterplotLegendItems)[number]>("g")
      .data(scatterplotLegendItems)
      .join("g")
      .attr(
        "transform",
        (_datum, index) =>
          `translate(0, ${index * cyclistScatterplotConfig.legendGap})`,
      );

    legendGroup
      .append("circle")
      .attr("r", dotRadius)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("class", (datum) => `legend-dot ${datum.className}`)
      .attr("fill", (datum) =>
        datum.className === "dot--doping"
          ? "var(--chart-dot-doping-fill)"
          : "var(--chart-dot-clean-fill)",
      )
      .attr("stroke", (datum) =>
        datum.className === "dot--doping"
          ? "var(--chart-dot-doping-stroke)"
          : "var(--chart-dot-clean-stroke)",
      );

    legendGroup
      .append("text")
      .attr("x", dotRadius + 10)
      .attr("y", 4)
      .text((datum) => datum.label);
  };

  const cleanup = bindResponsiveChart({
    wrapperElement,
    renderChart,
    cleanupChart: () => {
      svg.selectAll("*").remove();
    },
  });

  return {
    cyclists: dataset,
    cleanup,
  };
};
