let dataURL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

// expamle of data
// {
//   "Time": "39:40",
//   "Place": 28,
//   "Seconds": 2380,
//   "Name": "Giuseppe Guerini",
//   "Year": 2004,
//   "Nationality": "ITA",
//   "Doping": "",
//   "URL": ""
// }

const w = 800;
const h = 500;
const padding = 70;

d3.json(dataURL, function(err, dataset) {
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, d => d.Year) - 1,
      d3.max(dataset, d => d.Year) + 2
    ])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, d => d.Seconds) - 20,
      d3.max(dataset, d => d.Seconds) + 30
    ])
    .range([h - padding, padding]);

  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.Seconds))
    .attr("r", d => 15)
    .attr("class", "bar")
    .style("fill", d => (d.Doping !== "" ? "red" : "yellow"))
    //toolip
    .append("title")
    .text(
      d =>
        `${d.Name}
      Place: ${d.Place}
      Nationality: ${d.Nationality}
      Year: ${d.Year}
      Time: ${d.Time}
      Doping: ${d.Doping == "" ? "none" : d.Doping}`
    );

  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(7, 0)
    .tickPadding(10)
    .tickFormat(d => d);

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(7, 0)
    .tickPadding(10)
    .tickFormat(d =>
      d % 60 === 0
        ? Math.floor(d / 60) + ":00"
        : Math.floor(d / 60) + ":" + (d - Math.floor(d / 60) * 60)
    );

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
