import React, { useRef, useLayoutEffect, useState } from 'react';
import { stack, stackOffsetSilhouette, stackOrderAscending, curveCatmullRom, area } from 'd3-shape';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { uniq } from 'lodash';
import { max, extent, mean } from 'd3-array';

const EnIndustry = ({
  currentData,
  currentIndicator,
  currentSection,
  locationLabel,
  isThumbnail,
}) => {
  const colorArray = [
    '#FFD5C8', // Erdgas
    '#007F87', // Erneuerbare Energien
    '#FF9B7B', // Heizöl
    '#E14552', // Kohle
    '#a8a8a8', // Sonstige Energieträger
    '#2A4D9C', // Strom
    '#5F88C6', // Wärme
    '#757575', // Geheim
  ];

  // getting sizes of container for maps
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [highlighedStream, setHighlightedStream] = useState('');

  //   const [currentId, setCurrentId] = useState('');

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      });
    }
  }, []);

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

  let switchHighlightedStream = function (id) {
    if (currentData !== undefined) {
      // console.log(id)
      setHighlightedStream(id);
    }
  };

  if (currentData !== undefined) {
    // parameters for description text
    const lastDataPoint = currentData.data.slice(-1);
    lastYear = lastDataPoint[0]['year'];
    const lastRenValue = currentData.data.filter((d) => {
      return d.column === 'Anteil_Erneuerbar' && d.year === '2020';
    });
    percRenewables = lastRenValue[0].value !== null ? lastRenValue[0].value.toFixed(1) : 0;

    // get all energy sources and filter out "insgesamt" and "Anteil_Erneuerbar"
    const uniqueEnergySourceAll = uniq(currentData.data.map((d) => d.column));
    const uniqueEnergySourceFiltered = uniqueEnergySourceAll.filter((category) => {
      return category !== 'insgesamt' && category !== 'Anteil_Erneuerbar';
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
      .curve(curveCatmullRom.alpha(0.5));

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

      return {
        klass: stream.key.substring(0, 3) + '-stream',
        id: stream.key,
        fill: scaleCategory(stream.key),
        path: areaGen(stream),
        xPos: xScale(yearOfMax),
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
                      x={label.xPos - label.width * 2}
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
        </svg>
      </div>
      <div className="description">
        <div className="title">
          <h3>
            Der Energieverbrauch in der Industrie in {locationLabel} basiert im Jahr{' '}
            <span>{lastYear}</span> zu <span> {percRenewables}% </span>
            auf <span className="second-value"> erneuerbaren Energien</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default EnIndustry;
