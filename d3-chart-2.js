(function(d3) {
'use strict';

var dataset = [
  { label: 'Jan', additions: 1924, deletions: 1272 },
  { label: 'Feb', additions: 1746, deletions: 922 },
  { label: 'Mar', additions: 205, deletions: 157 },
  { label: 'Apr', additions: 1041, deletions: 229 },
  { label: 'May', additions: 278, deletions: 108 },
  { label: 'Jun', additions: 661, deletions: 238 },
];

var margin = {left:10, right:10, top:10, bottom:30};
var width = 600;
var height = 400;
var barwidth = 50;

var y = d3.scaleLinear()
	.domain([0, d3.max(dataset.map(function(d) {return d.additions + d.deletions;}))])
	.range([0, height]);

var x = d3.scaleBand()
	.range([0, width])
	.padding(0.3)
	.domain(dataset.map(function(d) {return d.label}));

var svg = d3.select('#chart2')
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var xAxis = d3.axisBottom(x)
	.tickSizeOuter(0);

svg.append("g")
.attr("transform", "translate(0," + height + ")")
.attr('class','x-axis')
.call(xAxis);

/*
var yAxis = d3.axisLeft(y)
	.ticks(3)
	.tickSizeOuter(0);

svg.append("g")
.call(yAxis)
.attr('class','y-axis');
*/

var g = svg
	.append("g");
	
var barAdditions = g.selectAll("g")
	.data(dataset)
	.enter().append('rect')
	.attr("x", function(d) {return x(d.label)})
	.attr("y", function(d) {return (height - y(d.additions)) + "px";})
	.attr("height", function(d) {return y(d.additions)})
	.attr("width", x.bandwidth())
	.attr("fill","#22BB55");
	
var barDeletions = g.selectAll("g")
	.data(dataset)
	.enter().append('rect')
	.attr("x", function(d) {return x(d.label)})
	.attr("y", function(d) {return (height - y(d.additions) - y(d.deletions)) + "px";})
	.attr("height", function(d) {return y(d.deletions)})
	.attr("width", x.bandwidth())
	.attr("fill","#EE3322");

var tooltip = d3.select('#chart2').
	append('div')
	.attr('class','tooltip');

tooltip.append('div')
	.attr('class', 'deletions');
	
tooltip.append('div')
	.attr('class', 'additions');
	
tooltip.append('div')
	.attr('class', 'total');
	
var tooltipMouseover = function(selection) {
	return function(d) {
		var additionWord = d.additions == 1 ? "addition" : "additions";
		var deletionWord = d.deletions == 1 ? "deletion" : "deletions";
		
		tooltip.select('.additions').html(d.additions + " " + additionWord);
		tooltip.select('.deletions').html(d.deletions + " " + deletionWord);
		tooltip.select('.total').html(d.additions + d.deletions + " in total");
		tooltip.select(selection).classed('selected', true);
		tooltip.style('display', 'block');
		tooltip.style('left', (event.pageX) + "px");
		tooltip.style('top', (d3.mouse(this)[1]) + "px");
	}
}

var tooltipMousemove = function(selection) {
	return function(d) {
		tooltip.style('left', (event.pageX) + "px");
		tooltip.style('top', (d3.mouse(this)[1] + 40) + "px");
	}
}

var tooltipMouseout = function(selection) {
	return function(d) {
		tooltip.style('display','none');
		tooltip.select(selection).classed('selected', false);
	}
}

barAdditions
	.on('mouseover', tooltipMouseover('.additions'))
	.on('mousemove', tooltipMousemove('.additions'))
	.on('mouseout', tooltipMouseout('.additions'));
barDeletions
	.on('mouseover', tooltipMouseover('.deletions'))
	.on('mousemove', tooltipMousemove('.deletions'))
	.on('mouseout', tooltipMouseout('.deletions'));

})(window.d3);