import React from 'react';
import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

import flipCard from '../img/buttons/flip.svg';
import { mod } from './helperFunc';

const Card = ({ classProp, sides, isThumbnail, children, handleSwitchBack, handleSwitchNext }) => {
  const [activeSide, setActiveSide] = useState(0);
  const [flipped, setFlipped] = useState(0);
  const [flipping, setFlipping] = useState(0);
  //TODO: flip first, after that switch the content on the side
  //maybe with gsap??

  useEffect(() => {
    const currentVal = flipped ? false : true;
    setFlipped(currentVal);
  }, [activeSide, flipping]);

  const swipeHandler = useSwipeable({
    onSwipedLeft: () => {
      handleSwitchBack();
    },
    onSwipedRight: () => {
      handleSwitchNext();
    },
  });

  const sideWithProps = function (rotation) {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          activeSide: mod(activeSide, sides.params.length),
          style: rotation,
          flipping: flipping
        });
      }
      return child;
    });
  };

  const renderSide = function (cardSide) {
    let rotation;
    if (cardSide === 'card-front') {
      rotation = { transform: 'rotateY(' + activeSide * 180 - 180 + 'deg)' };
    } else if (cardSide === 'card-back') {
      rotation = { transform: 'rotateY(' + activeSide * 180 + 'deg)' };
    } else {
      //card-preview
      console.log('card class for rotation is not set');
    }

    return (
      <div className={cardSide}>
        {sideWithProps(rotation)}
        <button
          className="button flip"
          onClick={() => {
            setFlipping(1);
            setActiveSide(activeSide + 1);
            setFlipping(0);
          }}
        >
          <img src={flipCard} className="button img" alt="flip-button-img" />
        </button>
      </div>
    );
  };

  //naive calc for initial small rotation
  const ranNum = Math.random() * (Math.round(Math.random()) ? 1 : -1);
  const previewRotation = 'rotate(' + ranNum * 5 + 'deg)';

  return (
    <div className={classProp}>
      {isThumbnail && <div className="card-preview"
        style={{ transform: previewRotation }}>{sideWithProps({})}</div>}
      {!isThumbnail && (
        <div
          className={`side-container ${flipped ? 'flip' : ''}`}
          style={{
            transform: 'rotateY(' + activeSide * 180 + 'deg)',
          }}
          {...swipeHandler}
        >
          {renderSide('card-front')}
          {renderSide('card-back')}
        </div>
      )}
    </div>
  );
};

export default Card;
