import React, { Component } from 'react';
import { setStateAsync } from '../helpers/helperFunc';
import { CSSTransition } from 'react-transition-group';

//chart container
import Chart from './side-elements/Chart.js';
//side elements
import Details from './side-elements/Details.js';
import TitleArt from './TitleArt.js';

import { toPng } from 'html-to-image';
import share from '../img/buttons/share.svg';

export default class Side extends Component {
  constructor(props) {
    super(props);

    let layoutdata = this.props.layoutControls.params[0][0];
    // name	      value	type
    // order	      describes the order in which the layout should be shown ordering hiccups	Int
    // vis/text	   if true shows the visualization, if fals shows text	                     Bool
    // indicator	describes which data should be imported in the layout                      Int
    // locator map	if true shows the map	                                                   Bool
    this.state = {
      // order: layoutdata.combo[0],
      showViz: layoutdata.combo[1],
      indicator: layoutdata.components.indicator,
      component: layoutdata.components.component,
      chartStyle: {
        width: '300',
        height: '200',
      },
      section: ['En', 'Mo', 'Ab', 'La', 'Ge'],
      ranking: '',
      exportActive: false,
    };

    this.vis = this.vis.bind(this);
    this.openUpCard = this.openUpCard.bind(this);
    this.handleClickOnList = this.handleClickOnList.bind(this);
    // if (this.switchDataLevel !== undefined) {
    //   this.switchDataLevel = this.switchDataLevel.bind(this);
    // }
    // this.switchDataLevel = this.switchDataLevel.bind(this);

    this.myRef = React.createRef();
    this.onShareButtonClick = this.onShareButtonClick.bind(this);
  }

  async onShareButtonClick() {
    if (this.myRef.current === null) {
      return;
    }

    await setStateAsync(this, { exportActive: true });
    // adding timeout before resolve to make sure everything is loaded
    await new Promise((resolve) => setTimeout(resolve, 1000))
      .then(() => {
        console.log('!');
        return toPng(this.myRef.current, {
          cacheBust: true,
          backgroundColor: '#fefaf6',
        });
      })
      .then((dataUrl) => {
        // const link = document.createElement('a');
        // link.download = 'klimaland_taz.png';
        // link.href = dataUrl;
        // link.click();

        // Returning it twice to prevent safari to export a blank canvas
        toPng(this.myRef.current).then(function (dataURL2) {
          const link = document.createElement('a');
          link.download = `klimaland_taz.png`;
          link.href = dataURL2;
          link.click();

          // resolve(dataURL2);
        });
      })
      .then(() => {
        setStateAsync(this, { exportActive: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async updateLayout() {
    //only for top card because of performance
    //for thumbnails: always stay in landkreis mode
    if (this.props.isTopCard || this.props.isThumbnail) {
      let activeSideWithMode = this.props.activeSide;
      //if not in landkreis mode
      if (!this.props.dataLevelLK && this.props.section !== 'Ab') {
        //side 0 --> side 2
        if (activeSideWithMode === 0) activeSideWithMode = 2;
        //side 1 --> side 1
      }

      let layoutdata = this.props.layoutControls.params[activeSideWithMode][activeSideWithMode];

      if (layoutdata.components !== undefined) {
        await setStateAsync(this, {
          showViz: layoutdata.combo[1],
          indicator: layoutdata.components.indicator,
          component: layoutdata.components.component,
        });
      } else {
        await setStateAsync(this, {
          showViz: layoutdata.combo[1],
          indicator: '',
          component: '',
          ranking: this.props.textData[this.props.section]['third'],
        });
      }
    }
  }

  /**
   * load vis component dynamically from vis index file depending on component stated in layoutcontrols from VisIndex.js
   * @returns React Component with the name in Layoutcontrols, nothing if this file does not exist
   */
  vis() {
    if (
      this.props.localData !== undefined &&
      this.props.layoutControls.params[this.props.activeSide][this.props.activeSide].components !==
        undefined &&
      //only render top card vis for performance
      (this.props.isTopCard || this.props.isThumbnail)
    ) {
      return (
        <Chart
          section={this.props.section}
          localData={this.props.localData}
          indicator={this.state.indicator}
          component={this.state.component}
          isThumbnail={this.props.isThumbnail}
          footnote={this.props.footnote}
          cardNumber={this.props.cardNumber}
        />
      );
    } else {
      //if not specified yet: return nothing
      return;
    }
  }

  /**
   * when someone clicked on a list item, pass this to parent
   * @param {} lk AGS and name of location clicked on in the list as value-label pair
   */
  handleClickOnList(lk) {
    this.props.handleClickOnList(lk);
  }

  async openUpCard(e) {
    if (this.props.isThumbnail) {
      this.props.clickOnCard(this.props.lk, this.props.section);
    }
  }

  /**
   * React Lifecycle Hook
   * updates state with new props
   * @param {*} prevProps check if any props changed (parameter set by react)
   */
  async componentDidUpdate(prevProps) {
    //check for prop changes (recommended for componentDidUpdate)
    if (
      this.props.isTopCard !== prevProps.isTopCard ||
      this.props.activeSide !== prevProps.activeSide ||
      this.props.layoutControls !== prevProps.layoutControls ||
      this.props.isThumbnail !== prevProps.isThumbnail ||
      this.props.windowSize !== prevProps.windowSize ||
      this.props.dataLevelLK !== prevProps.dataLevelLK ||
      this.props.textData !== prevProps.textData ||
      this.props.section !== prevProps.section
    ) {
      //update layout for top card
      await this.updateLayout();
    }

    if (this.props.textData !== prevProps.textData || this.props.section !== prevProps.section) {
      await setStateAsync(this, { ranking: this.props.textData[this.props.section]['third'] });
    }
  }

  /**
   * React Lifecycle Hook
   * updates chart size
   */
  async componentDidMount() {
    await this.updateLayout();
    if (this.props.isTopCard || this.props.isThumbnail) {
      await setStateAsync(this, { ranking: this.props.textData[this.props.section]['third'] });
    }
  }

  render() {
    return (
      <CSSTransition in={Boolean(this.props.flipping)} timeout={100} classNames="side-transition">
        <div className="side-outer" onClick={(e) => this.openUpCard(e)}>
          <div className="overlay-container">
            <div className="overlay-inner">
              <div className="postcard-title">
                <h4 className="section-title">{this.props.sectionName}</h4>
                <div
                  className={`section-thumb ${
                    this.props.mode === undefined ? 'postcard-miniature' : this.props.mode
                  }`}
                >
                  {(this.props.mode === 'comparison' || !this.props.isThumbnail) && (
                    <TitleArt landkreisLabel={this.props.lk.label} />
                  )}
                  {this.props.isThumbnail && this.state.ranking !== '' && (
                    <div className={`indicator-ranking ${this.state.ranking}`}>
                      <p>im {this.state.ranking}</p>
                    </div>
                  )}
                </div>
              </div>
              {!this.props.isThumbnail &&
                this.props.toggleLabels.lk !== '' &&
                this.props.activeSide !== 1 && (
                  <div className="button-toggle-container">
                    <div className="arrow-pointer" />
                    <svg width="100%" height="100%">
                      <defs>
                        <linearGradient id="MyGradient">
                          <stop offset="50%" stopColor="#e6c9a2" />
                          <stop offset="100%" stopColor="#ffe8c9" />
                        </linearGradient>
                      </defs>
                      <g className="toggle" onClick={this.props.switchDataLevel}>
                        <g
                          transform={`translate(${this.props.toggleLabels.lk.length * 8 + 10}, 2)`}
                        >
                          <rect
                            className="controller-bg"
                            x="0"
                            y="0"
                            width="40"
                            height="20"
                            rx="10"
                          />
                          <rect
                            className="toggle-rect"
                            x={this.props.isLKData ? 0 : 20}
                            y="0"
                            width="20"
                            height="20"
                            rx="10"
                            fill="#FFF9F1"
                            stroke="#484848"
                          />
                        </g>
                        <text x="0" y="18">
                          {this.props.toggleLabels.lk}
                        </text>
                        <text x={this.props.toggleLabels.bl.length * 8 + 20} y="18">
                          {this.props.toggleLabels.bl}
                        </text>
                        <text className="mobile-toggle-label" x="150" y="17">
                          Daten wechseln
                        </text>
                      </g>
                    </svg>
                  </div>
                )}
              <button className="button-download" onClick={this.onShareButtonClick}>
                <div className="inner-button">
                  <p className="download-label">Download</p>
                  <img src={share} className="button img" alt="click to download" />
                </div>
              </button>
            </div>
          </div>
          <div className="side-inner">
            {!this.state.showViz && this.props.isTopCard && (
              //TEXT
              <Details
                lk={this.props.lk}
                section={this.props.section}
                sectionName={this.props.sectionName}
                textData={this.props.textData}
                similarAgs={this.props.similarAgs}
                activeSide={this.props.activeSide}
                handleClickOnList={this.handleClickOnList}
              />
            )}
            {this.state.showViz && this.vis()}
          </div>
          {!this.props.isThumbnail && this.props.isTopCard && (
            <>
              <div className="social-media-layout" ref={this.myRef}>
                <div className="side-inner">
                  {this.state.exportActive && (
                    <div className="side-inner export">
                      {!this.state.showViz && ( //TEXT
                        <Details
                          lk={this.props.lk}
                          section={this.props.section}
                          sectionName={this.props.sectionName}
                          textData={this.props.textData}
                          similarAgs={this.props.similarAgs}
                          activeSide={this.props.activeSide}
                          handleClickOnList={this.handleClickOnList}
                        />
                      )}
                      {this.state.showViz && this.vis()}
                    </div>
                  )}
                </div>
                <TitleArt landkreisLabel={this.props.lk.label} />
                <div className="logo-container"></div>
              </div>
            </>
          )}
        </div>
      </CSSTransition>
    );
  }
}
