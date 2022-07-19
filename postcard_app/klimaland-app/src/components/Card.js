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

  const [activeSide, setActiveSide] = useState(0);

  useEffect(() => {
    console.log("flip card: " + activeSide);
  }, [activeSide]);

  return (
    // <div className={classProp} onClick={handleClick}>
    <div className={classProp}>
      {/* <Side lk={lk} section={section} /> */}

      <button
        className="flip-button"
        onClick={() => {
          setActiveSide(activeSide + 1);
        }}
      >
        <img src={flip} className="flip-button-img" alt="flip-button-img" />
      </button>
    </div>
  );
};

export default Card;
