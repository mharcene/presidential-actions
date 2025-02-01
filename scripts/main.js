console.log("main.js loaded");

d3.json('data/actions.json').then(function(data) {
    console.log("Data loaded:", data);
    // Your visualization code here
  }).catch(function(error) {
    console.error("Error loading data:", error);
  });  

// Set dimensions for the SVG container
const width = 800;
const height = 400;

// Select the visualization div and append an SVG element to it
const svg = d3.select('#visualization')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Load data from actions.json
d3.json('data/actions.json').then(function(data) {
  // For each data point, create a circle
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d, i) => (i + 1) * (width / (data.length + 1)))
    .attr('cy', height / 2)
    .attr('r', 20)
    .attr('fill', 'steelblue');
  
  // Add labels for each circle (action type)
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
  console.error('Error loading the data:', error);
});
