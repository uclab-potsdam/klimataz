import React, { Component } from 'react'

//side elements
import Text from './side-elements/Text.js';
import Locator from "./side-elements/Locator.js";

export default class Side extends Component {
  constructor(props){
    super(props)

    console.log(this.props)
  }

  render() {
    return (
      <div className="side-inner">
        <Text lk={this.props.lk} section={this.props.section} activeSide={this.props.activeSide} />
        <Locator lk={this.props.lk}/>
      </div>
    )
  }
}
