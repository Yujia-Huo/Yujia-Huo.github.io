d3.csv("./data/USPopulation-NewDataset-ARTG5430.csv").then(function(data){

// set the dimensions and margins of the graph
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = {top: 50, left: 100, right: 50, bottom: 100};
// append the svg object to the body of the page
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

let filtered_data = data.filter(function(d) {
        return d.Year === '1900'
    });


function draw(a){

    var numNodes = a
var nodes = d3.range(numNodes).map(function(d) {
	return {radius: 20}
})

var simulation = d3.forceSimulation(nodes)
	.force('charge', d3.forceManyBody().strength(5))
	.force('center', d3.forceCenter(width / 2, height / 2))
	.force('collision', d3.forceCollide().radius(function(d) {
		return d.radius
	}))
	.on('tick', ticked);

function ticked() {
	var u = d3.select('svg')
		.selectAll('circle')
		.data(nodes)
		.join('circle')
		.attr('r', function(d) {
			return d.radius
		})
		.attr('cx', function(d) {
			return d.x
		})
		.attr('cy', function(d) {
			return d.y
		})
}


//     const x = d3.scaleOrdinal()
//     .domain(["Infant", "Under adult", "Adult", "Senior"])
//     .range([50, 200, 350, 500])

//     // A color scale
//     const color = d3.scaleOrdinal()
//     .domain(["Infant", "Under adult", "Adult", "Senior"])
//     .range([ "#F8766D", "#00BA38", "#619CFF", "Black"])

//     // a= a/2000;
//     // let data = d3.range(a);
//     // console.log(data);

//     let node = svg.append("g")
//     .selectAll("circle")
//     .data(a)
//     .join("circle")
//         .attr("r", 10)
//         .attr("cx",width /2 )
//         .attr("cy", height / 2)
//         .style("fill", "black")
//         .style("fill-opacity", 0.8)
//         .attr("stroke", "black")
//         .style("stroke-width", 4)


//         // Features of the forces applied to the nodes:
//         const simulation = d3.forceSimulation()
//         // .on("tick", tick)
//         .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
//         .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
//         .force("collide", d3.forceCollide().strength(.01).radius(1).iterations(1)) // Force that avoids circle overlapping
//         .stop();

// // // Apply these forces to the nodes and update their positions.
// // // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
//         simulation
//         .nodes(a)
//         .on("tick", function(d){
//         node
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y)
//         });
    }
    // const num = [];
    // num.length = 10;

draw(10);
// create dummy data -> just one element per circle
// const data = [{ "name": "A", "group": 1 }, { "name": "B", "group": 1 }, { "name": "C", "group": 1 }, { "name": "D", "group": 1 }, { "name": "E", "group": 1 }, { "name": "F", "group": 1 },
//             { "name": "G", "group": 2 }, { "name": "H", "group": 2 }, { "name": "I", "group": 2 }, { "name": "J", "group": 2 }, { "name": "K", "group": 2 }, { "name": "L", "group": 2 },
//             { "name": "M", "group": 3 }, { "name": "N", "group": 3 }, { "name": "O", "group": 3 }]

// A scale that gives a X target position for each group

const pop = {
        min: d3.min(filtered_data, function(d) { return +d.People; }),
        max: d3.max(filtered_data, function(d) { return +d.People; })
};



console.log(pop);


// Initialize the circle: all located at the center of the svg area
// const node = svg.append("g")
//   .selectAll("circle")
//   .data(filtered_data)
//   .join("circle")
//     .attr("r", function(d) { return rScale(d.People); })
//     .attr("cx",width / 2)
//     .attr("cy", height / 2)
//     .style("fill", d => color(d.Stage))
//     .style("fill-opacity", 0.8)
//     .attr("stroke", "black")
//     .style("stroke-width", 4)

// // Features of the forces applied to the nodes:
// var simulation = d3.forceSimulation()
//     .force("x", d3.forceX().strength(1).x(d => x(d.Stage)))
//     .force("y", d3.forceY().strength(0.1).y( height/2 ))
//     .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
//     .force("charge", d3.forceManyBody().strength(10)) // Nodes are attracted one each other of value is > 0
//     .force("collide", d3.forceCollide().strength(.1).radius(13).iterations(1)) // Force that avoids circle overlapping

// // // Apply these forces to the nodes and update their positions.
// // // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
// simulation
//     .nodes(filtered_data)
//     .on("tick", function(d){
//       node
//           .attr("cx", d => d.x)
//           .attr("cy", d => d.y)
//     });


})