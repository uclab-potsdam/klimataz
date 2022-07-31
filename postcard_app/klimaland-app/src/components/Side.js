import React, { Component } from 'react'

import { setStateAsync } from './helper.js';


//side elements
import Text from './side-elements/Text.js';
import Locator from "./side-elements/Locator.js";

//all vis elements are loaded dynamically from this file depending on indicator in layoutcontrols
import VisIndex from './side-elements/vis/VisIndex';

export default class Side extends Component {
   constructor(props) {
      super(props)

      let layoutCombo = this.props.layoutControls[this.props.activeSide][this.props.activeSide].combo

      // name	      value	type
      // order	      describes the order in which the layout should be shown ordering hiccups	Int
      // vis/text	   if true shows the visualization, if fals shows text	                     Bool
      // indicator	describes which data should be imported in the layout                      Int
      // locator map	if true shows the map	                                                   Bool
      this.state = {
         order: layoutCombo[0],
         showViz: layoutCombo[1],
         indicatorInt: layoutCombo[2],
         showLocator: layoutCombo[3],
         chartStyle: {
            width: "300",
            height: "200"
         },
      }

      this.vis = this.vis.bind(this)
   }

   async updateChartSize() {
      if (this.props.isThumbnail) {
         let cardwidth = this.props.windowSize.width / 10 * 3 //30vw
         let width = cardwidth - (cardwidth / 3)
         let height = width * 0.7
         await setStateAsync(this,{ chartStyle: { width: String(width), height: String(height) } })
      }

      else {
         let cardwidth = this.props.windowSize.width / 10 * 7 //30vw
         let width = cardwidth - (cardwidth / 4)
         let height = width * 0.7
         await setStateAsync(this,{ chartStyle: { width: String(width), height: String(height) } })
      }
   }

   vis(){
      if(this.props.layoutControls[this.props.activeSide][0].components !== undefined){
         let chartComponent = this.props.layoutControls[this.props.activeSide][0].components.component
         
         const RenderChart = VisIndex[chartComponent];
         
         return <RenderChart
            lk={this.props.lk}
            chartStyle={this.state.chartStyle}
            localData={this.props.localData}
            thumbnailClass={(this.props.isThumbnail) ? "thumbnail" : ""}
            section={this.props.section}
         />
      }
      else{
         const RenderChart = VisIndex["PlaceHolder"];
         return <RenderChart
            lk={this.props.lk}
            section={this.props.section}
            activeSide={this.props.activeSide}
            chartStyle={this.state.chartStyle}
            localData={this.props.localData}
            thumbnailClass={(this.props.isThumbnail) ? "thumbnail" : ""} 
            />
      }
   }

   async componentDidUpdate(prevProps) {
      if (this.props.isTopCard !== prevProps.isTopCard || this.props.activeSide !== prevProps.activeSide
         || this.props.layoutControls !== prevProps.layoutControls || this.props.isThumbnail !== prevProps.isThumbnail
         || this.props.windowSize !== prevProps.windowSize) {

         //update layout for top card
         if (this.props.isTopCard) {
            let layoutCombo = this.props.layoutControls[this.props.activeSide][this.props.activeSide].combo
            await setStateAsync(this,{ order: layoutCombo[0], showViz: layoutCombo[1], indicator: layoutCombo[2], showLocator: layoutCombo[3] })
         }

         await this.updateChartSize();
      }
   }

   async componentDidMount() {
      await this.updateChartSize();
   }

   render() {
      return (
         <div className="side-inner" onClick={(e) => this.props.clickOnCard(e, this.props.lk, this.props.section)}>
            {!this.state.showViz &&
               <Text
                  lk={this.props.lk}
                  section={this.props.section}
                  activeSide={this.props.activeSide} />}
            {this.state.showViz && this.props.activeSide === 0 && this.vis()}
            {/* {this.state.showViz && this.props.section !== "Mo" && this.props.section !== "En" && 
               <Chart
                  lk={this.props.lk}
                  section={this.props.section}
                  activeSide={this.props.activeSide}
                  chartStyle={this.state.chartStyle}
                  localData={this.props.localData}
                  thumbnailClass={(this.props.isThumbnail) ? "thumbnail" : ""} />}
            {this.state.showViz && this.props.activeSide === 0 && this.props.section === "Mo" &&
               <MoCarDensity
                  lk={this.props.lk}
                  chartStyle={this.state.chartStyle}
                  localData={this.props.localData}
                  thumbnailClass={(this.props.isThumbnail) ? "thumbnail" : ""}
                  section={this.props.section} />}
            {this.state.showViz && this.props.activeSide === 0 && this.props.section === "En" &&
               <EnPrimaryEnergy
                  lk={this.props.lk}
                  chartStyle={this.state.chartStyle}
                  localData={this.props.localData}
                  thumbnailClass={(this.props.isThumbnail) ? "thumbnail" : ""}
                  section={this.props.section} />} */}
            {this.state.showLocator &&
               <Locator
                  lk={this.props.lk} />}
         </div>
      )
   }
}
