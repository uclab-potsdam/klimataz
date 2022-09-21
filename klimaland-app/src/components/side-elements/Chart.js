import React, { Component } from 'react';
import { setStateAsync } from '../helperFunc';
import VisIndex from './VisIndex';
import selectorControls from '../../data/selector-controls.json';

export default class Chart extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   chartComponentName:
    //     this.props.layoutControls.params[this.props.activeSide][this.props.activeSide].components
    //       .component,
    //   currentIndicator:
    //     this.props.layoutControls.params[this.props.activeSide][this.props.activeSide].components
    //       .indicator,
    // };
    //TODO: store range or max Val in data as well
    //TODO: reusable code snippets like scales or axis
  }

  // /**
  //  * React Lifecycle Hook
  //  * @param {*} prevProps
  //  */
  // async componentDidUpdate(prevProps) {
  //   if (this.props.indicator !== prevProps.indicator) {
  //     this.render();
  //   }
  // }

  //TODO: smarter way of drawing viz (from layout-controls!)
  render() {
    //import component
    const RenderChart = VisIndex[this.props.component];
    //return nothing if chart undefined
    if (RenderChart === undefined) {
      return null;
    }

    const localData = this.props.localData[this.props.section];
    const currentSnippet = localData[this.props.indicator];

    let locationLabel = '';
    const locationLabels = {};
    selectorControls.landkreise.forEach((d) => {
      if (d.value === this.props.localData.ags) {
        locationLabels['lk'] = d.label;
      }

      if (d.value === this.props.localData.bundesland) {
        locationLabels['bundesland'] = d.label;
      }
    });

    if (currentSnippet !== undefined) {
      locationLabel = currentSnippet.regional ? locationLabels['lk'] : locationLabels['bundesland'];

      if (this.props.indicator == '_industry_consumption_') {
        locationLabel = [locationLabels['lk'], locationLabels['bundesland']];
      }
    }

    return (
      <div className="chart-container">
        <div width="100%" className={'svg-container ' + this.props.section + '-chart'}>
          <RenderChart
            currentSection={this.props.section}
            currentData={currentSnippet}
            currentIndicator={this.props.indicator}
            locationLabel={locationLabel}
            isThumbnail={this.props.isThumbnail}
            footnote={this.props.footnote}
          />
        </div>
      </div>
    );
  }
}
