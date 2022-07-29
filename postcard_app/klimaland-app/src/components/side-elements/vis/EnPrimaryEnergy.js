import React, { Component } from 'react'
import * as d3 from "d3";
import Chart from '../Chart';
import { setStateAsync } from '../../helper';

export default class PrimaryEnergy extends Component {
   constructor(props) {
      super(props)

      this.margin = { top: 20, right: 40, bottom: 20, left: 40 }
      this.state = {
         benchmark: 0,
         data: [],
         regional: false
      }
   }

   async createChart() {
      console.log(this.props.localData)
      console.log(this.props.section)
      //TODO: solve duplicate code with other vis, e.g. scales or domains

      let data = this.props.localData[this.props.section]._primaryconsumption_.data.map(d => {
         return {
            year: +d.year,
            column: d.column,
            value: +d.value
         }
      });

      let yMaxValue = d3.max(data, (d) => d.value) + 100

      const scaleX = d3
         .scaleTime()
         .domain(d3.extent(data, (d) => d.year))
         .range([this.margin.left, this.state.width - this.margin.right]);


      const scaleY = d3
         .scaleLinear()
         .domain([0, yMaxValue])
         .range([this.state.height - this.margin.top, this.margin.bottom]);

      let types = d3.map(data, d => d.column);;
      types = new d3.InternSet(types);

      console.log(types)
      // Omit any data not present in the z-domain.
      //const I = d3.range(X.length).filter(i => types.has(Z[i]));

      console.log(data)

      // const groupByType = d3.group(
      //    data,
      //    d => d["column"]
      //  )
      // console.log(groupByType)

      // const stack = d3.stack().keys(["Braunkohle","Steinkohle"])
      // const stackedValues = stack(data);

      // console.log(stackedValues)

      // const stackedData = [];
      // // Copy the stack offsets back into the data.
      // stackedValues.forEach((layer, index) => {
      //    const currentStack = [];
      //    layer.forEach((d, i) => {
      //       currentStack.push({
      //          values: d,
      //          year: data[i].year
      //       });
      //    });
      //    stackedData.push(currentStack);
      // });

      // console.log(stackedData)

      // // const stackedData = d3.stack()
      // //    .keys(types)
      // //    .order("sum")(groupByType)
      // // Construct scales and axes.
      // const color = d3.scaleOrdinal(types, d3.schemeTableau10,);
      // const xAxis = d3.axisBottom(scaleY).ticks(this.state.width / 80, d3.format("d")).tickSizeOuter(0);
      // const yAxis = d3.axisLeft(scaleX).ticks(this.state.height / 50);

      // const areaPath = d3
      //    .area()
      //    .x((d) => scaleX(d.year))
      //    .y0((d) => scaleY(d.value))
      //    .y1(([, y2]) => scaleY(y2))
      //    .curve(d3.curveMonotoneX)(data);

      // await setStateAsync(this, { areaPath: areaPath })

   }

   componentDidMount() {
      this.createChart();
   }

   render() {
      return (
         <div width={this.props.chartStyle.width} height={this.props.chartStyle.height} className={"line-chart " + this.props.thumbnailClass}>
            <Chart
               chartStyle={this.props.chartStyle}
               section={this.props.section}
               activeSide={this.props.activeSide}
               lk={this.props.lk}
               thumbnailClass={this.props.thumbnailClass}
            >
               <svg viewBox={`0 0 ${this.props.chartStyle.width} 
                       ${this.props.chartStyle.height}`}
                  preserveAspectRatio="xMaxYMax meet"
                  width={this.props.chartStyle.width} height={this.props.chartStyle.height}>
                  <g>
                     <path
                        fill={this.color}
                        d={this.state.areaPath}
                        opacity={0.3} />
                  </g>
               </svg>
            </Chart> </div>
      )
   }
}
