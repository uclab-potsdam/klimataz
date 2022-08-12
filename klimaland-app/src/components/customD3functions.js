import * as d3 from "d3";

export function getXAxis(scaleX){
    return d3
        .axisBottom(scaleX)
        .ticks(10)
        .tickSize(10)
        .tickFormat(d3.format("d"));
}

export function getYAxis(scaleY){
    return d3
        .axisLeft(scaleY)
        .ticks(10)
        .tickSize(10)
}

export function getYearXScale(scope,data){
    return d3
         .scaleTime()
         .domain(d3.extent(data, (d) => d.year))
         .range([scope.margin.left, scope.state.width - scope.margin.right]);
}

export function getLinearYScale(scope,max){
    return d3
        .scaleLinear()
        .domain([0, max])
        .range([scope.state.height - scope.margin.top, scope.margin.bottom]);
}