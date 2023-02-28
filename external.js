function createScatterplot(data, xLabel, yLabel, xDomain, yDomain, colorScale, id, xTicks, yTicks) {
  // Define margin and dimensions for the scatterplot
  const margin = {top: 20, right: 20, bottom: 50, left: 50};
  const width = 450 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  // Create SVG element for the scatterplot
  const svg = d3.select(`#${id}`)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Convert string data to numeric data
  data.forEach(function(d) {
    d[xLabel] = +d[xLabel];
    d[yLabel] = +d[yLabel];
  });

  // Create scales for x and y axes
  const xScale = d3.scaleLinear()
                   .domain(xDomain)
                   .range([0, width]);

  const yScale = d3.scaleLinear()
                   .domain(yDomain)
                   .range([height, 0]);

  // Add x and y axes to the scatterplot
  const xAxis = d3.axisBottom(xScale).ticks((xDomain[1] - xDomain[0]) / xTicks);
  const yAxis = d3.axisLeft(yScale).ticks((yDomain[1] - yDomain[0]) / yTicks);

  svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

  svg.append("g")
     .call(yAxis);

  // Add points to the scatterplot
  svg.selectAll(".dot")
     .data(data)
     .enter()
     .append("circle")
     .attr("class", "dot")
     .attr("cx", d => xScale(d[xLabel]))
     .attr("cy", d => yScale(d[yLabel]))
     .attr("r", 3)
     .style("fill", d => colorScale(d.Species))
     .style("opacity", 0.5);
}

function createBarChart(data, id) {
  // Define margin and dimensions for the bar chart
  const margin = {top: 20, right: 20, bottom: 50, left: 50};
  const width = 450 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  // Hard code the data for the bar chart
  const counts = [50, 50, 50];

  // Define color scale for different species
  const colorScale = d3.scaleOrdinal()
                     .domain(["setosa", "versicolor", "virginica"])
                     .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  // Create SVG element for the bar chart
  const svg = d3.select(`#${id}`)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create x and y scales for the bar chart
  const xScale = d3.scaleBand()
                   .domain(["setosa", "versicolor", "virginica"])
                   .range([0, width])
                   .padding(0.2);

  const yScale = d3.scaleLinear()
                   .domain([0, d3.max(counts)])
                   .range([height, 0]);

  // Add x and y axes to the bar chart
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

  svg.append("g")
     .call(yAxis);

// Add bars to the bar chart
svg.selectAll(".bar")
   .data(counts)
   .enter()
   .append("rect")
   .attr("class", "bar")
   .attr("x", (d, i) => xScale(["setosa", "versicolor", "virginica"][i]))
   .attr("y", d => yScale(d))
   .attr("width", xScale.bandwidth())
   .attr("height", d => height - yScale(d))
   .style("fill", (d, i) => colorScale(["setosa", "versicolor", "virginica"][i]));

}

// Load data and create scatterplots
d3.csv("data/iris.csv").then(function(data) {
  // Define color scale for different species
  const colorScale = d3.scaleOrdinal()
                       .domain(["setosa", "versicolor", "virginica"])
                       .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  createScatterplot(data, "Sepal_Length", "Petal_Length", [0, 8], [0, 7], colorScale, "lengthscatter", 1, 0.5);
  createScatterplot(data, "Sepal_Width", "Petal_Width", [0, 5], [0, 3], colorScale, "widthscatter", 0.5, 0.2);
  createBarChart(data, "bargraph");
});
