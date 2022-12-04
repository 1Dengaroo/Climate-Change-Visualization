"use strict";

const forcePath = "data/forcings.csv";
const observePath = "data/observed.csv";

async function fetch(path) {
  const response = d3.csv(path, d3.autotype);
  return await response;
}

const forced = await fetch(forcePath);
const observed = await fetch(observePath);

const margin = { top: 25, right: 50, bottom: 25, left: 80 };
const width = 900 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const svg = d3
  .select(".climate-graph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x = d3
  .scaleLinear()
  .domain(d3.extent(observed.map((d) => d.Year)))
  .range([0, width]);

const y = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

// Create axis scales
const xAxis = d3.axisBottom().scale(x).tickFormat(d3.format("d"));
const yAxis = d3
  .axisLeft()
  .scale(y)
  .tickFormat((d) => {
    if (d > 0) return "+" + d * 2 + "°F Hotter";
    if (d < 0) return d * 2 + "°F Colder";
    return d * 2 + "°F";
  })
  .ticks(height / 80);

// Create axis containers
const xGroup = svg
  .append("g")
  .attr("class", "axis x-axis")
  .attr("transform", `translate(0, ${height})`);

const yGroup = svg.append("g").attr("class", "axis y-axis");

svg
  .append("g")
  .attr("class", "axis x-axis")
  .call(xAxis)
  .attr("transform", `translate(0, ${height})`);

svg.append("g").attr("class", "axis y-axis").call(yAxis);

svg
  .append("text")
  .attr("x", width - 50)
  .attr("y", height - 5)
  .attr("class", "axis-label")
  .attr("letter-spacing", "0.75px")
  .attr("font-weight", 400)
  .attr("font-size", "14px")
  .text("Year");

svg
  .append("text")
  .attr("x", 10)
  .attr("y", 10)
  .attr("class", "axis-label")
  .attr("font-weight", 400)
  .attr("font-size", "14px")
  .attr("letter-spacing", "0.75px")
  .text("1880-1910 Temperature Average");

// add grid lines
xGroup.call(xAxis).call((g) => g.select(".domain").remove());
xGroup
  .selectAll(".tick line")
  .clone()
  .attr("y2", -height)
  .attr("stroke-opacity", 0.1);

yGroup.call(yAxis).call((g) => g.select(".domain").remove());
yGroup
  .selectAll(".tick line")
  .clone()
  .attr("x2", width)
  .attr("stroke-opacity", 0.1);

// adding all lines
const observedLine = d3
  .line()
  .x((d) => x(d.Year))
  .y((d) => y(d.Annual_Mean));

svg
  .append("path")
  .datum(observed)
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-dasharray", `0,${length(observedLine(observed))}`)
  .attr("d", observedLine)
  .transition()
  .duration(2500)
  .ease(d3.easeLinear)
  .attr(
    "stroke-dasharray",
    `${length(observedLine(observed))},${length(observedLine(observed))}`
  );

svg
  .append("text")
  .attr("x", width - 30)
  .attr("class", "observed-label")
  .attr("y", 35)
  .attr("class", "axis-label")
  .attr("font-weight", 400)
  .attr("font-size", "10px")
  .attr("letter-spacing", "0.75px")
  .text("Temperature");

// adding all lines
let greenToggle = false,
  aeroToggle = false,
  ozoneToggle = false,
  landToggle = false,
  volcanicToggle = false,
  solarToggle = false,
  orbitalToggle = false;

const categorys = [
  "greenhouse",
  "ozone",
  "aerosol",
  "orbital",
  "solar",
  "land",
  "volcanic",
];

const colorMap = {
  greenhouse: "green",
  ozone: "teal",
  aerosol: "darkblue",
  orbital: "skyblue",
  solar: "orange",
  land: "yellowgreen",
  volcanic: "red",
};

function isToggled(category) {
  switch (category) {
    case "greenhouse":
      greenToggle = !greenToggle;
      return !greenToggle;
    case "land":
      landToggle = !landToggle;
      return !landToggle;
    case "orbital":
      orbitalToggle = !orbitalToggle;
      return !orbitalToggle;
    case "ozone":
      ozoneToggle = !ozoneToggle;
      return !ozoneToggle;
    case "solar":
      solarToggle = !solarToggle;
      return !solarToggle;
    case "volcanic":
      volcanicToggle = !volcanicToggle;
      return !volcanicToggle;
    case "aerosol":
      aeroToggle = !aeroToggle;
      return !aeroToggle;
  }
}

categorys.forEach((cat) => {
  document.querySelector("." + cat).addEventListener("click", () => {
    const category = document.querySelector("." + cat).classList[0];
    update(category);
  });
});

function update(category) {
  if (!isToggled(category)) {
    const greenhouse = d3
      .line()
      .x((d) => x(d.Year))
      .y((d) => {
        return y(parseFloat(d[category]) - 287.7);
      });

    svg
      .append("path")
      .datum(forced)
      .attr("fill", "none")
      .attr("class", category)
      .attr("stroke", colorMap[category])
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", `0,${length(greenhouse(forced))}`)
      .attr("d", greenhouse)
      .transition()
      .duration(2500)
      .ease(d3.easeLinear)
      .attr(
        "stroke-dasharray",
        `${length(greenhouse(forced))},${length(greenhouse(forced))}`
      );
  } else {
    svg.select("path." + category).remove();
  }
}

function position(d) {
  const t = d3.select(this);
  switch (d.side) {
    case "top":
      t.attr("text-anchor", "middle").attr("dy", "-0.7em");
      break;
    case "right":
      t.attr("dx", "0.5em").attr("dy", "0.32em").attr("text-anchor", "start");
      break;
    case "bottom":
      t.attr("text-anchor", "middle").attr("dy", "1.4em");
      break;
    case "left":
      t.attr("dx", "-0.5em").attr("dy", "0.32em").attr("text-anchor", "end");
      break;
  }
}

function length(path) {
  return d3.create("svg:path").attr("d", path).node().getTotalLength();
}
