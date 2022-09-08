import React, { Component } from 'react';
import Text from './Text.js';
import Locator from './Locator.js';
import List from './List.js';

export default class Details extends Component {
  render() {
    return (
      <div className="details-container">
        <div className="flex-container">
          <div className="text-container">
            <Text {...this.props} />
          </div>
          <div className="data-container">
            <div className="locator-map">
              <Locator lk={this.props.lk} />
            </div>
            <div className="lk-list">
              <List />
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
