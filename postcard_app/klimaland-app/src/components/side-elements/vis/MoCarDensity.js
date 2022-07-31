import React, { Component } from 'react'
import * as d3 from "d3";
import Chart from '../Chart';
import { setStateAsync } from '../../helper';
import { getLinearYScale, getXAxis, getYAxis, getYearXScale} from '../../customD3functions';

export default class MoCarDensity extends Component {

   constructor(props) {
      super(props)

      this.color = "OrangeRed";

      this.margin = { top: 20, right: 40, bottom: 20, left: 40 }

      this.state = {
         benchmark: 0,
         data: [],
         regional: true,
         xAxis: null,
         yAxis: null,
         scaleX: null,
         scaleY: null,
         linePath: null,
         areaPath: null,
         filteredData: [],
         width: this.props.chartStyle.width - this.margin.left,
         height: this.props.chartStyle.height - this.margin.top,
      }
   }

   // setStateAsync(state) {
   //    return new Promise((resolve) => {
   //       this.setState(state, resolve);
   //    });
   // }

   async createChart() {

      const footnote = this.props.localData.footnote;

      let data = this.props.localData[this.props.section]._cartype_density_.data.map(d => {
         return {
            key: +d.key,
            year: +d.year,
            column: d.column,
            value: +d.value
         }
      });

      const filteredData = data.filter(function (d) { return d.column == "Pkw" })

      let yMaxValue = d3.max(filteredData, (d) => d.value) + 100

      const scaleX = getYearXScale(this,filteredData)
      const scaleY = getLinearYScale(this,yMaxValue)

      const xAxis = (ref) => {
         const xAxis = getXAxis(scaleX);
         d3.select(ref).call(xAxis);
      };

      const yAxis = (ref) => {
         const yAxis = getYAxis(scaleY)
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
         .y1(() => scaleY(0))
         .curve(d3.curveMonotoneX)(filteredData);

      await setStateAsync(this,{
         benchmark: data.benchmark, data: data, regional: data.regional,
         xAxis: xAxis, yAxis: yAxis, scaleX: scaleX, scaleY: scaleY, areaPath: areaPath, 
         linePath: linePath, filteredData: filteredData, footnote:footnote
      }).catch((error) => { console.log(error) })
   }

   async componentDidMount() {
      await this.createChart()
   }

   async componentDidUpdate(prevProps) {
      if (this.props.chartStyle.width !== prevProps.chartStyle.width || this.props.chartStyle.height !== prevProps.chartStyle.height
         || this.props.isThumbnail !== prevProps.isThumbnail || this.props.localData !== prevProps.localData) {

         let width = this.props.chartStyle.width - this.margin.left
         let height = this.props.chartStyle.height - this.margin.top
         await setStateAsync(this,{ width: width, height: height })
         await this.createChart()
      }
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
                     <g className="axis axis-y" ref={this.state.yAxis} 
                        transform={`translate(${this.margin.left},0)`}/>
                     <g className="axis axis-x" ref={this.state.xAxis}
                        transform={`translate(0,${this.state.height - this.margin.bottom})`}
                     />
                     <path
                        fill={this.color}
                        d={this.state.areaPath}
                        opacity={0.3} />
                     <path 
                        strokeWidth={2}
                        fill="none"
                        stroke={this.color}
                        d={this.state.linePath} />
                     <g>
                        {this.state.filteredData.map((item) => {
                           return (
                              <g key={item.key}>
                                 <circle
                                    cx={this.state.scaleX(item.year)}
                                    cy={this.state.scaleY(item.value)}
                                    r={3}
                                    fill={this.color}
                                    stroke="#fff"
                                 />
                              </g>
                           )
                        })}
                     </g>
                     <text
                        transform={`translate(${this.margin.left + 10},${this.state.height + this.margin.bottom})`}
                        fill={this.color}
                     >{this.state.footnote}</text>
                  </g>
               </svg>
            </Chart>
         </div>
      )
   }
}
