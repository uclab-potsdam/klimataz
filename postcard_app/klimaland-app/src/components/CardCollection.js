import Card from "./Card";
import { useState } from "react";
import flip from "../img/buttons/flip.png";
import switchCard from "../img/buttons/switch.png";
//import shuffle from "../img/buttons/shuffle.png";
import close from "../img/buttons/close.png";

const CardCollection = ({mode,cardSelection,postcardView}) => {


    const clickHandler = () => {
        postcardView = true;
        console.log('click',postcardView);
    }


    //generate card objects dynamically depending on mode
    const cards = function() {
        let list;
        let classProp;

        if (postcardView){
            list = cardSelection.map((element,i) => {                
                const indexLeft = mod(activeCard - 1, cardSelection.length);
                const indexRight = mod(activeCard + 1, cardSelection.length);
    
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

            console.log("postcardview cards generated")
            return list;
        }

        else if (mode === "comparison") {
            classProp = "card card-ordered"
        }

        else if (mode === "lk") {
            classProp = "card card-ordered"
        }

        else if (mode === "shuffle"){
            //todo: editors pick / shuffle mode
            classProp = "card card-ordered"
        }

        list = cardSelection.map((element,i) =>
            <Card lk={element.lk} section={element.section} key={i} classProp={classProp} clickOnCard={clickHandler}/>
        );

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
            
            {/* <div className="card-container" >
                {cards()}
            </div> */}
            {mode === "comparison" && !postcardView && <div className="card-container">  {cards()} </div>}
            {mode === "lk" && !postcardView && <div className="card-container">  {cards()} </div>}
            {/* {mode() === "shuffle" &&!postcardView && cards()} */}
            {postcardView && <div className="card-container">
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
