import { Component } from 'react';

//our components
import CardCollection from './CardCollection';
import SelectionButtons from './SelectionButtons';
import { getRandomElement, getTotalLKName, setStateAsync } from '../helpers/helperFunc';
import Info from './Info.js';
import TitleArt from './TitleArt.js';
import Sources from './Sources.js';
import { UIContext } from './UIContext.js';

//images
import switchCardLeft from '../img/buttons/caret-left.svg';
import switchCardRight from '../img/buttons/caret-right.svg';
import closeCard from '../img/buttons/close.svg';
import umfrage from '../img/taz/umfrage.svg';

export default class LayoutManager extends Component {
  constructor(props) {
    super(props);

    //contextual indicator toggle labels
    this.toggleLabels = {
      La: {
        lk: 'Tierhaltung',
        bl: 'Tiere pro Fläche',
      },
      En: {
        lk: 'Industrie',
        bl: 'Gesamt',
      },
      Mo: {
        lk: 'Autodichte',
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
      //Lk of card that was on top in postcardview before cardSelection changes
      lastActiveCardLK: '',
      //true when currently editors pick is displayed
      showEditorsPick: true,
      // logic for toggle true lk
      dataLevelLK: true,
      previewLeftCard: '',
      previewRightCard: '',
    };

    this.escFunction = this.escFunction.bind(this);
  }

  /**
   * called by clicking on postcard, switches to postcardview
   * @param lk lk of postcard that was clicked on
   * @param section section of postcard that was clicked on
   */
  async switchToPostcardView(lk, section) {
    if (this.props.editorspick[0].view.value !== 3) {
      this.setState({ postcardView: true, dataLevelLK: true });
    } else {
      this.setState({ postcardView: true, dataLevelLK: this.props.editorspick[0].levelLK.value });
    }

    //get card id of clicked card
    let chosenCard = this.state.cardSelection.findIndex(
      (x) => x.lk.value === lk.value && x.section.value === section
    );

    if (chosenCard === -1) chosenCard = 0;

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
    const lastActiveLK = this.state.cardSelection[this.state.activeCard].lk;
    setStateAsync(this, {
      landkreisSelection: [lk],
      showEditorsPick: false,
      lastActiveCardLK: { value: lastActiveLK.value, label: lastActiveLK.label },
    })
      .then(() => {
        return this.updateCardSelection();
      })
      .then(() => {
        this.setNextCardPreviews();
      });
  }

  /**
   * creates text on arrows left and right in postcard view.
   * called by methods switchToPostcardView and nextCard
   * set state "previewLeftCard" and "previewRightCard"
   */
  setNextCardPreviews() {
    //switch to next card in postcard view
    if (!this.state.postcardView) return; //only in postcard view
    if (this.props.editorspick[0].view.value === 3) return; //not in single postcard view

    //if going to the next card
    const rightCard = (this.state.activeCard + 1) % this.state.cardSelection.length;
    let sectionLabel = this.state.cardSelection[rightCard].section.label;
    if (sectionLabel === 'Landwirtschaft') sectionLabel = 'Landw.';
    let rightCardPreview = '';
    if (this.state.mode === 'comparison') {
      rightCardPreview = this.state.cardSelection[rightCard].lk.label;
    }
    if (this.state.mode === 'lk') {
      rightCardPreview = sectionLabel;
    }
    this.setState({ previewRightCard: rightCardPreview });
    //if going back

    let leftCard = this.state.activeCard - 1;
    //if new card -1: set last card of selection as new card
    if (leftCard < 0) leftCard = this.state.cardSelection.length - 1;
    sectionLabel = this.state.cardSelection[leftCard].section.label;
    if (sectionLabel === 'Landwirtschaft') sectionLabel = 'Landw.';
    let leftCardPreview = '';
    if (this.state.mode === 'comparison') {
      leftCardPreview = this.state.cardSelection[leftCard].lk.label;
    }
    if (this.state.mode === 'lk') {
      leftCardPreview = sectionLabel;
    }

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
    if (this.props.editorspick[0].view.value === 3) return; //not in single postcard view

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
    if (e.length === 0) {
      this.setEditorsPick();
    }
    //otherwise, update cards to match selection
    else {
      //if default lk: immediately switch
      let defaultLK = this.props.editorspick[0].lk.value;
      if (
        this.state.mode === 'lk' &&
        this.state.landkreisSelection[0].value === 0 &&
        0 === defaultLK &&
        this.props.editorspick[0].view.label !== 'compview' //if iframe options were comparison view
      ) {
        e = e.filter((d) => {
          return d.value !== defaultLK;
        });
      }
      //else: set new selection
      setStateAsync(this, {
        landkreisSelection: e,
        showEditorsPick: false,
        lastActiveCardLK: '',
      }).then(() => {
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
    await setStateAsync(this, { sectionSelection: e, lastActiveCardLK: '' }).then(() => {
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
    if (!this.state.showEditorsPick & (this.state.mode !== 'shuffle')) {
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
              label: getTotalLKName(this.state.landkreisSelection[0]),
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
              lk: { value: element.value, label: getTotalLKName(element) },
              section: selectedSection,
            });
          });
        }

        //SINGLE POSTCARD VIEW
        else if (this.state.mode === 'singlePCview') {
          let selectedLK;
          selectedLK = {
            value: this.state.landkreisSelection[0].value,
            label: getTotalLKName(this.state.landkreisSelection[0]),
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
        return setStateAsync(this, { cardSelection: list });
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

  escFunction(event) {
    if (event.key === 'Escape') {
      this.closePostcardView();
    } else if (event.keyCode === 37) {
      this.handleSwitchBack();
    } else if (event.keyCode === 39) {
      this.handleSwitchNext();
    }
  }
  /**
   * React Lifecycle Hook
   * on mount: use editors pick (passed from Canvas as prop)
   */
  componentDidMount() {
    this.setEditorsPick();
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentDidUpdate(prevProps) {
    if (this.props.editorspick !== prevProps.editorspick) {
      this.setEditorsPick();
    }
  }

  render() {
    const currentSection = this.state.postcardView ? this.getActiveCardSection() : '';
    const currentToggleLabels = currentSection !== '' ? this.toggleLabels[currentSection] : {};

    return (
      <UIContext.Provider value={this.props.editorspick[0].ui.value}>
        <div className="main-container">
          {(this.state.mode === 'lk' || this.state.mode === 'singlePCview') && (
            <div className={!this.state.postcardView ? '' : 'titleArtHidden'}>
              <TitleArt landkreisLabel={getTotalLKName(this.state.landkreisSelection[0]) + '?'} />
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
          />

          {/* 
        {this.state.landkreisSelection.length > 0 && (
          <TitleCanvas landkreis={this.state.landkreisSelection} />
        )} */}
          <CardCollection
            cardSelection={this.state.cardSelection}
            mode={this.state.mode}
            postcardView={this.state.postcardView}
            landkreise={this.props.landkreiseData}
            activeCard={this.state.activeCard}
            lastActiveCardLK={this.state.lastActiveCardLK}
            dataLevelLK={this.state.dataLevelLK}
            handleSwitchNext={this.handleSwitchNext}
            handleSwitchBack={this.handleSwitchBack}
            switchToPostcardView={this.switchToPostcardView}
            addCardToSelection={this.addCardToSelection}
            toggleLabels={currentToggleLabels}
            isLKData={this.state.dataLevelLK}
            switchDataLevel={this.switchDataLevel}
          />
          {/* we could also put the code below into "SelectionButtons.js" or a more general
        buttons component and switch between the selection and shuffle or zoomed
        view buttons*/}
          {this.state.postcardView && (
            <>
              <div className="button-container">
                {this.props.editorspick[0].view.value !== 3 && (
                  <>
                    <div className="inner-button">
                      <button className="button close" onClick={this.closePostcardView}>
                        <img
                          src={closeCard}
                          className="button img img-close"
                          alt="close-button-img"
                        />
                      </button>
                    </div>
                    <div className="button-switch-container">
                      <button className="inner-button button-left" onClick={this.handleSwitchBack}>
                        <div className="button switch">
                          <img
                            src={switchCardLeft}
                            className="button img nav-left"
                            alt="switch-button-img"
                          />
                          <h6 className="switch-preview">{this.state.previewLeftCard}</h6>
                        </div>
                      </button>
                      <button className="inner-button button-right">
                        <div className="button switch" onClick={this.handleSwitchNext}>
                          <img
                            src={switchCardRight}
                            className="button img nav-right"
                            alt="switch-button-img"
                          />
                          <h6 className="switch-preview">{this.state.previewRightCard}</h6>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="umfrage-container">
                <a target="_blank" rel="noreferrer" href="https://forms.gle/B6dguRvQvC3y6AGi8">
                  <img
                    src={umfrage}
                    className="container-umfrage img umfrage-img"
                    alt="umfrage-img"
                  />
                </a>
                <p className="umfrage-label">
                  Nimm an unserer Umfrage teil, um einen taz Hoody zu gewinnen!
                </p>
              </div>
            </>
          )}

          <Info postcardView={this.state.postcardView} mode={this.state.mode} />
          <Sources />
        </div>
      </UIContext.Provider>
    );
  }
}
