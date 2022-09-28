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

    await setStateAsync(this, { exportActive: true })
      .then(() => {
        return toPng(this.myRef.current, {
          cacheBust: true,
          backgroundColor: '#fff',
        });
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'klimaland_taz.png';
        link.href = dataUrl;
        link.click();
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
   * updates Size of the Chart for Thumbnail and Postcardview. The viewwidth should be equal to the css
   * variable "$postcardview-postcardwidth" and "$thumbnail-postcardwith" in config.scss.
   */
  async updateChartSize() {
    // if (this.props.isThumbnail) {
    //   let cardwidth = (this.props.windowSize.width / 10) * 2; //20vw postcard size in thumbnail (config.scss)
    //   let width = cardwidth - cardwidth / 3; //conditional margin of chart
    //   let height = width * 0.7; //fixed ratio for postcard look
    //   await setStateAsync(this, {
    //     chartStyle: { width: String(width), height: String(height) },
    //   });
    // } else {
    //   let cardwidth = (this.props.windowSize.width / 10) * 5; //50vw postcard size in fullscreen  (config.scss)
    //   let width = cardwidth - cardwidth / 4; //conditional margin of chart
    //   let height = width * 0.7; //fixed ratio for postcard look
    //   await setStateAsync(this, {
    //     chartStyle: { width: String(width), height: String(height) },
    //   });
    // }
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
      //update chart size
      await this.updateChartSize();
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
    await this.updateChartSize();
    if (this.props.isTopCard || this.props.isThumbnail) {
      await setStateAsync(this, { ranking: this.props.textData[this.props.section]['third'] });
    }
  }

  render() {
    // console.log(this.props.switchDataLevel)
    // console.log('toggle labels in side', Object.keys(this.props.toggleLabels).length)
    // TO DO: Solve issue of inconsistent activeSide during carousel switch
    // console.log(Boolean(this.props.flipping))
    return (
      <CSSTransition in={Boolean(this.props.flipping)} timeout={100} classNames="side-transition">
        <div className="side-outer" onClick={(e) => this.openUpCard(e)}>
          <div className="overlay-container">
            <div className="overlay-inner">
              <div className="postcard-title">
                <h4 className="section-title">{this.props.sectionName}</h4>
                <div
                  className={`section-thumb ${this.props.mode === undefined ? 'postcard-miniature' : this.props.mode
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
              {!this.props.isThumbnail && this.props.toggleLabels.lk !== '' && (
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
                      <g transform={`translate(${this.props.toggleLabels.lk.length * 8 + 10}, 2)`}>
                        <rect
                          className="controller-bg"
                          x="0"
                          y="0"
                          width="40"
                          height="20"
                          rx="10"
                        />
                        <rect
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
                      <text
                        className="mobile-toggle-label"
                        x={this.props.toggleLabels.bl.length * 9 + 10}
                        y="17"
                      >
                        Switch data
                      </text>
                    </g>
                  </svg>
                </div>
              )}
              <button className="button-download" onClick={this.onShareButtonClick}>
                <img src={share} className="button img" alt="flip-button-img" />
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
