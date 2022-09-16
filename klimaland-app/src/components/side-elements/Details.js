import React, { Component } from 'react';
import Text from './Text.js';
import Locator from './Locator.js';
import List from './List.js';
import { readString } from 'react-papaparse';

import DynamicText from '../../data/final_postcard_texts.csv';

let DynamicTextData;
const papaConfig = {
  header: true,
  complete: (results, file) => {
    // console.log('Parsing complete:', results, file);
    DynamicTextData = results.data;
  },
  download: true,
  error: (error, file) => {
    console.log('Error while parsing:', error, file);
    DynamicTextData = [];
  },
};

readString(DynamicText, papaConfig);

export default class Details extends Component {
  constructor(props) {
    super(props);

    this.handleClickOnList = this.handleClickOnList.bind(this);
  }

  /**
   * when someone clicked on a list item, pass this to parent
   * @param {} lk AGS and name of location clicked on in the list as value-label pair
   */
  handleClickOnList(lk) {
    this.props.handleClickOnList(lk);
  }

  render() {
    const sectionFullName = {
      La: { de: 'Landwirtschaft', en: 'agriculture' },
      Mo: { de: 'Mobilität', en: 'mobility' },
      Ge: { de: 'Gebäude', en: 'buildings' },
      En: { de: 'Energie', en: 'energy' },
      Ab: { de: 'Abfall', en: 'waste' },
    };

    return (
      <div className="details-container">
        <div className="flex-container">
          <div className="text-container">
            <Text {...this.props} sectionFullName={sectionFullName} data={DynamicTextData} />
          </div>
          <div className="data-container">
            <div className="locator-map">
              <Locator lk={this.props.lk} />
            </div>
            <div className="lk-list">
              <List
                {...this.props}
                sectionFullName={sectionFullName}
                data={DynamicTextData}
                handleClickOnList={this.handleClickOnList}
              />
            </div>
          </div>
        </div>
        <div className="footer-container">
          <div className="footer-inner-container">
            <div className="logo-container"></div>
            <div className="info-backside">Wie werden die Indikatoren berechnet?</div>
          </div>
        </div>
      </div>
    );
  }
}
