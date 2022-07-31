import React, { Component } from 'react'
import * as d3 from "d3";
import Chart from '../Chart';
import { setStateAsync } from '../../helper';
import { getLinearYScale, getXAxis, getYAxis, getYearXScale } from '../../customD3functions';

export default class PrimaryEnergy extends Component {
   constructor(props) {
      super(props)

      this.margin = { top: 20, right: 0, bottom: 20, left: 60 }
      this.state = {
         benchmark: 0,
         data: [],
         stackedData:[],
         regional: false,
         xAxis: null,
         yAxis: null,
         scaleY:null,
         scaleX:null,
         color:null,
         width: this.props.chartStyle.width - this.margin.left,
         height: this.props.chartStyle.height - this.margin.top,
         areaPath:d3.area()
      }

      this.areaPath = this.areaPath.bind(this)
   }

   areaPath(data){
      return d3
      .area()
      .x(d => this.state.scaleX(d.data.year))
      .y0(d => this.state.scaleY(d[0]))
      .y1(d => this.state.scaleY(d[1]))(data)
   }

   async createChart() {
      //TODO: solve duplicate code with other vis, e.g. scales or domains

      let data = this.props.localData[this.props.section]._primaryconsumption_.data.map(d => {
         return {
            year: +d.year,
            [d.column]: +d.value
         }
      });

      const types = Array.from(
         new d3.InternSet(
            d3.map(this.props.localData[this.props.section]._primaryconsumption_.data, (d) => d.column)
         )
      )

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

      const stack = d3
         .stack()
         .keys(types)
         //.order(d3.stackOrderInsideOut)

      const stackedData = stack(dataByYear);

      const scaleX = getYearXScale(this,data);
      const scaleY = getLinearYScale(this,d3.max(stackedData.flat(2)))


      const xAxis = (ref) => {
         const xAxis = getXAxis(scaleX)
         //.tickFormat((d) => {return d3.timeFormat('%Y')(d.year)})
         d3.select(ref).call(xAxis);
      };

      const yAxis = (ref) => {
         const yAxis = getYAxis(scaleY)
         d3.select(ref).call(yAxis);
      };
      
      const color = d3.scaleOrdinal(types, d3.schemeTableau10,);

      let width = this.props.chartStyle.width - this.margin.left
      let height = this.props.chartStyle.height - this.margin.top

      await setStateAsync(this, { stackedData:stackedData,xAxis: xAxis, yAxis: yAxis, width: width, 
         height: height,scaleX:scaleX,scaleY:scaleY,color:color}).catch((error) => { console.log(error) }) 
   }

   componentDidMount() {
      this.createChart();
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
                     {this.state.stackedData.map((el,e) => {   
                        return(<path
                           key={e}
                           fill={this.state.color(e)}
                           d={this.areaPath(el)}
                           opacity={0.3} />)
                        })
                     }
                  </g>
               </svg>
               {this.props.useBLDataForLK && <div></div>}
            </Chart> </div>
      )
   }
}
