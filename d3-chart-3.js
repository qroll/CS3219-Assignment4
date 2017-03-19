var legendRectSize = 18;
var legendSpacing = 30;

var data = [
    {'date': 1, 'n-z': 0, 'a-m': 0},
    {'date': 2, 'n-z': 0, 'a-m': 0},
    {'date': 3, 'n-z': 1, 'a-m': 0}, 
    {'date': 4, 'n-z': 1, 'a-m': 0},
    {'date': 5, 'n-z': 0, 'a-m': 0}, 
    {'date': 6, 'n-z': 1, 'a-m': 1}, 
    {'date': 7, 'n-z': 1, 'a-m': 0}, 
    {'date': 8, 'n-z': 0, 'a-m': 0},
    {'date': 9, 'n-z': 0, 'a-m': 0},
    {'date': 10, 'n-z': 0, 'a-m': 0},
    {'date': 11, 'n-z': 0, 'a-m': 0},
    {'date': 12, 'n-z': 2, 'a-m': 0}, 
    {'date': 13, 'n-z': 5, 'a-m': 2}, 
    {'date': 14, 'n-z': 1, 'a-m': 25}, 
    {'date': 15, 'n-z': 6, 'a-m': 15}, 
    {'date': 16, 'n-z': 0, 'a-m': 0},
    {'date': 17, 'n-z': 0, 'a-m': 0},
    {'date': 18, 'n-z': 3, 'a-m': 23}, 
    {'date': 19, 'n-z': 3, 'a-m': 17}, 
    {'date': 20, 'n-z': 1, 'a-m': 12}, 
    {'date': 21, 'n-z': 8, 'a-m': 23}, 
    {'date': 22, 'n-z': 7, 'a-m': 3}, 
    {'date': 23, 'n-z': 0, 'a-m': 3}, 
    {'date': 24, 'n-z': 0, 'a-m': 9}, 
    {'date': 25, 'n-z': 1, 'a-m': 3}, 
    {'date': 26, 'n-z': 11, 'a-m': 10}, 
    {'date': 27, 'n-z': 7, 'a-m': 7}, 
    {'date': 28, 'n-z': 5, 'a-m': 3}, 
    {'date': 29, 'n-z': 4, 'a-m': 2}, 
    {'date': 30, 'n-z': 1, 'a-m': 1},
    {'date': 31, 'n-z': 0, 'a-m': 0}
];

var keys = ['n-z', 'a-m'];

var margin = {top: 20, right: 50, bottom: 30, left: 20},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand()
		.range([0, width])
		.padding(0.35);

var y = d3.scaleLinear()
        .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory20);

var xAxis = d3.axisBottom(x)
	.tickSizeOuter(0);

var svg = d3.select("#chart3").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
.attr("transform", "translate(0," + height + ")")
.attr('class','x-axis')
.call(xAxis);

var dataStackLayout = d3.stack()
	.keys(keys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

var layers = dataStackLayout(data);	

x.domain(data.map(function(d) { return d.date; }));
y.domain([0, 31]).nice();

var layer = svg.selectAll(".stack")
        .data(layers)
        .enter().append("g")
        .attr("class", "stack")
        .style("fill", function (d, i) {
            return color(i);
        });

// Render the Rectangles + AAttach tooltips
layer.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function (d) {
            return x(d.data.date);
        })
        .attr("y", function (d) {
            return y(d[1]);
        })
        .attr("height", function (d) {
            return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth())
        .on("mouseover", function(d) { tooltip.style("display", "block");
            tooltip.select(".text").html("Sum Of Commits:  " + d[1]); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
            var xPosition = d3.mouse(this)[0] - 15;
            var yPosition = d3.mouse(this)[1] - 25;
			
			tooltip.style('left', (xPosition) + "px");
			tooltip.style('top', (yPosition) + "px");
            //console.log(xPosition, yPosition)
        });

// Tooltips
var tooltip = d3.select('#chart3').append("div")
  .attr('class', 'tooltip');

tooltip.append('div')
	.attr('class', 'text');

// Append Axes
svg.append("g")
        .attr("class", "xAxisQ3")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

// Render Legend
var legend = svg.selectAll('.legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function(d,i) {
                    
                    var height = legendRectSize + legendSpacing;
                    var offset = height * color.domain().length/2;
                    var horz = -2 * legendRectSize;
                    var vert = (i * height - offset) + 30;
                    return 'translate(' + 30 + ',' + vert + ')';
                    
                });

legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

legend.append('text')
        .attr('x', legendRectSize + legendSpacing - 20)
        .attr('y', legendRectSize - legendSpacing + 25)
        .text(function(d) { 
            if (d == 1) {
                return "Authors with names starting from A to M";
            } else {
                return "Authors with names starting from N to Z";
            }
        });
