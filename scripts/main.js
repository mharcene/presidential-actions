// Set dimensions for the SVG container
const width = 800;
const height = 400;

// Select the visualization div and append an SVG element
const svg = d3.select('#visualization')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Load data from actions.json
d3.json('data/actions.json').then(function(data) {
  // Create circles and add event listeners for tooltips
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d, i) => (i + 1) * (width / (data.length + 1)))
    .attr('cy', height / 2)
    .attr('r', 20)
    .attr('fill', 'steelblue')
    .on('mouseover', function(event, d) {
      // Show tooltip on mouseover
      d3.select('#tooltip')
        .style('visibility', 'visible')
        .style('opacity', 1)
        .text(`${d.action} (${d.year})`);
    })
    .on('mousemove', function(event) {
      // Move tooltip with the mouse cursor
      d3.select('#tooltip')
        .style('top', (event.pageY + 10) + 'px')
        .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', function() {
      // Hide tooltip when the mouse leaves
      d3.select('#tooltip')
        .style('visibility', 'hidden')
        .style('opacity', 0);
    });

  // Optional: Add labels inside the circles
  svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', (d, i) => (i + 1) * (width / (data.length + 1)))
    .attr('y', height / 2 + 5)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .text(d => d.action);
}).catch(function(error) {
  console.error("Error loading data:", error);
});
