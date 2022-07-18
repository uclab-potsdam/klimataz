import React from "react";

const Side = ({ lk, section }) => {
  return (
    <div className="side">
      <h3>Grüße aus {lk.label}, mit der id {lk.value}!</h3>
      <h4>Es geht hier um {section}.</h4>
    </div>
  );
};

export default Side;
