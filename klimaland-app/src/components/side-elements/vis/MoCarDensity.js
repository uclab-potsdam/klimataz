import React, { useRef, useLayoutEffect, useState } from 'react';
import { max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { useCardSize } from '../../../helpers/helperFunc';

const MoCarDensity = ({
  currentData,
  currentIndicator,
  currentSection,
  locationLabel,
  isThumbnail,
  cardNumber,
}) => {
  // getting sizes of container for maps
  const targetRef = useRef();

  const dimensions = useCardSize(targetRef, cardNumber);

  window.mobileCheck = function () {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw(n|u)|c55\/|capi|ccwa|cdm|cell|chtm|cldc|cmd|co(mp|nd)|craw|da(it|ll|ng)|dbte|dcs|devi|dica|dmob|do(c|p)o|ds(12|d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(|_)|g1 u|g560|gene|gf5|gmo|go(\.w|od)|gr(ad|un)|haie|hcit|hd(m|p|t)|hei|hi(pt|ta)|hp( i|ip)|hsc|ht(c(| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i(20|go|ma)|i230|iac( ||\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|[a-w])|libw|lynx|m1w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|mcr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|([1-8]|c))|phil|pire|pl(ay|uc)|pn2|po(ck|rt|se)|prox|psio|ptg|qaa|qc(07|12|21|32|60|[2-7]|i)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h|oo|p)|sdk\/|se(c(|0|1)|47|mc|nd|ri)|sgh|shar|sie(|m)|sk0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h|v|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl|tdg|tel(i|m)|tim|tmo|to(pl|sh)|ts(70|m|m3|m5)|tx9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };

  //set default value to avoid errors
  let totalCars = 0;
  let hybridCars = 0;
  const carSquares = [];
  let xScale;
  let yScale;
  let rectWidth;
  let rectHeight;
  const isMobile = dimensions.width <= 350 && window.mobileCheck(window);
  const mobileThreshold = isMobile ? 8 : 10;

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

      if (index <= totalCars) {
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

      if (i > totalCars - hybridCars && i <= totalCars) {
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
    const marginWidth = Math.ceil(dimensions.width / 6);
    const marginHeight = Math.ceil(dimensions.height / 5);

    rectWidth = Math.ceil((dimensions.width - marginWidth * 2) / 10);
    rectHeight = Math.ceil((dimensions.width - marginWidth * 2) / mobileThreshold);
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
            <span>{locationLabel}</span>: Auf 100 Einwohner*innen kommen{' '}
            <span className="first-value">{totalCars}</span> Autos. Davon haben{' '}
            <span className="second-value">{hybridCars}</span> Hybrid- oder Elektroantrieb.
          </h4>
        </div>
        <div className="legend"></div>
      </div>
      {currentData !== undefined && currentData.data !== undefined && (
        <div className="visualization-container" ref={targetRef}>
          <svg className={`chart ${isThumbnail ? 'thumbnail-chart' : 'active-chart'}`}>
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
                      >
                        <rect width={rectWidth} height={rectHeight} fill="#F6A219" x="-3" y="-3" />
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
                        <rect width={rectWidth} height={rectHeight} fill="#FF7B7B" x="-3" y="-3" />
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
                        <rect width={rectWidth} height={rectHeight} fill="#FF7B7B" x="-6" y="-6" />
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
