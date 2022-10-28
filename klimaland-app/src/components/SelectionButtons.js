import React, { Component } from 'react';
import Select from 'react-select';
import { mobileCheck } from '../helpers/helperFunc';
import { UIContext } from './UIContext';

export default class SelectionButtons extends Component {
  static contextType = UIContext;

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.changeLandkreis = this.changeLandkreis.bind(this);
    this.changeSection = this.changeSection.bind(this);
    this.shuffle = this.shuffle.bind(this);

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
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

  getOptionsWithCheckedDefault(data) {
    return data.map((d) => {
      let isDefault = false;
      //if default
      if (this.props.defaultLK.some((def) => def.value === d.value)) {
        isDefault = true;
      }
      return {
        value: d.value,
        label: d.label,
        nameAddition: d.nameAddition,
        isDefault: isDefault,
      };
    });
  }

  //rgba(255, 232, 201, 0.7)

  customDesktopStyles = {
    option: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: isFocused ? '#fff4e5' : 'white',
      color: 'black',
    }),
    multiValue: (styles, { data }) => ({
      ...styles,
      backgroundColor: data.isDefault && this.props.mode == 'lk' ? 'rgb(230,230,230)' : '#fff4e5',
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      visibility: data.isDefault && this.props.mode == 'lk' ? 'hidden' : 'visible',
    }),
  };

  customMobileStyles = {
    option: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: isFocused ? '#fff4e5' : 'white',
      color: 'black',
    }),
    multiValue: (styles, { data }) => ({
      ...styles,
      backgroundColor: data.isDefault && this.props.mode == 'lk' ? 'rgb(230,230,230)' : '#fff4e5',
    }),
    valueContainer: (styles) => ({
      ...styles,
      maxHeight: '7vh',
      overflow: 'auto',
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      visibility: data.isDefault && this.props.mode == 'lk' ? 'hidden' : 'visible',
    }),
  };

  /**
   * React Lifecycle Hook
   * in the beginning, the InfoCard is not Focus
   */
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.props.postcardView) return;
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      event.preventDefault();
      this.setState({ open: false });
    }
  }

  render() {
    const orderedLandkreise = this.props.landkreise.sort((a, b) => {
      if (a.label > b.label) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
    });
    // .map((d) => {
    //   return this.getOptionWithCheckedDefault(d);
    // });

    const lkSelectionMobile = this.props.landkreisSelection;
    if (lkSelectionMobile.length >= 5 && mobileCheck(window)) {
      lkSelectionMobile.pop();
    }

    return (
      <div className="selection-buttons">
        {!this.props.postcardView && this.context && (
          <div className="selection-container" ref={this.wrapperRef}>
            <Select
              className={`selector lk mode-${this.props.mode}`}
              isMulti
              isClearable={false}
              //handle clearing when in shuffle mode
              //https://stackoverflow.com/questions/50412843/how-to-programmatically-clear-reset-react-select
              key={`my_unique_select_key__${this.props.landkreisSelection}`}
              defaultValue={this.getOptionsWithCheckedDefault(this.props.defaultLK)}
              value={this.getOptionsWithCheckedDefault(this.props.landkreisSelection) || ''}
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
              menuIsOpen={this.state.open}
              onMenuOpen={() => this.setState({ open: true })}
              onMenuClose={() => this.setState({ open: false })}
            />
            <Select
              className={`selector lk-mobile mode-${this.props.mode}`}
              isMulti
              isClearable={false}
              //handle clearing when in shuffle mode
              //https://stackoverflow.com/questions/50412843/how-to-programmatically-clear-reset-react-select
              key={`my_unique_select_key_mobile__${this.props.landkreisSelection}`}
              defaultValue={this.getOptionsWithCheckedDefault(this.props.defaultLK)}
              value={this.getOptionsWithCheckedDefault(this.props.landkreisSelection) || ''}
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
                styles={this.customDesktopStyles}
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
