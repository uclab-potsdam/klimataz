import React from "react";
import Side from "./Side";

const Card = ({lk, section}) => {
  return (
    <div className="card">
      <h3>Grüße aus {lk}!</h3>
      <h4>Es geht hier um {section}.</h4>

      <Side />
    </div>
  );
};

export default Card;
