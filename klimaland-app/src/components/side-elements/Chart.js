import React, { Component } from 'react';
import VisIndex from './VisIndex';
import selectorControls from '../../data/selector-controls.json';

export default class Chart extends Component {
  render() {
    //import component
    const RenderChart = VisIndex[this.props.component];
    //return nothing if chart undefined
    if (RenderChart === undefined) {
      return null;
    }

    const localData = this.props.localData[this.props.section];
    const currentSnippet = localData[this.props.indicator];

    //get label of location (lk and bundesland)
    let locationLabel = '';
    const locationLabels = {};
    locationLabels['lk'] = this.props.lk.label;
    let bl = selectorControls.landkreise.find((d) => d.value === this.props.localData.bundesland);
    if (bl !== undefined) {
      locationLabels['bundesland'] = bl.label;
    }

    if (currentSnippet !== undefined) {
      locationLabel = currentSnippet.regional ? locationLabels['lk'] : locationLabels['bundesland'];

      if (this.props.indicator === '_industry_consumption_') {
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
            cardNumber={this.props.cardNumber}
          />
        </div>
      </div>
    );
  }
}
