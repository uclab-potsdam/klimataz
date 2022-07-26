import React, { Component } from 'react'


//side elements
import Text from './side-elements/Text.js';
import Locator from "./side-elements/Locator.js";
import Chart from "./side-elements/Chart.js";

export default class Side extends Component {
   constructor(props) {
      super(props)

      let layoutCombo = this.props.layoutControls[this.props.activeSide].combo

      // name	      value	type
      // order	      describes the order in which the layout should be shown ordering hiccups	Int
      // vis/text	   if true shows the visualization, if fals shows text	                     Bool
      // indicator	describes which data should be imported in the layout                      Int
      // locator map	if true shows the map	                                                   Bool
      this.state = {
         order:layoutCombo[0],
         showViz:layoutCombo[1],
         indicator:layoutCombo[2],
         showLocator:layoutCombo[3],
         chartStyle:{
            width: "300",
            height: "200"
         },
      }
   }

   updateChartStyle(){
      if(this.props.isThumbnail) {
         let cardwidth = this.props.windowSize.width / 10 * 3 //30vw
         let width = cardwidth-(cardwidth/3)
         let height = width*0.7
         this.setState({chartStyle:{width:String(width),height:String(height)}})
      }

      else{
         let cardwidth = this.props.windowSize.width / 10 * 7 //30vw
         let width = cardwidth-(cardwidth/4)
         let height = width*0.7
         this.setState({chartStyle:{width:String(width),height:String(height)}})
      }
   }

   componentDidUpdate(prevProps) {
      if (this.props.isTopCard !== prevProps.isTopCard || this.props.activeSide !== prevProps.activeSide 
         || this.props.layoutControls !== prevProps.layoutControls || this.props.isThumbnail !== prevProps.isThumbnail
         || this.props.windowSize !== prevProps.windowSize){

         //update layout for top card
         if (this.props.isTopCard) {
            let layoutCombo = this.props.layoutControls[this.props.activeSide].combo
            this.setState({order:layoutCombo[0],showViz:layoutCombo[1],indicator:layoutCombo[2],showLocator:layoutCombo[3]})
         }

         this.updateChartStyle();
      }
   }

   componentDidMount(){
      this.updateChartStyle();
   }

   render() {
      return (
         <div className="side-inner">
            {!this.state.showViz && <Text 
               lk={this.props.lk} 
               section={this.props.section} 
               activeSide={this.props.activeSide}/>}
            {this.state.showViz && <Chart 
               lk={this.props.lk} 
               section={this.props.section} 
               activeSide={this.props.activeSide} 
               chartStyle={this.state.chartStyle} 
               thumbnailClass={(this.props.isThumbnail) ? "thumbnail" : ""}/>}
            {this.state.showLocator && <Locator 
               lk={this.props.lk}/>}
         </div>
      )
   }
}
