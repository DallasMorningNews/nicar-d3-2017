/* SET UP GLOBALS */
/* Define global variables for width, height and margins */
/* Define x and y axis and their paremeters */
/* Create the SVG space on the page. */

var target = document.querySelector(".chart");
var targetWidth = target.offsetWidth;
var targetHeight = target.offsetHeight;

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 20
};
var width = targetWidth - margin.left - margin.right;
var height = targetHeight - margin.top - margin.bottom;

// set the ranges
var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);

var theSvg;

var theData;
var year = "2014";

/* GET THE DATA */
/* Load the data from `data/mlb.csv` */
/* Make sure our numerical values are stored as numbers */
/* Set the domain of each scale (x & y) to the highest and lowest possible values */
/* Call separate functions to set up the chart and to update it */

/* This is an ajax call to load our csv-formatted data */
d3.csv("data/oecd_health_data.csv", function(error, data) {

    console.log("Hello, data:");
    
    theData = data;

    setNav();
    chartInit(data);
    chartUpdate(data);

});




/* DRAW THE PARTS OF THE CHART THAT DON'T CHANGE */
/* The x and y axis are static elements in that they dont change with new data */
/* So we draw them first */

function chartInit() {

    // Scale the range of the data
    xScale.domain(d3.extent(theData, function(d) {
        return +d.gdp_spending_2014;
    }));

    yScale.domain(d3.extent(theData, function(d) {
        console.log(+d.life_exp_2014);
        return +d.life_exp_2014;
    }));

    theSvg = d3.select(target).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add the X Axis
    theSvg.append("g")
    	.attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickFormat(function(d) {
            return d + "%";
        }))
        .append("text")
        .attr("class", "axis-label")
        .attr("fill", "#000")
        .attr("x", width)
        .attr("y", -8)
        .attr("text-anchor", "end")
        .text("Health care spending as percentage of GDP");

    // Add the Y Axis
    theSvg.append("g")
    	.attr("class", "y axis")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("class", "axis-label")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Life expectancy at birth");

}



function setNav() {

    d3.selectAll(".btn")
        .on("click", function() {
            year = d3.select(this).attr("val");

            d3.selectAll(".btn").classed("active", false);
            d3.select(this).classed("active", true);

            chartUpdate();

        });

}



/* DRAW THE DATA POINTS ONTO THE CHART */
/* We'll draw a circle for each team in the dataset along with the 3-letter abbr for team name */

function chartUpdate() {

    // Add the scatterplot
    theSvg.selectAll(".dot")
        .data(theData)
        .enter().append("circle")
        .attr("class", function(d) {
            return "dot " + d.cou;
        })
        .attr("r", 5)
        .attr("cx", function(d) {
            return xScale(+d["gdp_spending_"+year]);
        })
        .attr("cy", function(d) {
            return yScale(+d["life_exp_"+year]);
        });

    theSvg.selectAll(".dot")
        .transition()
        .duration(1000)
        .attr("cx", function(d) {
            return xScale(+d["gdp_spending_"+year]);
        })
        .attr("cy", function(d) {
            return yScale(+d["life_exp_"+year]);
        });



}