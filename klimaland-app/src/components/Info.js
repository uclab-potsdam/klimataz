import React, { Component } from 'react';
import closeCard from '../img/buttons/close.svg';
import flipCard from '../img/buttons/flip.svg';

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
        <div
          className={`help ${this.state.inFocus ? 'help-postcard' : ''}`}
          onClick={this.state.inFocus ? this.handleHelpNotFocus : this.handleHelpFocus}
        >
          <h4 className="desktop-title">Wie bediene ich die Postkarten?</h4>
          <h2 className="mobile-title">?</h2>
          <p className="text">
            In der <span className="info-suchleiste"> Suchleiste</span> kann nach einem beliebigen
            Landkreis oder Bundesland gesucht werden. Jede Postkarte beschäftigt sich mit einem
            anderen Bereich. <span className="info-highlight">Energie</span>,{' '}
            <span className="info-highlight">Mobilität</span>,{' '}
            <span className="info-highlight">Abfall</span>,{' '}
            <span className="info-highlight">Landwirtschaft</span> oder{' '}
            <span className="info-highlight">Gebäude</span>.
          </p>
          <p className="text">
            Mit einem Klick auf die Postkarte wird die vollständige Visualisierung sichtbar. Hier
            kann auch zu einem zweiten Datenset gewechselt werden. Auf der Rückseite{' '}
            <img src={flipCard} className="img-flip" alt="flip-button-img" /> der Postkarte befindet
            sich eine kurze Erklärung und ein Klimaausblick deiner Region.
          </p>
          <p className="text">
            Wie gut schlägt sich deine Region in der Bekämpfung der Klimakrise?
          </p>{' '}
          <button className="button close" onClick={this.handleHelpNotFocus}>
            <img src={closeCard} className="button img" alt="close-button-img" />
          </button>
        </div>
      </div>
    );
  }
}
