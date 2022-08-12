import React, { Component } from 'react';
import closeCard from '../img/buttons/close.svg';

export default class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inFocus: false,
    };

    //this binds the updateFocus function, because react does not like it if setState is called in a
    //render function. Without this bind, the App would just crash in an endless loop
    this.handleHelpFocus = this.updateFocus.bind(this, true);
    this.handleHelpNotFocus = this.updateFocus.bind(this, false);
  }

  /**
   * React Lifecycle Hook
   * in the beginning, the InfoCard is not Focus
   */
  componentDidMount() {
    this.setState({ inFocus: false });
  }

  /**
   * called by "onClick" on the infocard (true) or by onClick on the close button (false)
   * @param {} focus updates focus state with the value
   */
  updateFocus(focus) {
    this.setState({ inFocus: focus });
  }

  render() {
    return (
      <div className="info-container">
        {!this.state.inFocus && (
          <div className="help" onClick={this.handleHelpFocus}>
            <h4>How to use the postcards</h4>
          </div>
        )}
        {this.state.inFocus && (
          <div className="help help-postcard">
            <h4>How to use the postcards</h4>
            Hier ist eine Erklärung über die Postkarten und das gesamte Projekt
            <button className="button close" onClick={this.handleHelpNotFocus}>
              <img src={closeCard} className="button img" alt="close-button-img" />
            </button>
          </div>
        )}
      </div>
    );
  }
}
