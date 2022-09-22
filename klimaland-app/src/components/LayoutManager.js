import { Component } from 'react';

//our components
import CardCollection from './CardCollection';
import SelectionButtons from './SelectionButtons';
import { getRandomElement, setStateAsync } from '../helpers/helperFunc';
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

    //contextual indicator toggle labels
    this.toggleLabels = {
      La: {
        lk: 'Tieranzahl',
        bl: 'Tiere pro Fläche',
      },
      En: {
        lk: 'Industrie',
        bl: 'Energieverbrauch',
      },
      Mo: {
        lk: 'PkW-Dichte',
        bl: 'Transportmittel',
      },
      Ge: {
        lk: 'Heizenergie',
        bl: 'Energieeffizienz',
      },
      Ab: {
        lk: '',
        bl: '',
      },
    };

    //methods called by cardcollection
    this.switchToPostcardView = this.switchToPostcardView.bind(this);
    this.addCardToSelection = this.addCardToSelection.bind(this);

    //methods called by selectionbuttons
    this.updateShuffleSelection = this.updateShuffleSelection.bind(this);
    this.changeLandkreis = this.changeLandkreis.bind(this);
    this.changeSection = this.changeSection.bind(this);

    //methods called by buttons
    this.handleSwitchNext = this.nextCard.bind(this, true);
    this.handleSwitchBack = this.nextCard.bind(this, false);
    this.closePostcardView = this.closePostcardView.bind(this);
    this.switchDataLevel = this.switchDataLevel.bind(this);

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
      dataLevelLK: true,
      previewLeftCard: '',
      previewRightCard: '',
    };
  }

  /**
   * called by clicking on postcard, switches to postcardview
   * @param lk lk of postcard that was clicked on
   * @param section section of postcard that was clicked on
   */
  async switchToPostcardView(lk, section) {
    this.setState({ postcardView: true, dataLevelLK: true });

    //get card id of clicked card
    let chosenCard = this.state.cardSelection.findIndex(
      (x) => x.lk.value === lk.value && x.section.value === section
    );

    //set active card to this card id
    await setStateAsync(this, { activeCard: chosenCard }).then(() => {
      //update preview for left and right card
      this.setNextCardPreviews();
    });
  }

  /**
   * switch back to normal view
   * called by the close button in postcardview
   */
  closePostcardView() {
    if (!this.state.postcardView) return;

    this.setState({ postcardView: false });
  }

  switchDataLevel() {
    let levelUpdate = !this.state.dataLevelLK;
    this.setState({ dataLevelLK: levelUpdate });
  }

  /**
   * gets the section of the current active card. activeCard is the card currently displayed in postcardView.
   * @returns section value ("En","La", ..)of activeCard
   */
  getActiveCardSection() {
    return this.state.cardSelection[this.state.activeCard].section.value;
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
   * creates text on arrows left and right in postcard view.
   * called by methods switchToPostcardView and nextCard
   * set state "previewLeftCard" and "previewRightCard"
   */
  setNextCardPreviews() {
    //switch to next card in postcard view
    if (!this.state.postcardView) return;

    //if going to the next card
    const rightCard = (this.state.activeCard + 1) % this.state.cardSelection.length;
    let sectionLabel = this.state.cardSelection[rightCard].section.label;
    if (sectionLabel == 'Landwirtschaft') sectionLabel = 'Landw.';
    const rightCardPreview = sectionLabel + ':\n' + this.state.cardSelection[rightCard].lk.label;
    this.setState({ previewRightCard: rightCardPreview });
    //if going back

    let leftCard = this.state.activeCard - 1;
    //if new card -1: set last card of selection as new card
    if (leftCard < 0) leftCard = this.state.cardSelection.length - 1;
    sectionLabel = this.state.cardSelection[leftCard].section.label;
    if (sectionLabel == 'Landwirtschaft') sectionLabel = 'Landw.';
    const leftCardPreview = sectionLabel + '\n' + this.state.cardSelection[leftCard].lk.label;
    this.setState({ previewLeftCard: leftCardPreview });
  }

  /**
   * called by the "switch postcard" buttons in the carousel, goes in both directions now
   * sets activeCard
   * x true if carousel going to the next card (right), false if carousel going one card back (left)
   */
  async nextCard(goFurther) {
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

    await setStateAsync(this, { activeCard: newActiveCard }).then(() => {
      //update preview for left and right card
      this.setNextCardPreviews();
    });
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
      let defaultLK = this.props.editorspick[0].lk.value;
      if (this.state.mode == 'lk' && this.state.landkreisSelection[0].value == defaultLK) {
        e = e.filter((d) => {
          return d.value !== defaultLK;
        });
      }
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
      mode = 'singlePCview';
    } else if (
      (this.state.landkreisSelection.length === 1 && this.props.editorspick[0].view.value !== 3) ||
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
    await this.updateMode()
      .then(() => {
        let list = [];

        //shuffle: use shuffle selection
        if (this.state.mode === 'shuffle') {
          list = this.state.shuffleSelection;
        }

        //LK
        //get all five sections for this landkreis
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

        //COMPARISON
        // get selected section for each landkreise
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
        }

        //SINGLE POSTCARD VIEW
        else if (this.state.mode === 'singlePCview') {
          let selectedLK;
          selectedLK = {
            value: this.state.landkreisSelection[0].value,
            label: this.state.landkreisSelection[0].label,
          };

          let selectedSection;
          selectedSection = this.state.sectionSelection;

          list.push({
            lk: selectedLK,
            section: selectedSection,
          });
        }
        return list;
      })
      .then((list) => {
        setStateAsync(this, { cardSelection: list });
      })
      .then(() => {
        if (this.state.mode === 'singlePCview') {
          this.switchToPostcardView(
            this.state.landkreisSelection[0],
            this.state.sectionSelection.value
          );
        }
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
        {this.state.mode === 'lk' && this.state.postcardView === false && (
          <div className="word-art-title">
            <h4 className="gruss-thumb">Herzliche Grüße aus</h4>
            <h2 className="wordart">{this.state.landkreisSelection[0].label}</h2>
          </div>
        )}
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
          dataLevelLK={this.state.dataLevelLK}
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
            {this.getActiveCardSection() !== 'Ab' && (
              <div className="button-toggle-container">
                <svg>
                  <defs>
                    <linearGradient id="MyGradient">
                      <stop offset="50%" stopColor="#e6c9a2" />
                      <stop offset="100%" stopColor="#ffe8c9" />
                    </linearGradient>
                  </defs>
                  <g className="toggle" onClick={this.switchDataLevel}>
                    <rect className="controller-bg" x="10" y="10" width="40" height="20" rx="10" />
                    <rect
                      x={this.state.dataLevelLK ? 30 : 10}
                      y="10"
                      width="20"
                      height="20"
                      rx="10"
                      fill="#FFF9F1"
                      stroke="#484848"
                    />
                    {this.state.dataLevelLK && (
                      <text x="60" y="25">
                        {this.toggleLabels[this.getActiveCardSection()].lk}
                      </text>
                    )}
                    {!this.state.dataLevelLK && (
                      <text x="60" y="25">
                        {this.toggleLabels[this.getActiveCardSection()].bl}
                      </text>
                    )}
                  </g>
                </svg>
              </div>
            )}
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
                      <h6 className="switch-preview">{this.state.previewLeftCard}</h6>
                    </button>
                  </div>
                  <div className="inner-button button-right">
                    <button className="button switch" onClick={this.handleSwitchNext}>
                      <img src={switchCardRight} className="button img" alt="switch-button-img" />
                      <h6 className="switch-preview">{this.state.previewRightCard}</h6>
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
