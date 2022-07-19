import React from "react";
import Text from './side-elements/Text.js';
import Locator from "./side-elements/Locator";

const Side = ({ lk, section, activeSide }) => {
  console.log('select', lk)
  return (
    <div className="side-inner">
      <Text {...{ lk, section, activeSide }} />
      <Locator {...{lk}}/>
    </div>
  );
};

export default Side;
