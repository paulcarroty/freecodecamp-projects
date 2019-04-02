document.addEventListener("DOMContentLoaded", () => drawChart());

async function drawChart() {
  const margin = {
    top: 20,
    right: 30,
    bottom: 0,
    left: 200
  };

  const width = 1280 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const tooltipXOffset = 16;
  const tooltipYOffset = -30;
  const tooltipOpacity = 0.8;
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip");

  const container = d3
    .select("body")
    .append("div")
    .attr("id", "chart");

  container
    .append("h1")
    .attr("id", "title")
    .text("USA Educational Attainment");

  container
    .append("h3")
    .attr("id", "description")
    .text(
      "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
    );

  let svg = container
    .append("svg")
    .attr("id", "main-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.left + margin.right)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // JSON Setup
  const rawCounty =
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";
  const rawEducation =
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";

  let resEducation = await fetch(rawEducation);
  let education = await resEducation.json();

  // {
  // area_name: "Baldwin County",​​
  // bachelorsOrHigher: 28.6,
  // fips: 1003,
  // state: "AL"
  // }

  let resCounties = await fetch(rawCounty);
  let counties = await resCounties.json();

  // {
  //   arcs: [1,23], [23,45], [65,129];
  //   bbox: [-56.77775821661018, 12.469025989284091, 942.7924311762474, 596.9298966319916];
  //   counties: {
  //          geometries:
  //                  {type: polygon, id: 34899, arcs: [1,2,3,4,5]};
  //                  {type: multipolygon, id: 34435, arcs: [1,2], [3,65], [43,115]}}
  //  nation: { geometries:
  //                  {type: multipolygon, arcs: [234,45456,5676,3443], [3443]}}
  //  states: {geometries:
  //                  {type: multipolygon, arcs: [334,456,46,56,77,3] }}
  //  }

  // legend
  const colorQuantity = 8;
  const legendYOffset = -3.5;
  const legendTickSize = 25;
  const legendTickYOffset = 0;
  const legendCellWidth = 55;
  const legendCellHeight = 15;

  const minBachelorsOrHigher = d3.min(education.map(e => e.bachelorsOrHigher));
  const maxBachelorsOrHigher = d3.max(education.map(e => e.bachelorsOrHigher));

  // console.log(minBachelorsOrHigher, maxBachelorsOrHigher);

  const legendScaleX = d3
    .scaleLinear()
    .domain([minBachelorsOrHigher, maxBachelorsOrHigher])
    .range([width - (colorQuantity + 1) * legendCellWidth, width]);

  // color gradation
  const legendColorScale = d3
    .scaleThreshold()
    .domain(
      d3.range(
        minBachelorsOrHigher,
        maxBachelorsOrHigher,
        (maxBachelorsOrHigher - minBachelorsOrHigher) / colorQuantity
      )
    )
    .range(d3.schemeReds[colorQuantity + 1]);

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr(
      "transform",
      `translate(${legendCellWidth * legendYOffset}, ${legendCellHeight})`
    );

  legend
    .selectAll("rect")
    .data(
      legendColorScale.range().map(d => {
        d = legendColorScale.invertExtent(d);
        if (d[0] == null) d[0] = legendScaleX.domain()[0];
        if (d[1] == null) d[1] = legendScaleX.domain()[1];
        return d;
      })
    )
    .enter()
    .append("rect")
    .attr("height", legendCellHeight)
    .attr("x", d => legendScaleX(d[0]))
    .attr("width", d => legendScaleX(d[1]) - legendScaleX(d[0]))
    .attr("fill", d => legendColorScale(d[0]));

  legend
    .append("g")
    .attr("transform", `translate(0, ${legendTickYOffset})`)
    .call(
      d3
        .axisBottom(legendScaleX)
        .tickSize(legendTickSize)
        .tickFormat(
          eduPercent => Math.floor(Math.round(eduPercent * 10) / 10) + "%"
        )
        .tickValues(legendColorScale.domain().concat(maxBachelorsOrHigher))
    );

  // Map drawing
  const path = d3.geoPath();

  let countiesMap = d3.map();

  education.map(obj =>
    countiesMap.set(obj.fips, {
      areaName: obj.area_name,
      bachelorsOrHigher: obj.bachelorsOrHigher,
      state: obj.state
    })
  );

  // counties
  svg
    .append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(counties, counties.objects.counties).features)
    .enter()
    .append("path")
    .classed("county", true)
    .attr("data-fips", d => d.id)
    .attr("data-education", d => countiesMap.get(d.id).bachelorsOrHigher || 0)
    .attr("fill", d =>
      legendColorScale(countiesMap.get(d.id).bachelorsOrHigher || 0)
    )
    .attr("d", path)
    .on("mousemove", d => {
      const county = countiesMap.get(d.id);

      tooltip
        .attr("data-education", county.bachelorsOrHigher || 0)
        .style("opacity", tooltipOpacity)
        .style("display", "inline-block")
        .style("left", d3.event.pageX + tooltipXOffset + "px")
        .style("top", d3.event.pageY + tooltipYOffset + "px")
        .style(
          "background-color",
          `${legendColorScale(county.bachelorsOrHigher)}`
        )
        .html(
          county.areaName +
            " (" +
            county.state +
            ") " +
            county.bachelorsOrHigher +
            "%"
        );
    })
    .on("mouseout", () => tooltip.style("display", "none"));

  // Render States
  svg
    .append("path")
    .datum(
      topojson.mesh(counties, counties.objects.states, (a, b) => {
        return a !== b;
      })
    )
    .attr("class", "state")
    .classed("state", true)
    .attr("d", path);

  // Render Country
  svg
    .append("path")
    .attr("d", path(topojson.feature(counties, counties.objects.nation)))
    .attr("class", "country");
}
