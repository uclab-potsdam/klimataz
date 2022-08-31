import React, { useRef, useLayoutEffect, useState } from 'react';
import { line } from 'd3-shape';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { union, uniq } from 'lodash';
import { max, extent, mean, sum } from 'd3-array';

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
  let uniqueEnergyTypes = [];
  const marginWidth = 0;
  const marginHeight = 0;
  let axisElements = [];
  let yAxisValues = [];
  let yAxis = [];
  let scaleCategory = function () {
    return undefined;
  };

  if (currentData !== undefined) {
    const domainX = extent(currentData.data.map((d) => +d.year));
    const xScale = scaleLinear()
      .domain(domainX)
      .range([marginWidth, dimensions.width - marginWidth]);

    const energyYeara = [];
    const uniqueYears = uniq(currentData.data.map((d) => +d.year));

    axisElements = uniqueYears.map((axis, a) => {
      let taPosition = 'start';
      const currentYearData = currentData.data.filter((d) => +d.year === axis);

      currentYearData.forEach((d) => {
        energyYeara.push({
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
        label: axis,
        taPosition,
        x: xScale(axis),
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
            {axisElements.map((axis, a) => {
              return (
                <g key={a} transform={`translate(${axis.x}, 0)`}>
                  <line
                    x1="0"
                    x2="0"
                    y1={marginHeight}
                    y2={dimensions.height - marginHeight}
                    stroke="black"
                  />
                  // YEAR
                  <text x="-18" y={marginHeight + 15} textAnchor={axis.taPosition}>
                    {axis.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <div className="description">
        <div className="title">
          <h3>
            Der Ergieverbrauch von verarbeitenden Gewerben in RegionXY {/* <span>{lkData}</span> */}
            besteht 2020 {/* <span>{lastYear}</span> */}
            zu 0 % {/* <span>{renewVal Variable}</span>  */}
            aus <span className="second-value"> erneuerbaren Energieträgern</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default EnIndustry;
