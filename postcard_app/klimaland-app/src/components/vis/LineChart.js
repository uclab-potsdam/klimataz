import React, { Component } from 'react'
import * as d3 from "d3";

export default class LineChart extends Component {

   constructor(props) {
      super(props)

      this.color = "OrangeRed";

      this.state = {
         benchmark: 0,
         data: [],
         regional: false,
         xAxis: null,
         yAxis: null,
         scaleX: null,
         scaleY: null,
         linePath: null,
         areaPath: null,
         filteredData:[]
      }
   }

   setStateAsync(state) {
      return new Promise((resolve) => {
         this.setState(state, resolve);
      });
   }

   async createChart() {

      let data = this.props.data.mobility_cartype_density_.data.map(d => {
         return {
            key: +d.key,
            year: +d.year,
            column: d.column,
            value: +d.value
         }
      });

      const filteredData = data.filter(function(d){ return d.column == "Pkw" })

      let yMinValue = 0
      let yMaxValue = d3.max(filteredData, (d) => d.value) + 100

      const scaleX = d3
         .scaleTime()
         .domain(d3.extent(filteredData, (d) => d.year))
         .range([0, this.props.width]);

      const scaleY = d3
         .scaleLinear()
         .domain([yMinValue - 1, yMaxValue + 2])
         .range([this.props.height, 0]);

      const xAxis = (ref) => {
         const xAxis = d3.axisBottom(scaleX);
         d3.select(ref).call(xAxis);
      };

      const yAxis = (ref) => {
         const yAxis = d3.axisLeft(scaleY)
         d3.select(ref).call(yAxis);
      };

      const linePath = d3
         .line()
         .x((d) => scaleX(d.year))
         .y((d) => scaleY(d.value))
         .curve(d3.curveMonotoneX)(filteredData);

      const areaPath = d3
         .area()
         .x((d) => scaleX(d.year))
         .y0((d) => scaleY(d.value))
         .y1(() => scaleY(yMinValue - 1))
         .curve(d3.curveMonotoneX)(filteredData);

      await this.setStateAsync({
         benchmark: this.props.data.benchmark, data: data, regional: this.props.data.regional,
         xAxis: xAxis, yAxis: yAxis, scaleX: scaleX, scaleY: scaleY, areaPath: areaPath, linePath: linePath, filteredData: filteredData
      })
         .then(() => {
            console.log("done again")
         }).catch((error) => { console.log(error) })
   }

   async componentDidMount() {
      console.log("mount start")
      await this.createChart().then("hello done");
   }

   async componentDidUpdate(prevProps){
      if (this.props.width !== prevProps.width || this.props.height !== prevProps.height ){
         await this.createChart().then("hello done");
      }
   }

   render() {
      console.log("render")
      return (
         <div>
            <svg viewBox={`0 0 ${this.props.width} 
                          ${this.props.height}`} width={this.props.width} height={this.props.height}>



               <g className="axis" ref={this.state.yAxis} />
               <path fill={this.color} d={this.state.areaPath} opacity={0.3} />
               <path strokeWidth={3} fill="none" stroke={this.color} d={this.state.linePath} />
               {this.state.filteredData.map((item) => {
                  return (
                     <circle
                        key={item.key}
                        cx={this.state.scaleX(item.year)}
                        cy={this.state.scaleY(item.value)}
                        r={2}
                        fill={this.color}
                        stroke="#fff"
                     />
                  )
               })}
            </svg>
         </div>
      )
   }
}
