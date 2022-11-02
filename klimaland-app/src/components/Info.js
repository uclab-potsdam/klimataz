import React, { Component } from 'react';
import closeCard from '../img/buttons/close.svg';
import flipCard from '../img/buttons/flip.svg';
import toggleCard from '../img/buttons/toggle.png';
import share from '../img/buttons/share.svg';

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

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  /**
   * React Lifecycle Hook
   * in the beginning, the InfoCard is not Focus
   */
  componentDidMount() {
    this.setState({ inFocus: false });
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      event.preventDefault();
      this.updateFocus(false);
    }
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
      <div className="info-container" ref={this.wrapperRef}>
        <div
          className={`info-container-content ${this.state.inFocus ? 'open' : ''}`}
          onClick={this.state.inFocus ? this.handleHelpNotFocus : this.handleHelpFocus}
        >
          {this.state.inFocus && (
            <button className="button close" onClick={this.handleHelpNotFocus}>
              <img src={closeCard} className="button img img-close" alt="close-button-img" />
            </button>
          )}
          <div className="help">
            <h4 className="desktop-title help-title">Wie bediene ich die Postkarten?</h4>
            <h2 className="mobile-title">?</h2>
            {!this.props.postcardView && (
              <p className="text">
                In der <span className="info-suchleiste"> Suchleiste </span> kann nach einem
                beliebigen Landkreis oder Bundesland gesucht werden. Hier können auch mehrere
                Regionen ausgewählt und verglichen werden.{' '}
              </p>
            )}
            {this.props.mode !== 'singlePCview' && (
              <p className="text">
                Jede Postkarte beschäftigt sich mit einem anderen Bereich.{' '}
                <span className="info-highlight">Energie</span>,{' '}
                <span className="info-highlight">Mobilität</span>,{' '}
                <span className="info-highlight">Abfall</span>,{' '}
                <span className="info-highlight">Landwirtschaft</span> oder{' '}
                <span className="info-highlight">Gebäude</span>.
              </p>
            )}
            {!this.props.postcardView && this.props.mode === 'comparison' && (
              <p className="text">
                In der rechten <span className="info-suchleiste"> Leiste </span> kann zwischen den
                verschiedenen Bereichen gewechselt werden, wenn Regionen verglichen werden.{' '}
              </p>
            )}
            {!this.props.postcardView && (
              <p className="text">
                Mit einem Klick auf die Postkarte wird die vollständige Visualisierung sichtbar.
              </p>
            )}
            {this.props.postcardView && (
              <p>
                Auf der Vorderseite der Postkarte kann zu einem zweiten Datenset gewechselt{' '}
                <img src={toggleCard} className="img-toggle" alt="flip-button-img" /> werden.
                Außerdem kann die Postkarte zum Verschicken oder Teilen heruntergeladen
                <img src={share} className="img-download" alt="download-button-img" /> werden. Auf
                der Rückseite <img src={flipCard} className="img-flip" alt="flip-button-img" />
                der Postkarte befindet sich eine kurze Erklärung und ein Klimaausblick der Region.
              </p>
            )}
            {this.props.mode !== 'singlePCview' && (
              <p className="text">
                Wie gut schlägt sich deine Region in der Bekämpfung der Klimakrise?
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
