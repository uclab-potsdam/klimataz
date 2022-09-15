import React, { Component } from 'react';
import { setStateAsync } from './helperFunc.js';
import { CSSTransition } from 'react-transition-group';

//chart container
import Chart from './side-elements/Chart.js';
//side elements
import Details from './side-elements/Details.js';
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
      sectionLabel: ['Energie', 'Mobilität', 'Abfall', 'Landwirtschaft', 'Gebäude'],
      section: ['En', 'Mo', 'Ab', 'La', 'Ge'],
    };

    this.vis = this.vis.bind(this);
    this.openUpCard = this.openUpCard.bind(this);
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
      this.props.windowSize !== prevProps.windowSize
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
  }

  render() {
    // TO DO: Solve issue of inconsistent activeSide during carousel switch
    return (
      <CSSTransition in={Boolean(this.props.flipping)} timeout={200} classNames="side-transition">
        <div className="side-outer" onClick={(e) => this.openUpCard(e)}>
          {this.props.isThumbnail && (
            <div>
              <h4 className="gruss-thumb">Herzliche Grüße aus</h4>
              <h2 className="wordart-1">{this.props.lk.label}</h2>
              <h4 className="section-thumb">
                {this.state.sectionLabel[this.state.section.indexOf(this.props.section)]}
              </h4>
              <svg className="rating-thumb" width="50%" height="35%">
                <circle className="lower" cx="32" cy="32" r="30" stroke="#E5144B" fill="#fefaf6" />
                <circle className="middle" cx="67" cy="32" r="30" stroke="#f6a119" fill="#fefaf6" />
                <circle className="upper" cx="102" cy="32" r="30" stroke="#1A8579" fill="#1A8579" />
              </svg>
            </div>
          )}
          <div className="side-inner">
            {!this.state.showViz && ( //TEXT
              <Details
                lk={this.props.lk}
                section={this.props.section}
                activeSide={this.props.activeSide}
              />
            )}
            {this.state.showViz && this.vis()}
          </div>
        </div>
      </CSSTransition>
    );
  }
}
