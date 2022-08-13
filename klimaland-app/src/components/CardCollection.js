import { Component } from 'react';
import { mod, isInt } from './helperFunc.js';

//components
import Card from './Card';
import Side from './Side';

//data (same for all cards, so imported here)
import Data from '../data/data.json';
import LayoutControls from '../data/layout-controls-inprogress.json';

export default class CardCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //cards includes all rendered cards
      cards: [],
      windowSize: {
        width: 0,
        height: 0,
      },
    };

    //load all the data
    this.data = Data;
    this.layoutControls = LayoutControls;

    //bind functions called by components
    this.handleClickOnCard = this.handleClickOnCard.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  /**
   * calls switchToPostcardView in LayoutControls
   * @param {*} e event passed by Side
   * @param {*} lk landkreis of card that was clicked on
   * @param {*} section section of card that was clicked on
   */
  handleClickOnCard(e, lk, section) {
    this.props.switchToPostcardView(lk, section);
  }

  /**
   * resizing (for the chart mostly)
   */
  updateWindowDimensions() {
    this.setState({
      windowSize: { width: window.innerWidth, height: window.innerHeight },
    });
    this.generateCards();
  }

  /**
   * error handling: check the data before generating the cards
   * @param {*} element element in cardSelection (lk:{label:"",value:""},section:"")
   */
  checkData(element) {
    //check element types
    if (
      typeof element !== 'object' ||
      Array.isArray(element) ||
      element == null ||
      element == undefined
    ) {
      throw new Error('Selected Element is not an Object');
    }
    //check lk type
    if (element.lk.value == undefined || !isInt(element.lk.value)) {
      throw new Error('Selected Landkreis is not valid');
    }
    if (typeof element.lk.label !== 'string' || !element.lk.label instanceof String) {
      throw new Error('Selected Landkreis is not valid');
    }
    //check section type
    if (element.section == undefined || !['Ge', 'En', 'Ab', 'La', 'Mo'].includes(element.section)) {
      throw new Error('Selected Section is not valid');
    }
    //check if data exists
    if (
      this.data[element.lk.value] == undefined ||
      this.layoutControls[element.section] == undefined
    ) {
      throw new Error('No Data for Selected Element');
    }
    //check if lower level data exists
    if (
      this.layoutControls[element.section].params == undefined ||
      this.layoutControls[element.section].params[0] == undefined ||
      this.layoutControls[element.section].params[0][0] == undefined ||
      this.layoutControls[element.section].params[0][0].combo == undefined ||
      this.props.activeCard > this.layoutControls[element.section].params
    ) {
      throw new Error('No Layout Data for Selected Element');
    }
    if (this.data[element.lk.value][element.section] == undefined) {
      throw new Error('No Climate Protection Data for Selected Element');
    }
  }

  /**
   * generates list of card components dynamically depending on mode and cardSelection
   * pulls Local Data for the Landkreis of each card and passes it as prop to Side.js
   * called by componentDidUpdate
   */
  generateCards() {
    let list;
    let classProp;

    //if in postcardview: use css class for carousel
    if (this.props.postcardView) {
      //for each item in cardSelection
      list = this.props.cardSelection.map((element, i) => {
        //check data
        try {
          this.checkData(element);

          //css class for carousel
          const indexLeft = mod(this.props.activeCard - 1, this.props.cardSelection.length);
          const indexRight = mod(this.props.activeCard + 1, this.props.cardSelection.length);

          let classProp = '';

          let isTopCard = false;

          if (i === this.props.activeCard) {
            classProp = 'card card-active';
            isTopCard = true; //store if card is currently on top for rendering viz effectively
          } else if (i === indexRight) {
            classProp = 'card card-right';
          } else if (i === indexLeft) {
            classProp = 'card card-left';
          } else {
            classProp = 'card card-back';
          }

          return (
            <Card
              key={i}
              classProp={classProp}
              isThumbnail={false} //this is always false in postcardView
              sides={this.layoutControls[element.section]}
              handleSwitchNext={this.props.handleSwitchNext}
              handleSwitchBack={this.props.handleSwitchBack}
            >
              <Side
                lk={element.lk}
                isThumbnail={false}
                isTopCard={isTopCard} //this is true for the postcard on top
                section={element.section}
                windowSize={this.state.windowSize}
                localData={this.data[element.lk.value]}
                layoutControls={this.layoutControls[element.section]}
              />
            </Card>
          );
        } catch (e) {
          console.log(e);
        }
      });

      //   console.log("postcardview cards generated", list);
    }

    //if not in postcardview: use css class for overview / other modes
    else {
      if (this.props.mode === 'comparison') {
        classProp = 'card card-ordered';
      } else if (this.props.mode === 'lk') {
        classProp = 'card card-ordered';
      } else if (this.props.mode === 'shuffle') {
        //todo: editors pick / shuffle mode
        classProp = 'card card-ordered';
      }

      //for each item in cardSelection
      list = this.props.cardSelection.map((element, i) => {
        try {
          //check data
          this.checkData(element);

          //get local data
          let localData = this.data[element.lk.value];

          //use BL data for not regional data for each indicator
          //TODO: show somewhere, that this data is not on Landkreis Level as indicated by regional:false
          for (const [key, value] of Object.entries(localData[element.section])) {
            //if data not regional
            if (!value.regional && value.data == undefined) {
              //get  bundesland data
              let BLdata = this.data[localData.bundesland][element.section][key];
              //store bundesland data at indicator of landkreis
              localData[element.section][key] = BLdata;
            }
          }

          return (
            <Card
              key={i}
              classProp={classProp}
              isThumbnail={true} //this is always true when not in postcardView
              sides={this.layoutControls[element.section]} //TODO: this could also just be the number of cards
            >
              <Side
                lk={element.lk}
                section={element.section}
                windowSize={this.state.windowSize}
                isThumbnail={true}
                localData={localData}
                clickOnCard={this.handleClickOnCard} //this only is passed when not in postcardview
                layoutControls={this.layoutControls[element.section]}
              />
            </Card>
          );
        } catch (e) {
          console.log(e); //catch errors appearing in checkData()
        }
      });
    }

    //set list of cards
    this.setState({ cards: list });
  }

  /**
   * React LifeCyle Hook
   * update window size on mount
   */
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  /**
   * React Lifecylce Hook
   * @param {} prevProps
   */
  componentDidUpdate(prevProps) {
    if (
      this.props.cardSelection !== prevProps.cardSelection ||
      this.props.postcardView !== prevProps.postcardView ||
      this.props.activeCard !== prevProps.activeCard
    ) {
      //   console.log("props did update");
      this.generateCards();
    }
  }

  render() {
    return (
      <div className="card-collection">
        <h5 className="debug">
          Debug: {this.props.mode}, LK:{' '}
          {this.props.cardSelection.map((elem) => elem.lk.label + ' ' + elem.section + ' | ')}
        </h5>
        {this.props.mode === 'comparison' && !this.props.postcardView && (
          <div>
            <div className="card-container stacked"> {this.state.cards} </div>
          </div>
        )}
        {this.props.mode === 'lk' && !this.props.postcardView && (
          <div>
            <div className="card-container messy">{this.state.cards}</div>
          </div>
        )}
        {this.props.mode === 'shuffle' && !this.props.postcardView && (
          <div>
            <div className="card-container shuffle">{this.state.cards}</div>
          </div>
        )}
        {this.props.postcardView && (
          <div className="carousel-container">
            <div className="card-container carousel">{this.state.cards}</div>
          </div>
        )}
      </div>
    );
  }
}