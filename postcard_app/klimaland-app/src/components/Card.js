import React from "react";
import Side from "./Side";
import { useState, useEffect } from "react";
import flip from "../img/buttons/flip.png";
import { mod } from "./helper";

const Card = ({ classProp, lk, section, clickOnCard, isThumbnail }) => {
  const sides = ["side 1", "side 2", "side 3", "side 4"];

  const [activeSide, setActiveSide] = useState(0);
  const [flipped, setFlipped] = useState(0);

  let index = 0;

  useEffect(() => {
    index = mod(activeSide, sides.length);
    const currentVal = flipped ? false : true;
    setFlipped(currentVal);
    // console.log("side index: " + index);
    // console.log(flipped);
  }, [activeSide]);

  return (
    // <div className={classProp} onClick={handleClick}>
    <div>
      {isThumbnail && (
        <div className={classProp} onClick={clickOnCard}>
          <div className="card-preview">
            <Side
              lk={lk}
              section={section}
              activeSide={mod(activeSide, sides.length)}
            />
          </div>
        </div>
      )}
      {!isThumbnail && (
        <div className={classProp}>
          <div className={`side-container ${flipped ? "flip" : ""}`}>
            <div className="card-front">
              <Side
                lk={lk}
                section={section}
                activeSide={mod(activeSide, sides.length)}
              />
              <button
                className="button flip"
                onClick={() => {
                  setActiveSide(activeSide + 1);
                }}
              >
                <img src={flip} className="button img" alt="flip-button-img" />
              </button>
            </div>
            <div className="card-back">
              <Side
                lk={lk}
                section={section}
                activeSide={mod(activeSide, sides.length)}
              />
              <button
                className="button flip"
                onClick={() => {
                  setActiveSide(activeSide + 1);
                }}
              >
                <img src={flip} className="button img" alt="flip-button-img" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
