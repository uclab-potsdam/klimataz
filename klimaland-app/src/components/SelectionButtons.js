import React, { Component } from 'react';
import Select from 'react-select';

//img
import shuffle from '../img/buttons/shuffle.png';

export class SelectionButtons extends Component {
  constructor(props) {
    super(props);

    this.changeLandkreis = this.changeLandkreis.bind(this);
    this.changeSection = this.changeSection.bind(this);
    this.shuffle = this.shuffle.bind(this);
  }

  changeLandkreis(e) {
    this.props.changeLandkreis(e);
  }

  changeSection(e) {
    this.props.changeSection(e);
  }

  shuffle(e) {
    this.props.shuffle(e);
  }

  render() {
    return (
      <div className="selection-buttons">
        {!this.props.postcardView && (
          <div className="selection-container">
            <Select
              className="selector"
              isMulti
              //handle clearing when in shuffle mode
              //https://stackoverflow.com/questions/50412843/how-to-programmatically-clear-reset-react-select
              key={`my_unique_select_key__${this.props.landkreisSelection}`}
              value={this.props.landkreisSelection || ''}
              onChange={this.changeLandkreis}
              options={this.props.landkreise}
              //add nameAddition to label.
              //this is the (Landkreis) (kreisfreie Stadt) for Schweinfurt cases
              getOptionLabel={(options) => `${options.label} ${options.nameAddition}`}
              isOptionDisabled={() => this.props.landkreisSelection.length >= 3} //max selection number: 3
            />

            {this.props.mode === 'comparison' && (
              <Select
                className="selector"
                defaultValue={this.props.sections[0]}
                onChange={this.changeSection}
                options={this.props.sections}
                value={this.props.sectionSelection || ''}
              />
            )}

            <button className="button shuffle" onClick={this.shuffle}>
              <img src={shuffle} className="button-img" alt="shuffle-button-img" />
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default SelectionButtons;
