import Card from "./Card";
import Select from "react-select";
import { useState } from "react";
import flip from "../img/buttons/flip.png";
import switchCard from "../img/buttons/switch.png";
import shuffle from "../img/buttons/shuffle.png";
import close from "../img/buttons/close.png";

const CardCollection = () => {

    const shuffleSelection = [
        {lk:{value:"11"},section:"mobility"},{lk:"1011",section:"waste"},{lk:"11",section:"mobility"}
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

    //todo: load all landkreise from selector sheet
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

    let postcardView = false;

    //set mode depending on numbers of selecteed landkreise
    const mode = function(){
        let mode = "shuffle"
        if (landkreisSelection.length > 1) {
            mode = "comparison"
        }
        else if (landkreisSelection.length == 1) {
            mode = "lk"
        }
        // else if (landkreisSelection.length == 2) { //later this will be on click on a postcard
        //     mode = "postcard"
        // }
        else {
            mode = "shuffle"
        }

        //check if for mistakes during setting the mode
        if (!["comparison", "shuffle", "lk", "postcard"].includes(mode)) {
            mode = "shuffle"
        }

        console.log("mode: ",mode)
        return mode;
    }

    //todo: add location label and location id
    const cardSelection = function(){
        console.log("card selection...")
        let list = []
        if (mode() === "shuffle") {
            console.log(mode,list)
            return shuffleSelection
        }

        else if (mode() === "lk"){
            list = []
            let selectedLK;
            if(landkreisSelection[0] == undefined) selectedLK = {value:"11",label:"Berlin"}; // set default value for landkreisSelection (todo: use germany)
            else {selectedLK = {value:landkreisSelection[0].value,label:landkreisSelection[0].label}} //set selected value for landkreisSelection
            
            //add one card per section
            sections.forEach((element,i) => {
                list.push({lk:selectedLK,section:element.value})
            })

            console.log(mode(),list)
        }

        else if (mode() === "comparison"){
            let selectedSection;
            if(section[0] == undefined) selectedSection = "energy"; // set default value for section
            else { selectedSection = section[0].value} //set selected value for section

            //add one card per landkreisSelection
            landkreisSelection.forEach((element,i) => {
                list.push({lk:{value:element.value,label:element.label},section:selectedSection})
            })
            console.log(mode(),list)
        }

        return list;
    }

    //generate card objects dynamically depending on mode
    const cards = function() {
        let list;
        
        if (mode() == "comparison") {
            list = cardSelection().map((element,i) =>
                <Card lk={element.lk} section={element.section} key={i} classProp="card card-ordered"/>
            );
            
        }

        else if (mode() == "postcard"){
            list = cardSelection().map((element,i) => {                
                const indexLeft = mod(activeCard - 1, landkreisSelection.length);
                const indexRight = mod(activeCard + 1, landkreisSelection.length);
    
                let classProp = "";
    
                if (i === activeCard) {
                    classProp = "card card-active";
                } else if (i === indexRight) {
                    classProp = "card card-right";
                } else if (i === indexLeft) {
                    classProp = "card card-left";
                } else {
                    classProp = "card card-back";
                }

                return <Card lk={element.lk} section={element.section} key={i} classProp={classProp}/>
            });
        }

        else if (mode() == "lk") {
            list = cardSelection().map((element,i) =>
                <Card lk={element.lk} section={element.section} key={i} classProp="card card-ordered"/>
            );
        }

        else if (mode() == "shuffle"){
            //todo: editors pick / shuffle mode
            list = cardSelection().map((element,i) =>
                <Card lk={element.lk} section={element.section} key={i} classProp="card card-ordered"/>
            );
        }

        return list;
    }

    const [activeCard, setActiveCard] = useState(0);

    //modulo helper function
    const mod = (n, m) => {
        let result = n % m;
        return result >= 0 ? result : result + m;
    };

    //switch to next card in postcard view
    const nextCard = () => {
        setActiveCard((activeCard + 1) % cards().length);
    };

    return (
        <div className="card-collection">
            <h2>Card Collections</h2>

            <Select
                isMulti
                defaultValue={landkreisSelection}
                onChange={setLK}
                options={landkreise}
            />

            <h5>{landkreisSelection.map((elem) => elem.label)}</h5>

            <div style={{ visibility: (mode) == "comparison" ? "visible" : "hidden" }}>
                <Select
                    defaultValue={"energy"}
                    onChange={setSection}
                    options={sections}
                />

                <h5>{section.label}</h5>
            </div>

            {/* <div className="card-container" >
                {cards()}
            </div> */}
            {mode() == "comparison" && cards()}
            {mode() == "lk" && cards()}
            {/* {mode() == "shuffle" && cards()} */}
            {mode() == "postcard" && <div className="card-container">
                <div className="carousel">
                    {cards()}
                    <Card
                        key="9999"
                        classProp={"card"}
                        lk={"item.label"}
                        section="energy"
                    />
                </div>
            </div>}

            <div className="button-container">
                <button className="close-button">
                    <img
                        src={close}
                        className="close-button-img"
                        alt="close-button-img"
                    />
                </button>

                <button className="switch-button" onClick={nextCard}>
                    <img
                        src={switchCard}
                        className="switch-button-img"
                        alt="switch-button-img"
                    />
                </button>

                <button className="flip-button">
                    <img src={flip} className="flip-button-img" alt="flip-button-img" />
                </button>
            </div>
        </div>
    );
};

export default CardCollection;
