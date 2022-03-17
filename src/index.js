import './index.css';
import * as d3 from 'd3'
//setting the size and margin for main svg
const width = 1300;
const height = 600;
const margin = {"left":60,"bottom":30,"right":50,"top":30};
var isLoaded = false;
if(!isLoaded){
    d3.select("body").append("h1").html(`<div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>`).attr("id","loading")
}
d3.select("body").append("svg").attr("height",height).attr("width",width)
.attr("x",margin.left).attr("id","plot");

//fetching our data
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
.then((response)=>{
    isLoaded=true;
    return response.json();
})
.then((data)=>{
    //setting the scales
    const xScale = d3.scaleBand().domain(data.monthlyVariance.map(function (val) {
        return val.year}))
         .range([margin.left,width-margin.right]);
    const yScale = d3.scaleBand().domain([1,2,3,4,5,6,7,8,9,10,11,12])
         .range([height-margin.bottom,margin.top]);  
    const colorRange = d3.scaleSequential(d3.interpolateSpectral);
    const colorDomain = [d3.min(data.monthlyVariance,d=>d.variance)
        ,d3.max(data.monthlyVariance,d=>d.variance)]
    const varScale = d3.scaleLinear().domain(colorDomain).range([1,0])

    //tooltip
    d3.select("body").append("div").attr("class","tooltip").html("hello tooltip");

    //heating the map
    d3.select("#plot").selectAll("rect").data(data.monthlyVariance).enter()
    .append('rect')
    .style("fill",d=>colorRange(varScale(d.variance)))
    .attr("x",(d)=>{return xScale(d.year)})
    .attr("y",d=>yScale(d.month))
    .attr('width',xScale.bandwidth())
    .attr("height",yScale.bandwidth())
    .on("mouseover",(e,d)=>{d3.select(".tooltip").html(`year:${d.year}<br>month:${d.month}<br>variance:${d.variance} C`).style("top",e.pageY-80+"px").style("left",e.pageX-50+"px")
        .style("background-color",`${colorRange(varScale(d.variance))}`).style("padding","5px").style("border-width","1px").style("border-style","solid").transition().style("opacity","1")
        .style("color",()=>d.variance<-4||d.variance>4?"white":"black")
        console.log(d)
    d3.select(e.target).attr("stroke","black")
    }).on("mouseout",(e,d)=>{
        d3.select(".tooltip").transition().style("opacity","0")
        d3.select(e.target).attr("stroke","none")
    });

    //definning axis
    const xAxis= d3.axisBottom().scale(xScale).tickValues(
        xScale.domain().filter(year=>year % 10 === 0));

    const yAxis= d3.axisLeft().scale(yScale).tickValues(yScale.domain())
    .tickFormat(function (month) {
      var date = new Date(0);
      date.setUTCMonth(month-1);
      var format = d3.timeFormat('%B');
      return format(date);
    });

    d3.select("#plot").append("g")
    .attr("id","xaxis")
    .attr("transform",`translate(0,${height-margin.bottom})`).call(xAxis)
    

    d3.select("#plot").append("g")
    .attr("id","yaxis")
    .attr("transform",`translate(${margin.left},0)`).call(yAxis);
   

      var legendAxis = d3.scaleLinear().domain(colorDomain.map((el)=>el)).range([0,200]);
      const testingscale = d3.scaleLinear().domain([0,1]).range([200,0]);

    d3.select("body").append("svg").attr("id","legend").attr("height","50").attr("width","200").append("g").call(d3.axisTop().scale(legendAxis))
    .attr("transform",`translate(0,19)`);
    
    d3.select("#legend").selectAll('rect').data(d3.range(0,1,1/200))
    .enter().append("rect").attr("x",(d)=>testingscale(d)).attr("y",50-30).attr("width","1").attr("height","20")
    .attr("fill",(d)=>colorRange(d));
    
    d3.select("#legend").append("text").text("C").attr("y",16);
    d3.select("#loading").remove();
})








if(module.hot){
    module.hot.accept();
}
