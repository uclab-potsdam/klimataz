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

  //TODO: flip first, after that switch the content on the side
  //maybe with gsap??

  useEffect(() => {
    index = mod(activeSide, sides.length);
    const currentVal = flipped ? false : true;
    setFlipped(currentVal);
  }, [activeSide]);

  return (
    // <div className={classProp} onClick={handleClick}>
    <div className={classProp}>
      {isThumbnail && (
          <div className="card-preview" onClick={clickOnCard}>
            <Side
              lk={lk}
              section={section}
              activeSide={0} //active side for thumbnail always first one
            />
          </div>
      )}
      {!isThumbnail && (
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
      )}
    </div>
  );
};

export default Card;
