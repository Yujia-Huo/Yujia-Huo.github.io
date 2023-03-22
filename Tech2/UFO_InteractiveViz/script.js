// const width = window.innerWidth;
// const height = window.innerHeight;

//set up width and height
const width =1300;
const height = 900;
// const margin = {top: 20, right: 30, bottom: 40, left: 100}

//parse function for filter data
function parseCountries(d) {
    //time format
    var dateFormat = d3.timeFormat("%Y");

    //filter none US data
    if(d.state.length<3 && 
        d.state !="NL"&& 
        d.state !="PE"&& 
        d.state !="NS"&& 
        d.state !="NB"&& 
        d.state !="QC"&&
        d.state !="ON"&&
        d.state !="MB"&&
        d.state !="SK"&&
        d.state !="AB"&&
        d.state !="BC"&&
        d.state !="YT"&&
        d.state !="NT"&&
        d.state !="NU"){
    return {
        summary: d.summary,
        state: d.state,
        lon: d.city_longitude,
        lat: d.city_latitude,
        shape: d.shape,
        date: dateFormat(new Date(d.date_time_new))
    }
}
}
//append svg canvas

const plot = d3.select("#map");
const plot_1 = d3.select('#linechart')
const plot2 = d3.select("#shape");


//map
const svg= plot.append("svg")
    // .attr("width", width)
    // .attr("height", height)
    // .attr("transform", `translate(${margin.left},${margin.top})`)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("background-color", 'black');
//line chart
const svg_1 = plot_1.append("svg")
// .attr("width", width/2+200)
// .attr("height", height)
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", `0 0 ${width-500} ${height}`)
// .attr("transform", `translate(${margin.left},${margin.top})`)
.style("background-color", 'black');

const svg2= plot2.append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("background-color", 'black');
const svg2_2 =  plot2.append("svg")
.attr("width", width)
.attr("height", 200)
.attr("preserveAspectRatio", "xMinYMin meet")
.style("background-color", 'black');


//map projection type
const projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale(950)
    .center([-90, 30]);

const state = d3.geoPath().projection(projection);


//import data
const usaMapPromise = d3.json("./data/USA.json");
var obsPromise = d3.csv("https://gist.githubusercontent.com/Yujia-Huo/a16c2c58f1e92a46d9055a14953a6406/raw/5caa67713594746217b36eb7480fb87ade883ed3/nuforc_reports.csv",parseCountries);


//pass data and generate viz
Promise.all([usaMapPromise, obsPromise]).then(function([usamap, obs]){


        //sumary all shape type
        const Allshape = obs.map(function(d) {
            return d.shape;
        });
        const uniqueShape = [...new Set(Allshape)]

        //sumary all years
        const allDate = obs.map(function(d){
            return d.date;
        })
        const uniqueDate = [...new Set(allDate)].sort()


        //color scale for shape
        let colorScale = d3.scaleOrdinal()
            .domain(uniqueShape)
            .range(d3.schemePaired);

    
        // draw map for viz1
        // console.log(uniqueShape);
        svg.selectAll("path")
        .data(usamap.features)
        .enter()
        .append("path")
        // .attr("class", "continent")
        .attr("d", state)
        .attr("fill", "white")
        .attr("opacity", .15)
        .style("stroke-width", 1)
        .attr("stroke", "black");


        //Viz 1 line chart

        //dataset contain counts of each year
        const yearCount = [];

        for(let i=0; i<uniqueDate.length; i++){
            if(uniqueDate[i] !="0NaN"){
            const total = obs.filter(d=>d.date===uniqueDate[i]).length;
            yearCount.push({year:uniqueDate[i], total:total});
            }
        }

        console.log(yearCount);

        //x scale
        const x = d3.scaleLinear()
        .domain(d3.extent(yearCount, function(d) { return d.year; }))
        .range([ 0, width/2 ]);

        //x axis
        svg_1.append("g")
        .attr("transform", `translate(100, 500)`)
        .call(d3.axisBottom(x));

        // y scale
        const y = d3.scaleLinear()
        .domain([0, d3.max(yearCount, function(d) { return +d.total; })])
        .range([ 500, 0 ]);
        
        //y axis
        svg_1.append("g")
        .attr("transform", `translate(100, 0)`)
        .call(d3.axisLeft(y));

        //draw the line
        svg_1.append("path")
        .datum(yearCount)
        .attr("fill", "none")
        .attr("stroke", 'grey')
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x(function(d) { return x(d.year)+100 })
          .y(function(d) { return y(d.total) })
          )

        //highlight circle for update, defult unseen
        svg_1.selectAll('circle')
        .data(yearCount)
        .enter()
        .append('circle')
        .attr('class',function(d) { return 'y'+d.year; })
        .attr('cx', function(d) { return x(d.year)+100 })
        .attr('cy', function(d) { return y(d.total) })
        .attr('fill', 'rgba(165, 241, 250, 0.692)')
        .style("opacity", 0)
        .attr('r', 7);


        // draw map for viz2
        console.log(uniqueShape);
        svg2.selectAll("path")
        .data(usamap.features)
        .enter()
        .append("path")
        // .attr("class", "continent")
        .attr("d", state)
        .attr("fill", "white")
        .attr("opacity", .15)
        .style("stroke-width", 1)
        .attr("stroke", "black");

        // draw points for viz2
        const shapepoint = svg2.selectAll("circle")
        .data(obs)
        .enter()
        .append("circle")
        .attr('class',function(d){return d.shape; } )
        .attr("cx", function(d){return projection([d.lon, d.lat])[0]; })
        .attr("cy", function(d){return projection([d.lon, d.lat])[1]; })
        .attr("fill", function(d){return colorScale(d.shape); })
        .style("opacity", .5)
        .attr("r", 1.5);


        //count number of each shape
        const shapeCount = [];

        for(let i=0; i<uniqueShape.length; i++){
            const total = obs.filter(d=>d.shape===uniqueShape[i]).length;
            shapeCount.push({shape:uniqueShape[i], total:total});
        }



        //button for hover highlight
        const lightB= svg2_2.append('circle')
        // .attr('class','light')
        .attr('cx', width/2)
        .attr('cy', 100)
        .attr('fill', 'white')
        .attr('r', 10);


        lightB.on("mouseover", function(e, d) {
            svg2.selectAll('circle').style("opacity", .2)
            svg2.selectAll('.light').style("opacity", 1).attr("r", 2);

        }).on("mouseout", function() {
            svg2.selectAll('circle').style("opacity", .5).attr("r", 1.5);
        })

        //find max and min of the years
        dateMaxMin = d3.extent(obs, function (d) { return +d.date });
        console.log(dateMaxMin);


             // A function that update the chart when slider is moved?

    //update function for slider interaction(show each year)
    function updateDate(year) {
        // filter data of selected year
        filteredDate = obs.filter(function(d){ return d.date == year });

        console.log('year'+ year)
        //find count value of selected year
        var count = d3.format(',')(filteredDate.length);
        console.log(count);


       //draw circle on map
        svg.selectAll("circle")
        .data(filteredDate)
        .enter()
        .append("circle")
        // .attr('class',function(d) { return d.date; })
        .attr("cx", function(d){return projection([d.lon, d.lat])[0]; })
        .attr("cy", function(d){return projection([d.lon, d.lat])[1]; })
        .attr("fill", 'rgba(165, 241, 250, 0.692)')
        .style("opacity", 0)
        //animation
        .transition().duration(800).style("opacity", .6)
        .attr("r", 1.5)
        // console.log(1);
        // svg.selectAll(".y"+year).transition().duration(2000).style("opacity", .5);

        //text show year
        svg_1.append('text')
        .attr('class', 'discription')
        .attr("x", 110)
        .attr('y', 30)
        .attr('font-size', 25)
        .attr('font-weight', 200)
        .attr('fill', "white")
        .text("Year: " + year);

        //text show counts
        svg_1.append('text')
        .attr('class', 'discription')
        .attr("x", 110)
        .attr('y', 100)
        .attr('font-size', 25)
        .attr('font-weight', 200)
        .attr('fill', "white")
        .text("Count: " +count);

        //highlight line associate with circle on line chart
        const hightlightline = svg_1.append('line')
        .attr('x1', function(d) { return x(year)+100 })
        .attr('y1', 0)
        .attr('x2', function(d) { return x(year)+100 })
        .attr('y2', 500)
        .attr("stroke-width", 2)
        .attr('stroke', 'rgba(165, 241, 250, 0.692)')


    }

// //draw function for checkbox interaction(show all)
// function showAllRec(){

//     //select check box
//     d3.select(".showAll").each(function(d) {
//         cb = d3.select(this);
//         //record event of check box


//         //variable store points with defult 0 opacity
//         // point = svg.selectAll("circle")
//         //     .remove()
//         //     .data(obs)
//         //     .enter()
//         //     .append("circle")
//         //     .attr("cx", function(d){return projection([d.lon, d.lat])[0]; })
//         //     .attr("cy", function(d){return projection([d.lon, d.lat])[1]; })
//         //     .attr("fill", 'rgba(165, 241, 250, 0.692)')
//         //     .style("opacity", 0)
//         //     .attr("r", 1.5)
//             // console.log(1);

//         //draw circle when clicked
//         if(cb.property("checked")){
//             svg.selectAll('circle').transition().duration(1000).style("opacity", .3)
//             //remove previous draw text
//             svg.selectAll('text').remove();
//             svg.append('text')
//                 .attr("x", width-800)
//                 .attr('y', height-150)
//                 .attr('font-size', 40)
//                 .attr('fill', "white")
//                 .text("Full Records");
//           // Otherwise hide it
//           sliderCanvas.transition().duration(1000).style('opacity', 0)
//         }else{
//         console.log(1);
//         svg.selectAll('circle').transition().duration(1000).style("opacity", 0)
//         svg.selectAll('text').remove();
//         sliderCanvas.transition().duration(1000).style('opacity', 1)
//         }
//     });
// }

    //set up d3.slider()
    var slider = d3
    .sliderHorizontal()
    .min(1968)
    .max(2021)
    .step(1)
    .width(2*width-600)
    .tickFormat(d3.format('d'))
    .displayValue(false)
    //update with the value of slider
    .on('onchange', (val) => {
    d3.select('#value').text(val);
    //stored value of selected year
    selectedValue = val;
    console.log(val);
    //remove everything before draw new
    svg.selectAll("circle").remove();
    svg_1.selectAll('.discription').remove();
    svg_1.selectAll("line").transition().duration(200).style("opacity", 0).remove();
    svg_1.selectAll("circle").transition().duration(200).style("opacity", 0);
    //draw new
    updateDate(selectedValue);
    //show circle on the selected year
    svg_1.selectAll(".y"+selectedValue).transition().duration(800).style("opacity", 1);
    });


    //append svg slider to div
    let sliderCanvas = d3.select('#dataviz_mySlider')
    .append('svg')
    // .attr('width', 2*width-300)
    // .attr('height', 100)
    .attr("viewBox", `0 0 ${2*width-300} ${100}`)
    .append('g')
    .attr('transform', 'translate(100,30)')
    .call(slider)
    .style('opacity', 1);

    d3.select(".track")
    .attr("stroke-width", "1px")
    .style("background-color", "gray");


    //event listener

sliderCanvas;
    }
    )