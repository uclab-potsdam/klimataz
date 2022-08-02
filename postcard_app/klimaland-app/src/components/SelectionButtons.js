import React, { Component } from 'react'
import Select from "react-select";


//img
import shuffle from "../img/buttons/shuffle.png";

export class SelectionButtons extends Component {
    constructor(props) {
        super(props)

        this.changeLandkreis = this.changeLandkreis.bind(this);
        this.changeSection = this.changeSection.bind(this);
        this.shuffle = this.shuffle.bind(this)

        this.state = {
            selected : null
        }

    }

    changeLandkreis(e) {
        this.setState({selected :e});
        this.props.changeLandkreis(e);
    }

    changeSection(e) {
        this.props.changeSection(e);
    }

    shuffle(e) {
        console.log("reset lkSelection")
        this.setState({selected : []});
        this.props.shuffle(e);
    }


    render() {
        return (
            <div className="selection-buttons">
                {!this.props.postcardView && <div className="selection-container">
                    <Select
                        className="selector"
                        isMulti
                        //https://stackoverflow.com/questions/50412843/how-to-programmatically-clear-reset-react-select
                        key={`my_unique_select_key__${this.state.selected}`}
                        value={this.state.selected || ''}
                        defaultValue={this.props.landkreisSelection}
                        onChange={this.changeLandkreis}
                        options={this.props.landkreise}
                        getOptionLabel={(options) => `${options.label} ${options.nameAddition}`}
                        isOptionDisabled={() => this.props.landkreisSelection.length >= 3} //max selection number: 3
                    />

                    {this.props.mode === "comparison" && <Select
                        className="selector"
                        defaultValue={this.props.sections[0]}
                        onChange={this.changeSection}
                        options={this.props.sections}
                        />
                    }

                    <button className="button shuffle" onClick={this.shuffle}>
                        <img src={shuffle} className="button-img" alt="shuffle-button-img" />
                    </button>
                </div>}
            </div>
        )
    }
}

export default SelectionButtons