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

var xData = ['n-z', 'a-m'];

var margin = {top: 20, right: 50, bottom: 30, left: 20},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .35);

var y = d3.scale.linear()
        .rangeRound([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var dataIntermediate = xData.map(function (c) {
    return data.map(function (d) {
        return {x: d.date, y: d[c]};
    });
});

var dataStackLayout = d3.layout.stack()(dataIntermediate);

x.domain(dataStackLayout[0].map(function (d) {
    return d.x;
}));

y.domain([0,
    d3.max(dataStackLayout[dataStackLayout.length - 1],
            function (d) { return d.y0 + d.y;})
    ])
  .nice();

var layer = svg.selectAll(".stack")
        .data(dataStackLayout)
        .enter().append("g")
        .attr("class", "stack")
        .style("fill", function (d, i) {
            return color(i);
        });

// Render the Rectangles + AAttach tooltips
layer.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            return x(d.x);
        })
        .attr("y", function (d) {
            return y(d.y + d.y0);
        })
        .attr("height", function (d) {
            return y(d.y0) - y(d.y + d.y0);
        })
        .attr("width", x.rangeBand())
        .on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
            var xPosition = d3.mouse(this)[0] - 15;
            var yPosition = d3.mouse(this)[1] - 25;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text("Sum Of Commits:  " + d.y);
            //console.log(xPosition, yPosition)
        });

// Tooltips
var tooltip = svg.append("g")
  .style("display", "none");
    
tooltip.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");


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

/*
var tooltip = d3.select('#chart') // NEW
                .append('div') // NEW
                .attr('class', 'tooltip'); // NEW

tooltip.append('div') // NEW
        .attr('class', 'label'); // NEW

tooltip.append('div') // NEW
        .attr('class', 'count'); // NEW


var path = svg.selectAll('path')
                .data(function (d) {
                    return d;
                })
                .enter().append("rect")
                .attr("x", function (d) {
                    return x(d.x);
                })
                .attr("y", function (d) {
                    return y(d.y + d.y0);
                })
                .attr("height", function (d) {
                    return y(d.y0) - y(d.y + d.y0);
                })
                .attr("width", x.rangeBand());

path.on('mouseover', function(d) { // NEW
    var total = d3.sum(dataset.map(function(d) {
        return d.count;
    }));
    tooltip.select('.label').html(d.data.label);
    tooltip.select('.count').html(10);
    tooltip.style('display', 'block');
});

path.on('mouseout', function(d) { // NEW
    tooltip.style('display', 'none');
});

path.on('mousemove', function(d) {
    tooltip.style('top', (d3.event.layerY + 10) + 'px')
            .style('left', (d3.event.layerX + 10) + 'px');
});
*/

