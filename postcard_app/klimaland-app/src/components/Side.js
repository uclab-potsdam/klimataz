import React, { Component } from 'react'


//side elements
import Text from './side-elements/Text.js';
import Locator from "./side-elements/Locator.js";
import Chart from './side-elements/Chart';

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
         showLocator:layoutCombo[3]
      }
   }

   componentDidUpdate(prevProps) {
      if (this.props.isTopCard !== prevProps.isTopCard || this.props.activeSide !== prevProps.activeSide 
         || this.props.layoutControls !== prevProps.layoutControls) {

         //update layout for top card
         if (this.props.isTopCard) {
            let layoutCombo = this.props.layoutControls[this.props.activeSide].combo
            this.setState({order:layoutCombo[0],showViz:layoutCombo[1],indicator:layoutCombo[2],showLocator:layoutCombo[3]})
         }
      }
   }

   render() {
      return (
         <div className="side-inner">
            {!this.state.showViz && <Text lk={this.props.lk} section={this.props.section} activeSide={this.props.activeSide} />}
            {this.state.showViz && <Chart lk={this.props.lk} section={this.props.section} activeSide={this.props.activeSide}/>}
            {this.state.showLocator && <Locator lk={this.props.lk} />}
         </div>
      )
   }
}
