import React from "react";
import Side from "./Side";

const Card = ({ lk, section }) => {
  return (
    <div className="card">
      <Side lk={lk} section={section} />
    </div>
  );
};

export default Card;
