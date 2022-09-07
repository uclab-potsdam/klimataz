import React, { useRef, useLayoutEffect, useState } from 'react';

const LandDenisty = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {
  // getting sizes of container for maps
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      });
    }
  }, []);

  // inital variables
  const marginWidth = Math.round(dimensions.width / 10);
  const marginHeight = Math.round(dimensions.height / 10);
  const radius = isThumbnail ? Math.ceil(dimensions.width / 80) : Math.ceil(dimensions.width / 100);

  return (
    <div className={`animal-density vertical-layout ${isThumbnail ? 'is-thumbnail' : ''}`}>
      <div className="description">
        <div className="title">
          <h3>Wie viele Tiere pro Fläche leben im Durchschnitt in Deutschland?</h3>
        </div>
      </div>
      <div className="visualization-container" ref={targetRef}>
        <svg className="chart" width="100%" height="100%">
          <text x="100" y="100">
            Hello this will be the chart
          </text>
        </svg>
      </div>
    </div>
  );
};

export default LandDenisty;
