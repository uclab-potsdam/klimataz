import { Component } from 'react';

//our components
import CardCollection from './CardCollection';
import SelectionButtons from './SelectionButtons';
import { getRandomElement, setStateAsync } from './helperFunc.js';
import Info from './Info.js';
// import TitleCanvas from "./TitleCanvas";

//data
import DropDownControls from '../data/selector-controls.json';

//images
//import switchCard from '../img/buttons/switch.svg';
import switchCardLeft from '../img/buttons/caret-left.svg';
import switchCardRight from '../img/buttons/caret-right.svg';
import closeCard from '../img/buttons/close.svg';

export default class LayoutManager extends Component {
  constructor(props) {
    super(props);

    //called by cardcollection
    this.switchToPostcardView = this.switchToPostcardView.bind(this);

    //called by selectionbuttons
    this.updateShuffleSelection = this.updateShuffleSelection.bind(this);
    this.changeLandkreis = this.changeLandkreis.bind(this);
    this.changeSection = this.changeSection.bind(this);

    //called by other components
    this.handleSwitchNext = this.nextCard.bind(this, true);
    this.handleSwitchBack = this.nextCard.bind(this, false);
    this.closePostcardView = this.closePostcardView.bind(this);

    //load data
    this.landkreise = DropDownControls.landkreise;
    this.sections = DropDownControls.indicators;


    // just for testing - should be solved a bit nicer
    if (this.props.areaPick1) {
      this.state = {
        editorspick: [
          { lk: { value: '11', label: this.props.areaPick1 }, section: 'Mo' },
          { lk: { value: '2', label: this.props.areaPick2 }, section: 'Ab' },
          { lk: { value: '1001', label: this.props.areaPick3 }, section: 'En' },
        ],
        shuffleSelection: [],
        section: 'En',
        landkreisSelection: [],
        postcardView: false,
        mode: 'shuffle',
        cardSelection: [],
        activeCard: 0,
      };
    } else {
      this.state = {
        editorspick: [
          { lk: { value: '11', label: 'Berlin' }, section: 'Mo' },
          { lk: { value: '2', label: 'Hamburg' }, section: 'Ab' },
          { lk: { value: '1002', label: 'Kiel' }, section: 'En' },
        ],
        shuffleSelection: [],
        section: 'En',
        landkreisSelection: [],
        postcardView: false,
        mode: 'shuffle',
        cardSelection: [],
        activeCard: 0,
      };
    }
  }
  

  async updateMode() {
    let mode;
    if (this.state.landkreisSelection.length > 1) {
      mode = 'comparison';
    } else if (this.state.landkreisSelection.length === 1) {
      mode = 'lk';
    } else {
      mode = 'shuffle';
    }

    //check mode
    if (['comparison', 'shuffle', 'lk'].includes(mode)) {
      return setStateAsync(this, { mode: mode });
    }
  }

  switchToPostcardView(lk, section) {
    this.setState({ postcardView: true });

    //get card id of clicked card
    let chosenCard = this.state.cardSelection.findIndex(
      (x) => x.lk === lk && x.section === section
    );

    //set active card to this card id
    this.setState({ activeCard: chosenCard });
  }

  closePostcardView() {
    if (!this.state.postcardView) return;

    this.setState({ postcardView: false });
  }

  nextCard(goFurther) {
    //switch to next card in postcard view
    if (!this.state.postcardView) return;

    let newActiveCard = 0;

    if (goFurther) {
      newActiveCard = (this.state.activeCard + 1) % this.state.cardSelection.length;
    } else {
      newActiveCard = this.state.activeCard - 1;
      //if new card -1: set last card of selection as new card
      if (newActiveCard < 0) newActiveCard = this.state.cardSelection.length - 1;
    }

    this.setState({ activeCard: newActiveCard });

    //setActiveCard((activeCard + 1) % cards().length);
  }

  async changeLandkreis(e) {
    this.setState({ landkreisSelection: e }, () => {
      this.updateCardSelection();
    });
  }

  async changeSection(e) {
    await setStateAsync(this, { section: e.value }).then(() => {
      this.updateCardSelection();
    });
  }

  async updateShuffleSelection() {
    //if reshuffling
    if (this.state.mode === 'shuffle') {
      let shuffled = [];
      let randomLK, randomLKElement;
      const randomSection = getRandomElement(this.sections);

      for (let i = 0; i < 5; i++) {
        randomLK = getRandomElement(this.landkreise);

        //while random lk is already in list
        let alreadyInList = shuffled.findIndex((elem) => elem.lk.value === randomLK.value);
        while (alreadyInList !== -1) {
          randomLK = getRandomElement(this.landkreise);
          alreadyInList = shuffled.findIndex((elem) => elem.lk.value === randomLK.value);
        }

        randomLKElement = {
          lk: { value: randomLK.value, label: randomLK.label },
          section: randomSection.value,
        };
        shuffled.push(randomLKElement);
      }
      await setStateAsync(this, { shuffleSelection: shuffled }).then(() => {
        this.updateCardSelection();
      });

    }

    //else: switching to shuffle mode
    else {
      //use editors pick as first shuffle option
      //reset selection and mode
      await setStateAsync(this, {
        shuffleSelection: this.state.editorspick,
        landkreisSelection: [],
        mode: 'shuffle',
      }).then(() => {
        this.updateCardSelection();
      });
    }
  }

  async updateCardSelection() {
    await this.updateMode().then(() => {
      let list = [];
      if (this.state.mode === 'shuffle') {
        list = this.state.shuffleSelection;
      } else if (this.state.mode === 'lk') {
        list = [];
        let selectedLK;
        // set default value for landkreisSelection (TODO: use germany)
        if (this.state.landkreisSelection[0] === undefined) {
          selectedLK = { value: '11', label: 'Berlin' };
        } else {
          selectedLK = {
            value: this.state.landkreisSelection[0].value,
            label: this.state.landkreisSelection[0].label,
          };
        } //set selected value for landkreisSelection

        //add one card per section
        this.sections.forEach((element) => {
          list.push({ lk: selectedLK, section: element.value });
        });
      } else if (this.state.mode === 'comparison') {
        let selectedSection;

        // set default value for section
        if (this.state.section === undefined) {
          selectedSection = 'En';
        }
        //set selected value for section
        else {
          selectedSection = this.state.section;
        }

        //add one card per landkreisSelection
        this.state.landkreisSelection.forEach((element) => {
          list.push({
            lk: { value: element.value, label: element.label },
            section: selectedSection,
          });
        });
        // console.log('updated', list);
      }

      this.setState({ cardSelection: list });
    });
  }

  componentDidMount() {
    this.setState({ shuffleSelection: this.state.editorspick });
    this.updateCardSelection();
  }

  render() {
    return (
      <div className="main-container">
        <SelectionButtons
          mode={this.state.mode}
          postcardView={this.state.postcardView}
          landkreise={this.landkreise}
          sections={this.sections}
          landkreisSelection={this.state.landkreisSelection}
          changeLandkreis={this.changeLandkreis}
          changeSection={this.changeSection}
          shuffle={this.updateShuffleSelection}
        />
        {/* 
        {this.state.landkreisSelection.length > 0 && (
          <TitleCanvas landkreis={this.state.landkreisSelection} />
        )} */}
        <CardCollection
          cardSelection={this.state.cardSelection}
          mode={this.state.mode}
          postcardView={this.state.postcardView}
          activeCard={this.state.activeCard}
          handleSwitchNext={this.handleSwitchNext}
          handleSwitchBack={this.handleSwitchBack}
          switchToPostcardView={this.switchToPostcardView}
        />

        {/* we could also put the code below into "SelectionButtons.js" or a more general
        buttons component and switch between the selection and shuffle or zoomed
        view buttonså*/}
        {this.state.postcardView && (
          <div className="button-container">
            <div className="inner-button">
              <button className="button close" onClick={this.closePostcardView}>
                <img src={closeCard} className="button img" alt="close-button-img" />
              </button>
            </div>
            <div className="button-switch-container">
              <div className="inner-button">
                <button className="button switch" onClick={this.handleSwitchBack}>
                  <img src={switchCardLeft} className="button img" alt="switch-button-img" />
                </button>
              </div>
              <div className="inner-button">
                <button className="button switch" onClick={this.handleSwitchNext}>
                  <img src={switchCardRight} className="button img" alt="switch-button-img" />
                </button>
              </div>
            </div>
          </div>
        )}
        {!this.state.postcardView && <Info />}
      </div>
    );
  }
}
