import React, { useRef, useLayoutEffect, useState } from 'react';
import { line, stack, stackOffsetSilhouette } from 'd3-shape';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { uniq } from 'lodash';
import { max, extent } from 'd3-array';

const EnIndustry = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {
  const colorArray = ['#A80D35', '#FF7B7B', '#F6A219', '#3762FB', '#2A4D9C', '#5F88C6', '#5DCCD3'];

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
  let axisElements = [];
  let streamElements = [];
  let scaleCategory = function () {
    return undefined;
  };
  let lastYear = '?';
  let percRenewables = 0;

  if (currentData !== undefined) {
    const lastDataPoint = currentData.data.slice(-1);
    lastYear = lastDataPoint[0]['year'];
    percRenewables = lastDataPoint[0].value.toFixed(2);

    const uniqueEnergySource = uniq(currentData.data.map((d) => d.column));

    // get min and max from data
    const domainX = extent(currentData.data.map((d) => +d.year));
    // map domain onto range
    const xScale = scaleLinear()
      .domain(domainX)
      .range([marginWidth, dimensions.width - marginWidth]);

    const domainY = [0, max(currentData.data.map((d) => d.value))];
    const yScale = scaleLinear().domain(domainY).range([dimensions.height, marginHeight]).nice();
    scaleCategory = scaleOrdinal().domain(uniqueEnergySource).range(colorArray);
    const createLine = line()
      .x((d) => xScale(+d.year))
      .y((d) => yScale(d.value));

    // get unique years from data
    const uniqueYears = uniq(currentData.data.map((d) => +d.year));
    const energyYears = [];

    // create elements for vertical and horizontal axis, plus labels
    axisElements = uniqueYears.map((year, a) => {
      let taPosition = 'start';

      const currentYearData = currentData.data.filter((d) => +d.year === year);

      currentYearData.forEach((d) => {
        energyYears.push({
          label: `${d.year} %`,
          id: d.column,
        });
      });

      if (a === uniqueYears.length - 1) {
        taPosition = 'end';
      } else if (a !== 0) {
        taPosition = 'middle';
      }

      return {
        label: year,
        taPosition,
        x: xScale(year),
      };
    });

    streamElements = uniqueEnergySource.map((source, i) => {
      const currentSourceData = currentData.data.filter((d) => d.column === source);

      return {
        id: source,
        stroke: scaleCategory(source),
        path: createLine(currentSourceData),
      };
    });

    // var stackedData = stack().offset(stackOffsetSilhouette).keys(energySource)((d) => d);
  }

  return (
    <div
      className={`energy-industry horizontal-bottom-layout ${isThumbnail ? 'is-thumbnail' : ''}`}
    >
      <div className="visualization-container" ref={targetRef}>
        <svg className="chart" width="100%" height="100%">
          <g className="lines">
            {streamElements.map((line, l) => {
              return (
                <g key={l} className={`${line.id} line`}>
                  <path d={line.path} stroke={line.stroke} fill="none" />
                </g>
              );
            })}
          </g>
          <g className="axis">
            {axisElements.map((axis, a) => {
              if (a % 2 !== 0) {
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
                    <text x="-18" y={marginHeight + 15} textAnchor={axis.taPosition}>
                      {axis.label}
                    </text>
                  </g>
                );
              }
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
