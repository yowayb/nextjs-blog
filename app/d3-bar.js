import React from 'react';
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';

export function BarChart({ data }) {
  const { document } = (new JSDOM('')).window;
  global.document = document;

  const scratch = d3.select(document).select("body");
  scratch.append('g').attr('class', "plot-area");
  scratch.append('g').attr('class', "x-axis");
  scratch.append('g').attr('class', "y-axis");
  const height = 500;
  const width = 500;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.year))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1);

  const y1 = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.sales)])
    .rangeRound([height - margin.bottom, margin.top]);

  const xAxis = (g) =>
    g.attr("transform", `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(x)
        .tickValues(
          d3
            .ticks(...d3.extent(x.domain()), width / 40)
            .filter((v) => x(v) !== undefined)
        )
        .tickSizeOuter(0)
    );

  const y1Axis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .style("color", "steelblue")
      .call(d3.axisLeft(y1).ticks(null, "s"))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -margin.left)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(data.y1)
      );

  scratch.select(".x-axis").call(xAxis);
  scratch.select(".y-axis").call(y1Axis);

  scratch
    .select(".plot-area")
    .attr("fill", "steelblue")
    .selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.year))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y1(d.sales))
    .attr("height", (d) => y1(0) - y1(d.sales));

  return (
    <svg
      style={{
        height: 500,
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
      }}
      dangerouslySetInnerHTML={{ __html: scratch.node().innerHTML }}
    >
    </svg>
  );
}

export default BarChart;
