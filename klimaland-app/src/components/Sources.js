import React from 'react';
import closeCard from '../img/buttons/close.svg';
import { useState } from 'react';

const Sources = () => {
  const [showSources, setshowSources] = useState(false);

  return (
    <div className="inner-button">
      <button
        className="sources"
        onClick={() => {
          showSources ? setshowSources(false) : setshowSources(true);
        }}
      >
        {console.log(showSources)}
        {/* <h2 className="info-i">i</h2> */}
        <img src={closeCard} className="button img" alt="close-button-img" />
      </button>
    </div>
  );
};

export default Sources;
