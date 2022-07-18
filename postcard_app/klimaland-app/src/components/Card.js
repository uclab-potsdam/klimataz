import React from "react";
import Side from "./Side";

const Card = ({ classProp, lk, section, clickOnCard}) => {
  const handleClick = function(){
    console.log("clicked on card (child)")
    clickOnCard()
  }

  return (
    <div className={classProp} onClick={handleClick}>
      <Side lk={lk} section={section} />
    </div>
  );
};

export default Card;
