import React, { useRef, useLayoutEffect, useState } from 'react';

const Land = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {
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
    <div className={`animal-count horizontal-bottom-layout ${isThumbnail ? 'is-thumbnail' : ''}`}>
      <div className="visualization-container" ref={targetRef}>
        <svg className="chart" width="100%" height="100%">
          <g className="legend" transform={`translate(${marginWidth / 2}, ${marginHeight / 1.5})`}>
            <circle className="wenigerTiere" cx="0" cy="0" r={radius} />
            <text x={radius + 5} y={radius / 2}>
              weniger Tiere
            </text>
            <circle className="mehrTiere" cx="120" cy="0" r={radius} />
            <text x={radius + 125} y={radius / 2}>
              mehr Tiere
            </text>
            <circle className="vorherigeZaehlung" cx="240" cy="0" r={radius} />
            <text x={radius + 245} y={radius / 2}>
              als im Vergleich zur vorherigen Zählung
            </text>
          </g>
        </svg>
      </div>
      <div className="description">
        <div className="title">
          <h3>Entwicklung der Anzahl an Rindern, Schweinen und Schafen in {lkData}.</h3>
        </div>
      </div>
    </div>
  );
};

export default Land;
