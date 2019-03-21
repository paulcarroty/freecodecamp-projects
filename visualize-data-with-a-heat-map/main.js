const dataURL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const baseTemp = 8.66;

// expamle of data
// {
//   "baseTemperature": 8.66,
//   "monthlyVariance": [
//     {
//       "year": 1753,
//       "month": 1,
//       "variance": -1.366
//     },
//     {
//       "year": 1753,
//       "month": 2,
//       "variance": -2.223
//     }]
//  }

let getColor = variance => {
  switch (true) {
    case variance < 2.8:
      return "rgb(49, 54, 149)";
    case variance >= 2.8 && variance < 3.9:
      return "rgb(69, 117, 180)";
    case variance >= 3.9 && variance < 5:
      return "rgb(116, 173, 209)";
    case variance >= 5 && variance < 6.1:
      return "rgb(171, 217, 233)";
    case variance >= 6.1 && variance < 7.2:
      return "rgb(224, 243, 248)";
    case variance >= 7.2 && variance < 8.3:
      return "rgb(255, 255, 191)";
    case variance >= 8.3 && variance < 9.5:
      return "rgb(254, 224, 144)";
    case variance >= 9.5 && variance < 10.6:
      return "rgb(253, 174, 97)";
    case variance >= 10.6 && variance < 11.7:
      return "rgb(244, 109, 67)";
    case variance >= 11.7 && variance < 12.8:
      return "rgb(215, 48, 39)";
    case variance >= 12.8:
      return "rgb(165, 0, 38)";
  }
};

const w = 1600;
const h = 600;
const padding = 50;

d3.json(dataURL, function(err, dataset) {
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset.monthlyVariance, d => d.year) - 0,
      d3.max(dataset.monthlyVariance, d => d.year) + 5
    ])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, 12 + 0.01])
    .range([h - padding, padding]);

  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .selectAll("rect")
    .data(dataset.monthlyVariance)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.month))
    .attr(
      "width",
      d =>
        w /
        (d3.max(dataset.monthlyVariance, d => d.year) -
          d3.min(dataset.monthlyVariance, d => d.year))
    )
    .attr("height", d => 42)
    .attr("fill", d => getColor(d.variance + baseTemp))
    //toolip
    .append("title")
    .text(
      d =>
        `${d.year +
          " " +
          new Date(d.year, d.month).toLocaleString("en-us", { month: "long" })}
  ${(d.variance + baseTemp).toFixed(1)}°C
  ${d.variance}°C
        `
    );

  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(10, 0)
    .tickPadding(10)
    .tickFormat(d => d);

  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .style("font-size", "0.5em")
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);
});
