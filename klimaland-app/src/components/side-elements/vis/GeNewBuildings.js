import React, { useRef, useLayoutEffect, useState } from 'react';
import { uniq } from 'lodash';
import { max, extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import {
  firstToUppercase,
  formatNumber,
  useCardSize,
  mobileCheck,
} from './../../../helpers/helperFunc';

const Buildings = ({
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

  const [currentId, setCurrentId] = useState('');

  // inital variables
  let uniqueEnergyTypes = [];
  let lineElements = [];
  let axisElements = [];
  let yAxisValues = [];
  let yAxis = [];
  let numberOfBuildings = [{ value: 0 }];
  let selectedEnergy = 0;
  const isMobile = dimensions.width <= 350 && mobileCheck(window);
  const marginHeight = Math.ceil(dimensions.width / 10);
  const marginWidth = Math.ceil(dimensions.height / 10);

  const customLegendOrder = [
    'Umweltthermie (Luft/Wasser)',
    'Geothermie',
    'Solarthermie',
    'Holz',
    'Biogas/Biomethan',
    'Sonstige Biomasse',
    'Keine Energie (einschl. Passivhaus)',
    'Andere erneuerbare Energien',
    'Gas',
    'Fernwärme/Fernkälte',
    'Öl',
    'Strom',
    'Sonstige Heizenergie',
    'Andere fossile Energien',
  ];

  //clean labels to create classes
  const cleanKlassString = function (label) {
    let cleanedKlassString = label;

    if (label !== ' ') {
      if (label.includes('/') && !label.includes(' ')) {
        cleanedKlassString = cleanedKlassString.split('/')[1].toLowerCase();
      } else if (label.includes('(')) {
        cleanedKlassString = cleanedKlassString.split(' ')[0].toLowerCase();
      } else if (label.includes(' ') && !label.includes('(')) {
        cleanedKlassString = cleanedKlassString.split(' ')[1].toLowerCase();
      }
    }

    return cleanedKlassString;
  };

  const noSpecificRenewables = function () {
    let renewables = [
      'Umweltthermie (Luft/Wasser)',
      'Geothermie',
      'Solarthermie',
      'Holz',
      'Biogas/Biomethan',
      'Sonstige Biomasse',
      'Keine Energie (einschl. Passivhaus)',
    ];
    if (uniqueEnergyTypes.some((elem) => renewables.includes(elem))) {
      return false;
    } else {
      return true;
    }
  };

  const getLegendName = function (name) {
    if (name == 'Umweltthermie (Luft/Wasser)') return 'Umweltthermie (Wärmepumpe)';
    if (name == 'Andere erneuerbare Energien' && noSpecificRenewables()) {
      return 'Erneuerbare Energien';
    }
    if (name == 'Fernwärme/Fernkälte') return 'Fernwärme';
    return name;
  };

  const getDescriptionName = function (name) {
    if (name == 'Umweltthermie (Luft/Wasser)') return 'Umweltthermie (Wärmepumpe)';
    if (name == 'Andere erneuerbare Energien' && noSpecificRenewables()) {
      if (noSpecificRenewables()) {
        return 'erneuerbaren Energien';
      } else {
        return 'anderen erneuerbaren Energien';
      }
    }
    if (name == 'Andere fossile Energien') return 'anderen fossilen Energien';
    if (name == 'Fernwärme/Fernkälte') return 'Fernwärme';
    return name;
  };

  //handle click on legend to change label
  let changeId = function (id) {
    if (currentData !== undefined) {
      setCurrentId(id);
    }
  };

  if (currentData !== undefined) {
    // arrays

    //here filter out aggregated categories
    const energyData = currentData.data.filter((d) => {
      return d.column !== 'Number_buil' && d.column !== 'Fossils' && d.column !== 'Renewables';
    });

    const numberOfBuildingsObj = currentData.data.filter((d) => {
      return d.column === 'Number_buil';
    });

    energyData.forEach((d) => (d.column = firstToUppercase(d.column)));

    const uniqueYears = uniq(energyData.map((d) => +d.year));
    const existingEnergies = energyData.filter((d) => d.value !== null);

    // calc predefined label
    const existingEnergiesLY = existingEnergies.filter((d) => +d.year === max(uniqueYears));
    const maxValueForLY = max(existingEnergiesLY.map((d) => d.value));
    const selectedEnergyObj =
      currentId === ''
        ? existingEnergiesLY.filter((d) => d.value === maxValueForLY)
        : existingEnergiesLY.filter((d) => d.column === currentId);

    uniqueEnergyTypes = uniq(
      existingEnergies
        .map((d) => d.column)
        .sort((a, b) => customLegendOrder.indexOf(a) - customLegendOrder.indexOf(b))
    );

    numberOfBuildings =
      numberOfBuildingsObj[0] !== undefined ? numberOfBuildingsObj[0].value : numberOfBuildings;
    selectedEnergy =
      selectedEnergyObj[0] !== undefined ? selectedEnergyObj[0].value.toFixed(1) : selectedEnergy;

    // // Selects higher element in dataset
    if (currentId === '') {
      setCurrentId(selectedEnergyObj[0].column);
    }

    // calc variation on domain based on highest value in dataset
    const maxValue = max(energyData.map((d) => d.value));
    const maxDomainVal = maxValue >= 45 ? 100 : 50;
    const domainY = [0, maxDomainVal];
    const domainX = extent(energyData.map((d) => +d.year));
    const xScale = scaleLinear()
      .domain(domainX)
      .range([marginWidth, dimensions.width - marginWidth]);
    const yScale = scaleLinear()
      .domain(domainY)
      .range([dimensions.height - marginHeight, marginHeight]);
    const createLine = line()
      .x((d) => xScale(+d.year))
      .y((d) => yScale(d.value));

    yAxisValues = yScale.ticks(2);
    yAxis = yAxisValues.map((d) => yScale(d));

    // iterate over array and creates line for each energy type
    lineElements = uniqueEnergyTypes.map((type, t) => {
      const currentTypeData = existingEnergies.filter((d) => d.column === type);
      let typeKlass = type.toLowerCase();

      return {
        id: type,
        klassName: cleanKlassString(typeKlass),
        path: createLine(currentTypeData),
      };
    });

    // create elements for vertical and horizontal axis, plus labels
    axisElements = uniqueYears.map((axis, a) => {
      const energyMarkers = [];
      let taPosition = 'start';
      const currentYearData = existingEnergies.filter((d) => +d.year === axis);

      currentYearData.forEach((d) => {
        energyMarkers.push({
          y: yScale(d.value),
          klassName: cleanKlassString(d.column.toLowerCase()),
          label: `${d.value.toFixed(0)} %`,
          id: d.column,
          value: d.value.toFixed(0),
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
        <div className="title" style={{ display: isMobile ? 'block' : 'none' }}>
          <h4>
            Wie wird in Neubauten in <span>{locationLabel}</span> geheizt?
          </h4>
        </div>
        <div className="title" style={{ display: isMobile ? 'none' : 'block' }}>
          <h4>Wie wird in Neubauten geheizt?</h4>
        </div>
        <div className={`${cleanKlassString(currentId).toLowerCase()} caption`}>
          <p>
            Durchschnittlich werden in <span>{locationLabel}</span> pro Jahr{' '}
            <span>{formatNumber(numberOfBuildings)}</span> neue Wohnungen oder Häuser
            fertiggestellt. Davon werden{' '}
            <span className="energy-number">{formatNumber(selectedEnergy)} %</span> mit{' '}
            <span className="energy-number">{getDescriptionName(firstToUppercase(currentId))}</span>{' '}
            beheizt.
          </p>
        </div>
        <div className="legend">
          <div className="legend-inner">
            <div className="legend-elements-container">
              {uniqueEnergyTypes.map((type, t) => {
                return (
                  <div
                    key={t}
                    onClick={() => changeId(type)}
                    className={`legend-element ${
                      type === currentId ? 'selected' : ''
                    } ${cleanKlassString(type.toLowerCase())}`}
                  >
                    <div className={`element-color ${cleanKlassString(type.toLowerCase())}`} />
                    <p x="15" y="10" className={type === currentId ? 'selected' : ''}>
                      {getLegendName(firstToUppercase(type))}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {currentData !== undefined && currentData.data !== undefined && (
        <div className="visualization-container" ref={targetRef}>
          <svg className="building-newbuildings chart">
            <g className="axis">
              <g className="x-axis">
                {yAxis.map((yaxis, ya) => {
                  return (
                    <g key={ya} transform={`translate(0, ${yaxis})`}>
                      <line x1={marginWidth} x2={dimensions.width - marginWidth} y1="0" y2="0" />
                      <text
                        x={marginWidth + 5}
                        y={isMobile && yAxisValues[ya] !== 100 ? '-10' : '15'}
                        textAnchor="start"
                      >
                        {yAxisValues[ya]} %
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
            <g className="lines">
              {lineElements.map((line, l) => {
                return (
                  <g
                    key={l}
                    className={`${line.klassName} ${line.type} line`}
                    onClick={() => changeId(line.id)}
                  >
                    <path d={line.path} className="hitbox" fill="none" />
                    <path d={line.path} fill="none" />
                  </g>
                );
              })}
            </g>
            <g className="axis">
              {axisElements.map((axis, a) => {
                return (
                  <g key={a} transform={`translate(${axis.x}, 0)`}>
                    <line x1="0" x2="0" y1={marginHeight} y2={dimensions.height - marginHeight} />
                    <text x="-2" y={marginHeight - 10} textAnchor={axis.taPosition}>
                      {axis.label}
                    </text>
                    {axis.energyMarkers.map((en, e) => {
                      return (
                        <g
                          key={e}
                          transform={`translate(0, ${en.y})`}
                          className={`year-marker ${en.klassName} ${
                            en.id === currentId ? 'default' : 'optional'
                          }`}
                          onClick={() => changeId(en.id)}
                        >
                          <circle cx="0" cy="0" r="3" />
                        </g>
                      );
                    })}
                    {!isThumbnail &&
                      axis.energyMarkers.map((en, e) => {
                        return (
                          <g
                            key={e}
                            transform={`translate(0, ${en.y})`}
                            className={`year-marker ${en.klassName} ${
                              en.id === currentId ? 'default' : 'optional'
                            }`}
                            onClick={() => changeId(en.id)}
                          >
                            <g transform="translate(5, 0)">
                              <foreignObject
                                //x={a === axis.length - 1 ? -40 : -2}
                                x={en.value > 9 ? -21 : -18}
                                y="-12.5"
                                width="1"
                                height="1"
                              >
                                <div
                                  xmlns="http://www.w3.org/1999/xhtml"
                                  className={`label ${en.klassName} ${
                                    en.id === currentId ? 'default' : 'optional'
                                  } `}
                                >
                                  <p>{en.label}</p>
                                </div>
                              </foreignObject>
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
      )}
    </div>
  );
};

export default Buildings;
