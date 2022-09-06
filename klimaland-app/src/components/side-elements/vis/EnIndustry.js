import React, { useRef, useLayoutEffect, useState } from 'react';
import { line, stack, stackOffsetSilhouette, curveCatmullRom, area } from 'd3-shape';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { uniq } from 'lodash';
import { max, extent } from 'd3-array';

const EnIndustry = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {
  const colorArray = [
    '#A80D35',
    '#FF7B7B',
    '#F6A219',
    '#3762FB',
    '#2A4D9C',
    '#5F88C6',
    '#5DCCD3',
    '#5DCCA4',
  ];

  // getting sizes of container for maps
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
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
  let xAxisElements = [];
  let lineElements = [];

  let streamEle = [];
  let scaleCategory = function () {
    return undefined;
  };
  let lastYear = '?';
  let percRenewables = 0;
  let xAxisLineAmount = 0;

  if (currentData !== undefined) {
    const lastDataPoint = currentData.data.slice(-1);
    lastYear = lastDataPoint[0]['year'];
    percRenewables = lastDataPoint[0].value; //toFixed(2);

    const uniqueEnergySource = uniq(currentData.data.map((d) => d.column));

    const domainX = extent(currentData.data.map((d) => +d.year));
    const xScale = scaleLinear()
      .domain(domainX)
      .range([marginWidth, dimensions.width - marginWidth]);

    const domainY = [
      -max(currentData.data.map((d) => d.value)),
      max(currentData.data.map((d) => d.value)),
    ];

    const yScale = scaleLinear().domain(domainY).range([dimensions.height, marginHeight]).nice();

    scaleCategory = scaleOrdinal().domain(uniqueEnergySource).range(colorArray);

    const createLine = line()
      .x((d) => xScale(+d.year))
      .y((d) => yScale(d.value));

    const areaGen = area()
      .x((d) => xScale(d.data.year))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(curveCatmullRom.alpha(0.5));

    // get unique years from data
    const uniqueYears = uniq(currentData.data.map((d) => +d.year));
    xAxisLineAmount = Math.round(40 / uniqueYears.length);
    const energyYears = [];

    // create elements for horizontal axis, plus labels
    xAxisElements = uniqueYears.map((year, a) => {
      const currentYearData = currentData.data.filter((d) => +d.year === year);

      currentYearData.forEach((d) => {
        energyYears.push({
          label: `${d.year} %`,
          id: d.column,
        });
      });

      return {
        label: year,
        x: xScale(year),
      };
    });

    const stackData = [];

    // prepare data for stacking
    uniqueYears.forEach((year, y) => {
      const currentYearData = currentData.data.filter((d) => +d.year === year);

      const el = {};
      currentYearData.map((d) => {
        el.year = d.year;
        const nameOfEnergySource = d.column;
        el[nameOfEnergySource] = d.value !== null ? d.value : 0;
      });
      stackData.push(el);
    });

    const stacks = stack().keys(uniqueEnergySource).offset(stackOffsetSilhouette);
    const stackedSeries = stacks(stackData);

    // stream graph
    streamEle = stackedSeries.map((stream, s) => {
      return {
        fill: scaleCategory(stream.key),
        path: areaGen(stream),
      };
    });

    // line graph
    // lineElements = uniqueEnergySource.map((source, i) => {
    //   const currentSourceData = currentData.data.filter((d) => d.column === source);

    //   return {
    //     id: source,
    //     stroke: scaleCategory(source),
    //     path: createLine(currentSourceData),
    //   };
    // });
  }

  return (
    <div
      className={`energy-industry horizontal-bottom-layout ${isThumbnail ? 'is-thumbnail' : ''}`}
    >
      <div className="visualization-container" ref={targetRef}>
        <svg className="chart" width="100%" height="100%">
          <g className="axis">
            {xAxisElements.map((axis, a) => {
              if (a % xAxisLineAmount !== 0) {
                return (
                  <g key={a} transform={`translate(${axis.x}, 0)`}>
                    <line
                      x1="0"
                      x2="0"
                      y1={marginHeight}
                      y2={dimensions.height - marginHeight}
                      stroke="black"
                    />
                    {/* // YEAR */}
                    <text x="-18" y={marginHeight + 15} textAnchor="middle">
                      {axis.label}
                    </text>
                  </g>
                );
              }
            })}
          </g>
          <g className="lines">
            {/* {lineElements.map((line, l) => {
              return (
                <g key={l} className={`${line.id} line`}>
                  <path d={line.path} stroke={line.stroke} fill="none" />
                </g>
              );
            })} */}
            {streamEle.map((stream, s) => {
              return (
                <g key={s}>
                  <path d={stream.path} stroke="black" strokeWidth="0.75" fill={stream.fill} />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <div className="description">
        <div className="title">
          <h3>
            Der Ergieverbrauch von verarbeitenden Gewerben in {lkData} besteht{' '}
            <span>{lastYear}</span> zu <span> {percRenewables}% </span>
            aus <span className="second-value"> erneuerbaren Energieträgern</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default EnIndustry;
