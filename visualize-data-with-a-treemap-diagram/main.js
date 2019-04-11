document.addEventListener("DOMContentLoaded", () => drawTreeMap());

async function drawTreeMap() {
  const DATA = {
    videogames: {
      title: "Video Game Sales",
      desc: "Top 100 Most Sold Video Games Grouped by Platform",
      path:
        "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json"
    },
    movies: {
      title: "Movie Sales",
      desc: "Top 100 Highest Grossing Movies Grouped By Genre",
      path:
        "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json"
    },
    kickstarter: {
      title: "Kickstarter Pledges",
      desc: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
      path:
        "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json"
    }
  };

  const width = 1080;
  const height = 600;
  const padding = 0;

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const chart = svg.append("g").attr("id", "treemap");

  const legend = d3
    .select("body")
    .append("svg")
    .attr("id", "legend")
    .attr("width", width)
    .append("g")
    .attr("transform", `translate(${width / 4}, 0)`);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // setup header
  d3.select("ul")
    .selectAll("li")
    .data(["movies", "videogames", "kickstarter"])
    .enter()
    .append("li")
    .html(d => (d + " Data").toUpperCase())
    .on("click", d => updateData(DATA[d]));

  // handler for header click
  function updateData({ title, desc, path }) {
    d3.select("#title").html(title);
    d3.select("#description").html(desc);

    chart.selectAll("g").remove();
    legend.selectAll(".legend-tile").remove();

    d3.json(path).then(data => {
      makeTree(data);
    });
  }

  // generate random tree
  let randomProperty = Object.keys(DATA)[
    Math.floor(Math.random() * Object.keys(DATA).length)
  ];
  updateData(DATA[randomProperty]);

  // tree generation
  function makeTree(data) {
    const root = d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    const layout = d3
      .treemap()
      .size([width, height])
      .padding(padding);

    layout(root);

    const color = d3.scaleOrdinal(d3.schemePaired);

    const categories = chart
      .selectAll(".category")
      .data(root.children)
      .enter()
      .append("g")
      .attr("class", "category")
      .attr("id", d => d.data.name);

    const subcategories = categories
      .selectAll(".subcategory")
      .data(d => d.children)
      .enter()
      .append("g")
      .attr("class", "subcategory")
      .attr("id", d => d.data.name)
      .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

    subcategories
      .append("rect")
      .attr("class", "tile")
      .attr("fill", d => color(d.data.category))
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);

    subcategories
      .append("text")
      .attr("class", "tileText")
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 20 + i * 10)
      .text(d => d);

    let yCount = 0;

    // legend
    const legendTiles = legend
      .selectAll(".legend-tile")
      .data(root.children)
      .enter()
      .append("g")
      .attr("id", d => d.data.name)
      .attr("class", "legend-tile")
      .attr("transform", (d, i) => {
        const x = (i % 3) * 180;
        x === 0 ? yCount++ : yCount;
        return `translate(${x}, ${yCount * 30})`;
      });

    legendTiles
      .append("rect")
      .attr("class", "legend-item")
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", d => color(d.data.name));

    legendTiles
      .append("text")
      .attr("x", 25)
      .attr("y", 15)
      .text(d => d.data.name);
  }

  function handleMouseMove(d) {
    tooltip
      .html(
        `Name: ${d.data.name}<br/>
         Category: ${d.data.category}<br/>
         Value: ${d.data.value}
         `
      )
      .attr("data-value", d.data.value)
      .style(
        "left",
        d3.event.pageX < 0.8 * width
          ? d3.event.pageX + 10 + "px"
          : d3.event.pageX - d.data.name.length * 10 + "px"
      )
      .style(
        "top",
        d3.event.pageY < height * 0.8
          ? d3.event.pageY + 10 + "px"
          : d3.event.pageY - 80 + "px"
      )
      .style("opacity", "0.9");
  }

  // mouse out handler
  function handleMouseOut(d) {
    tooltip.style("opacity", "0");
  }
}
