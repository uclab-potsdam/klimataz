import React, { Component } from "react";
import closeCard from "../img/buttons/close.svg";

export default class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inFocus: false,
    };

    this.handleHelpFocus = this.updateFocus.bind(this, true);
    this.handleHelpNotFocus = this.updateFocus.bind(this, false);
  }

  componentDidMount() {
    this.setState({ inFocus: false });
  }

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
