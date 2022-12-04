const path = "data/sea.csv";

async function fetch(path) {
  const response = d3.csv(path, d3.autotype);
  return await response;
}

const data = await fetch(path);
data.map((d) => (d.Year = d.Year.slice(0, 4)));
const filtered = data.filter((d) => d.Year.slice(3) === "0");

const margin = { top: 25, right: 25, bottom: 25, left: 45 };
const width = 850 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const svg = d3
  .select(".sea-level-chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x = d3
  .scaleLinear()
  .domain(d3.extent(data.map((d) => d.Year)))
  .range([0, width]);
const y = d3
  .scaleLinear()
  .domain(d3.extent(data.map((d) => d.Level)))
  .range([height, 0]);

// Create axis scales
const xAxis = d3.axisBottom().scale(x).tickFormat(d3.format("d"));
const yAxis = d3.axisLeft().scale(y);

// Create axis containers
const xGroup = svg
  .append("g")
  .attr("class", "axis x-axis")
  .attr("transform", `translate(0, ${height})`);

const yGroup = svg.append("g").attr("class", "axis y-axis");

// draw axes
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
  .attr("letter-spaceing", "0.75px")
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
  .attr("letter-spaceing", "0.75px")
  .text("Sea Level Change (mm)");

// generate labels (years)
const label = svg
  .append("g")
  .attr("font-family", "sans-serif")
  .attr("class", "label")
  .selectAll("g")
  .data(filtered)
  .join("g")
  .attr("transform", (d) => `translate(${x(d.Year)},${y(d.Level)})`)
  .attr("opacity", 1);

label
  .append("text")
  .text((d) => d.Year)
  .attr("x", (d) => x(d.Year))
  .attr("y", (d) => y(d.Level))
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("stroke-width", 4)
  .attr("stroke-linejoin", "round");

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

// add line and animation (copied from original: https://observablehq.com/@d3/connected-scatterplot)
const line = d3
  .line()
  .x((d) => x(d.Year))
  .y((d) => y(d.Level));

svg
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "orange")
  .attr("stroke-width", 2)
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-dasharray", `0,${length(line(data))}`)
  .attr("d", line)
  .transition()
  .duration(2500)
  .ease(d3.easeLinear)
  .attr("stroke-dasharray", `${length(line(data))},${length(line(data))}`);

const line2 = d3
  .line()
  .x((d) => x(d.Year))
  .y((d) => y(d.Upper));

svg
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "blue")
  .attr("stroke-width", 1)
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-dasharray", `0,${length(line2(data))}`)
  .attr("d", line2)
  .style("stroke-dasharray", "3, 3");

const line3 = d3
  .line()
  .x((d) => x(d.Year))
  .y((d) => y(d.Lower));

svg
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "green")
  .attr("stroke-width", 1)
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-dasharray", `0,${length(line3(data))}`)
  .attr("d", line3)
  .style("stroke-dasharray", "3, 3");

const color = d3.scaleOrdinal(["blue", "orange", "green"]);

color(2);
color(1);
color(0);
svg
  .selectAll("rect")
  .data(color.domain())
  .enter()
  .append("rect")
  .attr("width", 12)
  .attr("height", 12)
  .attr("x", width - 150)
  .attr("y", (d, i) => height - 50 - i * 18)
  .style("fill", (d, i) => color(i));

svg
  .selectAll("text2")
  .data(color.domain())
  .enter()
  .append("text")
  .attr("x", width - 130)
  .attr("y", (d, i) => height - 40 - i * 18)
  .text((d) => {
    if (d == 0) {
      return "Upper Error Bound";
    } else if (d == 1) {
      return "Estimated Sea Level";
    } else {
      return "Lower Error Bound";
    }
  })
  .style("font-size", "12px");

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
