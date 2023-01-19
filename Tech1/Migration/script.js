// Set width and height as width and height of window
const width = window.innerWidth;
const height = window.innerHeight;
const margin = { top: 0, left: 0, right: 0, bottom: 100 };

const plot = d3.select("#map");
const W = plot.node().clientWidth;
const H = plot.node().clientHeight;
let yPos = 0;


function parseCountries(d) {
    return {
        country: d.Country,
        pop: +d.population,
        lon: d.lon,
        lat: d.lat
    }
}

const svg2 = plot.append("svg")
    .attr("width", 1500)
    .attr("height", 700)

const projection = d3.geoEquirectangular()
    .translate([width / 2, height / 2])
    .scale(200)
    .center([30, 0]);

const countries = d3.geoPath().projection(projection);

const USA = { lat: 37.0902, lon: -95.7129 };


// load data  
const worldmapPromise = d3.json("./data/world.geojson");
var countryPromise = d3.csv("./data/countries10.csv", parseCountries);

Promise.all([worldmapPromise, countryPromise])
    .then(function ([worldmap, country]) {

        const pop = {
            min: d3.min(country, function (d) { return +d.pop; }),
            max: d3.max(country, function (d) { return +d.pop; })
        };


        const rScale = d3.scaleSqrt()
            .domain([pop.min, pop.max])
            .range([20, 70]);

        // draw map
        svg2.selectAll("path")
            .data(worldmap.features)
            .enter()
            .append("path")
            .attr("class", "continent")
            .attr("d", countries)
            .attr("fill", "rgb(218, 208, 167)")
            .attr("opacity", .3)
            .attr("stroke", "none");

        d3.select("#animate").on("click", function () {

            svg2.selectAll(".line").remove();
            svg2.selectAll("circle").remove();

            svg2.append("circle")
                .attr("cx", projection([USA.lon, USA.lat])[0])
                .attr("cy", projection([USA.lon, USA.lat])[1])
                .attr("r", "0")
                .attr("fill", "rgb(78,130,131)")
                .attr("opacity", .5)
                .transition()
                .delay(2000)
                .duration(1500)
                .attr("r", "20px");

            var popCircles = svg2.selectAll(".country")
                .data(country)
                .enter()
                .append("circle")
                .attr("class", "country")
                //.attr("cx", function(d) {return projection([USA.lon, USA.lat])[0];})
                //.attr("cy", function(d) {return projection([USA.lon, USA.lat])[1];})
                .attr("cx", function (d) { return projection([d.lon, d.lat])[0]; })
                .attr("cy", function (d) { return projection([d.lon, d.lat])[1]; })
                .attr("r", 0)
                .attr("fill", "white")
                .attr("stroke", "white")
                .attr("stroke-width", 6)
                .attr("opacity", .5)
                .attr("fill-opacity","0");

            var mapArcs = svg2.selectAll(".line")
                .data(country)
                .enter()
                .append("path")
                .attr("class", "line")
                .attr("d", d => {
                    let startPt = projection([d.lon, d.lat]);
                    let endPt = projection([d.lon, d.lat]);
                    let p = `M ${startPt[0]}, ${startPt[1]}, L ${startPt[0]}, ${startPt[1]}, ${endPt[0]}, ${endPt[1]}`;
                    return p;
                })
                .style("fill", "none")
                .attr("stroke", "rgb(78,130,131)")
                .attr("opactity", 0.6)
                .attr("stroke-width", "2px")

            mapArcs.transition()
                .delay(500)
                //.delay(function (d) { return d.delay })
                .duration(1500)
                .attr("d", d => {
                    let startPt = projection([d.lon, d.lat]);
                    let endPt = projection([USA.lon, USA.lat]);
                    let p = `M ${startPt[0]}, ${startPt[1]}, L ${startPt[0]}, ${startPt[1]}, ${endPt[0]}, ${endPt[1]}`;
                    return p;
                })

            popCircles.transition()
                .delay(500)
                .duration(1500)
                .attr("r", function (d) { return rScale(d.pop); })
            //.transition()
            //.delay(function(d){ return d.delay})
            //.duration(1000)
            //.attr("r", 0);



            const tooltip3 = d3.select("#map")
                .append("div")
                .attr("class", "tooltip");

            //let displayValue = d3.format(",.2r")(d.pop);

            popCircles.on("mouseover", function (e, d) {
                tooltip3.style("visibility", "visible")
                    .style("left", "850px")
                    .style("top", "200px")
                    .html(`${d.country} : ${d.pop}`);

                d3.select(this)
                    .style("stroke-width", "8px");

            }).on("mouseout", function () {

                tooltip3.style("visibility", "hidden");

                d3.select(this)
                    .style("stroke-width", "7px");

            })
        });

/***************************** */
//     Vis 2               //

        d3.csv("./data/modes.csv").then(function(data) {

            /*
            CREATE THE SVG CANVAS
              */
            
            const canvas = d3.select("#chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height-50);
        
            const tooltip = d3.select("#chart")
                .append("div")
                .attr("class", "tooltip");
        
            const tooltip2 = d3.select("#chart")
                .append("div")
                .attr("class", "tooltip2");
        
            /*Create scale
            */
        
            const xScale = d3.scaleOrdinal()
            .domain(["born", "resident", "family", "special"])
            .range([330, 600-20, 850-20, 1100-20]);
        
            const yScale = d3.scaleLinear()
            .domain([1, 8])
            .range([height-margin.bottom, 150]);
        
        //Define lines for chart
            const lines = canvas.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x",  function(d) { return xScale(d.type); })
                .attr("y", height-margin.bottom)
                .attr("height", 10)
                .attr("width", 150)
                .attr("fill", "rgb(78, 130, 131)");
        
            canvas.on("mouseover", function () {
        
                lines.transition()
                    .delay(200)
                    .duration(800)
                    .attr("y", function(d) { return yScale(d.order); });
            }).on("mouseout", function () {
                lines.transition()
                    .delay(200)
                    .duration(800)
                    .attr("y", height-margin.bottom);
            }); 
        
                /*Create Text labels
            */
            canvas.append("text")
                .attr("class", "cat")
                .attr("x", 375-20)
                .attr("y", (height-margin.bottom)+45)
                .attr("text-anchor","left")
                .text("Birthright")
                .attr("fill", "white")
                .attr("font-size", 20);
        
            canvas.append("text")
                .attr("class", "cat")
                .attr("x", 625-20)
                .attr("y", (height-margin.bottom)+45)
                .attr("text-anchor","left")
                .text("Residential")
                .attr("fill", "white")
                .attr("font-size", 20);
        
            canvas.append("text")
                .attr("class", "cat")
                .attr("x", 875-20)
                .attr("y", (height-margin.bottom)+45)
                .attr("text-anchor","left")
                .text("Familial")
                .attr("fill", "white")
                .attr("font-size", 20);
        
            canvas.append("text")
                .attr("class", "cat")
                .attr("x", 1125-20)
                .attr("y", (height-margin.bottom)+45)
                .attr("text-anchor","left")
                .text("Special")
                .attr("fill", "white")
                .attr("font-size", 20);
        
        // Generate description text and hover effect
            lines.on("mouseover", function(e, d){
                tooltip.style("visibility", "visible")
                .style("left", "1000px")
                .style("top", "250px")
                .html(` <font size="+2">${d.title}</font> <br> <br>${d.description}`);
        
                // tooltip2.style("visibility", "visible")
                // .style("left", "1000px")
                // .style("bottom", "450px")
                // .html(`${d.title}`);
            
                d3.select(this)
                    .attr("stroke", "white")
                    .attr("stroke-width", 5)
                    .attr("stroke-opacity", .5)
                    })
                    
                .on("mouseout", function(){
            
                    tooltip.style("visibility","hidden")
                    tooltip2.style("visibility", "hidden")
                    d3.select(this)
                    .attr("stroke", "none")
                    .attr("stroke-width", 0);
                
                })
                });

        //*********************************************************************/
        //********************************* STEP VISUAL ***********************//


        const svg = d3.select("#chart2")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // **************************************************************** //
        // Draw Endpoints //
        svg.append("circle")
            .attr("cx", width / 2 - 585)
            .attr("cy", height / 2 + 100)
            .attr("r", 20)
            .style("fill", "none")
            .style("stroke", "rgb(255,255,255,.5)")
            .style("stroke-width", 10)

        svg.append("circle")
            .attr("cx", width / 2 + 585)
            .attr("cy", height / 2 + 100)
            .attr("r", 20)
            .style("fill", "none")
            .style("stroke", "rgb(255,255,255,.5)")
            .style("stroke-width", 10)

        // **************************************************************** //
        //Birth
        // **************************************************************** //
        d3.select("#birth").on("click", function () {

            svg.selectAll("line").remove();
            svg.selectAll("text").remove();

            var b_txt = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Citizenship Granted at Birth in U.S. or Abroad to Citizen Parents")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var b_line = svg.append("line")
                .attr("x1", width / 2 - 550)
                .attr("x2", width / 2 - 550)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78, 130, 131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            b_line.transition()
                .duration(1200)
                .attr("x2", width / 2 + 550)
                .attr("y2", height / 2 + 100)

            b_line.on("mouseover", function () {
                b_txt.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                b_txt.style("opacity", 0);
            });
        });

        // **************************************************************** //
        //Marriage
        // **************************************************************** //
        d3.select("#marriage").on("click", function () {

            svg.selectAll("line").remove();
            svg.selectAll("text").remove();

            //////white Lines/////
            svg.append("line")
                .attr("x1", width / 2 - 550)
                .attr("x2", width / 2 - 550)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .duration(800)
                .attr("x2", width / 2 - 416.88)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 - 411.88)
                .attr("x2", width / 2 - 411.88)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(800)
                .duration(800)
                .attr("x2", width / 2 - 278.76)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 - 273.76)
                .attr("x2", width / 2 - 273.76)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(1600)
                .duration(800)
                .attr("x2", width / 2 - 140.64)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 - 135.64)
                .attr("x2", width / 2 - 135.64)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(2400)
                .duration(800)
                .attr("x2", width / 2 - 2.51)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 + 2.49)
                .attr("x2", width / 2 + 2.49)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(3200)
                .duration(800)
                .attr("x2", width / 2 + 135.62)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 + 140.62)
                .attr("x2", width / 2 + 140.62)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(4000)
                .duration(800)
                .attr("x2", width / 2 + 273.75)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 + 278.75)
                .attr("x2", width / 2 + 278.75)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(4800)
                .duration(800)
                .attr("x2", width / 2 + 411.88)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 + 416.88)
                .attr("x2", width / 2 + 416.88)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(5600)
                .duration(800)
                .attr("x2", width / 2 + 550)
                .attr("y2", height / 2 + 100);

            /////Green Lines/////
            //rgb(78,130,131)
            var w_txt1 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Three Year LPR")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var w_line1 = svg.append("line")
                .attr("x1", width / 2 - 550)
                .attr("x2", width / 2 - 550)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")

            w_line1.transition()
                .duration(800)
                .attr("x2", width / 2 - 416.88)
                .attr("y2", height / 2 + 100);

            w_line1.on("mouseover", function () {
                w_txt1.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                w_txt1.style("opacity", 0);
            });
            //2
            var w_txt2 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Common Household")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var w_line2 = svg.append("line")
                .attr("x1", width / 2 - 411.88)
                .attr("x2", width / 2 - 411.88)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            w_line2.transition()
                .delay(800)
                .duration(800)
                .attr("x2", width / 2 - 278.76)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(6400)
                .duration(800)
                .attr("y1", height / 2 + 50)
                .attr("y2", height / 2 + 50);

            w_line2.on("mouseover", function () {
                w_txt2.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                w_txt2.style("opacity", 0);
            });
            //3
            var w_txt3 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Continuous Residence")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var w_line3 = svg.append("line")
                .attr("x1", width / 2 - 273.76)
                .attr("x2", width / 2 - 273.76)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            w_line3.transition()
                .delay(1600)
                .duration(800)
                .attr("x2", width / 2 - 140.64)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(5600)
                .duration(800)
                .attr("y1", height / 2)
                .attr("y2", height / 2);

            w_line3.on("mouseover", function () {
                w_txt3.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                w_txt3.style("opacity", 0);
            });
            //4
            var w_txt4 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Language Fundamentals")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var w_line4 = svg.append("line")
                .attr("x1", width / 2 - 135.64)
                .attr("x2", width / 2 - 135.64)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            w_line4.transition()
                .delay(2400)
                .duration(800)
                .attr("x2", width / 2 - 2.51)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(4800)
                .duration(800)
                .attr("y1", height / 2 - 50)
                .attr("y2", height / 2 - 50);

            w_line4.on("mouseover", function () {
                w_txt4.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                w_txt4.style("opacity", 0);
            });
            //5
            var w_txt5 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Civic Knowledge Test")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var w_line5 = svg.append("line")
                .attr("x1", width / 2 + 2.49)
                .attr("x2", width / 2 + 2.49)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            w_line5.transition()
                .delay(3200)
                .duration(800)
                .attr("x2", width / 2 + 135.62)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(4000)
                .duration(800)
                .attr("y1", height / 2 - 100)
                .attr("y2", height / 2 - 100);

            w_line5.on("mouseover", function () {
                w_txt5.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                w_txt5.style("opacity", 0);
            });
            //6
            var w_txt6 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Proof of Moral Character")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var w_line6 = svg.append("line")
                .attr("x1", width / 2 + 140.62)
                .attr("x2", width / 2 + 140.62)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            w_line6.transition()
                .delay(4000)
                .duration(800)
                .attr("x2", width / 2 + 273.75)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(3200)
                .duration(800)
                .attr("y1", height / 2 - 150)
                .attr("y2", height / 2 - 150);

            w_line6.on("mouseover", function () {
                w_txt6.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                w_txt6.style("opacity", 0);
            });
            //7
            var w_txt7 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Application Fees")
                .style("opacity", 0)
                .style("font-size", 30);

            var w_line7 = svg.append("line")
                .attr("x1", width / 2 + 278.75)
                .attr("x2", width / 2 + 278.75)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            w_line7.transition()
                .delay(4800)
                .duration(800)
                .attr("x2", width / 2 + 411.88)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(2400)
                .duration(800)
                .attr("y1", height / 2 - 200)
                .attr("y2", height / 2 - 200);

            w_line7.on("mouseover", function () {
                w_txt7.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                w_txt7.style("opacity", 0);
            });
            //8
            var w_txt8 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Oath of Allegience")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var w_line8 = svg.append("line")
                .attr("x1", width / 2 + 416.88)
                .attr("x2", width / 2 + 416.88)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "left");

            w_line8.transition()
                .delay(5600)
                .duration(800)
                .attr("x2", width / 2 + 550)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(1600)
                .duration(800)
                .attr("y1", height / 2 - 250)
                .attr("y2", height / 2 - 250);

            w_line8.on("mouseover", function () {
                w_txt8.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                w_txt8.style("opacity", 0);
            });

        });

        // **************************************************************** //
        //Residency
        // **************************************************************** //
        d3.select("#residency").on("click", function () {

            svg.selectAll("line").remove();
            svg.selectAll("text").remove();

            //////white Lines/////
            svg.append("line")
                .attr("x1", width / 2 - 550)
                .attr("x2", width / 2 - 550)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .duration(800)
                .attr("x2", width / 2 - 397.14)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 - 392.14)
                .attr("x2", width / 2 - 392.14)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(800)
                .duration(800)
                .attr("x2", width / 2 - 239.28)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 - 234.28)
                .attr("x2", width / 2 - 234.28)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(1600)
                .duration(800)
                .attr("x2", width / 2 - 81.42)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 - 76.42)
                .attr("x2", width / 2 - 76.42)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(2400)
                .duration(800)
                .attr("x2", width / 2 + 76.44)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 + 81.44)
                .attr("x2", width / 2 + 81.44)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(3200)
                .duration(800)
                .attr("x2", width / 2 + 224.3)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 + 229.3)
                .attr("x2", width / 2 + 229.3)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(4000)
                .duration(800)
                .attr("x2", width / 2 + 382.16)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 + 387.16)
                .attr("x2", width / 2 + 387.16)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(4800)
                .duration(800)
                .attr("x2", width / 2 + 550)
                .attr("y2", height / 2 + 100);

            /////Green Lines/////
            //rgb(78,130,131)
            var r_txt1 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Five Year LPR")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var r_line1 = svg.append("line")
                .attr("x1", width / 2 - 550)
                .attr("x2", width / 2 - 550)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")

            r_line1.transition()
                .duration(800)
                .attr("x2", width / 2 - 397.14)
                .attr("y2", height / 2 + 100);

            r_line1.on("mouseover", function () {
                r_txt1.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                r_txt1.style("opacity", 0);
            });
            //2
            var r_txt2 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Continuous Residence")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var r_line2 = svg.append("line")
                .attr("x1", width / 2 - 392.14)
                .attr("x2", width / 2 - 392.14)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            r_line2.transition()
                .delay(800)
                .duration(800)
                .attr("x2", width / 2 - 239.28)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(5600)
                .duration(800)
                .attr("y1", height / 2 + 50)
                .attr("y2", height / 2 + 50);

            r_line2.on("mouseover", function () {
                r_txt2.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                r_txt2.style("opacity", 0);
            });
            //3

            var r_txt3 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Language Fundamentals")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var r_line3 = svg.append("line")
                .attr("x1", width / 2 - 234.28)
                .attr("x2", width / 2 - 234.28)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            r_line3.transition()
                .delay(1600)
                .duration(800)
                .attr("x2", width / 2 - 81.42)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(4800)
                .duration(800)
                .attr("y1", height / 2)
                .attr("y2", height / 2);

            r_line3.on("mouseover", function () {
                r_txt3.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                r_txt3.style("opacity", 0);
            });

            //4
            var r_txt4 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Civic Knowledge Test")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var r_line4 = svg.append("line")
                .attr("x1", width / 2 - 76.42)
                .attr("x2", width / 2 - 76.42)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            r_line4.transition()
                .delay(2400)
                .duration(800)
                .attr("x2", width / 2 + 76.44)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(4000)
                .duration(800)
                .attr("y1", height / 2 - 50)
                .attr("y2", height / 2 - 50);

            r_line4.on("mouseover", function () {
                r_txt4.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                r_txt4.style("opacity", 0);
            });
            //5
            var r_txt5 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Proof of Moral Character")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var r_line5 = svg.append("line")
                .attr("x1", width / 2 + 81.44)
                .attr("x2", width / 2 + 81.44)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            r_line5.transition()
                .delay(3200)
                .duration(800)
                .attr("x2", width / 2 + 224.3)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(3200)
                .duration(800)
                .attr("y1", height / 2 - 100)
                .attr("y2", height / 2 - 100);

            r_line5.on("mouseover", function () {
                r_txt5.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                r_txt5.style("opacity", 0);
            });
            //6
            var r_txt6 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Application Fees")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var r_line6 = svg.append("line")
                .attr("x1", width / 2 + 229.3)
                .attr("x2", width / 2 + 229.3)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            r_line6.transition()
                .delay(4000)
                .duration(800)
                .attr("x2", width / 2 + 382.16)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(2400)
                .duration(800)
                .attr("y1", height / 2 - 150)
                .attr("y2", height / 2 - 150);

            r_line6.on("mouseover", function () {
                r_txt6.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                r_txt6.style("opacity", 0);
            });

            //7
            var r_txt7 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Oath of Allegience")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var r_line7 = svg.append("line")
                .attr("x1", width / 2 + 387.16)
                .attr("x2", width / 2 + 387.16)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            r_line7.transition()
                .delay(4800)
                .duration(800)
                .attr("x2", width / 2 + 550)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(1600)
                .duration(800)
                .attr("y1", height / 2 - 200)
                .attr("y2", height / 2 - 200);

            r_line7.on("mouseover", function () {
                r_txt7.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                r_txt7.style("opacity", 0);
            });


        });

        // **************************************************************** //
        //Military Service
        // **************************************************************** //
        d3.select("#military").on("click", function () {

            svg.selectAll("line").remove();
            svg.selectAll("text").remove();

            //////white Lines/////
            svg.append("line")
                .attr("x1", width / 2 - 550)
                .attr("x2", width / 2 - 550)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .duration(800)
                .attr("x2", width / 2 - 416.88)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 - 411.88)
                .attr("x2", width / 2 - 411.88)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(800)
                .duration(800)
                .attr("x2", width / 2 - 278.76)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 - 273.76)
                .attr("x2", width / 2 - 273.76)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(1600)
                .duration(800)
                .attr("x2", width / 2 - 140.64)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 - 135.64)
                .attr("x2", width / 2 - 135.64)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(2400)
                .duration(800)
                .attr("x2", width / 2 - 2.51)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 + 2.49)
                .attr("x2", width / 2 + 2.49)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(3200)
                .duration(800)
                .attr("x2", width / 2 + 135.62)
                .attr("y2", height / 2 + 100);

            svg.append("line")
                .attr("x1", width / 2 + 140.62)
                .attr("x2", width / 2 + 140.62)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(4000)
                .duration(800)
                .attr("x2", width / 2 + 273.75)
                .attr("y2", height / 2 + 100);

            var r_txt6 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("5 Year LPR")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var r_line6 = svg.append("line")
                .attr("x1", width / 2 + 278.75)
                .attr("x2", width / 2 + 278.75)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(4800)
                .duration(800)
                .attr("x2", width / 2 + 411.88)
                .attr("y2", height / 2 + 100);

            svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("5 Year LPR")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            svg.append("line")
                .attr("x1", width / 2 + 416.88)
                .attr("x2", width / 2 + 416.88)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(255,255,255,.5)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")
                .transition()
                .delay(5600)
                .duration(800)
                .attr("x2", width / 2 + 550)
                .attr("y2", height / 2 + 100);

            /////Green Lines/////
            //rgb(78,130,131)
            var m_txt1 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Three Year LPR")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var m_line1 = svg.append("line")
                .attr("x1", width / 2 - 550)
                .attr("x2", width / 2 - 550)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center")

            m_line1.transition()
                .duration(800)
                .attr("x2", width / 2 - 416.88)
                .attr("y2", height / 2 + 100);

            m_line1.on("mouseover", function () {
                m_txt1.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                m_txt1.style("opacity", 0);
            });
            //2
            var m_txt2 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("One Year of Miliatry Service")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var m_line2 = svg.append("line")
                .attr("x1", width / 2 - 411.88)
                .attr("x2", width / 2 - 411.88)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            m_line2.transition()
                .delay(800)
                .duration(800)
                .attr("x2", width / 2 - 278.76)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(6400)
                .duration(800)
                .attr("y1", height / 2 + 50)
                .attr("y2", height / 2 + 50);

            m_line2.on("mouseover", function () {
                m_txt2.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                m_txt2.style("opacity", 0);
            });
            //3
            var m_txt3 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Certify Service")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var m_line3 = svg.append("line")
                .attr("x1", width / 2 - 273.76)
                .attr("x2", width / 2 - 273.76)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            m_line3.transition()
                .delay(1600)
                .duration(800)
                .attr("x2", width / 2 - 140.64)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(5600)
                .duration(800)
                .attr("y1", height / 2)
                .attr("y2", height / 2);

            m_line3.on("mouseover", function () {
                m_txt3.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                m_txt3.style("opacity", 0);
            });
            //4
            var m_txt4 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Continuous Residence")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var m_line4 = svg.append("line")
                .attr("x1", width / 2 - 135.64)
                .attr("x2", width / 2 - 135.64)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            m_line4.transition()
                .delay(2400)
                .duration(800)
                .attr("x2", width / 2 - 2.51)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(4800)
                .duration(800)
                .attr("y1", height / 2 - 50)
                .attr("y2", height / 2 - 50);

            m_line4.on("mouseover", function () {
                m_txt4.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                m_txt4.style("opacity", 0);
            });
            //5
            var m_txt5 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Language Fundamentals")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var m_line5 = svg.append("line")
                .attr("x1", width / 2 + 2.49)
                .attr("x2", width / 2 + 2.49)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            m_line5.transition()
                .delay(3200)
                .duration(800)
                .attr("x2", width / 2 + 135.62)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(4000)
                .duration(800)
                .attr("y1", height / 2 - 100)
                .attr("y2", height / 2 - 100);

            m_line5.on("mouseover", function () {
                m_txt5.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                m_txt5.style("opacity", 0);
            });
            //6
            var m_txt6 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Civic Knowledge Test")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var m_line6 = svg.append("line")
                .attr("x1", width / 2 + 140.62)
                .attr("x2", width / 2 + 140.62)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            m_line6.transition()
                .delay(4000)
                .duration(800)
                .attr("x2", width / 2 + 273.75)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(3200)
                .duration(800)
                .attr("y1", height / 2 - 150)
                .attr("y2", height / 2 - 150);

            m_line6.on("mouseover", function () {
                m_txt6.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                m_txt6.style("opacity", 0);
            });
            //7
            var m_txt7 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Proof of Moral Character")
                .style("opacity", 0)
                .style("font-size", 30);

            var m_line7 = svg.append("line")
                .attr("x1", width / 2 + 278.75)
                .attr("x2", width / 2 + 278.75)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "center");

            m_line7.transition()
                .delay(4800)
                .duration(800)
                .attr("x2", width / 2 + 411.88)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(2400)
                .duration(800)
                .attr("y1", height / 2 - 200)
                .attr("y2", height / 2 - 200);

            m_line7.on("mouseover", function () {
                m_txt7.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                m_txt7.style("opacity", 0);
            });
            //8
            var m_txt8 = svg.append('text')
                .attr("x", width / 2 - 550)
                .attr("y", 150)
                .text("Oath of Allegience")
                .style("opacity", 0)
                .style("font-size", 30)
                .style("font-weight", 400);

            var m_line8 = svg.append("line")
                .attr("x1", width / 2 + 416.88)
                .attr("x2", width / 2 + 416.88)
                .attr("y1", height / 2 + 100)
                .attr("y2", height / 2 + 100)
                .attr("stroke", "rgb(78,130,131)")
                .attr("stroke-width", 15)
                .attr("element-anchor", "left");

            m_line8.transition()
                .delay(5600)
                .duration(800)
                .attr("x2", width / 2 + 550)
                .attr("y2", height / 2 + 100)
                .transition()
                .delay(1600)
                .duration(800)
                .attr("y1", height / 2 - 250)
                .attr("y2", height / 2 - 250);

            m_line8.on("mouseover", function () {
                m_txt8.style("opacity", .75)
                    .style("fill", "white");
            }).on("mouseout", function () {
                m_txt8.style("opacity", 0);
            });


        });

    });

