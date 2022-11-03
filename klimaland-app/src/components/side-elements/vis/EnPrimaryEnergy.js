import React, { createRef, useState } from 'react';
import { stack, stackOffsetNone, stackOrderAscending, curveMonotoneX, area } from 'd3-shape';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { uniq } from 'lodash';
import { max, extent } from 'd3-array';
import { formatNumber, useCardSize } from '../../../helpers/helperFunc';

const Energy = ({
  currentData,
  currentIndicator,
  currentSection,
  locationLabel,
  isThumbnail,
  cardNumber,
}) => {
  const colorArray = [
    '#E14552', // Steinkohle
    '#732b20', // Braunkohle
    '#FF9B7B', // Mineralöle und Mineralöl produkte
    '#FFD5C8', // Gase
    '#007F87', // Gesamt Erneuerbare Energieträger
    '#2A4D9C', // Stromaustauschsaldo
    '#FFBE53', // Kernenergie
    '#ff7b7b', // Andere Energieträger
  ];

  const labelArray = [
    'Steinkohle',
    'Braunkohle',
    'Mineralöle',
    'Gase',
    'Erneuerbare Energien',
    'Stromaustauschsaldo',
    'Kernenergie',
    'Sonstige Energieträger',
  ];

  // , 'Kernenergie', 'Andere Energieträger']
  // getting sizes of container for maps
  const targetRef = createRef();
  const dimensions = useCardSize(targetRef, cardNumber);

  const [highlighedStream, setHighlightedStream] = useState('');
  const [activeLabel, setactiveLabel] = useState('');

  // inital variables
  const marginWidth = 0;
  const marginHeight = 0;
  const paddingHeight = 15;
  let xAxisElements = [];
  let yAxisElements = [];
  let streamEle = [];
  let scaleCategory = function () {
    return undefined;
  };
  let mapLabel = function () {
    return undefined;
  };
  let lastYear = '?';
  let percRenewables = 0;
  let lastExport = {};

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
      return d.column === 'Anteil Erneuerbar' && d.year === '2020';
    });
    percRenewables = lastRenValue[0].value !== null ? lastRenValue[0].value.toFixed(1) : 0;

    // get all energy sources and filter out "insgesamt" and "Anteil_Erneuerbar"
    const uniqueEnergySourceAll = uniq(currentData.data.map((d) => d.column));
    const uniqueEnergySourceFiltered = uniqueEnergySourceAll.filter((category) => {
      return (
        category !== 'Insgesamt' &&
        category !== 'Anteil Erneuerbar' &&
        category !== 'Gesamt Nichterneuerbar' &&
        category !== 'Klärgas, Deponiegas' &&
        category !== 'Wasserkraft' &&
        category !== 'Windkraft' &&
        category !== 'Solarenergie' &&
        category !== 'Biomasse' &&
        category !== 'Sonstige erneuerbare Energien'
      );
    });

    //store last stromaustauschsaldo value
    lastExport.value = currentData.data.filter((d) => {
      return d.column === 'Stromaustauschsaldo' && d.year === '2020';
    })[0].value;
    lastExport.abs = Math.abs(lastExport.value); //absolute value

    //filter out negative stromaustauschsaldo values
    //copy data
    const filteredData = JSON.parse(JSON.stringify(currentData.data));
    //replace negative values with 0
    filteredData
      .filter((d) => {
        return (
          d.column === 'Stromaustauschsaldo' || (d.column === 'Andere Energieträger' && d.value < 0)
        );
      })
      .forEach((d) => (d.value = 0));

    // setup domains for scaling
    const domainX = extent(filteredData.map((d) => +d.year));
    const xScale = scaleLinear()
      .domain(domainX)
      .range([marginWidth, dimensions.width - marginWidth]);
    const maxY = max(filteredData.map((d) => d.value));
    const domainY = [0, maxY];
    const yScale = scaleLinear().domain(domainY).range([dimensions.height, marginHeight]).nice();

    // map source to color
    scaleCategory = scaleOrdinal().domain(uniqueEnergySourceFiltered).range(colorArray);

    mapLabel = (d) => {
      const labelIndex = uniqueEnergySourceFiltered.indexOf(d);
      return labelArray[labelIndex];
    };

    // get unique years from data
    const uniqueYears = uniq(filteredData.map((d) => +d.year));

    // create elements for horizontal axis, plus labels
    xAxisElements = uniqueYears.map((year, a) => {
      return {
        label: year,
        x: xScale(year),
      };
    });

    //create elements for y axis
    const yAxisValues = yScale.ticks(4);
    yAxisElements = yAxisValues.map((d) => {
      return {
        label: `${formatNumber(d)} TJ`,
        x: yScale(d),
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
      const currentYearData = filteredData.filter((d) => +d.year === year);

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
      .offset(stackOffsetNone);
    const stackedSeries = stacks(stackData);

    // stream graph
    streamEle = stackedSeries.map((stream, s) => {
      const maxStreamValue = max(
        stackData.map((d) => {
          // filtering first and last year to avoid labels overflow
          return +d['year'] !== 1990 && +d['year'] !== 2020 ? d[stream.key] : 0;
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
      const labelID = mapLabel(stream.key);

      for (let index = 0; index < stream['length']; index++) {
        // const next = index > stream['length'] ? stream['length'] - 1 : index + 1

        const scaledFloor = yScale(stream[index][0]);
        const scaledCeil = yScale(stream[index][1]);
        const year = stackData[index].year;
        const value = stackData[index][stream.key];
        let x = xScale(year);
        if (x + 50 > dimensions.width - marginWidth) x -= 20;

        const y = Math.abs(scaledCeil);
        const yValue = Math.abs(scaledFloor - (scaledFloor - scaledCeil) / 2);

        let xValue = xScale(year);
        if (xValue + 20 > dimensions.width - marginWidth) {
          xValue -= 65;
        } else if (xValue + 40 > dimensions.width - marginWidth) {
          xValue -= 40;
        } else if (xValue + 60 > dimensions.width - marginWidth) {
          xValue -= 10;
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
        id: labelID,
        fill: scaleCategory(stream.key),
        path: areaGen(stream),
        xPos: xScale(yearOfMax),
        labels: labelRects,
        yPos: yScale(stream[indexOfMax][0] - (stream[indexOfMax][0] - stream[indexOfMax][1]) / 2),
        height: yScale(stream[indexOfMax][0] - stream[indexOfMax][1]),
        width: labelID.length,
        threshold:
          highlighedStream === labelID || (maxStreamValue > 50000 && highlighedStream === ''), //Fixed value for now, maybe make it dynamic?
        maxStreamValue,
      };
    });
  }

  return (
    <div className={`primary-energy horizontal-bottom-layout ${isThumbnail ? 'is-thumbnail' : ''}`}>
      <div className="visualization-container" ref={targetRef}>
        <svg className="energy-primenergy chart" width="100%" height="100%">
          <g className="x-axis">
            {xAxisElements.map((axis, a) => {
              if (a % 3 === 2) {
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
                        dimensions.width <= 515 ? `rotate(-90, -10, ${marginHeight + 10})` : ''
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
                  <path d={stream.path} fill={stream.fill} />
                </g>
              );
            })}
          </g>
          <g className="y-axis">
            {yAxisElements.map(function (axis, a) {
              if (a === 0) return;
              return (
                <g
                  transform={`translate(0, ${axis.x})`}
                  key={a}
                  className={`${yAxisElements.length - 1 === a ? 'last-line' : ''}`}
                >
                  <line x1="0" x2={dimensions.width} y1="0" y2="0" />
                  <text x={dimensions.width - 10} y="-5" textAnchor="end">
                    {axis.label}
                  </text>
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
                        <p>{label.id == 'Stromaustauschsaldo' ? 'importierter Strom' : label.id}</p>
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
                      <g key={l} className={stream.klass}>
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
        {lastExport.value < 0 && (
          <div className="strom-export-box">
            <p>
              In {locationLabel} wurden 2020 zusätzlich {formatNumber(lastExport.abs)} TJ Strom
              exportiert.
            </p>
          </div>
        )}
      </div>
      <div className="description">
        <div className="title">
          <h4>
            Der Energieverbrauch in <span className="locationLabel">{locationLabel}</span> basiert
            im Jahr {lastYear} zu{' '}
            <span className="second-value"> {formatNumber(percRenewables)} %</span> auf
            <span className="second-value"> erneuerbaren Energien</span>.
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Energy;
