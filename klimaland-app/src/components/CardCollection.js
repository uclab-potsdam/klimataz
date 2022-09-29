/* eslint-disable array-callback-return */
import { Component } from 'react';
import { mod, isInt, setStateAsync } from '../helpers/helperFunc';

//components
import Card from './Card';
import Side from './Side';

//data (same for all cards, so imported here)
import Data from '../data/data.json';
import LayoutControls from '../data/layout-controls-inprogress.json';
import DynamicTextJson from '../data/textData.json';
import { local } from 'd3';

export default class CardCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //cards includes all rendered cards
      cards: [],
      textData: [],
      windowSize: {
        width: 0,
        height: 0,
      },
    };

    //load all the data
    this.data = Data;
    this.layoutControls = LayoutControls;
    this.textData = DynamicTextJson;

    //bind functions called by components
    this.handleClickOnCard = this.handleClickOnCard.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.addCardToSelection = this.addCardToSelection.bind(this);

    // if (this.switchDataLevel !== undefined) {
    //   this.switchDataLevel = this.switchDataLevel.bind(this);
    // }

    this.updateData = this.updateData.bind(this);
  }

  async updateData(result) {
    // console.log(result)
    const data = result.data;
    // Here this is available and we can call this.setState (since it's binded in the constructor)
    await setStateAsync(this, { textData: data, textLoaded: true }).then(() => {
      this.generateCards();
    }); // or shorter ES syntax: this.setState({ data });
  }

  /**
   * calls switchToPostcardView in LayoutControls
   * @param {*} e event passed by Side
   * @param {*} lk landkreis of card that was clicked on
   * @param {*} section section of card that was clicked on
   */
  handleClickOnCard(lk, section) {
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
   * when someone clicked on a list item, pass this to parent
   * @param {} lk AGS and name of location clicked on in the list as value-label pair
   */
  addCardToSelection(lk) {
    this.props.addCardToSelection(lk);
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
      element === undefined
    ) {
      throw new Error('Selected Element is not an Object');
    }
    //check lk type
    if (element.lk === undefined || element.lk.value === undefined || !isInt(element.lk.value)) {
      throw new Error('Selected Landkreis is not valid');
    }
    if (typeof element.lk.label !== 'string' || !element.lk.label instanceof String) {
      throw new Error('Selected Landkreis is not valid');
    }
    //check section type
    if (
      element.section === undefined ||
      element.section.value === undefined ||
      !['Ge', 'En', 'Ab', 'La', 'Mo'].includes(element.section.value)
    ) {
      throw new Error('Selected Section is not valid');
    }
    //check if data exists
    if (
      this.data[element.lk.value] === undefined ||
      this.layoutControls[element.section.value] === undefined
    ) {
      throw new Error('No Data for Selected Element');
    }
    //check if lower level data exists
    if (
      this.layoutControls[element.section.value].params === undefined ||
      this.layoutControls[element.section.value].params[0] === undefined ||
      this.layoutControls[element.section.value].params[0][0] === undefined ||
      this.layoutControls[element.section.value].params[0][0].combo === undefined ||
      this.layoutControls[element.section.value].params[0][0].components.indicator === undefined ||
      this.props.activeCard > this.layoutControls[element.section.value].params
    ) {
      throw new Error('No Layout Data for Selected Element');
    }
    if (this.data[element.lk.value][element.section.value] === undefined) {
      throw new Error('No Climate Protection Data for Selected Element');
    }
  }

  checkIndicatorData(element) {
    let indicator0 = this.layoutControls[element.section.value].params[0][0].components.indicator;
    if (
      this.data[element.lk.value][element.section.value][indicator0] === undefined ||
      this.data[element.lk.value][element.section.value][indicator0].data === undefined
    ) {
      throw new Error('No Climate Protection Data for Indicator of Selected Element');
    }
    if (this.layoutControls[element.section.value].params[2] !== undefined) {
      let indicator2 = this.layoutControls[element.section.value].params[2][2].components.indicator;
      if (
        this.data[element.lk.value][element.section.value][indicator2] === undefined ||
        this.data[element.lk.value][element.section.value][indicator2].data === undefined
      ) {
        throw new Error('No Climate Protection Data for Indicator of Selected Element');
      }
    }
  }

  getLocalData(element, section) {
    //get local data
    let localData = this.data[element.lk.value];

    //use BL data for not regional data for each indicator
    //TODO: show somewhere, that this data is not on Landkreis Level as indicated by regional:false
    for (const [key, value] of Object.entries(localData[section])) {
      //for industry data: get bundesland data for landkreise where energy is secret (stored in json under "regional")
      if (key === '_industry_consumption_') {
        if (element.lk.value > 16 && !value.regional) {
          //get  bundesland data
          let BLdata = this.data[localData.bundesland][section][key];
          //store bundesland data at indicator of landkreis
          localData[section][key] = BLdata;
        }
      }
      //if data not regional
      if (!value.regional && value.data === undefined) {
        //get  bundesland data
        let BLdata = this.data[localData.bundesland][section][key];
        //store bundesland data at indicator of landkreis
        localData[section][key] = BLdata;
      }
    }
    return localData;
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

          const section = element.section.value;

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

          const footnote = this.data[element.lk.value].footnote;

          const localData = this.getLocalData(element, section);

          let localTextData = [];
          let similarAgs = [];

          if (this.textData !== undefined) {
            //get dynamic text data for current ags
            localTextData = this.textData[element.lk.value];

            // pulling similar lks (within the bl)
            similarAgs = Object.fromEntries(
              Object.entries(this.textData).filter(([key, value]) => {
                return element.lk.value !== 0
                  ? value[section]['third'] === localTextData[section]['third'] &&
                  value.key !== element.lk.value
                  : value.key !== element.lk.value;
              })
            );

            //convert to array for ags-name pairs
            similarAgs = Object.keys(similarAgs).map((key) => [Number(key), similarAgs[key]]);

            similarAgs = similarAgs.map(function (d) {
              return {
                value: d[1].key,
                label: d[1].name,
              };
            });

            // shuffle the array
            const shuffled = similarAgs.sort(() => 0.5 - Math.random());
            // get 10 random location
            const randomSample = shuffled.slice(0, 10);

            similarAgs = randomSample;
          }

          // console.log(this.props.switchDataLevel)

          return (
            <Card
              key={i}
              classProp={classProp}
              isThumbnail={false} //this is always false in postcardView
              sides={this.layoutControls[section]}
              handleSwitchNext={this.props.handleSwitchNext}
              handleSwitchBack={this.props.handleSwitchBack}
            >
              <Side
                lk={element.lk}
                isThumbnail={false}
                isTopCard={isTopCard} //this is true for the postcard on top
                dataLevelLK={this.props.dataLevelLK}
                section={section}
                sectionName={element.section.label}
                windowSize={this.state.windowSize}
                localData={localData}
                textData={localTextData}
                similarAgs={similarAgs}
                layoutControls={this.layoutControls[section]}
                handleClickOnList={this.addCardToSelection}
                footnote={footnote}
                toggleLabels={this.props.toggleLabels}
                isLKData={this.props.dataLevelLK}
                switchDataLevel={this.props.switchDataLevel}
              />
            </Card>
          );
        } catch (e) {
          console.log(e); //catch errors appearing in checkData()
        }
      });
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
          const section = element.section.value;

          //get local data
          let localData = this.getLocalData(element, section);

          //use BL data for not regional data for each indicator
          //TODO: show somewhere, that this data is not on Landkreis Level as indicated by regional:false
          for (const [key, value] of Object.entries(localData[section])) {
            //if data not regional
            if (!value.regional && value.data === undefined) {
              //get  bundesland data
              let BLdata = this.data[localData.bundesland][section][key];
              //store bundesland data at indicator of landkreis
              localData[section][key] = BLdata;
            }
          }
          this.checkIndicatorData(element);

          //get dynamic text data for current ags
          // let localTextData = this.state.textData.filter((d) => {
          //   return +d.AGS === element.lk.value;
          // });

          let localTextData = this.textData[element.lk.value];

          return (
            <Card
              key={i}
              classProp={classProp}
              isThumbnail={true} //this is always true when not in postcardView
              sides={this.layoutControls[section]} //TODO: this could also just be the number of cards
            >
              <Side
                lk={element.lk}
                section={section}
                sectionName={element.section.label}
                windowSize={this.state.windowSize}
                isThumbnail={true}
                textData={localTextData}
                mode={this.props.mode}
                dataLevelLK={true} //always true in thumbnail view
                localData={localData}
                clickOnCard={this.handleClickOnCard} //this only is passed when not in postcardview
                layoutControls={this.layoutControls[section]}
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
      this.props.activeCard !== prevProps.activeCard ||
      this.props.dataLevelLK !== prevProps.dataLevelLK
    ) {
      this.generateCards();
    }
  }

  render() {
    return (
      <div className="card-collection">
        {/* <h5 className="debug">
          Debug: {this.props.mode}, LK:{' '}
          {this.props.cardSelection.map((elem) => elem.lk.label + ' ' + elem.section.label + ' | ')}
        </h5> */}
        {this.props.mode === 'comparison' && !this.props.postcardView && (
          <div className="inner-card-collection">
            <div className="card-container stacked"> {this.state.cards} </div>
          </div>
        )}
        {this.props.mode === 'lk' && !this.props.postcardView && (
          <div className="inner-card-collection">
            <div className="card-container messy">{this.state.cards}</div>
          </div>
        )}
        {this.props.mode === 'shuffle' && !this.props.postcardView && (
          <div className="inner-card-collection">
            <div className="card-container shuffle">{this.state.cards}</div>
          </div>
        )}
        {this.props.mode === 'singlePCview' && this.props.postcardView && (
          <div className="carousel-container">
            <div className="card-container carousel">{this.state.cards}</div>
          </div>
        )}
        {this.props.postcardView && this.props.mode !== 'singlePCview' && (
          <div className="carousel-container">
            <div className="card-container carousel">{this.state.cards}</div>
          </div>
        )}
      </div>
    );
  }
}
