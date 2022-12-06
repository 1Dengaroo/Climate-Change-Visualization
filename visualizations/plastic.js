let sort_type = 0;

let category = "ocean_waste";

const m = 80;
const margin = { top: m, right: m, bottom: m, left: m };
const width = 750 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

//////////////////// CHART INIT ////////////////////

const svg = d3
  .select(".plastic-chart")
  .append("svg")
  .attr("viewBox", [
    0,
    0,
    width + margin.left + margin.right,
    height + margin.top + margin.bottom,
  ])
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3.scaleBand().range([0, width]).paddingInner(0.1);

const yScale = d3.scaleLinear().rangeRound([height, 0]);

svg.append("g").attr("class", "axis y-axis");
svg.append("g").attr("class", "axis x-axis");

yAxisLabel = svg
  .append("text")
  .attr("x", 110)
  .attr("y", -10)
  .attr("fill", "#876957")
  .text("Plastic Pollution");

//////////////////// CHART UPDATE FUNCTION ////////////////////

function update(data, category) {
  // update data
  category = document.querySelector("#plastic-category").value;
  data = data.sort(function (a, b) {
    if (sort_type == 0) return a[category] - b[category];
    if (sort_type == 1) return b[category] - a[category];
  });

  // update domains
  xScale.domain(data.map((d) => d.country));
  yScale.domain([0, d3.max(data, (d) => d[category])]);

  const xAxis = d3.axisBottom().scale(xScale).ticks(5, "s");
  const yAxis = d3.axisLeft().scale(yScale).ticks(5, "s");

  // update axes
  yAxisLabel.text(function () {
    if (category == "ocean_waste")
      return "Total Plastic Release into the Ocean in 1 year (in Tonnes) ";
    if (category == "plastic_production")
      return "Total Plastic Production in 1 year (in Tonnes)";
  });

  svg
    .select(".x-axis")
    .transition()
    .duration(700)
    .attr("transform", `translate(0, ${height})`)
    .attr("font-size", "8px")
    .call(xAxis);

  svg.select(".y-axis").transition().duration(700).call(yAxis);

  svg
    .selectAll("rect")
    .transition()
    .duration(700)
    .attr("x", (d) => xScale(d.country))
    .attr("y", (d) => yScale(d[category]))
    .attr("height", (d) => height - yScale(d[category]))
    .attr("width", 42);
}

//////////////////// CHART UPDATES ////////////////////

d3.csv("data/plastic.csv", d3.autoType).then((data) => {
  console.log("data", data);

  data = data.sort(function (a, b) {
    if (sort_type == 0) return a[category] - b[category];
    if (sort_type == 1) return b[category] - a[category];
  });

  xScale.domain(data.map((d) => d.country));
  yScale.domain(d3.extent(data, (d) => d[category]));

  svg
    .select(".x-axis")
    .transition()
    .duration(0)
    .attr("transform", `translate(0, ${height})`);

  svg
    .selectAll("rect")
    .remove()
    .exit()
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "rect")
    .attr("fill", "#876957")
    .attr("x", (d) => xScale(d.country))
    .attr("y", (d) => yScale(d[category]))
    .attr("height", (d) => height - yScale(d[category]))
    .attr("width", 50);

  update(data, category);

  // EVENT LISTENERS
  document.querySelector("#plastic-category").addEventListener("change", () => {
    update(data, category);
  });
  document.querySelector("#sort").addEventListener("click", () => {
    sort_type == 0 ? (sort_type = 1) : (sort_type = 0);
    update(data, category);
  });
});
