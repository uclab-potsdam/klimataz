import React, { useRef, useLayoutEffect, useState } from 'react';
import { arc } from 'd3';
import { max } from 'd3-array';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { uniq } from 'lodash';

const Land = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {
  const colorArray = [
    '#FFF2DA', // erstes Jahr
    '#007F87', // Zunahme
    '#F6A219', // Abnahme
  ];

  // getting sizes of container for maps
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      });
    }
  }, []);

  // inital variables
  const marginWidth = Math.round(dimensions.width / 10); // for mobile a value like dimensions.width / 7 should work
  const marginHeight = Math.round(dimensions.height / 10);
  const legendRadius = isThumbnail
    ? Math.ceil(dimensions.width / 80)
    : Math.ceil(dimensions.width / 100);
  const radiusArc = Math.ceil(dimensions.width / 12);
  let axisElements = [];
  let arcRinder = [];
  let arcSchafe = [];
  let arcSchweine = [];
  let firstYear = 2010;
  let lastYear = 2020;

  if (currentData !== undefined) {
    // get unique years from data
    const uniqueYears = uniq(currentData.data.map((d) => +d.year));
    firstYear = uniqueYears[0];
    lastYear = uniqueYears.slice(-1)[0];
    const uniqueAnimals = uniq(currentData.data.map((d) => d.column));

    // save data for each animal
    const dataRinder = currentData.data.filter((d) => {
      if (d.value === null) d.value = 0;
      return d.column === 'Rinder';
    });

    const dataSchafe = currentData.data.filter((d) => {
      if (d.value === null) d.value = 0;
      return d.column === 'Schafe';
    });

    const dataSchweine = currentData.data.filter((d) => {
      if (d.value === null) d.value = 0;
      return d.column === 'Schweine';
    });

    // defining domains and scaling
    const domainRind = [0, max([1, max(dataRinder.map((d) => d.value))])];
    const domainSchaf = [0, max([1, max(dataSchafe.map((d) => d.value))])];
    const domainSchwein = [0, max([1, max(dataSchweine.map((d) => d.value))])];
    const domainY = [uniqueYears.length - 1, 0]; // switch 0 and uniqueYears.length - 1 for vertical swap
    const domainX = [0, uniqueAnimals.length - 1];

    const rindScale = scaleLinear().domain(domainRind).range([0, radiusArc]);
    const schafScale = scaleLinear().domain(domainSchaf).range([0, radiusArc]);
    const schweinScale = scaleLinear().domain(domainSchwein).range([0, radiusArc]);
    const yScale = scaleLinear()
      .domain(domainY)
      .range([marginHeight * 4, dimensions.height - marginHeight]);
    const xScale = scaleLinear()
      .domain(domainX)
      .range([marginWidth * 2.75, dimensions.width - marginWidth * 2.25]);

    const colorCategory = scaleOrdinal().domain([0, 1, 2]).range(colorArray);

    // create elements for horizontal axis, plus labels
    axisElements = uniqueYears.map((year, a) => {
      return {
        label: year,
        y: yScale(uniqueYears.indexOf(year)),
        labelAnimal: uniqueAnimals[a],
        x: xScale(a),
      };
    });

    // generates the half circles
    const arcGenerator = arc()
      .outerRadius((d) => d)
      .innerRadius(0)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    // scaling check according to each animal
    const animalScale = (d) => {
      if (d.column === 'Rinder') {
        return rindScale(d.value);
      } else if (d.column === 'Schafe') {
        return schafScale(d.value);
      } else if (d.column === 'Schweine') {
        return schweinScale(d.value);
      }
    };

    // check for in- or decrease of animal count and return index for fitting colorValue
    const checkChange = (data, d, animalArray) => {
      let difference = 0;
      let colorVal = 0;

      // only calculate if it is not the first year
      if (d - 1 >= 0) {
        difference = data.value - animalArray[d - 1].value;
      }

      if (difference < 0) {
        colorVal = 1;
      } else if (difference > 0) {
        colorVal = 2;
      } else if (difference === 0) {
        colorVal = 0;
      }
      return colorVal;
    };

    // adds . as thousand separator
    const formatNumber = (num) => {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    };

    // map all parameters for animal group
    const dataAnimal = (data, d, animalArray) => {
      const currentArc = {};
      const scaledValue = animalScale(data);
      let prevScaledValue = 0;
      if (d - 1 >= 0) {
        prevScaledValue = animalScale(animalArray[d - 1]);
      }
      const colorValue = checkChange(data, d, animalArray);

      currentArc.id = data.column;
      currentArc.value = scaledValue;
      currentArc.valueTotal = formatNumber(data.value);
      currentArc.year = +data.year;
      currentArc.path = arcGenerator(scaledValue);
      currentArc.y = yScale(uniqueYears.indexOf(parseInt(data.year)));
      currentArc.x = xScale(uniqueAnimals.indexOf(data.column));
      currentArc.color = colorCategory(colorValue);
      currentArc.pathPrev = arcGenerator(prevScaledValue);

      return currentArc;
    };

    // call function above for each animal group
    dataRinder.map((data, d) => {
      arcRinder.push(dataAnimal(data, d, dataRinder));
    });
    dataSchafe.map((data, d) => {
      arcSchafe.push(dataAnimal(data, d, dataSchafe));
    });
    dataSchweine.map((data, d) => {
      arcSchweine.push(dataAnimal(data, d, dataSchweine));
    });
  }

  return (
    <div className={`animal-count horizontal-bottom-layout ${isThumbnail ? 'is-thumbnail' : ''}`}>
      <div className="visualization-container" ref={targetRef}>
        <svg className="chart" width="100%" height="100%">
          <g className="legend" transform={`translate(${marginWidth / 2}, ${marginHeight / 1.5})`}>
            <circle className="wenigerTiere" cx="0" cy="0" r={legendRadius} />
            <text x={legendRadius + 5} y={legendRadius / 2}>
              weniger Tiere
            </text>
            <circle className="mehrTiere" cx="120" cy="0" r={legendRadius} />
            <text x={legendRadius + 125} y={legendRadius / 2}>
              mehr Tiere
            </text>
            <circle className="vorherigeZaehlung" cx="240" cy="0" r={legendRadius} />
            <text x={legendRadius + 245} y={legendRadius / 2}>
              als im Vergleich zur vorherigen Zählung
            </text>
          </g>
          <g className="axis">
            {axisElements.map((axis, a) => {
              return (
                <g key={a}>
                  <g key={a} transform={`translate(0, ${axis.y})`}>
                    <line
                      x1={marginWidth}
                      x2={dimensions.width - marginWidth}
                      y1="0"
                      y2="0"
                      stroke="#484848"
                    />
                    {/* YEAR */}
                    <text x={marginWidth} y="-10" textAnchor="start">
                      {axis.label}
                    </text>
                  </g>
                  <g key={axis.labelAnimal} transform={`translate(${axis.x},0)`}>
                    {/* Animal */}
                    <text x="0" y={marginHeight * 2} textAnchor="middle">
                      {axis.labelAnimal}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
          <g className="arcs">
            {arcRinder.map((arc, a) => {
              return (
                <g key={a} transform={`translate(${arc.x},${arc.y})`}>
                  <path d={arc.path} fill={arc.color} />
                  <path className="previousYear" d={arc.pathPrev} />
                  <g>
                    <rect className="labelCount" x="-35" y="-22" width="70" height="16" />
                    <text x="0" y="-10" fill="black" textAnchor="middle">
                      {arc.valueTotal}
                    </text>
                  </g>
                </g>
              );
            })}
            {arcSchafe.map((arc, a) => {
              return (
                <g key={a} transform={`translate(${arc.x},${arc.y})`}>
                  <path d={arc.path} fill={arc.color} />
                  <path className="previousYear" d={arc.pathPrev} />
                  <g>
                    <rect className="labelCount" x="-35" y="-22" width="70" height="16" />
                    <text x="0" y="-10" fill="black" textAnchor="middle">
                      {arc.valueTotal}
                    </text>
                  </g>
                </g>
              );
            })}
            {arcSchweine.map((arc, a) => {
              return (
                <g key={a} transform={`translate(${arc.x},${arc.y})`}>
                  <path d={arc.path} fill={arc.color} />
                  <path className="previousYear" d={arc.pathPrev} />
                  <g>
                    <rect className="labelCount" x="-35" y="-22" width="70" height="16" />
                    <text x="0" y="-10" fill="black" textAnchor="middle">
                      {arc.valueTotal}
                    </text>
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
            Entwicklung der Anzahl an Rindern, Schweinen und Schafen in {lkData} über die Jahre{' '}
            {firstYear} bis {lastYear}.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Land;
