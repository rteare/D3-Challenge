// automatically resizes the chart
function makeResponsive() {
    var svgWidth = 960;
    var svgHeight = 500;
    
    var margin = {
      top: 20,
      right: 40,
      bottom: 60,
      left: 100
    };
    
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Import Data
    d3.csv("assets/data/data.csv").then(function(stateData) {
    
        // Parse Data/Cast as numbers
        // ==============================
        stateData.forEach(function(data) {
          data.poverty = +data.poverty;
          data.healthcare = +data.healthcare;
        });
    
        // Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear()
          .domain([3, d3.max(stateData, d => d.poverty)])
          .range([0, width]);
    
        var yLinearScale = d3.scaleLinear()
          .domain([6, d3.max(stateData, d => d.healthcare)])
          .range([height, 0]);
    
        // Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
    
        // Append Axes to the chart
        // ==============================
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
    
        chartGroup.append("g")
          .call(leftAxis);
    
        // Create Circles
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".7");

        var circlesText = chartGroup.selectAll(".label")
        .data(stateData)
        .enter()
        .append("text")
        .text(function(d) {return (d.abbr)})
        .attr("x", d => xLinearScale(d.healthcare)-11)
        .attr("y", d => yLinearScale(d.poverty)+5)
        .style('fill','white');
    
        // Initialize tool tip
        // ==============================
        var toolTip = d3.tip()
          .attr("class", "tooltip") // style
          .offset([80, -60]) // placement
          .html(function(d) { // structure/content
            return (`State: ${d.abbr}<br>Lacks Healthcare (%): ${d.healthcare}<br>In Poverty (%): ${d.poverty}`);          });
    
        // Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);
    
        // Create event listeners to display and hide the tooltip
        // ==============================
        circlesGroup.on("mouseover", function(data) {
          toolTip.show(data, this);
        })
          // onmouseout event
          .on("mouseout", function(data, index) {
            toolTip.hide(data);
          });
    
        // Create axes labels
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 50)
          .attr("x", 0 - (height*.75))
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("Lacks Healthcare (%)");
    
        chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .attr("class", "axisText")
          .text("In Poverty (%)");
      }).catch(function(error) {
        console.log(error);
      });
    
};
