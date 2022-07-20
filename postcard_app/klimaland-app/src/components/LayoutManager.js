import { Component } from "react";
import Select from "react-select";
import DropDownControls from "../data/selector-controls.json";

//our components
import CardCollection from "./CardCollection";

import { getRandomElement } from "./helper.js"

//images
//import flip from "../img/buttons/flip.png";
import switchCard from "../img/buttons/switch.png";
import shuffle from "../img/buttons/shuffle.png";
import close from "../img/buttons/close.png";


export default class Controls extends Component {
    constructor(props) {
        super(props);

        //TODO: reformat DropDownControls.indicators to object with value/label pairs
        //this.sections = DropDownControls.indicators
        this.sections = [{ label: "Mobilität", value: "mobility", }, { label: "Gebäude", value: "buildings", },
        { label: "Energie", value: "energy", }, { label: "Landwirtschaft", value: "agriculture", }, {
            label: "Abfallentsorgung",
            value: "waste",
        },]

        this.landkreise = DropDownControls.landkreise

        this.switchToPostcardView = this.switchToPostcardView.bind(this);
        this.nextCard = this.nextCard.bind(this);
        this.closePostcardView = this.closePostcardView.bind(this);
        this.updateShuffleSelection = this.updateShuffleSelection.bind(this)

        this.state = {
            //editors pick might be a prop and set by canvas!
            editorspick: [
                { lk: { value: "11", label: "Berlin" }, section: "mobility" },
                { lk: { value: "2", label: "Hamburg" }, section: "waste" },
                { lk: { value: "1011", label: "Flensburg" }, section: "mobility" },
            ],
            shuffleSelection: [],
            section: [],
            landkreisSelection: [],
            postcardView: false,
            mode: "shuffle",
            cardSelection: [],
            activeCard: 0,
        };
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve);
        });
    }

    async updateMode() {
        // console.log("update mode", this.state.landkreisSelection);
        if (this.state.landkreisSelection.length > 1) {
            return this.setState({ mode: "comparison" });
        }
        else if (this.state.landkreisSelection.length === 1) {
            return this.setStateAsync({ mode: "lk" });
        }
        else {
            return this.setStateAsync({ mode: "shuffle" });
        }

        // TODO: check if for mistakes during setting the mode
        // if (!["comparison", "shuffle", "lk", "postcard"].includes(mode)) {
        //     mode = "shuffle"
        // }

        // return mode;
    }

    switchToPostcardView() {
        this.setState({ postcardView: true });
    }

    closePostcardView() {
        if (!this.state.postcardView) return;

        this.setState({ postcardView: false });
    }

    nextCard() {
        if (!this.state.postcardView) return;

        //switch to next card in postcard view
        let newActiveCard =
            (this.state.activeCard + 1) % this.state.cardSelection.length;
        this.setState({ activeCard: newActiveCard });
        //setActiveCard((activeCard + 1) % cards().length);
    }

    async changeLandkreis(e) {
        // await this.setStateAsync({landkreisSelection:e})
        // .then(()=>{this.updateCardSelection()})
        this.setState({ landkreisSelection: e }, () => {
            this.updateCardSelection();
        });
    }

    async changeSection(e) {
        await this.setStateAsync({ section: e }).then(() => {
            this.updateCardSelection();
        });
    }

    async updateCardSelection() {
        await this.updateMode().then(() => {
            let list = [];
            if (this.state.mode === "shuffle") {
                list = this.state.shuffleSelection;
            }
            else if (this.state.mode === "lk") {
                list = [];
                let selectedLK;
                // set default value for landkreisSelection (TODO: use germany)
                if (this.state.landkreisSelection[0] === undefined) {
                    selectedLK = { value: "11", label: "Berlin" };
                }
                else {
                    selectedLK = {
                        value: this.state.landkreisSelection[0].value,
                        label: this.state.landkreisSelection[0].label,
                    };
                } //set selected value for landkreisSelection

                //add one card per section
                this.sections.forEach((element) => {
                    list.push({ lk: selectedLK, section: element.value });
                });
            }
            else if (this.state.mode === "comparison") {
                let selectedSection;

                // set default value for section
                if (this.state.section === undefined) {
                    selectedSection = "energy";
                }
                //set selected value for section
                else {
                    selectedSection = this.state.section.value;
                }

                //add one card per landkreisSelection
                this.state.landkreisSelection.forEach((element) => {
                    list.push({
                        lk: { value: element.value, label: element.label },
                        section: selectedSection,
                    });
                });
            }

            this.setState({ cardSelection: list });
        });
    }

    async updateShuffleSelection() {
        //if reshuffling
        if (this.state.mode == "shuffle") {
            let shuffled = []
            let randomLK, randomLKElement, randomSection;
            for (let i = 0; i < 5; i++) {
                randomLK = getRandomElement(this.landkreise)
                randomSection = getRandomElement(this.sections)
                randomLKElement = {lk:{value:randomLK.value,label:randomLK.label},section:randomSection.value}

                shuffled.push(randomLKElement)
            }
            await this.setStateAsync({ shuffleSelection: shuffled }).then(() => {
                this.updateCardSelection();
            });
        }

        //else: switching to shuffle mode
        else {

            //use editors pick as first shuffle option
            //reset selection and mode
            await this.setStateAsync({ shuffleSelection: this.state.editorspick, landkreisSelection: [], mode: "shuffle" }).then(() => {
                this.updateCardSelection();
            });

        }


    }

    componentDidMount() {
        console.log("Mount")
        this.setState({ shuffleSelection: this.state.editorspick })
        this.updateCardSelection();
    }

    render() {
        return (
            <div>
                {!this.state.postcardView && <div className="selection-container">
                    <Select
                        className="selector"
                        isMulti
                        defaultValue={this.state.landkreisSelection}
                        onChange={this.changeLandkreis.bind(this)}
                        options={this.landkreise}
                        isOptionDisabled={() => this.state.landkreisSelection.length >= 3} //max selection number: 3
                    />

                    <button className="shuffle-button" onClick={this.updateShuffleSelection}>
                        <img src={shuffle} className="button-img" alt="shuffle-button-img" />
                    </button>

                    <h5>
                        Du hast{" "}
                        {this.state.landkreisSelection.map((elem) => elem.label + " ")}{" "}
                        ausgewählt.
                    </h5>

                    <div
                        style={{
                            visibility:
                                this.state.mode === "comparison" ? "visible" : "hidden",
                        }}
                    >
                        <Select
                            className="selector"
                            defaultValue={this.sections[0]}
                            onChange={this.changeSection.bind(this)}
                            options={this.sections}
                        />

                        <h5>in der Sektion {this.state.section.label}.</h5>
                    </div>

                    <p>View: {this.state.mode}</p>
                </div>}

                <CardCollection
                    cardSelection={this.state.cardSelection}
                    mode={this.state.mode}
                    postcardView={this.state.postcardView}
                    activeCard={this.state.activeCard}
                    switchToPostcardView={this.switchToPostcardView.bind(this)}
                />

                {this.state.postcardView && (
                    <div className="button-container">
                        <button className="close-button" onClick={this.closePostcardView}>
                            <img src={close} className="button-img" alt="close-button-img" />
                        </button>

                        <button className="switch-button" onClick={this.nextCard}>
                            <img
                                src={switchCard}
                                className="button-img"
                                alt="switch-button-img"
                            />
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
