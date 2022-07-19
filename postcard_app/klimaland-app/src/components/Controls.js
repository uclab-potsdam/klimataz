//react components
import React from 'react'
import Select from "react-select";
import { useState } from "react";

//our components
import CardCollection from './CardCollection'

const Controls = () => {

    const shuffleSelection = [
        { lk: { value: "11" }, section: "mobility" }, { lk: "1011", section: "waste" }, { lk: "11", section: "mobility" }
    ]

    const sections = [
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
    ];

    //TODO: load all landkreise from selector sheet
    const landkreise = [
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
    ];

    //store selected landkreise and sections
    const [section, setSection] = useState([]);
    const [landkreisSelection, setLK] = useState([]);

    console.log("reset postcard view")
    let postcardView = false;

    //TODO: use enum for modes for fewer mistakes
    //set mode depending on numbers of selecteed landkreise
    const mode = function () {
        let mode = "shuffle"
        if (landkreisSelection.length > 1) {
            mode = "comparison"
        }
        else if (landkreisSelection.length === 1) {
            mode = "lk"
        }
        // else if (landkreisSelection.length === 2) { //later this will be on click on a postcard
        //     mode = "postcard"
        // }
        else {
            mode = "shuffle"
        }

        //check if for mistakes during setting the mode
        if (!["comparison", "shuffle", "lk", "postcard"].includes(mode)) {
            mode = "shuffle"
        }

        return mode;
    }


    const cardSelection = function () {
        let list = []
        console.log('postcardview? ', postcardView);
        if (mode() === "shuffle") {
            console.log(mode, list)
            return shuffleSelection
        }

        else if (mode() === "lk") {
            list = []
            let selectedLK;
            if (landkreisSelection[0] === undefined) selectedLK = { value: "11", label: "Berlin" }; // set default value for landkreisSelection (todo: use germany)
            else { selectedLK = { value: landkreisSelection[0].value, label: landkreisSelection[0].label } } //set selected value for landkreisSelection

            //add one card per section
            sections.forEach((element) => {
                list.push({ lk: selectedLK, section: element.value })
            })

            console.log(mode(), list)
        }

        else if (mode() === "comparison") {
            let selectedSection;

            // set default value for section
            if (section === undefined) {
                selectedSection = "energy";
            }
            //set selected value for section
            else {
                selectedSection = section.value
            }

            //add one card per landkreisSelection
            landkreisSelection.forEach((element) => {
                list.push({ lk: { value: element.value, label: element.label }, section: selectedSection })
            })
            console.log(mode(), list)
        }

        return list;
    }

    return (
        <div>
            <h2>Card Collections</h2>

            <Select
                isMulti
                defaultValue={landkreisSelection}
                onChange={setLK}
                options={landkreise}
            />

            <h5>{landkreisSelection.map((elem) => elem.label)}</h5>

            <div style={{ visibility: (mode() === "comparison") ? "visible" : "hidden" }}>
                <Select
                    defaultValue={"energy"}
                    onChange={setSection}
                    options={sections}
                />

                <h5>{section.label}</h5>
            </div>

            <CardCollection cardSelection={cardSelection()} mode={mode()} postcardView={postcardView} />
        </div>
    )
}

export default Controls