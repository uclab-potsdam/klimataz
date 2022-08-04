import React, { Component } from 'react';
import { setStateAsync } from '../helperFunc';
import VisIndex from './VisIndex';

export default class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartComponentName:
        this.props.layoutControls.params[this.props.activeSide][this.props.activeSide].components
          .component,
    };
    //TODO: store range or max Val in data as well
    //TODO: reusable code snippets like scales or axis
  }

  async componentDidUpdate(prevProps) {
    if (
      this.props.layoutControls !== prevProps.layoutControls ||
      this.props.activeSide !== prevProps.activeSide
    ) {
      await setStateAsync(this, {
        chartComponentName:
          this.props.layoutControls.params[this.props.activeSide][this.props.activeSide].components
            .component,
      });
    }
  }

  //TODO: smarter way of drawing viz (from layout-controls!)
  render() {
    //import component
    const RenderChart = VisIndex[this.state.chartComponentName];
    //return nothing if chart undefined
    if (RenderChart == undefined) {
      return null;
    }
    return (
      <div className="chart-container">
        <svg
          width="100%"
          height="100%"
          className={'svg-container ' + this.props.section + '-chart'}
        >
          <RenderChart {...this.props} />
        </svg>
      </div>
    );
  }
}
