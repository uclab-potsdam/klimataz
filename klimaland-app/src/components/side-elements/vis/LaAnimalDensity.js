import React, { useRef } from 'react';
import { max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { min, uniq } from 'lodash';
import { formatNumber, useCardSize, mobileCheck } from '../../../helpers/helperFunc';

const LandDenisty = ({ currentData, locationLabel, cardNumber }) => {
  // getting sizes of container for maps
  const targetRef = useRef();
  const dimensions = useCardSize(targetRef, cardNumber);

  // inital variables
  const isMobile = dimensions.width <= 450 && mobileCheck(window);
  let marginWidth = Math.round(dimensions.width / 8);
  const marginHeight = Math.round(dimensions.height / 6);
  const marginBars = Math.round(dimensions.height / 50);
  const barWidth = Math.round(dimensions.height / 4.5);
  let barElements = [];

  if (isMobile) {
    marginWidth = Math.round(dimensions.width / 10);
  }

  if (currentData !== undefined) {
    const uniqueYears = uniq(currentData.data.map((d) => +d.year));

    // save data for under 2GV
    const dataUnderTwoGV = currentData.data.filter((d) => {
      if (d.value === null) d.value = 0;
      return d.column === 'davon_auf_unter_2_0_GV_ha';
    });

    const dataOverTwoGV = currentData.data.filter((d) => {
      if (d.value === null) d.value = 0;
      return (
        d.column === '2_0-2_5_GV_ha' ||
        d.column === '2_5-5_0_GV_ha' ||
        d.column === '5_0_und_mehr_GV_ha'
      );
    });

    // combine values with over 2 GV
    const accDataOverTwoGV = Object.values(
      dataOverTwoGV.reduce(
        (acc, { year, value }) => (
          ((acc[year] = acc[year] || { year, value: 0 }).value += value), acc
        ),
        {}
      )
    );
    //add column for description
    accDataOverTwoGV.forEach((data, d) => {
      data.column = 'ueber_2_GV_ha';
    });

    const domainX = [0, uniqueYears.length - 1];
    const domainY = [0, max([1, max(currentData.data.map((d) => d.value))])];

    const xScale = scaleLinear()
      .domain(domainX)
      .range([marginWidth * 2, dimensions.width - marginWidth * 2]);
    const yScale = scaleLinear()
      .domain(domainY)
      .range([0, (dimensions.height - marginHeight) / 1.35]);

    // map all parameters for animal group
    const mapBar = (data, d) => {
      const currentBar = {};
      const colorValue = 'fff';

      currentBar.id = data.column;
      currentBar.value = yScale(data.value);
      currentBar.valueTotal =
        formatNumber(data.value) === '0' ? 'unbekannt' : formatNumber(data.value);
      currentBar.year = +data.year;
      currentBar.x = xScale(uniqueYears.indexOf(parseInt(data.year)));
      currentBar.color = colorValue;

      // settings for labels on mobile
      if (isMobile) {
        currentBar.xLabel = 0;
        currentBar.widthLabel = barWidth;
        currentBar.heightLabel = 14;
      } else {
        currentBar.xLabel =
          barWidth - (currentBar.valueTotal.length > 4 ? currentBar.valueTotal.length * 7 : 25);
        currentBar.widthLabel =
          currentBar.valueTotal.length > 4 ? currentBar.valueTotal.length * 7 : 25;
        currentBar.heightLabel = 16;
      }

      return currentBar;
    };

    let overTwoGV = [];
    let underTwoGV = [];

    // call function above for each animal group
    dataUnderTwoGV.forEach((data, d) => {
      underTwoGV.push(mapBar(data, d));
    });

    accDataOverTwoGV.forEach((data, d) => {
      overTwoGV.push(mapBar(data, d));
    });

    barElements.push(underTwoGV);
    barElements.push(overTwoGV);
  }

  return (
    <div className="animal-density vertical-layout">
      <div className="description">
        <div className="title">
          <h4>
            Wie viele Tiere pro Fläche leben im Durchschnitt in{' '}
            <span className="locationLabel">{locationLabel}</span>?
          </h4>
        </div>
        <div className="caption">
          <p>
            Um die Anzahl verschiedener Tiere vergleichen zu können, gibt es die Großvieheinheit.
            Sie entspricht 500 kg, also in etwa einem Rind, 8 Schweinen, 10 Schafen oder 640
            Legehennen.
          </p>
        </div>
        <div className="legend">
          <svg height="200px">
            <text x="0" y="10">
              Großvieheinheiten pro Hektar
            </text>

            <g transform="translate(0, 18)">
              <g className="legend-item uber-label">
                <path
                  d="M17 0L17 17L-1.05984e-07 17L-7.62939e-06 6.60564e-07L17 0Z"
                  fill="#E14552"
                />
                <path
                  d="M-7.62939e-06 6.60564e-07L7.08333 0L9.91667 0L17 0L17 7.08333L17 9.91667L17 17L9.91667 17L7.08333 17L-1.05984e-07 17L8.12377e-07 9.91667L9.09514e-07 7.08333L-7.62939e-06 6.60564e-07Z"
                  fill="#E14552"
                />
                <path
                  d="M-0.176784 0.176778L3.36489 3.71844L3.71844 3.36489L0.176769 -0.176776L-0.176784 0.176778ZM3.36489 3.71844L8.32322 8.67678L8.67678 8.32322L3.71844 3.36489L3.36489 3.71844ZM8.32322 8.67678L13.2816 13.6351L13.6351 13.2816L8.67678 8.32322L8.32322 8.67678ZM13.2816 13.6351L16.8232 17.1768L17.1768 16.8232L13.6351 13.2816L13.2816 13.6351ZM16.8232 -0.176777L13.2816 3.36489L13.6351 3.71844L17.1768 0.176777L16.8232 -0.176777ZM13.2816 3.36489L8.32322 8.32322L8.67678 8.67678L13.6351 3.71844L13.2816 3.36489ZM8.32322 8.32322L3.36489 13.2816L3.71844 13.6351L8.67678 8.67678L8.32322 8.32322ZM3.36489 13.2816L-0.176777 16.8232L0.176777 17.1768L3.71844 13.6351L3.36489 13.2816ZM6.90656 -0.176777L3.36489 3.36489L3.71844 3.71844L7.26011 0.176777L6.90656 -0.176777ZM3.36489 3.36489L-0.176776 6.90656L0.176778 7.26011L3.71844 3.71844L3.36489 3.36489ZM-0.176776 10.0934L3.36489 13.6351L3.71844 13.2816L0.176777 9.73989L-0.176776 10.0934ZM3.36489 13.6351L6.90656 17.1768L7.26011 16.8232L3.71844 13.2816L3.36489 13.6351ZM10.0934 17.1768L13.6351 13.6351L13.2816 13.2816L9.73989 16.8232L10.0934 17.1768ZM13.6351 13.6351L17.1768 10.0934L16.8232 9.73989L13.2816 13.2816L13.6351 13.6351ZM17.1768 6.90656L13.6351 3.36489L13.2816 3.71844L16.8232 7.26011L17.1768 6.90656ZM13.6351 3.36489L10.0934 -0.176777L9.73989 0.176777L13.2816 3.71844L13.6351 3.36489ZM17 0L17.5 -1.94284e-08L17.5 -0.5L17 -0.5L17 0ZM17 17L17 17.5L17.5 17.5L17.5 17L17 17ZM-1.05984e-07 17L-0.5 17L-0.5 17.5L1.15293e-07 17.5L-1.05984e-07 17ZM-7.62939e-06 6.60564e-07L-7.87787e-06 -0.499999L-0.500008 -0.499999L-0.500008 6.79993e-07L-7.62939e-06 6.60564e-07ZM7.08333 0L7.08333 -0.5L7.08333 -0.5L7.08333 0ZM9.09514e-07 7.08333L0.500001 7.08333L0.500001 7.08333L9.09514e-07 7.08333ZM8.12377e-07 9.91667L0.500001 9.91667V9.91667L8.12377e-07 9.91667ZM17 9.91667L16.5 9.91667L16.5 9.91667L17 9.91667ZM17 7.08333L16.5 7.08333L17 7.08333ZM9.91667 0L9.91667 0.5L9.91667 0ZM16.5 1.94284e-08L16.5 17L17.5 17L17.5 -1.94284e-08L16.5 1.94284e-08ZM17 16.5L-3.27261e-07 16.5L1.15293e-07 17.5L17 17.5L17 16.5ZM0.5 17L0.499992 6.41136e-07L-0.500008 6.79993e-07L-0.5 17L0.5 17ZM-7.40812e-06 0.500001L17 0.5L17 -0.5L-7.85067e-06 -0.499999L-7.40812e-06 0.500001ZM7.08333 -0.5L-7.87787e-06 -0.499999L-7.38092e-06 0.500001L7.08333 0.5L7.08333 -0.5ZM0.500001 7.08333L0.499992 2.59666e-07L-0.500008 1.06146e-06L-0.499999 7.08333L0.500001 7.08333ZM0.5 17L0.500001 9.91667L-0.499999 9.91667L-0.5 17L0.5 17ZM0.500001 9.91667L0.500001 7.08333L-0.499999 7.08333L-0.499999 9.91667L0.500001 9.91667ZM7.08333 16.5L-3.27261e-07 16.5L1.15293e-07 17.5L7.08333 17.5L7.08333 16.5ZM17 16.5L9.91667 16.5L9.91667 17.5L17 17.5L17 16.5ZM9.91667 16.5L7.08333 16.5L7.08333 17.5L9.91667 17.5L9.91667 16.5ZM17.5 17L17.5 9.91667L16.5 9.91667L16.5 17L17.5 17ZM17.5 9.91667L17.5 7.08333L16.5 7.08333L16.5 9.91667L17.5 9.91667ZM17.5 7.08333L17.5 2.01848e-07L16.5 -2.01848e-07L16.5 7.08333L17.5 7.08333ZM17 -0.5L9.91667 -0.5L9.91667 0.5L17 0.5L17 -0.5ZM9.91667 -0.5L7.08333 -0.5L7.08333 0.5L9.91667 0.5L9.91667 -0.5Z"
                  fill="#484848"
                />
                <text x="23" y="13">
                  über 2
                </text>
              </g>
              <g transform="translate(0, 30)" className="legend-item unter-label">
                <path
                  d="M17 0L17 17L-1.05984e-07 17L-7.62939e-06 6.60564e-07L17 0Z"
                  fill="#FFBA4E"
                />
                <path d="M17 0L17 17L-1.05984e-07 17L4.76837e-07 0L17 0Z" fill="#FFBA4E" />
                <path
                  d="M-0.176776 0.176777L8.32322 8.67678L8.67678 8.32322L0.176777 -0.176777L-0.176776 0.176777ZM8.32322 8.67678L16.8232 17.1768L17.1768 16.8232L8.67678 8.32322L8.32322 8.67678ZM16.8232 -0.176777L8.32322 8.32322L8.67678 8.67678L17.1768 0.176777L16.8232 -0.176777ZM8.32322 8.32322L-0.176777 16.8232L0.176777 17.1768L8.67678 8.67678L8.32322 8.32322ZM17 0L17.5 -1.94284e-08L17.5 -0.5L17 -0.5L17 0ZM17 17L17 17.5L17.5 17.5L17.5 17L17 17ZM-1.05984e-07 17L-0.5 17L-0.5 17.5L1.15293e-07 17.5L-1.05984e-07 17ZM-7.62939e-06 6.60564e-07L-7.85067e-06 -0.499999L-0.500008 -0.499999L-0.500008 6.79993e-07L-7.62939e-06 6.60564e-07ZM4.76837e-07 0L2.74988e-07 -0.5H-0.5L-0.5 -2.1899e-07L4.76837e-07 0ZM17 17L17 17.5L17.5 17.5L17.5 17L17 17ZM17 0L17.5 2.01849e-07L17.5 -0.5L17 -0.5L17 0ZM-1.05984e-07 17L-0.5 17L-0.5 17.5L1.15293e-07 17.5L-1.05984e-07 17ZM16.5 1.94284e-08L16.5 17L17.5 17L17.5 -1.94284e-08L16.5 1.94284e-08ZM17 16.5L-3.27261e-07 16.5L1.15293e-07 17.5L17 17.5L17 16.5ZM0.5 17L0.499992 6.41136e-07L-0.500008 6.79993e-07L-0.5 17L0.5 17ZM-7.40812e-06 0.500001L17 0.5L17 -0.5L-7.85067e-06 -0.499999L-7.40812e-06 0.500001ZM17.5 17L17.5 2.01849e-07L16.5 -2.01848e-07L16.5 17L17.5 17ZM0.5 17L0.5 2.18991e-07L-0.5 -2.1899e-07L-0.5 17L0.5 17ZM17 -0.5H2.74988e-07L6.78685e-07 0.5H17L17 -0.5ZM17 16.5L-3.27261e-07 16.5L1.15293e-07 17.5L17 17.5L17 16.5Z"
                  fill="#484848"
                />
                <text x="23" y="13">
                  unter 2
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div className="visualization-container" ref={targetRef}>
        <svg className="land-animaldensity chart" width="100%" height="100%">
          <defs>
            {/* orange rectangle pattern */}
            <pattern
              id="diagonalHatch1"
              width="10"
              height="10"
              patternTransform="rotate(45)"
              patternUnits="userSpaceOnUse"
            >
              <rect fill="#FFBA4E" width="10" height="10" />
              <line x1="0" y1="0" x2="0" y2="10" stroke="black" />
            </pattern>
            <pattern
              id="diagonalHatch2"
              width="10"
              height="10"
              patternTransform="rotate(-45)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="10" stroke="black" />
            </pattern>

            {/* red rectangle pattern */}
            <pattern
              id="diagonalHatch3"
              width="5"
              height="5"
              patternTransform="rotate(45)"
              patternUnits="userSpaceOnUse"
            >
              <rect fill="#E14552" width="5" height="5" />
              <line x1="0" y1="0" x2="0" y2="5" stroke="black" />
            </pattern>
            <pattern
              id="diagonalHatch4"
              width="5"
              height="5"
              patternTransform="rotate(-45)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="5" stroke="black" />
            </pattern>
          </defs>
          <g className="bars">
            {barElements[0].map((bar, a) => {
              return (
                <g key={a} transform={`translate(${bar.x},${dimensions.height - marginHeight})`}>
                  <rect
                    x={-barWidth / 2}
                    y={-bar.value}
                    width={barWidth}
                    height={bar.value}
                    stroke={bar.color}
                    fill="url(#diagonalHatch1)"
                  />
                  <rect
                    x={-barWidth / 2}
                    y={-bar.value}
                    width={barWidth}
                    height={bar.value}
                    stroke={bar.color}
                    fill="url(#diagonalHatch2)"
                  />
                  <g>
                    <g transform={`translate(${-barWidth / 2}, ${marginBars - 5})`}>
                      <rect
                        className="labelCount"
                        x={bar.xLabel}
                        y={min([-20, -bar.value])}
                        width={bar.widthLabel}
                        height={bar.heightLabel}
                      />
                      <text
                        className="labelText"
                        x={barWidth - 2}
                        y={min([-8, -bar.value + 12])}
                        textAnchor="end"
                      >
                        {bar.valueTotal}
                      </text>
                    </g>
                    <text x="0" y="25" textAnchor="middle" className="year-label">
                      {bar.year}
                    </text>
                  </g>
                </g>
              );
            })}
            {barElements[1].map((bar, a) => {
              return (
                <g key={a} transform={`translate(${bar.x},${dimensions.height - marginHeight})`}>
                  <rect
                    x={-barWidth / 2}
                    y={-bar.value - max([16, barElements[0][a].value]) - marginBars}
                    width={barWidth}
                    height={bar.value}
                    stroke={bar.color}
                    fill="url(#diagonalHatch3)"
                  />
                  <rect
                    x={-barWidth / 2}
                    y={-bar.value - max([16, barElements[0][a].value]) - marginBars}
                    width={barWidth}
                    height={bar.value}
                    stroke={bar.color}
                    fill="url(#diagonalHatch4)"
                  />
                  <g
                    transform={`translate(${-barWidth / 2}, ${
                      -bar.value - max([16, barElements[0][a].value])
                    })`}
                  >
                    <rect
                      className="labelCount"
                      x={bar.xLabel}
                      y={min([-5, bar.value - 30])}
                      width={bar.widthLabel}
                      height={bar.heightLabel}
                    />
                    <text
                      className="labelText"
                      x={barWidth - 2}
                      y={min([7, bar.value - 18])}
                      textAnchor="end"
                    >
                      {bar.valueTotal}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default LandDenisty;
