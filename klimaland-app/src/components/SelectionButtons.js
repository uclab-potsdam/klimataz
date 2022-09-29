import React, { Component } from 'react';
import Select from 'react-select';
import { mobileCheck } from '../helpers/helperFunc';

export class SelectionButtons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuIsOpen: false,
    };

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

  customDesktopStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#fff4e5' : 'white',
      color: 'black',
    }),
  };

  customMobileStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#fff4e5' : 'white',
      color: 'black',
    }),
    valueContainer: (provided) => ({
      ...provided,
      maxHeight: '7vh',
      overflow: 'scroll',
    }),
  };

  render() {
    const orderedLandkreise = this.props.landkreise.sort((a, b) => {
      if (a.label > b.label) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
    });

    const lkSelectionMobile = this.props.landkreisSelection;
    if (lkSelectionMobile.length >= 5 && mobileCheck(window)) {
      lkSelectionMobile.pop();
    }

    return (
      <div className="selection-buttons">
        {!this.props.postcardView && this.props.uiVis && (
          <div className="selection-container">
            {/* {this.props.viewVis !== 2 && ( */}
            <Select
              className={`selector lk mode-${this.props.mode}`}
              isMulti
              //handle clearing when in shuffle mode
              //https://stackoverflow.com/questions/50412843/how-to-programmatically-clear-reset-react-select
              key={`my_unique_select_key__${this.props.landkreisSelection}`}
              value={this.props.landkreisSelection || ''}
              styles={this.customDesktopStyles}
              onChange={this.changeLandkreis}
              options={orderedLandkreise}
              //add nameAddition to label.
              //this is the (Landkreis) (kreisfreie Stadt) for Schweinfurt cases
              getOptionLabel={(options) =>
                `${options.label} ${options.nameAddition ? options.nameAddition : ''}`
              }
              isOptionDisabled={() => this.props.landkreisSelection.length >= 5} //max selection number: 5
              noOptionsMessage={() => 'Landkreis wurde nicht gefunden.'}
            />
            <Select
              className={`selector lk-mobile mode-${this.props.mode}`}
              isMulti
              //handle clearing when in shuffle mode
              //https://stackoverflow.com/questions/50412843/how-to-programmatically-clear-reset-react-select
              key={`my_unique_select_key_mobile__${this.props.landkreisSelection}`}
              value={this.props.landkreisSelection || ''}
              styles={this.customMobileStyles}
              onChange={this.changeLandkreis}
              options={orderedLandkreise}
              //add nameAddition to label.
              //this is the (Landkreis) (kreisfreie Stadt) for Schweinfurt cases
              getOptionLabel={(options) =>
                `${options.label} ${options.nameAddition ? options.nameAddition : ''}`
              }
              isOptionDisabled={() => this.props.landkreisSelection.length >= 4} //max selection number: 4
              // controlShouldRenderValue={false}
              hideSelectedOptions={false}
              noOptionsMessage={() => 'Landkreis wurde nicht gefunden.'}
            />
            {this.props.mode === 'comparison' && this.props.sections.length > 1 && (
              <Select
                className={`selector section mode-${this.props.mode}`}
                defaultValue={this.props.sections[0]}
                onChange={this.changeSection}
                options={this.props.sections}
                value={this.props.sectionSelection || ''}
              />
            )}
            {/* <button className="button shuffle" onClick={this.shuffle}>
              <img src={shuffle} className="button-img" alt="shuffle-button-img" />
            </button> */}
          </div>
        )}
      </div>
    );
  }
}

export default SelectionButtons;
