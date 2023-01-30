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

let infant_filter = filtered_data.filter(function(d) {
    return d.Stage === 'Infant'
});

let uadult_filter = filtered_data.filter(function(d) {
    return d.Stage === 'Under adult'
});

let adult_filter = filtered_data.filter(function(d) {
    return d.Stage === 'Adult'
});

let senior_filter = filtered_data.filter(function(d) {
    return d.Stage === 'Senior'
});

infant_sum  = d3.sum(infant_filter, function(d) { return +d.People; })
uadult_sum  = d3.sum(uadult_filter, function(d) { return +d.People; })
adult_sum  = d3.sum(adult_filter, function(d) { return +d.People; })
senior_sum  = d3.sum(senior_filter, function(d) { return +d.People; })



let filtered_data2 = data.filter(function(d) {
    return d.Year === '2000'
});

let infant_filter2 = filtered_data2.filter(function(d) {
return d.Stage === 'Infant'
});

let uadult_filter2 = filtered_data2.filter(function(d) {
return d.Stage === 'Under adult'
});

let adult_filter2 = filtered_data2.filter(function(d) {
return d.Stage === 'Adult'
});

let senior_filter2 = filtered_data2.filter(function(d) {
return d.Stage === 'Senior'
});

infant_sum2  = d3.sum(infant_filter2, function(d) { return +d.People; })
uadult_sum2 = d3.sum(uadult_filter2, function(d) { return +d.People; })
adult_sum2  = d3.sum(adult_filter2, function(d) { return +d.People; })
senior_sum2  = d3.sum(senior_filter2, function(d) { return +d.People; })


console.log(senior_filter);
let group1= svg.append('g')
let group2= svg.append('g')
let group3= svg.append('g')
let group4= svg.append('g')
let group5= svg.append('g')
let group6= svg.append('g')
let group7= svg.append('g')
let group8= svg.append('g');
// console.log(infant_sum);


svg.append('text')
.attr('x', 1500)
.attr('y', 220+200)
.attr('stroke', 'Black')
.style("font-size", 50)
.text("1990 and 2000")
.style("font-weight", 50)

svg.append('text')
  .attr('x', 1500)
  .attr('y', 300+200)
  .attr('stroke', 'Black')
  .style("font-size", 50)
  .text("US Population")

  svg.append('text')
  .attr('x', 1500)
  .attr('y', 380+200)
  .attr('stroke', 'Black')
  .style("font-size", 50)
  .text("Distribution")


svg.append('text')
  .attr('x', 100)
  .attr('y', 300)
  .attr('stroke', 'Black')
  .style("font-size", 30)
  .text("1990")

  svg.append('text')
  .attr('x', 100)
  .attr('y', 800)
  .attr('stroke', 'Black')
  .style("font-size", 30)
  .text("2000")

  svg.append('text')
  .attr('x', 300)
  .attr('y', 100)
  .attr('stroke', 'Black')
  .style("font-size", 30)
  .text("Infant")

  svg.append('text')
  .attr('x', 300)
  .attr('y', 150)
  .attr('stroke', 'Black')
  .style("font-size", 30)
  .text("(0-5)")

  svg.append('text')
  .attr('x', 560)
  .attr('y', 100)
  .attr('stroke', 'Black')
  .style("font-size", 30)
  .text("Under Adult")

  svg.append('text')
  .attr('x', 580)
  .attr('y', 150)
  .attr('stroke', 'Black')
  .style("font-size", 30)
  .text("(10-15)")

  svg.append('text')
  .attr('x', 910)
  .attr('y', 100)
  .attr('stroke', 'Black')
  .style("font-size", 30)
  .text("Adult")

  svg.append('text')
  .attr('x', 900)
  .attr('y', 150)
  .attr('stroke', 'Black')
  .style("font-size", 30)
  .text("(20-55)")

  svg.append('text')
  .attr('x', 1200)
  .attr('y', 100)
  .attr('stroke', 'Black')
  .style("font-size", 30)
  .text("Senior")

  svg.append('text')
  .attr('x', 1200)
  .attr('y', 150)
  .attr('stroke', 'Black')
  .style("font-size", 30)
  .text("(60+)")

function draw(){
    for (let i = 0; i < 9; i++) {
            console.log(i);
            var numNodes = [infant_sum, uadult_sum, adult_sum, senior_sum, infant_sum2, uadult_sum2, adult_sum2, senior_sum2]
            let xp= [200, 500, 800, 1100, 200, 500, 800, 1100]
            let groups = [group1, group2, group3, group4, group5, group6, group7, group8]
            let color=[ '#470024','#01847F','#492D22', '#003153','#470024','#01847F','#492D22', '#003153']
            if(i<4){
                cy =300;
            }
            if(i>3){
                cy =800;
            }
            // var xCenter = [100, 300, 500];
            var nodes = d3.range(numNodes[i]/300000).map(function(d) {
            return {radius: 5}
            })
            console.log(cy);

            let node = groups[i].selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', function(d) {return d.radius})
            .attr('cx', function(d) {return xp[i]})
            .attr('cy', cy)
            .attr('fill', function(d) {return color[i]})
            .attr('fill-opacity', "100%")
            .attr("stroke", "black")
            .style("stroke-width", 0)


            // // Features of the forces applied to the nodes:
            var simulation = d3.forceSimulation()
            .force("x", d3.forceX().strength(1.3).x(xp[i]+150))
            .force("y", d3.forceY().strength(0.1).y( cy ))
            .force("charge", d3.forceManyBody().strength(8)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.1).radius(10).iterations(1)) // Force that avoids circle overlapping

    // // Apply these forces to the nodes and update their positions.
    // // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
            simulation
            .nodes(nodes)
            .on("tick", function(d){
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
            });

    
    }

}


draw();



})