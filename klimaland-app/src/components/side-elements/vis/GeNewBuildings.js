import React, { useRef, useLayoutEffect, useState } from 'react';
import { percentage, firstToUppercase } from '../../helperFunc';
import { uniq } from 'lodash';
import { max, extent, mean, sum } from 'd3-array';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { line } from 'd3-shape';

const Buildings = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {
  // getting sizes of container for maps
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [currentId, setCurrentId] = useState('');

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
  let lineElements = [];
  let axisElements = [];
  let yAxisValues = [];
  let yAxis = [];
  let numberOfBuildings = 0;
  let scaleCategory = function () {
    return undefined;
  };
  const marginHeight = Math.ceil(dimensions.width / 10);
  const marginWidth = Math.ceil(dimensions.height / 10);
  const energyTypesOrder = [
    'Fossils',
    'Andere fossile Energie',
    'Gas',
    'Renewables',
    'Umweltthermie',
    'Andere erneuerbare Energien',
    'Strom',
  ];
  const colorArray = ['#A80D35', '#FF7B7B', '#F6A219', '#3762FB', '#2A4D9C', '#5F88C6', '#5DCCD3'];

  //handle click on legend to change label
  let changeId = function (id) {
    if (currentData !== undefined) {
      setCurrentId(id);
    }
  };

  if (currentData !== undefined) {
    // arrays
    currentData.data.forEach((d) => (d.column = firstToUppercase(d.column)));

    const sortedData = [...currentData.data].sort(
      (a, b) => energyTypesOrder.indexOf(a.column) - energyTypesOrder.indexOf(b.column)
    );
    const uniqueYears = uniq(currentData.data.map((d) => +d.year));
    const allBuildings = currentData.data.map((d) => d.value);

    uniqueEnergyTypes = uniq(sortedData.map((d) => d.column));
    numberOfBuildings = Math.round(mean(allBuildings));

    // Selects higher element in dataset
    if (currentId === '') {
      setCurrentId(uniqueEnergyTypes[0]);
    }

    // constructors and scales
    let totalValue = 0;
    const yearlyTotal = uniqueYears.map((year) => {
      let yearValue = 0;
      currentData.data.forEach((d) => {
        if (+d.year === year) {
          totalValue = totalValue + d.value;
          yearValue = yearValue + d.value;
        }
      });

      currentData.data.forEach((d) => {
        if (+d.year === year) {
          d.perc = percentage(d.value, yearValue);
        }
      });
      return yearValue;
    });

    // calc variation on domain based on highest value in dataset
    const maxValue = max(currentData.data.map((d) => d.perc));
    const maxDomainVal = maxValue >= 50 ? 100 : 50;
    const domainY = [0, maxDomainVal];
    const domainX = extent(currentData.data.map((d) => +d.year));
    const xScale = scaleLinear()
      .domain(domainX)
      .range([marginWidth, dimensions.width - marginWidth]);
    const yScale = scaleLinear()
      .domain(domainY)
      .range([dimensions.height - marginHeight, marginHeight]);
    scaleCategory = scaleOrdinal().domain(uniqueEnergyTypes).range(colorArray);
    const createLine = line()
      .x((d) => xScale(+d.year))
      .y((d) => yScale(d.perc));

    yAxisValues = yScale.ticks(2);
    yAxis = yAxisValues.map((d) => yScale(d));

    // iterate over array and creates line for each energy type
    lineElements = uniqueEnergyTypes.map((type, t) => {
      const currentTypeData = currentData.data.filter((d) => d.column === type);

      return {
        id: type,
        stroke: scaleCategory(type),
        path: createLine(currentTypeData),
      };
    });

    // create elements for vertical and horizontal axis, plus labels
    axisElements = uniqueYears.map((axis, a) => {
      const energyMarkers = [];
      let taPosition = 'start';
      const currentYearData = currentData.data.filter((d) => +d.year === axis);

      currentYearData.forEach((d) => {
        energyMarkers.push({
          y: yScale(d.perc),
          label: `${d.perc.toFixed(1)} %`,
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
        energyMarkers,
        length: uniqueYears.length,
      };
    });
  }

  return (
    <div className={`newbuildings-energy ${isThumbnail ? 'is-thumbnail' : ''}`}>
      <div className="description">
        <div className="title">
          <h3>Welche primären Heiz-energien werden in neuen Wohneinheiten installiert?</h3>
        </div>
        <div className="caption">
          <p>
            Jedes Jahr wurden in {lkData} <span>{numberOfBuildings}</span> neue Wohneinheiten
            (Wohnungen oder Häuser) fertiggestellt. <span>{firstToUppercase(currentId)}</span> are
            xxx%.
          </p>
        </div>
        <div className="legend">
          <svg height="180px">
            <g>
              {uniqueEnergyTypes.map((type, t) => {
                return (
                  <g
                    transform={`translate(20, ${(t + 1) * 20})`}
                    key={t}
                    onClick={() => changeId(type)}
                  >
                    <circle cx="0" cy="5" r="4" fill={scaleCategory(type)} />
                    <text x="15" y="10">
                      {firstToUppercase(type)}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
      <div className="visualization-container" ref={targetRef}>
        <svg className="chart">
          <g className="axis">
            <g className="x-axis">
              {yAxis.map((yaxis, ya) => {
                return (
                  <g key={ya} transform={`translate(0, ${yaxis})`}>
                    <line x1={marginWidth} x2={dimensions.width - marginWidth} y1="0" y2="0"></line>
                    <text x={marginWidth - 10} y="10" textAnchor="end">
                      {yAxisValues[ya]}%
                    </text>
                  </g>
                );
              })}
            </g>
          </g>

          <g className="lines">
            {lineElements.map((line, l) => {
              return (
                <g key={l} className={`${line.id} line`}>
                  <path d={line.path} stroke={line.stroke} fill="none" />
                </g>
              );
            })}
          </g>
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
                  <text x="-2" y={marginHeight - 10} textAnchor={axis.taPosition}>
                    {axis.label}
                  </text>
                  {axis.energyMarkers.map((en, e) => {
                    return (
                      <g
                        key={e}
                        transform={`translate(0, ${en.y})`}
                        className={`year-marker ${en.id === currentId ? 'default' : 'optional'}
                                                            `}
                      >
                        <circle cx="0" cy="0" r="3" fill={scaleCategory(en.id)} />
                        <g transform="translate(5, 0)">
                          <rect
                            className="marker-label"
                            x={a === axis.length - 1 ? -40 : -2}
                            y="-25"
                            width="45"
                            height="20"
                            fill="white"
                            stroke={scaleCategory(en.id)}
                            rx="2"
                          />
                          <text
                            className="marker-label"
                            x="2"
                            y="-10"
                            fill={scaleCategory(en.id)}
                            textAnchor={`${a === axis.length - 1 ? 'end' : 'start'}`}
                          >
                            {en.label}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Buildings;
