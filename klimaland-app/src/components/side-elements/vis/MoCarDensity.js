import React, { useRef } from 'react';
import { max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { useCardSize, mobileCheck } from '../../../helpers/helperFunc';

const MoCarDensity = ({ currentData, locationLabel, isThumbnail, cardNumber }) => {
  // getting sizes of container for maps
  const targetRef = useRef();

  const dimensions = useCardSize(targetRef, cardNumber);

  //set default value to avoid errors
  let totalCars = 0;
  let hybridCars = 0;
  const carSquares = [];
  let xScale;
  let yScale;
  let rectWidth;
  let rectHeight;
  const isMobile = dimensions.width <= 350 && mobileCheck(window);

  if (currentData !== undefined) {
    // Data for rendered text
    const lastYear = max(currentData.data.map((d) => +d.year));
    const lastDataPoint = currentData.data.find(
      (d) => d.column === 'Gesamt' && +d.year === lastYear
    );
    const lastDataPointHy = currentData.data.find(
      (d) => d.column === 'Hybrid' && +d.year === lastYear
    );
    const lastDataPointEl = currentData.data.find(
      (d) => d.column === 'Elektro' && +d.year === lastYear
    );
    const rawValue = lastDataPoint.value / 10;
    const sumGreenCars = (lastDataPointHy.value + lastDataPointEl.value) / 10;
    totalCars = Math.round(rawValue);
    hybridCars = Math.round(sumGreenCars);

    // variables for calc matrix
    const inhabitantsBenchmark = 100;
    const biggestTotalCars = Math.max(totalCars, inhabitantsBenchmark);
    const carsInExcess = biggestTotalCars - inhabitantsBenchmark;

    // creating matrix of squares based on number of cars
    let rowThreshold = 10;
    let rowNum = 0;
    let columnNum = 0;
    for (let index = 0; index < inhabitantsBenchmark; index++) {
      const currentSquare = {};
      currentSquare.ownsCar = false;
      currentSquare.isHybrid = false;
      if (index >= rowThreshold) {
        rowThreshold = rowThreshold + 10;
        rowNum = rowNum + 1;
        columnNum = 0;
      }

      if (index < totalCars) {
        currentSquare.ownsCar = true;
      }

      currentSquare.row = rowNum;
      currentSquare.column = columnNum;
      columnNum = columnNum + 1;
      carSquares.push(currentSquare);
    }

    // second loop over matrix to determine excess for edge cases (see Wolfsburg)
    // and to consider hybrid cars as part of the total
    carSquares.forEach((d, i) => {
      if (i < carsInExcess) {
        d.isExcess = true;
      }

      if (i >= totalCars - hybridCars && i < totalCars) {
        d.isHybrid = true;
      } else if (
        carsInExcess !== 0 &&
        i >= inhabitantsBenchmark - hybridCars &&
        i < inhabitantsBenchmark
      ) {
        d.isHybrid = true;
      }
    });

    //scales and margins, using d3 as utility
    const marginWidth = Math.ceil(dimensions.width / 5);
    const marginHeight = Math.ceil(dimensions.height / 5.5);

    rectWidth = Math.ceil((dimensions.width - marginWidth * 2) / 10);
    rectHeight = Math.ceil((dimensions.width - marginWidth * 1.55) / 10);
    xScale = scaleLinear()
      .domain([0, max(carSquares.map((d) => d.row))])
      .range([marginWidth - 50, dimensions.width - marginWidth - 10]);
    yScale = scaleLinear()
      .domain([0, max(carSquares.map((d) => d.column))])
      .range([marginHeight - 50, dimensions.height - marginHeight + 25]);
  }

  return (
    <div
      className={`car-density vertical-layout ${isThumbnail ? 'is-thumbnail' : ''} ${
        isMobile ? 'is-mobile' : ''
      }`}
    >
      <div className="description">
        <div className="title">
          <h4>
            In <span className="locationLabel">{locationLabel}</span> kommen auf 100 Einwohner*innen{' '}
            <span className="first-value">{totalCars}</span> Autos. Davon sind{' '}
            <span className="second-value">{hybridCars}</span> mit Hybrid- oder Elektroantrieb.
          </h4>
        </div>
        <div className="legend"></div>
      </div>
      {currentData !== undefined && currentData.data !== undefined && (
        <div className="visualization-container" ref={targetRef}>
          <svg
            className={`mobility-cars chart ${isThumbnail ? 'thumbnail-chart' : 'active-chart'}`}
          >
            <g className="cars-container">
              <g className="grid">
                {carSquares.map(function (sq, s) {
                  return (
                    <g
                      key={`${s}-grid`}
                      className="without-car"
                      transform={`translate(${xScale(sq.row)}, ${yScale(sq.column)})`}
                    >
                      <rect
                        width={rectWidth}
                        height={rectHeight}
                        rx="3"
                        x={!sq.ownsCar ? '10' : '0'}
                        y={!sq.ownsCar ? '10' : '0'}
                      />
                    </g>
                  );
                })}
              </g>
              <g className="gridded-data">
                {carSquares.map((sq, s) => {
                  if (sq.isHybrid) {
                    return (
                      <g
                        key={`${s}-hybrid`}
                        className="hybrid-cars"
                        transform={`translate(${xScale(sq.row)}, ${yScale(sq.column)})`}
                        rx="5px"
                      >
                        <rect
                          width={rectWidth}
                          height={rectHeight}
                          fill="#F6A219"
                          rx="3"
                          x="-3"
                          y="-3"
                        />
                      </g>
                    );
                  }
                  if (sq.ownsCar) {
                    return (
                      <g
                        key={`${s}-car`}
                        className="owns-car"
                        transform={`translate(${xScale(sq.row)}, ${yScale(sq.column)})`}
                      >
                        <rect
                          width={rectWidth}
                          height={rectHeight}
                          fill="#FF7B7B"
                          rx="3"
                          x="-3"
                          y="-3"
                        />
                      </g>
                    );
                  } else {
                    return null;
                  }
                })}
              </g>
              <g className="gridded-data is-excess">
                {carSquares.map(function (sq, s) {
                  if (sq.isExcess) {
                    return (
                      <g
                        key={`${s}-excess`}
                        className="is-excess owns-car"
                        transform={`translate(${xScale(sq.row)}, ${yScale(sq.column)})`}
                      >
                        <rect
                          width={rectWidth}
                          height={rectHeight}
                          rx="3"
                          fill="#FF7B7B"
                          x="-6"
                          y="-6"
                        />
                      </g>
                    );
                  } else {
                    return null;
                  }
                })}
              </g>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};

export default MoCarDensity;
