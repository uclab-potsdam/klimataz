import React from "react";
import Side from "./Side";
import { useState, useEffect } from "react";

import LayoutControls from "../data/layout-controls.json";
import flip from "../img/buttons/flip.png";
import { mod } from "./helper";

const Card = ({ classProp, lk, section, clickOnCard, isThumbnail, isTopCard }) => {
  //const sides = ["side 1", "side 2", "side 3", "side 4"];
  //const sides = ["side 1", "side 2", "side 3"];

  const sides = LayoutControls[section].params;
  console.log(section)


  const [activeSide, setActiveSide] = useState(0);
  const [flipped, setFlipped] = useState(0);

  const layoutControls = LayoutControls[section].params;

  let index = 0;

  //TODO: flip first, after that switch the content on the side
  //maybe with gsap??

  useEffect(() => {
    index = mod(activeSide, sides.length);
    const currentVal = flipped ? false : true;
    setFlipped(currentVal);
  }, [activeSide]);

  const renderSide = function (cardSide) {
    return (
      <div className={cardSide}>
        <Side
          lk={lk}
          section={section}
          isThumbnail={isThumbnail}
          isTopCard={isTopCard}
          activeSide={mod(activeSide, sides.length)}
          layoutControls = {sides}
        />
        <button
          className="button flip"
          onClick={() => {
            setActiveSide(activeSide + 1);
          }}
        >
          <img src={flip} className="button img" alt="flip-button-img" />
        </button>
      </div>)
  }

  return (
    <div className={classProp}>
      {isThumbnail && (
        <div className="card-preview" onClick={clickOnCard}>
          <Side
            lk={lk}
            section={section}
            isThumbnail={isThumbnail}
            layoutControls = {sides}
            activeSide={0} //active side for thumbnail always first one
            layoutControls = {layoutControls}
          />
        </div>
      )}
      {!isThumbnail && (
        <div className={`side-container ${flipped ? "flip" : ""}`}>
          {renderSide("card-front")}
          {renderSide("card-back")}
        </div>
      )}
    </div>
  );
};

export default Card;
