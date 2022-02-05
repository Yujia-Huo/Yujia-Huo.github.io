d3.csv("./MilitarySpending.csv").then(function(data) {
/*
    SETTING UP THE SVG CANVAS
      */
    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    const margin = {top: 50, left: 100, right: 50, bottom: 150};
    /*
    CREATE THE SVG CANVAS
      */
    
    const canvas = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    /*
    CREATE THE SCALE
    */

    const year={
        min: d3.min(data, function(d){ return +d.Year; }),
        max: d3.max(data, function(d){ return +d.Year; })
    };

    console.log(year.min); 
    const spend={
        min: d3.min(data, function(d){ return +d.DefenseBudget; }),
        max: d3.max(data, function(d){ return +d.DefenseBudget; })
    };


    const gdp={
        min: d3.min(data, function(d){ return +d.GDP; }),
        max: d3.max(data, function(d){ return +d.GDP; })
    }

    const pop={
        min: d3.min(data, function(d){ return +d.Population; }), 
        max: d3.max(data, function(d){ return +d.Population; })
    }

    const xScale= d3.scaleLinear()
    .domain([year.min, year.max])
    .range([margin.left, width-margin.right]);

    const yScale= d3.scaleLinear()
    .domain([0, spend.max+20])
    .range([height-margin.bottom, margin.top]);

    const rScale = d3.scaleSqrt()
    .domain([pop.min, pop.max])
    .range([2, 20]);


        /*
    CREATE THE AXIES
    */
    const xAxis = canvas.append("g")
    .attr("class","axis")
    .attr("transform", `translate(0,${height-margin.bottom})`)
    .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("d")))

    const yAxis = canvas.append("g")
    .attr("class","axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft().scale(yScale))


/*
    DRAW AXIES LABLE
    */
    const xAxisLabel = canvas.append("text")
    .attr("class","axisLabel")
    .attr("x", width/2)
    .attr("y", height-margin.bottom/2)
    .text("Year")
    .style("font-size", "2vh");
        
        
    const yAxisLabel = canvas.append("text")
    .attr("class","axisLabel")
    .attr("transform","rotate(-90)")
    .attr("x",-height/2)
    .attr("y",(margin.left/2)-30)
    .text("military spending(in Billions USD)")
    .style("font-size", "2vh");

    /*
    DRAW POINTS
    */
    const points = canvas.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.Year); })
            .attr("cy", function(d) { return yScale(d.DefenseBudget); })
            .attr("r", function(d) { return rScale(d.Population); })
            .attr("fill", "#CE4A50");
    
    /*
    UPDATE DATA FOR SPENDING
    */
    d3.select("#spending").on("click", function() {
        yScale.domain([0, spend.max+20])
        let c=canvas.selectAll("circle")
        .data(data, function(d){ return d.Year});

        c.transition()
        .duration(1500)
        .delay(250)
        .attr("cx", function(d) { return xScale(d.Year); })
        .attr("cy", function(d) { return yScale(d.DefenseBudget); })
        .attr("r",function(d) { return rScale(d.Population); })
        .attr("fill","#CE4A50");

        yAxis.transition()
        .duration(1500)
        .delay(250)
        .call(d3.axisLeft().scale(yScale));

        yAxisLabel.text("military spending(in Billions USD)");
        yAxisLabel.transition()
        .duration(1500)
        .delay(250);

            /*
    GENERATE TOOLTIP WITH HOVER EFFECT
    */
        points.on("mouseover", function(e, d){

            let cx = +d3.select(this).attr("cx");
            let cy = +d3.select(this).attr("cy");
    
            tooltip.style("visibility", "visible")
            .style("left", `${cx-10}px`)
            .style("top", `${cy}px`)
            .html(`<b>Year:</b> ${d.Year}<br><b>Military Spending: </b> $${d.DefenseBudget} Billions<br><b>Population:</b> ${d.Population} Millions`);
    
            d3.select(this)
            .attr("stroke", "#DDEFE3")
            .attr("stroke-width", 5);
            }).on("mouseout", function(){
    
            tooltip.style("visibility","hidden")
                d3.select(this)
                .attr("stroke", "none")
                .attr("stroke-width", 0);
            })

        
    })

    /*
    UPDATE DATA FOR GDP
    */
        d3.select("#GDP").on("click", function() {
        yScale.domain([0, gdp.max+20])
        let c=canvas.selectAll("circle")
        .data(data, function(d){ return d.Year});

        c.transition()
        .duration(1500)
        .delay(250)
        .attr("cx", function(d) { return xScale(d.Year); })
        .attr("cy", function(d) { return yScale(d.GDP); })
        .attr("r",function(d) { return rScale(d.Population); })
        .attr("fill","#377375");

        yAxis.transition()
        .duration(1500)
        .delay(250)
        .call(d3.axisLeft().scale(yScale));

        yAxisLabel.transition()
        .duration(1500)
        .delay(250)
        .text("GDP(in Billions USD)")


    /*
    GENERATE TOOLTIP WITH HOVER EFFECT
    */
        points.on("mouseover", function(e, d){

            let cx = +d3.select(this).attr("cx");
            let cy = +d3.select(this).attr("cy");
    
            tooltip.style("visibility", "visible")
            .style("left", `${cx-10}px`)
            .style("top", `${cy}px`)
            .html(`<b>Year:</b> ${d.Year}<br><b>GDP: </b> $${d.GDP} Billions<br><b>Population:</b> ${d.Population} Millions`);
    
            d3.select(this)
            .attr("stroke", "#DDEFE3")
            .attr("stroke-width", 5);
            }).on("mouseout", function(){
    
            tooltip.style("visibility","hidden")
                d3.select(this)
                .attr("stroke", "none")
                .attr("stroke-width", 0);
            })
        })


    /*
    DEFINE TOOTIP
    */
    const tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip");



    /*
    GENERATE TOOLTIP WITH HOVER EFFECT
    */
    points.on("mouseover", function(e, d){

        let cx = +d3.select(this).attr("cx");
        let cy = +d3.select(this).attr("cy");

        tooltip.style("visibility", "visible")
        .style("left", `${cx-10}px`)
        .style("top", `${cy}px`)
        .html(`<b>Year:</b> ${d.Year}<br><b>Military Spending: </b> $${d.DefenseBudget} Billions<br><b>Population:</b> ${d.Population} Millions`);

        d3.select(this)
        .attr("stroke", "#DDEFE3")
        .attr("stroke-width", 5);
        }).on("mouseout", function(){

        tooltip.style("visibility","hidden")
            d3.select(this)
            .attr("stroke", "none")
            .attr("stroke-width", 0);
        })
});