import './index.css';
import * as d3 from 'd3'
import { axisBottom } from 'd3';
import { schemeBrBG } from 'd3';

const width = 1300;
const height = 600;
const margin = {"left":60,"bottom":30,"right":50,"top":30}

d3.select("body").append("svg").attr("height",height).attr("width",width)
.attr("x",margin.left).attr("id","plot");

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
.then((response)=>{
    return response.json();
})
.then((data)=>{
    const xScale = d3.scaleBand()
    .domain(data.monthlyVariance.map(function (val) {
        return val.year}))
    .range([margin.left,width-margin.right]);
    
    const yScale = d3.scaleBand().domain([1,2,3,4,5,6,7,8,9,10,11,12])
    .range([height-margin.bottom,margin.top]);

    const colScale = d3.scaleQuantize().domain([d3.min(data.monthlyVariance,d=>d.variance)
    ,d3.max(data.monthlyVariance,d=>d.variance)])
    .range(["#03AEFD", "#10AEF0", "#1FB0E1", "#37B3C8", "#4DB8B3", 
    "#6BBE95", "#89C576", "#A1CA60", "#BDD043", "#D1D32F", "#E8D718","#F5D70A","#FFD103","#FFB804","#FFAD03","#FF9C03","#FF9003","#FF7A03","#FF5F03","#FF3B01","#FF2F01","#FF1F01","#FF1501","#FF0900","#FF0200","#CD0000","#980000","#7F0000","#760000"]);

    d3.select("#plot").selectAll("rect").data(data.monthlyVariance).enter()
    .append('rect')
    .style("fill",d=>colScale(d.variance))
    .attr("x",(d)=>{return xScale(d.year)})
    .attr("y",d=>yScale(d.month))
    .attr('width',xScale.bandwidth())
    .attr("height",yScale.bandwidth());

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
   

      var legendAxis = d3.scaleLinear().domain(colScale.domain().map((el)=>el+1)).range([0,200]);

      const xlegendscale = d3.scaleLinear().domain(colScale.domain()).range([schemeBrBG[11]])

    d3.select("body").append("svg").attr("id","legend").append("g").call(d3.axisBottom().scale(legendAxis))
    .attr("transform",`translate(0,25)`)
    
    
    d3.select("#legend").selectAll('rect').data(d3.range(d3.min(data.monthlyVariance,(d)=>d.variance),d3.max(data.monthlyVariance,(d)=>d.variance+1),0.1))
    .enter().append("rect").attr("x",(d)=>legendAxis(d)).attr("y","0").attr("width","2px").attr("height","20")
    .attr("fill",(d)=>colScale(d))
})





if(module.hot){
    module.hot.accept();
}
