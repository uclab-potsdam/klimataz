import React, { useRef, useLayoutEffect, useState } from 'react';
import { arc } from 'd3';
import { max, extent } from 'd3-array';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { uniq } from 'lodash';

const Land = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {
  const colorArray = [
    '#007F87', // Zunahme
    '#F6A219', // Abnahme
    '#FFF2DA', // erstes Jahr
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
  const marginWidth = Math.round(dimensions.width / 10);
  const marginHeight = Math.round(dimensions.height / 10);
  const legendRadius = isThumbnail
    ? Math.ceil(dimensions.width / 80)
    : Math.ceil(dimensions.width / 100);
  const radiusArc = Math.ceil(dimensions.width / 10);
  let axisElements = [];
  let arcElements = [];
  let arcRinder = [];
  let arcSchafe = [];
  let arcSchweine = [];

  if (currentData !== undefined) {
    // get unique years from data
    const uniqueYears = uniq(currentData.data.map((d) => +d.year));
    const firstYear = uniqueYears[0];
    const uniqueAnimals = uniq(currentData.data.map((d) => d.column));

    const dataRinder = currentData.data.filter((d) => {
      return d.column === 'Rinder';
    });

    const dataSchafe = currentData.data.filter((d) => {
      return d.column === 'Schafe';
    });

    const dataSchweine = currentData.data.filter((d) => {
      return d.column === 'Schweine';
    });

    const domainRind = [0, max(dataRinder.map((d) => d.value))];
    const domainSchaf = [0, max(dataSchafe.map((d) => d.value))];
    const domainSchwein = [0, max(dataSchweine.map((d) => d.value))];
    const domainY = [0, uniqueYears.length - 1];
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

    // create elements for horizontal axis, plus labels
    axisElements = uniqueYears.map((year, a) => {
      return {
        label: year,
        y: yScale(uniqueYears.indexOf(year)),
        labelAnimal: uniqueAnimals[a],
        x: xScale(a),
      };
    });

    const arcGenerator = arc()
      .outerRadius((d) => d)
      .innerRadius(0)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    const animalScale = (d) => {
      if (d.column === 'Rinder') {
        return rindScale(d.value);
      } else if (d.column === 'Schafe') {
        return schafScale(d.value);
      } else if (d.column === 'Schweine') {
        return schweinScale(d.value);
      }
    };

    const colorCategory = scaleOrdinal().domain([0, 1, 2]).range(colorArray);

    const checkChange = () => {};
    dataRinder.map((data, d) => {
      const currentArc = {};
      const scaledValue = animalScale(data);
      let change = 0;

      if (d - 1 >= 0) {
        change = data.value - dataRinder[d - 1].value;
      }

      let test = 0;
      if (change > 0) {
        test = 1;
      } else if ((change = 0)) {
        test = 2;
      } else {
        test = 0;
      }

      currentArc.id = data.column;
      currentArc.value = scaledValue;
      currentArc.year = +data.year;
      currentArc.path = arcGenerator(scaledValue);
      currentArc.y = yScale(uniqueYears.indexOf(parseInt(data.year)));
      currentArc.x = xScale(uniqueAnimals.indexOf(data.column));
      currentArc.color = colorCategory(test);

      arcRinder.push(currentArc);
    });
    arcElements.push(arcRinder);

    dataSchafe.map((data, d) => {
      const currentArc = {};
      const scaledValue = animalScale(data);

      currentArc.id = data.column;
      currentArc.value = scaledValue;
      currentArc.year = +data.year;
      currentArc.path = arcGenerator(scaledValue);
      currentArc.y = yScale(uniqueYears.indexOf(parseInt(data.year)));
      currentArc.x = xScale(uniqueAnimals.indexOf(data.column));

      arcSchafe.push(currentArc);
    });
    arcElements.push(arcSchafe);

    dataSchweine.map((data, d) => {
      const currentArc = {};
      const scaledValue = animalScale(data);

      currentArc.id = data.column;
      currentArc.value = scaledValue;
      currentArc.year = +data.year;
      currentArc.path = arcGenerator(scaledValue);
      currentArc.y = yScale(uniqueYears.indexOf(parseInt(data.year)));
      currentArc.x = xScale(uniqueAnimals.indexOf(data.column));

      arcSchweine.push(currentArc);
    });
    arcElements.push(arcSchweine);
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
                      stroke="black"
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
                  <path d={arc.path} stroke="black" strokeWidth="0.75" fill={arc.color} />
                  <text>{arc.label}</text>
                </g>
              );
            })}
            {/* {arcSchafe.map((arc, a) => {
              return (
                <g key={a} transform={`translate(${arc.x},${arc.y})`}>
                  <path d={arc.path} stroke="black" strokeWidth="0.75" fill="none" />
                  <text>{arc.label}</text>
                </g>
              );
            })}
            {arcSchweine.map((arc, a) => {
              return (
                <g key={a} transform={`translate(${arc.x},${arc.y})`}>
                  <path d={arc.path} stroke="black" strokeWidth="0.75" fill="none" />
                  <text>{arc.label}</text>
                </g>
              );
            })} */}
          </g>
        </svg>
      </div>
      <div className="description">
        <div className="title">
          <h3>
            Entwicklung der Anzahl an Rindern, Schweinen und Schafen in {lkData} über die Jahre 2010
            bis 2020.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Land;
