import React from "react";
import Locator from "./side-elements/Locator";

const Side = ({ lk, section, activeSide }) => {
  return (
    <div className="side">
      <h3>
        Grüße aus {lk.label}, mit der id {lk.value}!
      </h3>
      <h4>Es geht hier um {section}.</h4>
      <p>Seite {activeSide}</p>
      <Locator />
    </div>
  );
};

export default Side;
