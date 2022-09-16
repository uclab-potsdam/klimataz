import { Component } from 'react';

//our components
import CardCollection from './CardCollection';
import SelectionButtons from './SelectionButtons';
import { getRandomElement, setStateAsync } from './helperFunc.js';
import Info from './Info.js';
// import TitleCanvas from "./TitleCanvas";

//images
//import switchCard from '../img/buttons/switch.svg';
import switchCardLeft from '../img/buttons/caret-left.svg';
import switchCardRight from '../img/buttons/caret-right.svg';
import closeCard from '../img/buttons/close.svg';

export default class LayoutManager extends Component {
  constructor(props) {
    super(props);

    //methods called by cardcollection
    this.switchToPostcardView = this.switchToPostcardView.bind(this);
    this.addCardToSelection = this.addCardToSelection.bind(this);

    //methods called by selectionbuttons
    this.updateShuffleSelection = this.updateShuffleSelection.bind(this);
    this.changeLandkreis = this.changeLandkreis.bind(this);
    this.changeSection = this.changeSection.bind(this);

    //methods called by other components
    this.handleSwitchNext = this.nextCard.bind(this, true);
    this.handleSwitchBack = this.nextCard.bind(this, false);
    this.closePostcardView = this.closePostcardView.bind(this);

    this.state = {
      //card selection if we are in shuffle mode
      shuffleSelection: [],
      //selected section for comparison mode
      sectionSelection: this.props.sectionsData[0],
      //selected landkreis
      landkreisSelection: [],
      //postcardview: postcard is full screen
      postcardView: false,
      //current mode (shuffle, comparison, lk, singlePCview)
      mode: 'shuffle',
      //selection of postcards, passed down to card Selection
      cardSelection: [],
      //card that is on top in postcardview, index of this card in cardSelection
      activeCard: 0,
      //true when currently editors pick is displayed
      showEditorsPick: true,
    };
  }

  /**
   * called by clicking on postcard, switches to postcardview
   * @param lk lk of postcard that was clicked on
   * @param section section of postcard that was clicked on
   */
  switchToPostcardView(lk, section) {
    this.setState({ postcardView: true });

    //get card id of clicked card
    let chosenCard = this.state.cardSelection.findIndex(
      (x) => x.lk === lk && x.section.value === section
    );

    //set active card to this card id
    this.setState({ activeCard: chosenCard });
  }

  /**
   * switch back to normal view
   * called by the close button in postcardview
   */
  closePostcardView() {
    if (!this.state.postcardView) return;

    this.setState({ postcardView: false });
  }

  /**
   * called by clickOnList (of similar landkreise). switch to landkreis view of the new landkreis.
   * since we are already in postcard view here, we just stay on the same postcard and the same side automatically.
   * @param {} lk AGS and name of location clicked on in the list as value-label pair
   */
  addCardToSelection(lk) {
    setStateAsync(this, {
      landkreisSelection: [lk],
      showEditorsPick: false,
    }).then(() => {
      this.updateCardSelection();
    });
  }

  /**
   * called by the "switch postcard" buttons in the carousel, goes in both directions now
   * sets activeCard
   * x true if carousel going to the next card (right), false if carousel going one card back (left)
   */
  nextCard(goFurther) {
    //switch to next card in postcard view
    if (!this.state.postcardView) return;

    let newActiveCard = 0;

    //if going to the next card
    if (goFurther) {
      newActiveCard = (this.state.activeCard + 1) % this.state.cardSelection.length;
    }
    //if going back
    else {
      newActiveCard = this.state.activeCard - 1;
      //if new card -1: set last card of selection as new card
      if (newActiveCard < 0) newActiveCard = this.state.cardSelection.length - 1;
    }

    this.setState({ activeCard: newActiveCard });
  }

  /**
   * called by selection buttons for landkreise. Changes landkreise selection in the buttons to the
   * event parameters and updates card selection.
   * @param e selected landkreis
   */
  async changeLandkreis(e) {
    //if everything is deselected, show editors pick
    if (e.length == 0) {
      this.setEditorsPick();
    }
    //otherwise, update cards to match selection
    else {
      setStateAsync(this, { landkreisSelection: e, showEditorsPick: false }).then(() => {
        this.updateCardSelection();
      });
    }
  }

  /**
   * called by selection buttons for section. Changes section selection in the buttons to the
   * event parameters and updates card selection.
   * @param e selected section
   */
  async changeSection(e) {
    await setStateAsync(this, { sectionSelection: e }).then(() => {
      this.updateCardSelection();
    });
  }

  /**
   * sets buttons to editors pick (passed as props by canvas from iframe) and updates cards to editors picks
   */
  async setEditorsPick() {
    //set to all landkreise of editors pick,
    let editorsLK = this.props.editorspick.map((item) => item.lk);

    // TO DO: add option for several sections
    // let editorsLK = this.props.editorspick.map((item) => item.sections);

    //only keep unique values
    editorsLK = Array.from(new Set(editorsLK.map(JSON.stringify))).map(JSON.parse);
    await setStateAsync(this, {
      shuffleSelection: this.props.editorspick,
      landkreisSelection: editorsLK,
      //set to first section of editors pick (that is also what
      //makes sense for comparison mode, for the other modes this param is not important)
      sectionSelection: this.props.editorspick[0].section,
      showEditorsPick: true,
    }).then(() => {
      this.updateCardSelection();
    });
  }

  /**
   * detect which mode we are in depending on the length of the landkreis selection
   * and sets mode
   * always called by updateCardSelection
   */
  async updateMode() {
    let mode;
    if (this.state.landkreisSelection.length > 1) {
      mode = 'comparison';
    } else if (
      this.state.landkreisSelection.length === 1 &&
      this.props.editorspick[0].view.value === 3
    ) {
      this.switchToPostcardView(this.state.landkreisSelection, this.state.sectionSelection);
      mode = 'singlePCview';
    } else if (
      this.state.landkreisSelection.length === 1 ||
      this.state.landkreisSelection.length === undefined
    ) {
      mode = 'lk';
    } else {
      mode = 'shuffle';
    }
    //check if mode is valid
    if (['comparison', 'shuffle', 'lk', 'singlePCview'].includes(mode)) {
      return setStateAsync(this, { mode: mode });
    }
  }

  /**
   * called by shuffling. Gets Random List of Landkreise and Sections.
   * If it was clicked for the first time from another mode, the cards are set to the editors pick
   */
  async updateShuffleSelection() {
    //if we shuffle for the first time:
    //switch to shuffle mode and use editors pick as first shuffle option
    if (!this.state.showEditorsPick & (this.state.mode != 'shuffle')) {
      await this.setEditorsPick();
    }
    //if reshuffling (means we are already in shuffle mode or in editors pick)
    //create list of random cards
    else {
      let shuffled = [];
      let randomLK, randomLKElement;
      //pick one random section
      const randomSection = getRandomElement(this.props.sectionsData);

      //get five random unique landkreise
      for (let i = 0; i < 5; i++) {
        randomLK = getRandomElement(this.props.landkreiseData);
        let alreadyInList = shuffled.findIndex((elem) => elem.lk.value === randomLK.value);

        //if random lk is already in list find new landkreis
        while (alreadyInList !== -1) {
          randomLK = getRandomElement(this.props.landkreiseData);
          alreadyInList = shuffled.findIndex((elem) => elem.lk.value === randomLK.value);
        }

        //push random lk to list
        randomLKElement = {
          lk: { value: randomLK.value, label: randomLK.label },
          section: { value: randomSection.value, label: randomSection.label },
        };
        shuffled.push(randomLKElement);
      }

      //update card selection
      await setStateAsync(this, {
        shuffleSelection: shuffled,
        mode: 'shuffle',
        showEditorsPick: false,
        landkreisSelection: [],
      }).then(() => {
        this.updateCardSelection();
      });
    }
  }

  /**
   * update card selection after shuffling or selecting a landkreis
   * always calles "updateMode" first and adds cards to the cardSelection List depending on the mode
   */
  async updateCardSelection() {
    await this.updateMode().then(() => {
      let list = [];

      //shuffle: use shuffle selection
      if (this.state.mode === 'shuffle') {
        list = this.state.shuffleSelection;
      }

      //lk: get all five sections for this landkreis
      else if (this.state.mode === 'lk') {
        list = [];
        let selectedLK;
        // set default value for landkreisSelection if nothing is selected
        if (this.state.landkreisSelection[0] === undefined) {
          selectedLK = { value: '0', label: 'Deutschland' };
        } else {
          selectedLK = {
            value: this.state.landkreisSelection[0].value,
            label: this.state.landkreisSelection[0].label,
          };
        } //set selected value for landkreisSelection

        //add one card per section
        this.props.sectionsData.forEach((element) => {
          list.push({ lk: selectedLK, section: { value: element.value, label: element.label } });
        });
      }

      //comparison: get selected section for each landkreise
      else if (this.state.mode === 'comparison') {
        let selectedSection;

        // set default value for section if undefined
        if (this.state.sectionSelection === undefined) {
          selectedSection = 'En';
        }
        //set selected value for section
        else {
          selectedSection = this.state.sectionSelection;
        }

        //add one card per landkreisSelection
        this.state.landkreisSelection.forEach((element) => {
          list.push({
            lk: { value: element.value, label: element.label },
            section: selectedSection,
          });
        });
      } else if (this.state.mode === 'singlePCview') {
        let selectedLK;
        selectedLK = {
          value: this.state.landkreisSelection[0].value,
          label: this.state.landkreisSelection[0].label,
        };

        let selectedSection;
        selectedSection = this.state.sectionSelection;

        //add one card per landkreisSelection
        this.state.landkreisSelection.forEach((element) => {
          list.push({
            lk: { value: element.value, label: element.label },
            section: selectedSection,
          });
        });
        this.handleSwitchNext();
      }

      this.setState({ cardSelection: list });
    });
  }

  /**
   * React Lifecycle Hook
   * on mount: use editors pick (passed from Canvas as prop)
   */
  componentDidMount() {
    this.setEditorsPick();
  }

  componentDidUpdate(prevProps) {
    if (this.props.editorspick !== prevProps.editorspick) {
      this.setEditorsPick();
    }
  }

  render() {
    return (
      <div className="main-container">
        <SelectionButtons
          mode={this.state.mode}
          postcardView={this.state.postcardView}
          landkreise={this.props.landkreiseData}
          sections={this.props.sectionsData}
          landkreisSelection={this.state.landkreisSelection}
          sectionSelection={this.state.sectionSelection}
          defaultLK={this.props.editorspick.map(function (el) {
            return el.lk;
          })}
          changeLandkreis={this.changeLandkreis}
          changeSection={this.changeSection}
          shuffle={this.updateShuffleSelection}
          uiVis={this.props.editorspick[0].ui.value}
          viewVis={this.props.editorspick[0].view.value}
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
          addCardToSelection={this.addCardToSelection}
        />
        {/* we could also put the code below into "SelectionButtons.js" or a more general
        buttons component and switch between the selection and shuffle or zoomed
        view buttons*/}
        {this.state.postcardView && (
          <div className="button-container">
            {this.props.editorspick[0].view.value !== 3 && (
              <>
                <div className="inner-button">
                  <button className="button close" onClick={this.closePostcardView}>
                    <img src={closeCard} className="button img" alt="close-button-img" />
                  </button>
                </div>
                <div className="button-switch-container">
                  <div className="inner-button button-left">
                    <button className="button switch" onClick={this.handleSwitchBack}>
                      <img src={switchCardLeft} className="button img" alt="switch-button-img" />
                    </button>
                  </div>
                  <div className="inner-button button-right">
                    <button className="button switch" onClick={this.handleSwitchNext}>
                      <img src={switchCardRight} className="button img" alt="switch-button-img" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {!this.state.postcardView && <Info />}
      </div>
    );
  }
}
