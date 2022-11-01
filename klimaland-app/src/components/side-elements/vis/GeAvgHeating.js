import React, { useRef, useLayoutEffect, useState } from 'react';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { extent } from 'd3-array';
import { stack } from 'd3-shape';
import { useCardSize, mobileCheck } from '../../../helpers/helperFunc';

const GeAvgHEating = ({
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

  const [higlightedBar, setHiglightedBar] = useState('');

  let yScale;
  let xScale;
  let barChartData;
  const classesData = [];
  const width = dimensions.width;
  const height = dimensions.height;
  const isMobile = width <= 450 && mobileCheck(window);
  const barsSize = isMobile ? width / 50 : width / 40;
  const mobileThreshold = isMobile ? 25 : 0;
  const marginWidth = Math.round(width / 25);
  const marginHeight = Math.round(height / 10);
  const energyClasses = { 'A+': 25, A: 50, B: 100, C: 125, D: 150, E: 200, F: 225, G: 250 };
  const classesKeys = Object.keys(energyClasses);
  const classesColors = [
    '#008088',
    '#2C8284',
    '#438581',
    '#CE9D46',
    '#EDA128',
    '#F3954D',
    '#F18B63',
    '#E95850',
  ];

  let switchHighlightedBar = function (i) {
    if (currentData !== undefined) {
      // console.log(id)
      setHiglightedBar(i);
    }
  };

  if (currentData !== undefined) {
    currentData.data.forEach((d) => {
      if (d.year.length === 2) {
        d.year = d.year.replace(/^/, '20');
      }
    });

    const domainX = extent(
      currentData.data.map((d) => {
        return +d.year;
      })
    );
    yScale = scaleLinear().domain([250, 0]).range([height, marginHeight]);
    xScale = scaleLinear()
      .domain(domainX)
      .range([marginWidth + mobileThreshold, width - (marginWidth * 4.5 + mobileThreshold / 2)]);
    const colorScale = scaleOrdinal().domain(classesKeys).range(classesColors);

    const stacks = stack().keys(classesKeys)([energyClasses]);
    let prevClass = 'A+';
    stacks.forEach((bar, b) => {
      const data = bar[0];
      const label = data.data[bar.key];
      const y1 = b !== 0 ? yScale(data.data[prevClass]) : 25;
      const y2 = yScale(data.data[bar.key]);
      classesData.push({
        klass: bar.key,
        y1,
        y2,
        yMid: b !== 0 ? height - (y1 + y2) / 2 + 5 : height - y2 + y2 / 3,
        fill: colorScale(bar.key),
        label,
        keyColor: bar.key === 'A' || bar.key === 'A+' || bar.key === 'B' ? 'white' : '#484848',
      });
      prevClass = bar.key;
    });

    barChartData = currentData.data.map((bar, b) => {
      let enKlass = 'none';
      classesKeys.forEach((klass, k) => {
        if (k !== 0) {
          const prevKlass = classesKeys[k - 1];

          if (bar.value <= energyClasses[klass] && bar.value > energyClasses[prevKlass]) {
            enKlass = klass;
          }
        }
      });

      return {
        year: xScale(+bar.year),
        yearLabel: bar.year,
        valueLabel: bar.value,
        kwh: yScale(bar.value),
        fill: colorScale(enKlass),
        enKlass,
      };
    });
  }

  return (
    <div className={`avg-heating ${isThumbnail ? 'is-thumbnail' : ''}`}>
      <div className="visualization-container" ref={targetRef}>
        <svg className="building-avg chart" transform="translate(0, 20)">
          <clipPath id="backgroundRect">
            <rect
              x={marginWidth}
              y="0%"
              width={width - marginWidth * 2}
              height={height - marginHeight}
              stroke="black"
              rx="10"
            />
          </clipPath>
          <g className="clipped-container" clipPath="url(#backgroundRect)">
            <g className="chart-axis">
              <g className="bar-axis">
                {classesData.map((klass, k) => {
                  return (
                    <g key={k}>
                      <rect
                        x={marginWidth}
                        y={height - klass.y2}
                        width="30"
                        height={klass.y2 - klass.y1}
                        fill={klass.fill}
                      />
                      <text
                        x={marginWidth + 15}
                        y={klass.yMid}
                        textAnchor="middle"
                        fill={klass.keyColor}
                      >
                        {klass.klass}
                      </text>
                      <text
                        x={width - marginWidth - 5}
                        y={height - klass.y2 + 15}
                        textAnchor="end"
                        fill="#484848"
                      >
                        {klass.label}
                      </text>
                    </g>
                  );
                })}
              </g>
              {classesKeys.map((klass, k) => {
                return (
                  <g key={k} transform={`translate(0, ${height - yScale(energyClasses[klass])})`}>
                    <line x1="0" x2={width} y1="0" y2="0" stroke="#484848" />
                  </g>
                );
              })}
            </g>
            <g className="chart-bars" transform={`translate(${marginWidth + 10}, 0)`}>
              {barChartData.map((bar, b) => {
                return (
                  <g
                    key={b}
                    className={`single-bar ${
                      higlightedBar === b || higlightedBar === '' ? 'in-focus' : 'no-focus'
                    }`}
                    transform={`translate(${bar.year}, 0)`}
                    onMouseEnter={() => switchHighlightedBar(b)}
                    onMouseLeave={() => switchHighlightedBar('')}
                  >
                    <rect
                      x="0.5"
                      y={height - bar.kwh}
                      height={bar.kwh - marginHeight}
                      width={barsSize - 1}
                      fill={bar.fill}
                      stroke={bar.fill}
                      fillOpacity="20%"
                    />
                    <rect
                      x="0"
                      y={height - bar.kwh - 5}
                      width={barsSize}
                      height="10"
                      fill={bar.fill}
                      rx="5"
                    />
                    <g
                      transform={`translate(-25, ${height - bar.kwh - 30})`}
                      className="interactive-labels"
                    >
                      <rect x="-1" y="-11" width="70" height="15" rx="1" stroke={bar.fill} />
                      <text x="0" y="0">
                        {Math.round(bar.valueLabel)} kWh/m²
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
            <rect
              x={marginWidth + 0.5}
              y="0.5"
              width={width - marginWidth * 2 - 1}
              height={height - marginHeight - 1}
              stroke="#484848"
              fill="none"
              rx="10"
            />
          </g>
          <g className="non-clipped-elements">
            {barChartData.map((label, l) => {
              return (
                <g key={l} transform={`translate(${label.year + 50}, 0)`}>
                  <text
                    x="0"
                    y={height - marginHeight + 15}
                    textAnchor="middle"
                    transform={isMobile ? `rotate(90, 0, ${height - marginHeight + 15})` : ''}
                  >
                    {label.yearLabel}
                  </text>
                </g>
              );
            })}

            <text
              className="measure-label"
              x={width - marginWidth + 10}
              y={height - marginHeight + 15}
              textAnchor="end"
            >
              kWh/m²
            </text>
          </g>
        </svg>
      </div>
      <div className="description">
        <div className="title">
          <h4>
            Wie hoch ist der durchschnittliche Verbrauch an Energie fürs Heizen bei einem
            Privathaushalt in
            <span className="locationLabel"> {locationLabel}</span>?
          </h4>
        </div>
      </div>
    </div>
  );
};

export default GeAvgHEating;
