import React, { useState } from "react";
import Front from "./Front";
import Back from "./Back";
import flip from "../data/images/buttons/flip.svg";

const Card = () => {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <div className={`card-container ${activeCard ? "flip" : ""}`}>
      <div className="card-front">
        <Front />
        <button
          className="button-flip"
          onClick={() => setActiveCard(!activeCard)}
        >
          <img
            src={flip}
            className="flip-button-img"
            alt="flip-button"
            width="80%"
          />
        </button>
      </div>
      <div className="card-back">
        <Back />
        <button
          className="button-flip"
          onClick={() => setActiveCard(!activeCard)}
        >
          <img
            src={flip}
            className="flip-button-img"
            alt="flip-button"
            width="80%"
          />
        </button>
      </div>
    </div>
  );
};

export default Card;
