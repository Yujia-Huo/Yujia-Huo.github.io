// const width = window.innerWidth;
// const height = window.innerHeight;

//set up width and height
const width =window.innerWidth;
const height = 900;

//parse function for filter data
function parseCountries(d) {
    var dateFormat = d3.timeFormat("%Y");

    if(d.state.length<3){
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
const plot2 = d3.select("#shape");

const svg= plot.append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("background-color", 'black');

    const svg2= plot2.append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("background-color", 'black');


//map projection type
const projection = d3.geoEquirectangular()
    .translate([width / 2, height / 2])
    .scale(1200)
    .center([-90, 35]);

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
        svg2.selectAll("circle")
        .data(obs)
        .enter()
        .append("circle")
        .attr('class',function(d){return d.shape; } )
        .attr("cx", function(d){return projection([d.lon, d.lat])[0]; })
        .attr("cy", function(d){return projection([d.lon, d.lat])[1]; })
        .attr("fill", function(d){return colorScale(d.shape); })
        .style("opacity", .5)
        .attr("r", 1.5)



        //find max and min of the years
        dateMaxMin = d3.extent(obs, function (d) { return +d.date });
        console.log(dateMaxMin);


             // A function that update the chart when slider is moved?

        //update function for slider interaction(show each year)
    function updateDate(year) {
        // filter data of each year
        filteredDate = obs.filter(function(d){ return d.date == year })
        //reset checkbox to uncheck

        var count = d3.format(',')(filteredDate.length);
        console.log(count);

        document.querySelector('.showAll').checked = false;
        // draw circle
        svg.selectAll("circle")
        .data(filteredDate)
        .enter()
        .append("circle")
        .attr('class',function(d) { return d.date; })
        .attr("cx", function(d){return projection([d.lon, d.lat])[0]; })
        .attr("cy", function(d){return projection([d.lon, d.lat])[1]; })
        .attr("fill", 'rgba(165, 241, 250, 0.692)')
        .style("opacity", 0)
        //animation
        .transition().duration(800).style("opacity", .6)
        .attr("r", 1.5)
        console.log(1);

        //text show year
        svg.append('text')
        .attr("x", width-800)
        .attr('y', height-200)
        .attr('font-size', 40)
        .attr('font-weight', 200)
        .attr('fill', "white")
        .text("Year: " + year);

        svg.append('text')
        .attr("x", width-800)
        .attr('y', height-150)
        .attr('font-size', 40)
        .attr('font-weight', 200)
        .attr('fill', "white")
        .text("Count: " +count);


    }

//draw function for checkbox interaction(show all)
function showAllRec(){

    //select check box
    d3.select(".showAll").each(function(d) {
        cb = d3.select(this);
        //record event of check box


        //variable store points with defult 0 opacity
        point = svg.selectAll("circle")
            .remove()
            .data(obs)
            .enter()
            .append("circle")
            .attr("cx", function(d){return projection([d.lon, d.lat])[0]; })
            .attr("cy", function(d){return projection([d.lon, d.lat])[1]; })
            .attr("fill", 'rgba(165, 241, 250, 0.692)')
            .style("opacity", 0)
            .attr("r", 1.5)
            // console.log(1);

        //draw circle when clicked
        if(cb.property("checked")){
            point.transition().duration(1000).style("opacity", .3)
            //remove previous draw text
            svg.selectAll('text').remove();
            svg.append('text')
                .attr("x", width-800)
                .attr('y', height-150)
                .attr('font-size', 40)
                .attr('fill', "white")
                .text("Full Records");
          // Otherwise hide it
        }else{
        console.log(1);
        point.transition().remove();
        svg.selectAll('text').remove();
        }
    });
}

    //set up d3.slider()
    var slider = d3
    .sliderHorizontal()
    .min(1968)
    .max(2021)
    .step(1)
    .width(600)
    .tickFormat(d3.format('d'))
    .displayValue(false)
    //update with the value of slider
    .on('onchange', (val) => {
    d3.select('#value').text(val);
    selectedValue = val;
    console.log(val);
    //remove everything before draw new
    svg.selectAll("circle").remove();
    svg.selectAll("text").remove();
    //draw new
    updateDate(selectedValue);
    });

    //append svg slider to div
    let sliderCanvas = d3.select('#dataviz_mySlider')
    .append('svg')
    .attr('width', 800)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(slider);
    

    //event listener
    d3.select(".showAll").on("change",showAllRec);
showAllRec();

sliderCanvas;
    }
    )