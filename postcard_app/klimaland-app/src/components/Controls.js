import { Component } from "react";
import Select from "react-select";
import DropDownControls from "../data/selector-controls.json";

//our components
import CardCollection from "./CardCollection";

//images
import flip from "../img/buttons/flip.png";
import switchCard from "../img/buttons/switch.png";
//import shuffle from "../img/buttons/shuffle.png";
import close from "../img/buttons/close.png";

export default class Controls extends Component {
    constructor(props) {
        super(props);
        console.log(DropDownControls.landkreise)
        this.landkreise = DropDownControls.landkreise
        // [
        //     // FM: ids need to be checked for consistency
        //     {
        //         label: "Flensburg",
        //         value: "01001",
        //     },
        //     {
        //         label: "St. Wendel",
        //         value: "10046"
        //     },
        //     {
        //         label: "Hamburg",
        //         value: "02",
        //     },
        //     {
        //         label: "Berlin",
        //         value: "11",
        //     },
        //     {
        //         // FM: single digit bundesland needs 0 at the beginning
        //         label: "Nordrhein-Westfalen",
        //         value: "05"
        //     },
        //     {
        //         label: "Deutschland",
        //         value: "0",
        //     },
        // ]

        this.sections = DropDownControls.indicators

        // this.sections = [
        //     {
        //         label: "Mobilität",
        //         value: "mobility",
        //     },
        //     {
        //         label: "Gebäude",
        //         value: "buildings",
        //     },
        //     {
        //         label: "Energie",
        //         value: "energy",
        //     },
        //     {
        //         label: "Landwirtschaft",
        //         value: "agriculture",
        //     },
        //     {
        //         label: "Abfallentsorgung",
        //         value: "waste",
        //     },
        // ]

        this.switchToPostcardView = this.switchToPostcardView.bind(this);
        this.nextCard = this.nextCard.bind(this);
        this.closePostcardView = this.closePostcardView.bind(this);

        this.state = {
            shuffleSelection: [
                { lk: { id: "11" }, section: "mobility" },
                { lk: "1011", section: "waste" },
                { lk: "11", section: "mobility" },
            ],
            section: [],
            landkreisSelection: [],
            postcardView: false,
            mode: "",
            cardSelection: [],
            activeCard: 0
        };
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve);
        });
    }

    async updateMode() {
        //setMode("shuffle")
        console.log("update mode", this.state.landkreisSelection);
        //return this.setStateAsync({mode:"shuffle"})
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
        console.log("set postcard view true");
        this.setState({ postcardView: true });
    }

    closePostcardView() {
        if(!this.state.postcardView) return

        console.log("set postcard view false");
        this.setState({ postcardView: false });
    }

    nextCard(){
        if(!this.state.postcardView) return

        //switch to next card in postcard view
        let newActiveCard = (this.state.activeCard + 1) % this.state.cardSelection.length      
        this.setState({activeCard: newActiveCard});
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
            console.log(
                "updateCardSelection postcardview? ",
                this.state.postcardView
            );
            if (this.state.mode === "shuffle") {
                console.log(this.state.mode, list);
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

            console.log(this.state.mode, list);
            this.setState({ cardSelection: list });
            //return list;
        });
    }

    render() {
        return (
            <div>
                <h2>Card Collections</h2>

                <Select
                    isMulti
                    defaultValue={this.state.landkreisSelection}
                    onChange={this.changeLandkreis.bind(this)}
                    options={this.landkreise}
                    isOptionDisabled={() => this.state.landkreisSelection.length >= 3} //max selection number: 3
                />

                <h5>
                    Du hast{" "}
                    {this.state.landkreisSelection.map((elem) => elem.label + " ")}{" "}
                    ausgewählt.
                </h5>

                <div
                    style={{
                        visibility: this.state.mode === "comparison" ? "visible" : "hidden",
                    }}
                >
                    <Select
                        defaultValue={this.state.section[0]}
                        onChange={this.changeSection.bind(this)}
                        options={this.sections}
                    />

                    <h5>in der Sektion {this.state.section.label}.</h5>
                </div>

                <CardCollection
                    cardSelection={this.state.cardSelection}
                    mode={this.state.mode}
                    postcardView={this.state.postcardView}
                    activeCard = {this.state.activeCard}
                    switchToPostcardView={this.switchToPostcardView.bind(this)}
                />

                {this.state.postcardView && <div className="button-container">
                    <button className="close-button" onClick={this.closePostcardView}>
                        <img
                            src={close}
                            className="close-button-img"
                            alt="close-button-img"
                        />
                    </button>

                    <button className="switch-button" onClick={this.nextCard}>
                        <img
                            src={switchCard}
                            className="switch-button-img"
                            alt="switch-button-img"
                        />
                    </button>

                    {/* <button className="flip-button">
                        <img src={flip} className="flip-button-img" alt="flip-button-img" />
                    </button> */}
                </div>}
            </div>
        );
    }
}
