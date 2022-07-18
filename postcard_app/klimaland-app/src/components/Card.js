import React from "react";
import Side from "./Side";

const Card = ({ classProp, lk, section, key}) => {
  return (
    <div className={classProp}>
      <Side lk={lk} section={section} />
    </div>
  );
};

export default Card;
