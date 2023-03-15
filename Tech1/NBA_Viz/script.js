
const width = window.innerWidth;
const height = window.innerHeight;
// const margin = { top: 0, left: 0, right: 0, bottom: 100 };

const plot = d3.select("#map");
// const W = plot.node().clientWidth;
// const H = plot.node().clientHeight;
let yPos = 0;
// const velocity = 4;
// const len = Math.round(arc.getTotalLength());



function parseCountries(d) {

    return {
        country: d.COUNTRY,
        lon: d.lon,
        lat: d.lat
    }
}
function randomRange(min, max){
    return Math.random()*(max-min)+min;
}
const svg= plot.append("svg")
    .attr("width", 3000)
    .attr("height", 2000)


const projection = d3.geoEquirectangular()
    .translate([width / 2, height / 2])
    .scale(300)
    .center([0, 0]);

const countries = d3.geoPath().projection(projection);
const USA = { lat: 37.0902, lon: -100.7129 };


// load data  
// const worldmapPromise = d3.json("./data/world.geojson");
// var countryPromise = d3.csv("./data/nbaMotion/InternationalPlayer_1996-97.csv", parseCountries);
const file=[
    d3.json("./data/world.geojson"), 
    d3.csv("./data/nbaMotion/InternationalPlayer_1996-97.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_1997-98.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_1998-99.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_1999-00.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2000-01.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2001-02.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2002-03.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2003-04.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2004-05.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2005-06.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2006-07.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2007-08.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2008-09.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2009-10.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2010-11.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2011-12.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2012-13.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2013-14.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2014-15.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2015-16.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2016-17.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2017-18.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2018-19.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2019-20.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2020-21.csv", parseCountries),
    d3.csv("./data/nbaMotion/InternationalPlayer_2021-22.csv", parseCountries)
    
];





// d3.csv("./data/nbaMotion/InternationalPlayer_1996-97.csv"). then(function(data){
//     const dataFilter = data.filter(function(d){return d.COUNTRY=="Serbia"})
//     console.log(dataFilter);
//     var e = dataFilter.length;
//     console.log(e);
// })
// now store the count in each data member



Promise.all(file)
    .then(function (data) {
        
        const worldmap=data.splice(0,1)[0];

        let i=0;

    function loop(){
    const country=data[i];
    draw(worldmap,country);
    if(i===26) return;
    else i++;
    };
    loop();

    d3.interval(()=>{
        loop();
    },7000);

});

function draw(worldmap, country){

    d3.select('svg').selectAll('*').remove();

    // const continent= [...new Set(worldmap.map(d=>d.continent))];
    // console.log(continent);
    const unique =[...new Set(country.map(d=>d.country))];
    const uniquelat =[...new Set(country.map(d=>d.lat))];
    const uniquelon =[...new Set(country.map(d=>d.lon))];

    // console.log(uniquelon);
    const totals = [];

    for(let i=0; i<unique.length; i++){
        const total = country.filter(d=>d.country===unique[i]).length;
        totals.push({name:unique[i], total:total, lon:uniquelon[i], lat:uniquelat[i]});
    }

    console.log(totals);

    // const dataGrouped = d3.group(country, d=>d.country);
    
    // const dataRollup = d3.rollup(country, v => v.length, d => d.country)

    // const readableDataRollup= dataRollup.map

    // const width = 1700;
    // const height = 1000;
    const margin = {top: 50, left: 50, right: 50, bottom: 50};
    //draw bar chart


    let yScale = d3.scaleLinear()
        .domain([0, 30])
        .range([height-margin.bottom, margin.top]);


    let xScale = d3.scaleBand()
        .domain(unique)
        .range([margin.left, width-margin.right])
        .padding(0.9); 

    let rScale= d3.scaleSqrt()
        .domain([0, 50])
        .range([0, 50]);


        // svg.selectAll(".bar")
        // .data(totals)
        // .enter()
        // .append("rect")
        // .attr("class", "bar")
        // .attr("x", function(d){return xScale(d.name); })
        // .attr("y", height-margin.bottom)
        // .attr("height", 0)
        // .attr("width", 10)
        // .attr("fill", "red")
        // .transition()
        // .delay(1500)
        // .duration(3000)
        // .attr("y", function(d){return yScale(d.total);})
        // .attr("height", function(d){return height-margin.bottom-yScale(d.total); })


        // const xAxis = svg.append("g")
        // .attr("transform",`translate(0,${height-margin.bottom})`)
        // .call(d3.axisBottom(xScale).tickFormat((d,i) => unique[i]));


        // const yAxis = svg.append("g")
        // .attr("transform",`translate(${margin.left}, 0)`)
        // .call(d3.axisLeft().scale(yScale));




        // yAxis.selectAll(".tick text")
        // .attr("font-size","12pt")
        // // .style("text-anchor", "end")
        // // .attr("transform", "rotate(-50)");

        // xAxis.selectAll(".tick text")
        // .attr("font-size","12pt")
        // .style("text-anchor", "end")
        // .attr("transform", "rotate(-50)");


    // draw map
    svg.selectAll("path")
    .data(worldmap.features)
    .enter()
    .append("path")
    .attr("class", "continent")
    .attr("d", countries)
    .attr("fill", "black")
    .attr("opacity", .2)
    .attr("stroke", "white");


//draw other countries
    var circle= svg.selectAll(".country")
    .data(totals)
    .enter()
    .append("circle")
    .attr("class", "country")
    .attr("cx", function (d) { return projection([d.lon, d.lat])[0]; })
    .attr("cy", function (d) { return projection([d.lon, d.lat])[1]; })
    .attr("r", 0)
    .attr("fill", "red")
    .attr("stroke", "none")
    .attr("opacity", .7)
    .transition()
    .delay(200)
    //.delay(function (d) { return d.delay })
    .duration(3000)
    .attr("r", function(d){return rScale(d.total); })


    var mapLines = svg.selectAll(".line")
    .data(totals)
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
    .attr("stroke", "red")
    .attr("stroke-width", "2pt")
    .attr("stroke-opacity", .3)
    .transition()
    .delay(1500)
    //.delay(function (d) { return d.delay })
    .duration(3000)
    .attr("d", d => {
        let startPt = projection([d.lon, d.lat]);
        let endPt = projection([USA.lon, USA.lat]);
        let p = `M ${startPt[0]}, ${startPt[1]}, L ${startPt[0]}, ${startPt[1]}, ${endPt[0]}, ${endPt[1]}`;
        return p;
    })

}
