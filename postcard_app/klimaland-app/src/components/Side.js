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
      layout: layoutdata,
      chartStyle: {
        width: '300',
        height: '200',
      },
    };

    this.vis = this.vis.bind(this);
  }

  //update chartsize
  async updateChartSize() {
    if (this.props.isThumbnail) {
      let cardwidth = (this.props.windowSize.width / 10) * 3; //30vw postcard size in thumbnail
      let width = cardwidth - cardwidth / 3; //conditional margin
      let height = width * 0.7; //fixed ratio for postcard look
      await setStateAsync(this, {
        chartStyle: { width: String(width), height: String(height) },
      });
    } else {
      let cardwidth = (this.props.windowSize.width / 10) * 7; //70vw postcard size in fullscreen
      let width = cardwidth - cardwidth / 4; //conditional margin
      let height = width * 0.7; //fixed ratio for postcard look
      await setStateAsync(this, {
        chartStyle: { width: String(width), height: String(height) },
      });
    }
  }

  //load component dynamically from vis index file
  vis() {
    if (
      this.state.layout.components !== undefined &&
      //only render top card vis for performance
      (this.props.isTopCard || this.props.isThumbnail)
    ) {
      return <Chart {...this.props} />;
    } else {
      //if not specified yet: return nothing
      return;
    }
  }

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
          layout: layoutdata,
          order: layoutdata.combo[0],
          showViz: layoutdata.combo[1],
          indicator: layoutdata.combo[2],
          showLocator: layoutdata.combo[3],
        });
      }

      await this.updateChartSize();
    }
  }

  async componentDidMount() {
    await this.updateChartSize();
  }

  render() {
    // TO DO: Solve issue of inconsistent activeSide during carousel switch
    // console.log("currently on:", this.props.section, this.props.activeSide)
    return (
      <CSSTransition
        in={this.props.activeSide === this.props.activeSide + 1}
        timeout={200}
        classNames="side-transition"
      >
        <div
          className="side-inner"
          onClick={(e) => {
            this.props.clickOnCard(e, this.props.lk, this.props.section);
          }}
        >
          {!this.state.showViz && ( //TEXT
            <Details
              lk={this.props.lk}
              section={this.props.section}
              activeSide={this.props.activeSide}
            />
          )}
          {this.state.showViz && //VIS
            this.props.activeSide === 0 &&
            this.vis()}
        </div>
      </CSSTransition>
    );
  }
}
