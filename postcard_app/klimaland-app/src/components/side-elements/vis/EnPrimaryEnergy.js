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
         stackedData:[],
         regional: false,
         xAxis: null,
         yAxis: null,
         width: this.props.chartStyle.width - this.margin.left,
         height: this.props.chartStyle.height - this.margin.top,
      }
   }

   async createChart() {
      console.log(this.props.localData)
      console.log(this.props.section)
      //TODO: solve duplicate code with other vis, e.g. scales or domains

      let data = this.props.localData[this.props.section]._primaryconsumption_.data.map(d => {
         return {
            year: +d.year,
            [d.column]: +d.value
         }
      });

      let yMaxValue = d3.max(this.props.localData[this.props.section]._primaryconsumption_.data, (d) => d.value) + 100

      const scaleX = d3
         .scaleTime()
         .domain(d3.extent(data, (d) => d.year))
         .range([this.margin.left, this.state.width - this.margin.right]);

      const scaleY = d3
         .scaleLinear()
         .domain([0, yMaxValue])
         .range([this.state.height - this.margin.top, this.margin.bottom]);

      const types = Array.from(
         new d3.InternSet(
            d3.map(this.props.localData[this.props.section]._primaryconsumption_.data, (d) => d.column)
         )
      )

      console.log(types)
      // Omit any data not present in the z-domain.
      //const I = d3.range(X.length).filter(i => types.has(Z[i]));

      console.log(data)

      const dataByYear = [];
      data.forEach((item) => {
         // create item if it does not exist
         if (dataByYear.findIndex((elem) => elem.year === item.year) === -1) {
            dataByYear.push({ year: item.year });
         }
         // get year
         let year = dataByYear.find((obj) => {
            return obj.year === item.year;
         });
         let index = Object.keys(item)[1];
         year[index] = item[index];
      });

      console.log(dataByYear)

      // dataByYear=[
      //    {year: 2000, Kohle: 250, Wind: 2, Atom: 117},
      //    {year: 2001, Kohle: 230, Wind: 20, Atom: 100},
      //    {year: 2002, Kohle: 10, Wind: 50, Atom: 85},
      // ]

      const stack = d3
         .stack()
         .keys(types)
         .order(d3.stackOrderNone)
         .offset(d3.stackOffsetNone)

      const stackedValues = stack(dataByYear);
      console.log(stackedValues)

      //}

      // const groupByType = d3.group(
      //    data,
      //    d => d["column"]
      //  )
      // console.log(groupByType)

      // const stack = d3.stack().keys(["Braunkohle","Steinkohle"])
      // const stackedValues = stack(data);

      // console.log(stackedValues)

      const stackedData = [];
      // // Copy the stack offsets back into the data.
      stackedValues.forEach((layer, index) => {
         const currentStack = [];
         layer.forEach((d, i) => {
            currentStack.push({
               values: d,
               year: data[i].year
            });
         });
         stackedData.push(currentStack);
      });

      console.log(stackedData)

      // const series = grp
      //    .selectAll(".series")
      //    .data(stackedData)
      //    .enter()
      //    .append("g")
      //    .attr("class", "series");

      // series
      //    .append("path")
      //    .attr("d", dataValue => area(dataValue));

      // const areaPath = d3
      //    .area()
      //    .x(dataPoint => scaleX(dataPoint.year))
      //    .y0(dataPoint => scaleY(dataPoint.values[0]))
      //    .y1(dataPoint => scaleY(dataPoint.values[1]))
      //    .curve(d3.curveMonotoneX)(stackedData);

      const xAxis = (ref) => {
         const xAxis = d3
            .axisBottom(scaleX)
            .ticks(10)
            .tickSize(10)
            .tickFormat(d3.format("d"));
         //.tickFormat((d) => {return d3.timeFormat('%Y')(d.year)})
         d3.select(ref).call(xAxis);
      };

      const yAxis = (ref) => {
         const yAxis = d3.axisLeft(scaleY)
            .ticks(10)
            .tickSize(10)
         d3.select(ref).call(yAxis);
      };
      const color = d3.scaleOrdinal(types, d3.schemeTableau10,);

      // const areaPath = d3
      //    .area()
      //    .x((d) => scaleX(d.year))
      //    .y0((d) => scaleY(d.value))
      //    .y1(([, y2]) => scaleY(y2))
      //    .curve(d3.curveMonotoneX)(data);

      let width = this.props.chartStyle.width - this.margin.left
      let height = this.props.chartStyle.height - this.margin.top

      await setStateAsync(this, { stackedData:stackedData,xAxis: xAxis, yAxis: yAxis, width: width, height: height}).then(()=>{
         
         const areaPath = d3
            .area()
            .x((d) => scaleX(d.year))
            .y0((d) => scaleY(d.values[0]))
            .y1((d) => scaleY(d.values[1]))
            .curve(d3.curveMonotoneX)(this.state.stackedData);


         console.log(this.state.stackedData)
         console.log(areaPath)
         this.state.stackedData.forEach(d => {
            console.log(d)
         });

         setStateAsync(this,{areaPath:areaPath})
      })

   }

   componentDidMount() {
      this.createChart();
   }

   render() {
      return (
         <div width={this.props.chartStyle.width} height={this.props.chartStyle.height} className={"area-chart " + this.props.thumbnailClass}>
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
                  <g className="axis axis-y" ref={this.state.yAxis} 
                        transform={`translate(${this.margin.left},0)`}/>
                     <g className="axis axis-x" ref={this.state.xAxis}
                        transform={`translate(0,${this.state.height - this.margin.bottom})`}/>
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
