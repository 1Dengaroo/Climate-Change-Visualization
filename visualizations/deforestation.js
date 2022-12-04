"use strict";

// fetch data
const path = "data/country_rates.csv";

async function fetchData() {
  const response = d3.csv(path, d3.autotype);
  return await response;
}

const data = await fetchData();

let allData = [];
let posData = [];
let negData = [];

// filter data by positive and negative values
data.forEach(function (d) {
  const initial = d["2000 [YR2000]"];
  const final = d["2015 [YR2015]"];
  const change = (final - initial) / initial;
  if (d["Country Name"] != "" && !isNaN(change)) {
    if (change < 0) {
      negData.push({ country: d["Country Name"], change: change });
    } else {
      posData.push({ country: d["Country Name"], change: change });
    }

    allData.push({ country: d["Country Name"], change: change });
  }
});

allData.sort((a, b) => a.change - b.change);
posData.sort((a, b) => a.change - b.change);
negData.sort((a, b) => a.change - b.change);

// sets margins and widths
const margin = { top: 50, right: 50, bottom: 120, left: 50 };

const width = 700 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

const changeScale = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

// initialize svg
const svg = d3
  .select(".deforestation-chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set scale
const scale = d3
  .scaleLinear()
  .domain([0, negData.length + posData.length])
  .range([0, width]);

const xAxis = d3.axisBottom().scale(scale).tickFormat("").ticks(0);

const xGroup = svg
  .append("g")
  .attr("class", "axis x-axis")
  .attr("transform", "translate(0," + height / 2 + ")")
  .call(xAxis)
  .selectAll("text")
  .attr("y", -3)
  .attr("x", 10)
  .attr("transform", "rotate(90)")
  .style("text-anchor", "start");

const yAxis = d3.axisLeft().scale(changeScale).tickFormat(d3.format(".0%"));

const yGroup = svg
  .append("g")
  .attr("class", "axis y-axis")
  .attr("transform", "translate(0" + ", 0)")
  .call(yAxis);

svg
  .append("text")
  .text("Forest Area Change By Country")
  .attr("class", "title")
  .attr("x", width / 2)
  .attr("y", 0);

// set area scales
const areaN = d3
  .area()
  .x((d, i) => scale(i))
  .y1((d) => changeScale(d.change))
  .y0(height / 2);

const pathN = svg
  .append("path")
  .datum(negData)
  .attr("class", "areaNeg")
  .attr("d", areaN);

const areaP = d3
  .area()
  .x((d, i) => scale(i + negData.length))
  .y1((d) => changeScale(d.change))
  .y0(height / 2);

const pathP = svg
  .append("path")
  .datum(posData)
  .attr("class", "areaPos")
  .attr("d", areaP);

// add mouse drag interactivity
const lineSvg = svg.append("g");
const focus = svg.append("g").style("display", "none");

focus
  .append("line")
  .attr("class", "x")
  .style("stroke", "black")
  .attr("y1", 0)
  .attr("y2", height);

focus.append("text").attr("class", "txt");
focus.append("text").attr("class", "txtRate");

svg
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all")
  .on("mouseover", () => focus.style("display", null))
  .on("mouseout", () => focus.style("display", "none"))
  .on("mousemove", (e) => mouseMove(e));

// credit/inspo: geeksforgeeks
function mouseMove(e) {
  let x = Math.round(scale.invert(d3.pointer(e)[0]));
  if (x >= allData.length) {
    x = allData.length - 1;
  }

  let anchor = "start";
  let change = 8;
  if (x > negData.length) {
    anchor = "end";
    change = -8;
  }

  focus
    .select("text.txt")
    .attr("transform", "translate(" + (scale(x) + change) + ",40)")
    .attr("text-anchor", anchor)
    .text(allData[x]["country"]);

  focus
    .select("text.txtRate")
    .attr("transform", "translate(" + (scale(x) + change) + ",53)")
    .attr("text-anchor", anchor)
    .text(
      "Change in forest area: " + (100 * allData[x]["change"]).toFixed(2) + "%"
    );

  focus.select("line.x").attr("transform", "translate(" + scale(x) + ",0)");
}
