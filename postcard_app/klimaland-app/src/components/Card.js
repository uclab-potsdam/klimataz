import React from "react";
import Side from "./Side";
import { useState, useEffect } from "react";
import flip from "../img/buttons/flip.png";
import { mod } from "./helper";

const Card = ({ classProp, lk, section, clickOnCard }) => {
  const handleClick = function () {
    console.log("clicked on card (child)");
    // clickOnCard();
  };

  const sides = ["side 1", "side 2", "side 3", "side 4"];

  const [activeSide, setActiveSide] = useState(0);
  const [flipped, setFlipped] = useState(0);

  let index = 0;

  useEffect(() => {
    index = mod(activeSide, sides.length);
    const currentVal = flipped ? false : true;
    setFlipped(currentVal);
    console.log("side index: " + index);
    console.log("flipped");
  }, [activeSide]);

  return (
    // <div className={classProp} onClick={handleClick}>
    <div className={classProp}>
      <div className={`side-container ${flipped ? "flip" : ""}`}>
        <div className="card-front">
          <Side
            lk={lk}
            section={section}
            activeSide={mod(activeSide, sides.length)}
          />
          <button
            className="flip-button"
            onClick={() => {
              setActiveSide(activeSide + 1);
            }}
          >
            <img src={flip} className="flip-button-img" alt="flip-button-img" />
          </button>
        </div>
        <div className="card-back">
          <Side
            lk={lk}
            section={section}
            activeSide={mod(activeSide, sides.length)}
          />
          <button
            className="flip-button"
            onClick={() => {
              setActiveSide(activeSide + 1);
            }}
          >
            <img src={flip} className="flip-button-img" alt="flip-button-img" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
