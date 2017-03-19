(function(d3) {
'use strict';

var dataset = [
  { label: 'Elias Dorneles', count: 1 },
  { label: 'Matt O\'Connell', count: 1 },
  { label: 'Matvei Nazaruk', count: 1 },
  { label: 'Mikhail Korobov', count: 2 },
  { label: 'Joakim Uddholm', count: 7 },
  { label: 'Paul Tremberth', count: 9 },
  { label: 'Pawel Miech', count: 11 }
];

var margin = {left:20, right:20, top:20, bottom:20};
var width = 400;
var height = 400;
var radius = Math.min(width, height) / 2;

var color = d3.scaleOrdinal(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69"]);

var svg = d3.select('#chart1')
  .append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')');

var arc = d3.arc()
  .innerRadius(0)
  .outerRadius(radius);

var arcOver = d3.arc()
	.innerRadius(0)
	.outerRadius(radius + 10);

var pie = d3.pie()
  .value(function(d) { return d.count; })
  .sort(null);

var path = svg.selectAll('path')
  .data(pie(dataset))
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d) {
	return color(d.data.label);
  });

var tooltip = d3.select('#chart1').
	append('div')
	.attr('class','tooltip');

tooltip.append('div')
	.attr('class', 'label');

tooltip.append('div')
	.attr('class', 'count');
	
tooltip.append('div')
	.attr('class', 'percent');

path
	.on('mouseover', function(d) {
		d3.select(this)
		.classed("hover", true)
		.transition()
		.duration(500)
		.attr("d", arcOver);

		var	total = d3.sum(dataset.map(function(d)	{
			return d.count;
		}));
		
		var	percent = Math.round(1000 * d.data.count / total) / 10;
		tooltip.select('.label').html(d.data.label);
		tooltip.select('.count').html(d.data.count + " commits (" + percent + "%)");
		
		tooltip.style('display', 'block');
		tooltip.style('left', (d3.event.pageX + 10) + "px");
		tooltip.style('top', (d3.event.pageY + 10) + "px");
	})
	.on('mousemove', function(d) {
		tooltip.style('left', (d3.event.pageX + 10) + "px");
		tooltip.style('top', (d3.event.pageY + 10) + "px");
	})
	.on('mouseout', function(d) {
		d3.select(this)
		.classed("hover", false)
		.transition()
		.duration(500)
		.attr("d", arc);

		tooltip.style('display','none');
	});

})(window.d3);