import React, { Component } from 'react';

export default class Energy extends Component {
  render() {
    return (
      <g className="energy-chart">
        <text x="50%" y="50%" textAnchor="middle">
          Energy
        </text>
        <text x="50%" y="60%" textAnchor="middle">
          {this.props.lk.label}
        </text>
      </g>
    );
  }
}
