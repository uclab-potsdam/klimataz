import React, { Component } from 'react'
import Chart from '../Chart.js'


export default class PlaceHolder extends Component {

   constructor(props){
      super(props)

      this.state = {
         fill: '#FFE8C9',
         stroke: '#bbb'
     }
   }

   
   render() {
      return (
         <div><Chart
            chartStyle={this.props.chartStyle}
            section={this.props.section}
            activeSide={this.props.activeSide}
            lk={this.props.lk}
            thumbnailClass={this.props.thumbnailClass}
         >
            <svg width="100%" height="100%" className="previewChart">
               <rect width={this.props.chartStyle.width}
                  height={this.props.chartStyle.height}
                  style={{ fill: this.state.fill, strokeWidth: 3, stroke: this.state.stroke }} />
               <text
                  y={this.props.chartStyle.height / 2} >
                  Placeholder for Chart
               </text>
            </svg>
         </Chart></div>
      )
   }
}
