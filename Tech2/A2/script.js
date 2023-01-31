/*
QUESTION 1:

Examine the d3.csv().then() pattern below
and discuss the following questions:
    - What is the "./data/gapminder.csv" inside of
        inside of the parentheses for d3.csv()
        referring to?
        A: It refering to the path to the 
        document named "gapminder.csv". The path is from the local
        folder to data folder and then find the file

    - What is the parameter named `data` inside of
        the function expression within .then()
        referring to?
        A: It refering to use the data the imported from
        previous d3.csv function

    - What kind of JS data structure is `data`?
        A: it is an array
    - Where does the entire d3.csv().then() pattern
        open and close in this document?
        A: the pattern open the CSV file and access to the information

    You may find it useful to examine the contents
    of `data` with console.log(data)

*/

d3.csv("./data/gapminder.csv").then(function(data) {
    /*
    DEFINE DIMENSIONS OF SVG + CREATE SVG CANVAS

    QUESTION 2:
        - What is document.querySelector("#chart") doing?

        A: it target the id name of the div

        - `clientWidth` and `clientHeight` are properties of
            elements in the DOM (Document Object Model).
            What do these properties measure?
            A: It messure the current web browser width and height
    */
    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    const margin = {top: 50, left: 100, right: 50, bottom: 100};

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    /* FILTER THE DATA 
    
    This data set is large and includes data from multiple years.

    Let's filter the data to only select data for the year 2007,
    and then subsequently use that year's data to draw the scatter plot.

    To filter the data, we can use the .filter() method for arrays.

    QUESTION 3:

    `.filter()` is a JavaScript array method.
    - What does this method do/how does this method work?
        (What do we get back from using this method?)
        A1: the method creates a new array filled with 
        elements that pass a test provided by a function.

    - Inside the parentheses for .filter(), there is
        a function expression with a parameter
        named `d`. What is `d` a reference to?
        A: the d is refering to the "data" parameter that
        has being defined in the previous d3.csv and stored the 
        original dataset

    - Does that parameter *have to be* named `d`?
        Can it be named something else?
        A: it doesn't have to be d. But the name 
        inside the function show be the same as the parameter
        in the function().

    - What is the purpose of the statement inside
        the function expression? What is this doing?

        return d.year === '2007';
        A: It select the row of the dataset that the "Year"
        value is equal to 2007

    - Why are we storing the result of data.filter(...)
        inside a variable (filtered_data)?
        A: because we need to use the filtered data. If it doesn't 
        store in a variable, we are unable to find the filtered result.

    */

    let filtered_data = data.filter(function(d) {
        return d.year === '2007';
    });
    console.log(filtered_data);


    /*
    DETERMINE MIN AND MAX VALUES OF VARIABLES

    In the following section, we'll use the methods d3.min() and d3.max()
    to calculate minimum and maximum values of the variables in our data set.

    Note that to keep things clean, we're organizing the minimum and maximum
    values inside of objects, and storing those min/max values in properties
    named inside those objects. This helps make it easier to refer to these
    values later in our code.


    QUESTION 4:
        - What does d3.min() do? What does d3.max() do?
            What are the 2 arguments we supply to d3.min()/d3.max()?
            A: d3.min() select the lowest value of a variable inside the 
            dataset. d3.max() select the heighest valye of a 
            variable insidethe dataset. The first argument is select
            the dataset, second argument is to select certain variable
            inside the data.

        - In the second argument for both d3.min() and d3.max(),
            the function expression has a parameter named `d`.
            What is `d` a reference to?
            A: d refering to the variable "filtered_data"

        - Why is there a plus sign (+) in front of d.gdpPercap,
            d.lifeExp, and d.pop?
            A: it turns the format of the value into numbers.

    */

    const gdpPercap = {
        min: d3.min(filtered_data, function(d) { return +d.gdpPercap; }),
        max: d3.max(filtered_data, function(d) { return +d.gdpPercap; })
    };

    const lifeExp = {
        min: d3.min(filtered_data, function(d) { return +d.lifeExp; }),
        max: d3.max(filtered_data, function(d) { return +d.lifeExp; })
    };

    const pop = {
        min: d3.min(filtered_data, function(d) { return +d.pop; }),
        max: d3.max(filtered_data, function(d) { return +d.pop; })
    };



    /*
    CREATE SCALES

    We'll use the computed min and max values to create scales for
    our scatter plot.

    QUESTION 5:
        - What does d3.scaleLinear() do?
         A: create a linear scale which use 
         linear function to transform data value into visual
         variable, in this case is position

        - What does d3.scaleSqrt() do?
        A: create a square function which most common use when 
         sizing circles by area rather than radius

        - What does d3.scaleOrdinal() do?
        A: create and return the ordinal scale 

        - For each scale below, what does the domain
            represent, and what does the range represent?
            A: domain represent the input bound, which is the data value
            and range represent output bound, such as position, color.
        - For each scale below, how many values are in
            the domain and range?
            A: there are two value in domain and two value for range.
            For domain, the first value represent the lowest value of the input
            and second value represent highest value of the input.
            For range, the first value represent the lowest output and 
            second value represent highest output.


    */

    const xScale = d3.scaleLinear()
        .domain([gdpPercap.min, gdpPercap.max])
        .range([margin.left, width-margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, lifeExp.max])
        .range([height-margin.bottom, margin.top]);

    const rScale = d3.scaleSqrt()
        .domain([pop.min, pop.max])
        .range([1, 15]);

    const fillScale = d3.scaleOrdinal()
        .domain(["Asia", "Europe", "Africa", "Americas", "Oceania"])
        .range(['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e']);


    /*
    DRAW AXES

    QUESTION 6:
    
    The following chunks of code draw 2 axes -- an x- an y-axis.
        - What is the purpose of the "g" element being appended?
        A: the "g" element is used to group SVG shapes together

        - What is the purpose of the "transform" attribute being defined?
        A: placing the element in the right position and orientation.

        - What do the d3.axisBottom() and d3.axisLeft() methods do?
        A: it use the function from the d3 library to draw basic axis.
        d3.axisBottom() draw the x axis and d3.axisLeft() draw the y axis.

    */
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));


    /*
    DRAW POINTS

    In this scatter plot, each circle will represent a single country;
    the horizontal position of the circle will represent GDP per capita,
    vertical position will represent life expectancy, color will represent
    continent, and radius will represent population

    QUESTION 7:

    The following chunk of code is the standard D3 data join pattern.
        - What is the purpose of the pattern svg.selectAll().data().enter().append()?
        A: SelectAll() select all the element with the same type in the canvas
        data() defined which dataset input valye will be use
        enter() import data values
        append() draw certain image with addtional attribute

        - Each attribute defined below is defined using things called
            "accessor functions." In each accessor function, what is
            the parameter named `d` a reference to?
            A: d refer to the paramenter in the data(), which is filtered data
        - Inside each accessor function, what is the purpose of
            each "return ___;" statement?
            A: the return define the output of the function which will use to
            define the first argument.

    */
    const points = svg.selectAll("circle")
        .data(filtered_data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.gdpPercap); })
            .attr("cy", function(d) { return yScale(d.lifeExp); })
            .attr("r", function(d) { return rScale(d.pop); })
            .attr("fill", function(d) { return fillScale(d.continent); });
    
    /*
    DRAW AXIS LABELS

    QUESTION 8:

    The chunks of code below draw text labels for the axes.

    Examine the yAxisLabel. What is going on with the 
    "transform", "x", and "y" attributes, in terms of
    how their values are computed to control the rotated
    placement of the label?
    A:the second argument in the attr() will control the first argument.
    x refer to the x position and controled by width value
    y refer to the y position and control by the height and margin bottom
    transform control by the command that use in the second argument, 
    in this case is rotate() and value inside rotate() define the rotation
    value. When the item rotated, in y axis, the x actually control the y position
    on the page and y control the x position on the page.

    */
    const xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .text("GDP per Capita");

    const yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/2)
        .text("Life Expectancy (Years)");

});
