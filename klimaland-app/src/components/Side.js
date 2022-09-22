import React, { Component } from 'react';
import { setStateAsync } from '../helpers/helperFunc';
import { CSSTransition } from 'react-transition-group';

//chart container
import Chart from './side-elements/Chart.js';
//side elements
import Details from './side-elements/Details.js';

import { toPng } from 'html-to-image';
import share from '../img/buttons/share.svg';

export default class Side extends Component {
  constructor(props) {
    super(props);

    let layoutdata = this.props.layoutControls.params[this.props.activeSide][this.props.activeSide];

    // name	      value	type
    // order	      describes the order in which the layout should be shown ordering hiccups	Int
    // vis/text	   if true shows the visualization, if fals shows text	                     Bool
    // indicator	describes which data should be imported in the layout                      Int
    // locator map	if true shows the map	                                                   Bool
    this.state = {
      order: layoutdata.combo[0],
      showViz: layoutdata.combo[1],
      indicatorInt: layoutdata.combo[2],
      showLocator: layoutdata.combo[3],
      chartStyle: {
        width: '300',
        height: '200',
      },
      section: ['En', 'Mo', 'Ab', 'La', 'Ge'],
      ranking: 'mittleren Drittel',
    };

    this.vis = this.vis.bind(this);
    this.openUpCard = this.openUpCard.bind(this);
    this.handleClickOnList = this.handleClickOnList.bind(this);

    this.myRef = React.createRef();
    this.onShareButtonClick = this.onShareButtonClick.bind(this);
  }

  onShareButtonClick() {
    if (this.myRef.current === null) {
      return;
    }

    toPng(this.myRef.current, {
      cacheBust: true,
      backgroundColor: '#fff',
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'klimaland_taz.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * updates Size of the Chart for Thumbnail and Postcardview. The viewwidth should be equal to the css
   * variable "$postcardview-postcardwidth" and "$thumbnail-postcardwith" in config.scss.
   */
  async updateChartSize() {
    if (this.props.isThumbnail) {
      let cardwidth = (this.props.windowSize.width / 10) * 2; //20vw postcard size in thumbnail (config.scss)
      let width = cardwidth - cardwidth / 3; //conditional margin of chart
      let height = width * 0.7; //fixed ratio for postcard look
      await setStateAsync(this, {
        chartStyle: { width: String(width), height: String(height) },
      });
    } else {
      let cardwidth = (this.props.windowSize.width / 10) * 5; //50vw postcard size in fullscreen  (config.scss)
      let width = cardwidth - cardwidth / 4; //conditional margin of chart
      let height = width * 0.7; //fixed ratio for postcard look
      await setStateAsync(this, {
        chartStyle: { width: String(width), height: String(height) },
      });
    }
  }

  /**
   * load vis component dynamically from vis index file depending on component stated in layoutcontrols from VisIndex.js
   * @returns React Component with the name in Layoutcontrols, nothing if this file does not exist
   */
  vis() {
    if (
      this.props.layoutControls.params[this.props.activeSide][this.props.activeSide].components !==
        undefined &&
      //only render top card vis for performance
      (this.props.isTopCard || this.props.isThumbnail)
    ) {
      return <Chart {...this.props} />;
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
      this.props.textData !== prevProps.textData ||
      this.props.thirdKey !== prevProps.thirdKey
    ) {
      //update layout for top card
      //only for top card because of performance
      if (this.props.isTopCard) {
        let layoutdata =
          this.props.layoutControls.params[this.props.activeSide][this.props.activeSide];
        await setStateAsync(this, {
          order: layoutdata.combo[0],
          showViz: layoutdata.combo[1],
          indicator: layoutdata.combo[2],
          showLocator: layoutdata.combo[3],
          ranking: this.props.textData[0][this.props.thirdKey],
        });
      }

      await this.updateChartSize();
    }
  }

  /**
   * React Lifecycle Hook
   * updates chart size
   */
  async componentDidMount() {
    await this.updateChartSize();
    await setStateAsync(this, { ranking: this.props.textData[0][this.props.thirdKey] });
  }

  render() {
    // TO DO: Solve issue of inconsistent activeSide during carousel switch

    return (
      <CSSTransition in={Boolean(this.props.flipping)} timeout={200} classNames="side-transition">
        <div className="side-outer" onClick={(e) => this.openUpCard(e)}>
          <div className="overlay-container">
            {this.props.isThumbnail && (
              <div className={`section-thumb ${this.props.mode}`}>
                {this.props.mode === 'comparison' && (
                  <div className="word-art-title">
                    <h4 className="gruss-thumb">Herzliche Grüße aus</h4>
                    <h2 className="wordart">{this.props.lk.label}</h2>
                  </div>
                )}
                <h4 className="section-title">{this.props.sectionName}</h4>
                <svg className="rating-thumb" width="50%" height="35%">
                  <g>
                    <circle
                      className={`${
                        this.state.ranking === 'unteren Drittel' ? 'active' : 'inactive'
                      } 
                  lower`}
                      cx="32"
                      cy="32"
                      r="30"
                    />
                    <circle
                      className={`${
                        this.state.ranking === 'mittleren Drittel' ? 'active' : 'inactive'
                      } middle`}
                      cx="67"
                      cy="32"
                      r="30"
                    />
                    <circle
                      className={`${
                        this.state.ranking === 'oberen Drittel' ? 'active' : 'inactive'
                      } upper`}
                      cx="102"
                      cy="32"
                      r="30"
                    />
                  </g>
                </svg>
              </div>
            )}
          </div>
          <div className="side-inner">
            {!this.state.showViz && ( //TEXT
              <Details
                lk={this.props.lk}
                section={this.props.section}
                sectionName={this.props.sectionName}
                textData={this.props.textData}
                similarAgs={this.props.similarAgs}
                thirdKey={this.props.thirdKey}
                activeSide={this.props.activeSide}
                handleClickOnList={this.handleClickOnList}
              />
            )}
            {this.state.showViz && this.vis()}
          </div>
          {!this.props.isThumbnail && (
            <>
              <div className="social-media-layout" ref={this.myRef}>
                <div className="side-inner">
                  <div className="side-inner export">
                    {!this.state.showViz && ( //TEXT
                      <Details
                        lk={this.props.lk}
                        section={this.props.section}
                        sectionName={this.props.sectionName}
                        textData={this.props.textData}
                        similarAgs={this.props.similarAgs}
                        thirdKey={this.props.thirdKey}
                        activeSide={this.props.activeSide}
                        handleClickOnList={this.handleClickOnList}
                      />
                    )}
                    {this.state.showViz && this.vis()}
                  </div>
                </div>

                <div className="greetings">
                  <h4 className="gruss-thumb">Herzliche Grüße aus</h4>
                  <h2 className="wordart-1">{this.props.lk.label}</h2>
                </div>
                <div className="logo-container"></div>
              </div>

              <button className="buttonDownload" onClick={this.onShareButtonClick}>
                <img src={share} className="button img" alt="flip-button-img" />
              </button>
            </>
          )}
        </div>
      </CSSTransition>
    );
  }
}
