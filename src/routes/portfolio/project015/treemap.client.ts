import * as d3 from "d3";
import { bindResponsiveChart, fetchJson } from "~/utils/portfolio-demo";
import { treemapConfig } from "./treemap.config";
import { queryTreemapDom } from "./treemap.dom";
import {
  getTreemapCategories,
  getTreemapDimensions,
  type TreeMapNode,
} from "./treemap.model";

export const setupTreemap = async (root: HTMLElement) => {
  const {
    container: containerElement,
    legend: legendElement,
    tooltip: tooltipElement,
  } = queryTreemapDom(root);

  if (!containerElement || !legendElement || !tooltipElement) {
    return undefined;
  }

  const container = d3.select(containerElement);
  const legendRoot = d3.select(legendElement);
  const tooltip = d3.select(tooltipElement);
  const data = await fetchJson<TreeMapNode>(treemapConfig.datasetUrl);
  const categories = getTreemapCategories(data);
  const color = d3
    .scaleOrdinal<string, string>()
    .domain(categories)
    .range(treemapConfig.colorPalette.slice(0, Math.max(categories.length, 2)));

  const renderChart = () => {
    const measuredWidth = containerElement.clientWidth || 960;
    const { width, height } = getTreemapDimensions(
      measuredWidth,
      treemapConfig.minWidth,
      treemapConfig.minHeight,
      treemapConfig.heightRatio,
    );

    const hierarchyRoot = d3
      .hierarchy<TreeMapNode>(data)
      .sum((datum) => datum.value)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const rootNode = d3
      .treemap<TreeMapNode>()
      .size([width, height])
      .paddingInner(0)
      .round(false)(hierarchyRoot);

    const leaves = rootNode.leaves();

    container.selectAll("*").remove();
    legendRoot.selectAll("*").remove();

    const svg = container
      .append("svg")
      .attr("class", "treemap-svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-labelledby", "title description");

    const tiles = svg
      .selectAll<SVGGElement, (typeof leaves)[number]>("g")
      .data(leaves)
      .join("g")
      .attr("transform", (datum) => `translate(${datum.x0},${datum.y0})`);

    tiles
      .append("rect")
      .attr("class", "tile")
      .attr("data-name", (datum) => datum.data.name)
      .attr("data-category", (datum) => datum.data.category)
      .attr("data-value", (datum) => datum.data.value)
      .attr("width", (datum) => Math.max(0, datum.x1 - datum.x0))
      .attr("height", (datum) => Math.max(0, datum.y1 - datum.y0))
      .attr("fill", (datum) => color(datum.data.category))
      .on("mousemove", (event, datum) => {
        const [x, y] = [event.clientX + 20, event.clientY - 28];
        tooltip
          .classed("visible", true)
          .style("left", `${x}px`)
          .style("top", `${y}px`)
          .attr("data-value", datum.data.value)
          .html(
            `<strong>${datum.data.name}</strong><br />Category: ${datum.data.category}<br />Value: ${datum.data.value.toLocaleString()}`,
          );
      })
      .on("mouseleave", () => {
        tooltip.classed("visible", false);
      });

    tiles
      .append("text")
      .attr("class", "tile-label")
      .selectAll("tspan")
      .data((datum) => datum.data.name.split(/\s+/g))
      .join("tspan")
      .attr("x", 6)
      .attr("y", (_datum, index) => 16 + index * 12)
      .text((word) => word);

    const legendWidth = Math.min(
      treemapConfig.legendMaxWidth,
      Math.max(treemapConfig.legendMinWidth, width),
    );
    const itemsPerRow = Math.max(
      1,
      Math.floor(legendWidth / treemapConfig.legendColumnWidth),
    );

    const legendSvg = legendRoot
      .append("svg")
      .attr("width", "100%")
      .attr(
        "viewBox",
        `0 0 ${legendWidth} ${Math.ceil(categories.length / itemsPerRow) * treemapConfig.legendRowHeight}`,
      )
      .attr("role", "presentation");

    const legendItems = legendSvg
      .selectAll<SVGGElement, string>("g")
      .data(categories)
      .join("g")
      .attr("transform", (_category, index) => {
        const row = Math.floor(index / itemsPerRow);
        const col = index % itemsPerRow;
        return `translate(${col * (treemapConfig.legendRectSize * 6)}, ${row * treemapConfig.legendRowHeight})`;
      });

    legendItems
      .append("rect")
      .attr("class", "legend-item")
      .attr("width", treemapConfig.legendRectSize)
      .attr("height", treemapConfig.legendRectSize)
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("fill", (category) => color(category));

    legendItems
      .append("text")
      .attr("class", "legend-label")
      .attr("x", treemapConfig.legendRectSize + treemapConfig.legendPadding)
      .attr("y", treemapConfig.legendRectSize - 4)
      .text((category) => category);
  };

  return bindResponsiveChart({
    wrapperElement: containerElement,
    renderChart,
    cleanupChart: () => {
      container.selectAll("*").remove();
      legendRoot.selectAll("*").remove();
      tooltip.classed("visible", false);
    },
  });
};
