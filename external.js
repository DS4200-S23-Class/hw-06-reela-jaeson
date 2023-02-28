// External JS File

// Define margin and dimensions for the scatterplot
  const margin = {top: 50, right: 50, bottom: 50, left: 50};
  const height = 550;
  const width = 550; 
  const vis_width = width - margin.left - margin.right;
  const vis_height = height - margin.top - margin.bottom;

// Create frame for scatter plot (Petal_Length vs. Sepal_Length)
  const svg1 = d3.select("#lengthscatter")
                 .append("svg")
                 .attr("height", height)
                 .attr("width", width)
                 .attr("class", "frame"); 

// Create frame for scatter plot (Petal_Width vs. Sepal_Width)
  const svg2 = d3.select("#widthscatter")
                 .append("svg")
                 .attr("height", height)
                 .attr("width", width)
                 .attr("class", "frame"); 


// Create frame for bar graph (Counts of Species)
  const svg3 = d3.select("#bargraph")
                    .append("svg")
                    .attr("width", vis_width + margin.left + margin.right)
                    .attr("height", vis_height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load data and create scatterplots
d3.csv("data/iris.csv").then(function(data) {
  
// Constants for scatterplot Petal_Length vs Sepal_Length
  const Sep_Max_Length = d3.max(data, (d) => {return parseInt(d.Sepal_Length);});
  const Pet_Max_Length = d3.max(data, (d) => {return parseInt(d.Petal_Length);});
  const Sep_Scale_Length = d3.scaleLinear() 
                     .domain([0, (Sep_Max_Length + 1)]) 
                     .range([0, vis_width]); 
  const Pet_Scale_Length = d3.scaleLinear()
                     .domain([0, (Pet_Max_Length + 1)])
                     .range([vis_height, 0]);


  let dot1 = svg1.append("g")
                       .selectAll("dots")  
                       .data(data)  
                       .enter()       
                       .append("circle")  
                       .attr("cx", (d) => {return (Sep_Scale_Length(d.Sepal_Length) + margin.left);}) 
                       .attr("cy", (d) => {return (Pet_Scale_Length(d.Petal_Length) + margin.top);}) 
                       .attr("r", 5)
                       .attr("class", (d) => {return d.Species;});

// Define x-axis for first scatter plot
  svg1.append("g") 
        .attr("transform", "translate(" + margin.left + "," + (vis_height + margin.top) + ")") 
        .call(d3.axisBottom(Sep_Scale_Length).ticks(9)) 
        .attr("font-size", "10px");

// Define y-axis for first scatter plot
  svg1.append("g")       
        .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")")
        .call(d3.axisLeft(Pet_Scale_Length).ticks(14))
        .attr("font-size", "10px");

// Constants for scatterplot Petal_Width vs Sepal_Width
  const Sep_Max_Width = d3.max(data, (d) => {return parseInt(d.Sepal_Width);});
  const Pet_Max_Width = d3.max(data, (d) => {return parseInt(d.Petal_Width);});
  const Sep_Scale_Width = d3.scaleLinear() 
                     .domain([0, (Sep_Max_Width + 1)]) // add some padding  
                     .range([0, vis_width]);  
  const Pet_Scale_Width = d3.scaleLinear()
                     .domain([0, (Pet_Max_Width + 1)])
                     .range([vis_height, 0]);


let dot2 = svg2.append("g")
                       .selectAll("dots")
                       .data(data)  
                       .enter()       
                       .append("circle")  
                       .attr("cx", (d) => {return (Sep_Scale_Width(d.Sepal_Width) + margin.left);}) 
                       .attr("cy", (d) => {return (Pet_Scale_Width(d.Petal_Width) + margin.top);}) 
                       .attr("r", 5)
                       .attr("class", (d) => {return d.Species;});

// Define x-axis for first second scatter plot
  svg2.append("g") 
        .attr("transform", "translate(" + margin.left + "," + (vis_height + margin.top) + ")") 
        .call(d3.axisBottom(Sep_Scale_Width).ticks(9)) 
        .attr("font-size", "10px");

// Define y-axis for first second scatter plot
  svg2.append("g")       
        .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")")
        .call(d3.axisLeft(Pet_Scale_Width).ticks(14))
        .attr("font-size", "10px");

svg2.call(d3.brush()                
                 .extent([[0,0], [width, height]]) 
                 .on("start brush", brushChart)); 

// Create Counts of Species
  const counts = 50;
  const bar_species = d3.scaleBand()
                        .range([ 0, vis_width])
                        .domain(data.map(function(d) {return d.Species;}))
                        .padding(0.2);
  const bar_count =  d3.scaleLinear()
                        .domain([0, counts])
                        .range([vis_height, 0]);

  svg3.append("g")
        .attr("transform", "translate(0," + vis_height + ")")
        .call(d3.axisBottom(bar_species))
        .selectAll("text");

  svg3.append("g")
        .call(d3.axisLeft(bar_count));

  let bar = svg3.append("g")
                    .selectAll("bar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("x", function(d) {return bar_species(d.Species);})
                    .attr("y", bar_count(50))
                    .attr("width", bar_species.bandwidth())
                    .attr("height", function(d) {return vis_height - bar_count(50);})
                    .attr("class", (d) => {return d.Species;});

  function brushChart(event) {
    brushselect = event.selection;
    dot1.classed("brushed", function(d){return checkBrushed(brushselect, Sep_Scale_Width(d.Sepal_Width) + margin.left, Pet_Scale_Width(d.Petal_Width) + margin.top );})
    dot2.classed("brushed", function(d){return checkBrushed(brushselect, Sep_Scale_Width(d.Sepal_Width) + margin.left, Pet_Scale_Width(d.Petal_Width) + margin.top );})
    bar.classed("brushed", function(d){return checkBrushed(brushselect, Sep_Scale_Width(d.Sepal_Width) + margin.left, Pet_Scale_Width(d.Petal_Width) + margin.top );})
  };

  function checkBrushed(coordinates, cx, cy) {
    const [[x0, y0], [x1, y1]] = coordinates; 
    return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
  };
});

