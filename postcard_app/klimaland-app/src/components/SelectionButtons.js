import React, { Component } from 'react'
import Select from "react-select";


//img
import shuffle from "../img/buttons/shuffle.png";

export class SelectionButtons extends Component {
    constructor(props){
        super(props)

        this.changeLandkreis = this.changeLandkreis.bind(this);
        this.changeSection = this.changeSection.bind(this);
        this.shuffle = this.shuffle.bind(this)

    }

    changeLandkreis(e){
        this.props.changeLandkreis(e);
    }

    changeSection(e){
        this.props.changeSection(e);
    }

    shuffle(e){
        this.props.shuffle(e);
    }


    render() {
        return (
            <div>
                {!this.props.postcardView && <div className="selection-container">
                    <Select
                        className="selector"
                        isMulti
                        defaultValue={this.props.landkreisSelection}
                        onChange={this.changeLandkreis}
                        options={this.props.landkreise}
                        isOptionDisabled={() => this.props.landkreisSelection.length >= 3} //max selection number: 3
                    />

                    <button className="button shuffle" onClick={this.shuffle}>
                        <img src={shuffle} className="button-img" alt="shuffle-button-img" />
                    </button>

                    <h5>
                        Du hast{" "}
                        {this.props.landkreisSelection.map((elem) => elem.label + " ")}{" "}
                        ausgewählt.
                    </h5>

                    <div
                        style={{
                            visibility:
                                this.props.mode === "comparison" ? "visible" : "hidden",
                        }}
                    >
                        <Select
                            className="selector"
                            defaultValue={this.props.sections[0]}
                            onChange={this.changeSection}
                            options={this.props.sections}
                        />

                        <h5>in der Sektion {this.props.sections[0].label}.</h5>
                    </div>

                    <p>View: {this.props.mode}</p>
                </div>}</div>
        )
    }
}

export default SelectionButtons