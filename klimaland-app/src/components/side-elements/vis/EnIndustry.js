import React, { useRef, useLayoutEffect, useState } from 'react';
import { stack, stackOffsetSilhouette, stackOrderAscending, curveMonotoneX, area } from 'd3-shape';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { uniq } from 'lodash';
import { max, extent } from 'd3-array';
import { formatNumber, useCardSize } from './../../../helpers/helperFunc';

const EnIndustry = ({
  currentData,
  currentIndicator,
  currentSection,
  locationLabel,
  isThumbnail,
  footnote,
  cardNumber,
}) => {
  const colorArray = [
    '#FFD5C8', // Erdgas
    '#007F87', // Erneuerbare Energien
    '#FF9B7B', // Heizöl
    '#E14552', // Kohle
    '#DDA0DD', // Sonstige Energieträger
    '#2A4D9C', // Strom
    '#5F88C6', // Wärme
    '#778899', // Geheim
  ];

  // getting sizes of container for maps
  const targetRef = useRef();
  const dimensions = useCardSize(targetRef, cardNumber);

  const [highlighedStream, setHighlightedStream] = useState('');
  const [activeLabel, setactiveLabel] = useState('');

  //   const [currentId, setCurrentId] = useState('');

  // inital variables
  const marginWidth = 0;
  const marginHeight = 0;
  // const paddingHeight = 15;
  let xAxisElements = [];
  let streamEle = [];
  let scaleCategory = function () {
    return undefined;
  };
  let lastYear = '?';
  let percRenewables = 0;
  let secretFootnote = 'In ' + locationLabel[0] + ' ist dieser Vebrauch geheim. ';
  let showBundeslandForLK = false;

  let switchHighlightedStream = function (id) {
    if (currentData !== undefined && currentData.data !== undefined) {
      setHighlightedStream(id);
    }
  };

  let switchActiveLabel = function (index) {
    if (currentData !== undefined && currentData.data !== undefined) {
      setactiveLabel(index);
    }
  };

  if (currentData !== undefined) {
    // parameters for description text
    const lastDataPoint = currentData.data.slice(-1);
    lastYear = lastDataPoint[0]['year'];
    const lastRenValue = currentData.data.filter((d) => {
      return d.column === 'Anteil_Erneuerbar' && d.year === '2020';
    });

    // filteredData is used exclusively to generate domains and for iterating over years,
    // removes all null values and keep only valid years (so streams do not start from 0)
    const filteredData = currentData.data.filter((d) => d.value !== null)

    percRenewables = lastRenValue[0].value !== null ? lastRenValue[0].value.toFixed(1) : 0;
    //if locationLabel[0] !== locationLabel[1] => this is a bundesland
    showBundeslandForLK = !currentData.regional && locationLabel[0] !== locationLabel[1];

    // get all energy sources and filter out "insgesamt" and "Anteil_Erneuerbar"
    const uniqueEnergySourceAll = uniq(currentData.data.map((d) => d.column));
    const uniqueEnergySourceFiltered = uniqueEnergySourceAll.filter((category) => {
      return (
        category !== 'insgesamt' &&
        category !== 'Anteil_Erneuerbar' &&
        category !== 'Anteil_Geheim' &&
        category !== 'has_regional'
      );
    });

    // setup domains for scaling
    const domainX = extent(currentData.data.map((d) => +d.year));
    const xScale = scaleLinear()
      .domain(domainX)
      .range([marginWidth, dimensions.width - marginWidth]);
    const domainY = [
      -max(currentData.data.map((d) => d.value / 2)),
      max(currentData.data.map((d) => d.value / 2)),
    ];
    const yScale = scaleLinear().domain(domainY).range([dimensions.height, marginHeight]).nice();

    // map source to color
    scaleCategory = scaleOrdinal().domain(uniqueEnergySourceFiltered).range(colorArray);

    // get unique years from data
    const uniqueYears = uniq(currentData.data.map((d) => +d.year));

    // create elements for horizontal axis, plus labels
    xAxisElements = uniqueYears.map((year, a) => {
      return {
        label: year,
        x: xScale(year),
      };
    });

    // create area for streams
    const areaGen = area()
      .x((d) => xScale(d.data.year))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(curveMonotoneX);

    // prepare data for stacking
    const stackData = [];
    uniqueYears.forEach((year, y) => {
      const currentYearData = currentData.data.filter((d) => +d.year === year);

      const el = {};
      currentYearData.map((d) => {
        el.year = d.year;
        const nameOfEnergySource = d.column;
        return (el[nameOfEnergySource] = d.value !== null ? d.value : 0);
      });
      stackData.push(el);
    });

    // create stacks
    const stacks = stack()
      .keys(uniqueEnergySourceFiltered)
      .order(stackOrderAscending)
      .offset(stackOffsetSilhouette);
    const stackedSeries = stacks(stackData);

    // stream graph
    streamEle = stackedSeries.map((stream, s) => {
      const maxStreamValue = max(
        stackData.map((d) => {
          return d['year'] !== 1992 && +d['year'] !== 2020 ? d[stream.key] : 0;
        })
      );

      let yearOfMax = 0;
      let indexOfMax = 0;

      stackData.forEach((d, i) => {
        if (d[stream.key] === maxStreamValue) {
          yearOfMax = d.year;
          indexOfMax = i;
        }
      });

      const labelRects = [];
      for (let index = 0; index < stream['length']; index++) {
        const scaledFloor = yScale(stream[index][0]);
        const scaledCeil = yScale(stream[index][1]);
        const year = stackData[index].year;
        const value = stackData[index][stream.key];
        let x = xScale(year);
        if (x + 50 > dimensions.width - marginWidth) x -= 20;

        const y = Math.abs(scaledCeil);
        const yValue = Math.abs(scaledFloor - (scaledFloor - scaledCeil) / 2);

        let xValue = xScale(year);
        if (xValue + 40 > dimensions.width - marginWidth) {
          xValue -= 65;
        } else if (xValue + 50 > dimensions.width - marginWidth) {
          xValue -= 30;
        }

        const height = Math.abs(scaledCeil - scaledFloor);
        const labelEl = {
          x,
          y,
          xValue,
          yValue,
          height,
          value,
        };

        labelRects.push(labelEl);
      }

      return {
        klass: stream.key.substring(0, 3) + '-stream',
        id: stream.key,
        fill: scaleCategory(stream.key),
        path: areaGen(stream),
        xPos: xScale(yearOfMax),
        labels: labelRects,
        yPos: yScale(stream[indexOfMax][0] - (stream[indexOfMax][0] - stream[indexOfMax][1]) / 2),
        height: yScale(stream[indexOfMax][0] - stream[indexOfMax][1]),
        width: stream.key.length,
        threshold:
          highlighedStream === stream.key || (maxStreamValue > 50000 && highlighedStream === ''), //Fixed value for now, maybe make it dynamic?
        maxStreamValue,
      };
    });
  }

  return (
    <div
      className={`energy-industry horizontal-bottom-layout ${isThumbnail ? 'is-thumbnail' : ''}`}
    >
      <div className="visualization-container" ref={targetRef}>
        <svg className="chart" width="100%" height="100%">
          <g className="axis">
            {xAxisElements.map((axis, a) => {
              if (a % 2 !== 0) {
                return (
                  <g key={a} transform={`translate(${axis.x + 1}, 0)`}>
                    <line
                      x1="0"
                      x2="0"
                      y1={marginHeight}
                      y2={dimensions.height - marginHeight}
                      stroke="black"
                    />
                    {/* // YEAR */}
                    <text
                      x="-18"
                      y={marginHeight + 15}
                      textAnchor="middle"
                      transform={
                        dimensions.width <= 350 ? `rotate(-90, -10, ${marginHeight + 10})` : ''
                      }
                    >
                      {axis.label}
                    </text>
                  </g>
                );
              } else {
                return null;
              }
            })}
          </g>
          <g className="streams-container">
            {streamEle.map((stream, s) => {
              return (
                <g
                  key={s}
                  className={`stream ${stream.klass}`}
                  onMouseEnter={() => switchHighlightedStream(stream.id)}
                  onMouseLeave={() => switchHighlightedStream('')}
                >
                  <path className={`path ${stream.id}`} d={stream.path} fill={stream.fill} />
                </g>
              );
            })}
          </g>
          <g className="streams-labels-container">
            {streamEle.map((label, l) => {
              return (
                <g key={l}>
                  <g className="label">
                    <foreignObject
                      className={label.threshold ? 'visible' : 'invisible'}
                      x={label.xPos - label.width * 2 > 0 ? label.xPos - label.width * 2 : 0}
                      y={label.yPos - 8}
                      width="1"
                      height="1"
                    >
                      <div xmlns="http://www.w3.org/1999/xhtml" className={label.klass}>
                        <p>{label.id}</p>
                      </div>
                    </foreignObject>
                  </g>
                </g>
              );
            })}
          </g>
          <g className="years-labels-container">
            {streamEle.map((stream, s) => {
              return (
                <g
                  key={s}
                  className="stream-labels"
                  onMouseEnter={() => switchHighlightedStream(stream.id)}
                  onMouseLeave={() => switchHighlightedStream('')}
                >
                  {stream.labels.map((label, l) => {
                    return (
                      <g key={l}>
                        <rect
                          x={label.x}
                          y={label.y}
                          width="40"
                          height={label.height}
                          opacity="0"
                          onMouseEnter={() => switchActiveLabel(l)}
                          onMouseLeave={() => switchActiveLabel('')}
                        />
                        {label.value !== 0 && (
                          <g
                            className={`interactive-labels ${activeLabel === l ? 'active-label' : ''
                              }`}
                            transform={`translate(${label.xValue}, ${label.yValue})`}
                          >
                            <foreignObject
                              className={stream.threshold ? 'visible' : 'invisible'}
                              x="0"
                              y="0"
                              width="1"
                              height="1"
                            >
                              <div xmlns="http://www.w3.org/1999/xhtml" className={stream.klass}>
                                <p>{formatNumber(label.value)} TJ</p>
                              </div>
                            </foreignObject>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <div className="description">
        <div className="title">
          <h4>
            Der Energieverbrauch in der Industrie in{' '}
            <span>{showBundeslandForLK ? locationLabel[1] : locationLabel[0]}</span> basiert im Jahr{' '}
            <span>{lastYear}</span> zu{' '}
            <span className="second-value"> {formatNumber(percRenewables)}</span> % auf{' '}
            <span className="second-value"> erneuerbaren Energien</span>.{' '}
            {showBundeslandForLK && secretFootnote}
            {footnote}
            {footnote !== '' && '.'}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default EnIndustry;
