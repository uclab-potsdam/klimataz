import Card from "./Card";
import Select from "react-select";
import { useState } from "react";
import flip from "../img/buttons/flip.png";
import switchCard from "../img/buttons/switch.png";
import shuffle from "../img/buttons/shuffle.png";
import close from "../img/buttons/close.png";

const CardCollection = () => {
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

    const [section, setSection] = useState([]);
    const [landkreis, setLK] = useState([]);

    //set mode depending on numbers of selecteed landkreise
    const mode = function(){
        let mode = "shuffle"
        if (landkreis.length ==3) {
            mode = "comparison"
        }
        else if (landkreis.length == 1) {
            mode = "lk"
        }
        else if (landkreis.length == 2) { //later this will be on click on a postcard
            mode = "postcard"
        }
        else {
            mode = "shuffle"
        }
    
        //check if for mistakes during setting the mode
        if (!["comparison", "shuffle", "LK", "postcard"].includes(mode)) {
            mode = "shuffle"
        }

        return mode;
    }


    //generate card objects dynamically depending on mode
    //to do: split function into section-lk pairs and generating the card objects
    const cards = function() {
        let list;
        
        if (mode() == "comparison") {
            let firstSection;
            if(section[0] == undefined) firstSection = "energy"; // set default value for section
            else { firstSection = section[0].value}
            
            list = landkreis.map((element,i) =>
                <Card lk={element.label} section={firstSection} key={i}/>
            );
        }

        else if (mode() == "postcard"){
            list = landkreis.map((element,i) => {
                let firstSection;
                if(section[0] == undefined) firstSection = "energy"; // set default value for section
                else { firstSection = section[0].value}
                
                const indexLeft = mod(activeCard - 1, landkreis.length);
                const indexRight = mod(activeCard + 1, landkreis.length);
    
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

                return <Card lk={element.label} section={firstSection} key={i} classProp={classProp}/>
            });
        }

        else if (mode() == "LK") {
            list = sections.map((element,i) =>
                <Card lk={landkreis[0].label} section={element.value} key={i}/>
            );
        }

        else if (mode() == "shuffle"){
            //todo: editors pick / shuffle mode
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
                defaultValue={landkreis}
                onChange={setLK}
                options={landkreise}
            />

            <h5>{landkreis.map((elem) => elem.label)}</h5>

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
            {mode() == "lk" && cards()}

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
