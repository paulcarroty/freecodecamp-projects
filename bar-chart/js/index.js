let yMargin = 40,
  width = 800,
  height = 400,
  barWidth = width / 275;

let clickHighlight = d3
  .select(".svgContainer")
  .append("div")
  .attr("id", "clickHighlight")
  .style("opacity", 0);

let overlay = d3
  .select(".svgContainer")
  .append("div")
  .attr("class", "overlay")
  .style("opacity", 0);

let svgContainer = d3
  .select(".svgContainer")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 250);

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  function(err, data) {
    svgContainer
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -250)
      .attr("y", 75)
      .text("Gross Domestic Product");

    svgContainer
      .append("text")
      .attr("x", width / 2 + 80)
      .attr("y", height + 50)
      .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
      .attr("class", "info");

    let years = data.data.map(item => {
      let quarter;
      let temp = item[0].substring(5, 7);

      // get current quarter
      if (temp === "01") {
        quarter = "Q1";
      } else if (temp === "04") {
        quarter = "Q2";
      } else if (temp === "07") {
        quarter = "Q3";
      } else if (temp === "10") {
        quarter = "Q4";
      }

      return item[0].substring(0, 4) + " " + quarter;
    });

    let yearsDate = data.data.map(item => {
      return new Date(item[0]);
    });

    let xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);
    let xScale = d3
      .scaleTime()
      .domain([d3.min(yearsDate), xMax])
      .range([0, width]);

    // get scaled version of x
    let xAxis = d3.axisBottom().scale(xScale);

    let xAxisGroup = svgContainer
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(60, 410)");

    let GDP = data.data.map(item => item[1]);

    let gdpMax = d3.max(GDP);

    let linearScale = d3
      .scaleLinear()
      .domain([0, gdpMax])
      .range([0, height]);

    let scaledGDP = GDP.map(function(item) {
      return linearScale(item);
    });

    let yAxisScale = d3
      .scaleLinear()
      .domain([0, gdpMax])
      .range([height, 0]);

    // get scaled version of y
    let yAxis = d3.axisLeft(yAxisScale);

    let yAxisGroup = svgContainer
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(60, 10)");

    d3.select("svg")
      .selectAll("rect")
      .data(scaledGDP)
      .enter()
      .append("rect")
      .attr("data-date", (d, i) => data.data[i][0])
      .attr("data-gdp", (d, i) => data.data[i][1])
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(yearsDate[i]))
      .attr("y", (d, i) => height - d + 10)
      .attr("width", barWidth)
      .attr("height", d => d)
      .style("fill", "#1f9d55")
      .attr("transform", "translate(60, 0)")
      .on("mouseover", (d, i) => {
        overlay
          .transition()
          .duration(0)
          .style("height", d + "px")
          .style("width", barWidth + "px")
          .style("opacity", 0.9)
          .style("left", i * barWidth + 0 + "px")
          .style("top", height - d + 10 + "px")
          .style("transform", "translateX(60px)");
        clickHighlight
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        clickHighlight
          .html(
            years[i] +
              "<br>" +
              "$" +
              GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
              " Billion"
          )
          .attr("data-date", data.data[i][0])
          .style(
            "left",
            i < 138 ? i * barWidth + "px" : (i - 60) * barWidth + "px"
          )
          .style("top", height - (i + 160) + "px")
          .style("transform", "translateX(60px)");
      })
      .on("mouseout", function(d) {
        clickHighlight
          .transition()
          .duration(300)
          .style("opacity", 0);
        overlay
          .transition()
          .duration(300)
          .style("opacity", 0);
      });
  }
);
