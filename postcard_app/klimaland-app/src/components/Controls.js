import { Component } from 'react'
import Select from "react-select";

//our components
import CardCollection from './CardCollection'

export default class Controls extends Component {

    constructor(props) {
        super(props)

        this.state = {
            shuffleSelection: [
                { lk: { value: "11" }, section: "mobility" }, { lk: "1011", section: "waste" }, { lk: "11", section: "mobility" }
            ], sections: [
                {
                    label: "Mobilität",
                    value: "mobility",
                },
                {
                    label: "Gebäude",
                    value: "buildings",
                },
                {
                    label: "Energie",
                    value: "energy",
                },
                {
                    label: "Landwirtschaft",
                    value: "agriculture",
                },
                {
                    label: "Abfallentsorgung",
                    value: "waste",
                },
            ], landkreise: [
                {
                    label: "Flensburg",
                    value: "1011",
                },
                {
                    label: "Hamburg",
                    value: "2",
                },
                {
                    label: "Berlin",
                    value: "11",
                },
                {
                    label: "Deutschland",
                    value: "0"
                }
            ], section: [], landkreisSelection: [], postcardView: false, mode: "", cardSelection: []
        }

    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async updateMode() {
        //setMode("shuffle")
        console.log("update mode", this.state.landkreisSelection)
        //return this.setStateAsync({mode:"shuffle"})
        if (this.state.landkreisSelection.length > 1) {
            return this.setState({ mode: "comparison" })
        }
        else if (this.state.landkreisSelection.length === 1) {
            return this.setStateAsync({ mode: "lk" })
        }
        // else if (landkreisSelection.length === 2) { //later this will be on click on a postcard
        //     mode = "postcard"
        // }
        else {
            return this.setStateAsync({ mode: "shuffle" })
            //setMode("shuffle")
        }
        //console.log("updated mode:", this.state.mode)

        //check if for mistakes during setting the mode
        // if (!["comparison", "shuffle", "lk", "postcard"].includes(mode)) {
        //     mode = "shuffle"
        // }

        // return mode;
    }

    switchToPostcardView() {
        console.log("set postcard view true")
        this.setState({ postcardView: true });
    }

    async changeLandkreis(e) {
        // await this.setStateAsync({landkreisSelection:e})
        // .then(()=>{this.updateCardSelection()})
        this.setState({ landkreisSelection: e }, () => {
            console.log("set state done")
            this.updateCardSelection();
        });

    }

    async changeSection(e) {
        await this.setStateAsync({ section: e })
            .then(() => {
                this.updateCardSelection()
            })
    }

    async updateCardSelection() {
        await this.updateMode().then(() => {
            console.log("update mode done")
            let list = []
            console.log('updateCardSelection postcardview? ', this.state.postcardView);
            if (this.state.mode === "shuffle") {
                console.log(this.state.mode, list)
                list = this.state.shuffleSelection
            }

            else if (this.state.mode === "lk") {
                list = []
                let selectedLK;
                // set default value for landkreisSelection (TODO: use germany)
                if (this.state.landkreisSelection[0] === undefined) selectedLK = { value: "11", label: "Berlin" };
                else { selectedLK = { value: this.state.landkreisSelection[0].value, label: this.state.landkreisSelection[0].label } } //set selected value for landkreisSelection

                //add one card per section
                this.state.sections.forEach((element) => {
                    list.push({ lk: selectedLK, section: element.value })
                })
            }

            else if (this.state.mode === "comparison") {
                let selectedSection;

                // set default value for section
                if (this.state.section === undefined) {
                    selectedSection = "energy";
                }
                //set selected value for section
                else {
                    selectedSection = this.state.section.value
                }

                //add one card per landkreisSelection
                this.state.landkreisSelection.forEach((element) => {
                    list.push({ lk: { value: element.value, label: element.label }, section: selectedSection })
                })
            }

            console.log(this.state.mode, list)
            this.setState({ cardSelection: list })
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
                    options={this.state.landkreise}
                />

                <h5>Du hast {this.state.landkreisSelection.map((elem) => elem.label + " ")} ausgewählt.</h5>

                <div style={{ visibility: (this.state.mode === "comparison") ? "visible" : "hidden" }}>
                    <Select
                        defaultValue={this.state.section[0]}
                        onChange={this.changeSection.bind(this)}
                        options={this.state.sections}
                    />

                    <h5>in der Sektion {this.state.section.label}.</h5>
                </div>

                <CardCollection cardSelection={this.state.cardSelection} mode={this.state.mode} postcardView={this.state.postcardView} switchToPostcardView={this.switchToPostcardView} />
            </div>
        )
    }
}
