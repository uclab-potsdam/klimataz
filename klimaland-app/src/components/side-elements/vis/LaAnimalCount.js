import React, { useRef } from 'react';
import { arc } from 'd3';
import { max } from 'd3-array';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { uniq } from 'lodash';
import { formatNumber, useCardSize, mobileCheck } from '../../../helpers/helperFunc';

const Land = ({ currentData, locationLabel, isThumbnail, cardNumber }) => {
  const colorArray = [
    '#fff2da45', // erstes Jahr
    '#007F87', // Zunahme
    '#F6A219', // Abnahme
  ];

  // getting sizes of container for maps
  const targetRef = useRef();
  const dimensions = useCardSize(targetRef, cardNumber);

  // inital variables
  const isMobile = dimensions.width <= 450 && mobileCheck(window);
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
  let marginLabel = 3;

  if (isMobile) marginLabel = -23;

  // move position in array for custom order Schweine, Rinder, Schafe
  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
  };

  if (currentData !== undefined) {
    // get unique years from data
    const uniqueYears = uniq(currentData.data.map((d) => +d.year));
    firstYear = uniqueYears[0];
    lastYear = uniqueYears.slice(-1)[0];
    const uniqueAnimals = uniq(currentData.data.map((d) => d.column));
    uniqueAnimals.move(2, 0);

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
    const domainTier = [0, max([1, max(currentData.data.map((d) => d.value))])];
    const domainY = [uniqueYears.length - 1, 0]; // switch 0 and uniqueYears.length - 1 for vertical swap
    const domainX = [0, uniqueAnimals.length - 1];

    const tierScale = scaleLinear().domain(domainTier).range([0, radiusArc]);
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

    // map all parameters for animal group
    const dataAnimal = (data, d, animalArray) => {
      const currentArc = {};
      const scaledValue = tierScale(data.value);
      let prevScaledValue = 0;
      if (d - 1 >= 0) {
        prevScaledValue = tierScale(animalArray[d - 1].value);
      }
      const colorValue = checkChange(data, d, animalArray);

      currentArc.id = data.column;
      currentArc.value = scaledValue;
      currentArc.valueTotal =
        formatNumber(data.value) === '0' ? 'unbekannt/geheim' : formatNumber(data.value);
      console.log(currentArc.valueTotal);
      currentArc.year = +data.year;
      currentArc.path = arcGenerator(scaledValue);
      currentArc.y = yScale(uniqueYears.indexOf(parseInt(data.year)));
      currentArc.x = xScale(uniqueAnimals.indexOf(data.column));
      currentArc.color = colorCategory(colorValue);
      currentArc.pathPrev =
        formatNumber(data.value) === '0' ? arcGenerator(0) : arcGenerator(prevScaledValue);
      currentArc.radius = scaledValue;
      currentArc.radiusPrev = formatNumber(data.value) === 0 ? 0 : prevScaledValue;

      return currentArc;
    };

    // call function above for each animal group
    dataSchweine.forEach((data, d) => {
      arcSchweine.push(dataAnimal(data, d, dataSchweine));
    });
    dataRinder.forEach((data, d) => {
      arcRinder.push(dataAnimal(data, d, dataRinder));
    });
    dataSchafe.forEach((data, d) => {
      arcSchafe.push(dataAnimal(data, d, dataSchafe));
    });
  }

  return (
    <div className={`animal-count horizontal-bottom-layout ${isThumbnail ? 'is-thumbnail' : ''}`}>
      {currentData !== undefined && currentData.data !== undefined && (
        <div className="visualization-container" ref={targetRef}>
          <svg className="chart" width="100%" height="100%">
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="10"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <polyline points="0,0 10,5 0,10" fill="none" stroke="#484848" strokeWidth="2" />
              </marker>
            </defs>
            <g
              className="legend"
              transform={`translate(${marginWidth / 2}, ${marginHeight / 1.5})`}
            >
              <g className="label-item wenigerTiere">
                <circle className="wenigerTiere" cx="0" cy="0" r={legendRadius} />

                <text x={legendRadius + 10} y={legendRadius / 2 + 2}>
                  weniger Tiere
                </text>
              </g>
              <g className="label-item mehrTiere">
                <circle className="mehrTiere" cx="120" cy="0" r={legendRadius} />

                <text x={legendRadius + 130} y={legendRadius / 2 + 2}>
                  mehr Tiere
                </text>
              </g>
              <g className="label-item vorherigeZaehlung">
                <circle className="vorherigeZaehlung" cx="240" cy="0" r={legendRadius} />
                <text x={legendRadius + 250} y={legendRadius / 2 + 2}>
                  Anzahl aus vorheriger Zählung
                </text>
              </g>
            </g>
            <g className="axis">
              {axisElements.map((axis, a) => {
                return (
                  <g key={a} className="x-axis-container">
                    <g key={a} transform={`translate(0, ${axis.y})`}>
                      <line
                        x1={marginWidth}
                        x2={dimensions.width - marginWidth}
                        y1="0"
                        y2="0"
                        stroke="#484848"
                      />
                      {/* YEAR */}
                      <text className="year-label" x={marginWidth} y="-10" textAnchor="start">
                        {axis.label}
                      </text>
                    </g>
                    <g key={axis.labelAnimal} transform={`translate(${axis.x},0)`}>
                      {/* Animal */}
                      <text x="0" y={marginHeight * 2} textAnchor="middle" className="animal-label">
                        {axis.labelAnimal}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
            <g className="arcs">
              {arcSchweine.map((arc, a) => {
                return (
                  <g key={a} transform={`translate(${arc.x},${arc.y})`}>
                    <path d={arc.path} fill={arc.color} />
                    <path className="previousYear" d={arc.pathPrev} />
                    <g className="label-container">
                      <text x="0" y={marginLabel + 12} fill="black" textAnchor="middle">
                        {arc.valueTotal}
                      </text>
                    </g>

                    {arc.radiusPrev !== 0 && Math.abs(arc.radiusPrev - arc.radius) > 5 && (
                      <polyline
                        points={'0, ' + -arc.radiusPrev + ', 0,' + -arc.radius}
                        fill="none"
                        stroke="#484848"
                        markerEnd="url(#arrow)"
                      />
                    )}
                  </g>
                );
              })}
              {arcRinder.map((arc, a) => {
                return (
                  <g key={a} transform={`translate(${arc.x},${arc.y})`}>
                    <path d={arc.path} fill={arc.color} />
                    <path className="previousYear" d={arc.pathPrev} />
                    <g className="label-container">
                      <text x="0" y={marginLabel + 12} fill="black" textAnchor="middle">
                        {arc.valueTotal}
                      </text>
                    </g>

                    {arc.radiusPrev !== 0 && Math.abs(arc.radiusPrev - arc.radius) > 5 && (
                      <polyline
                        points={'0, ' + -arc.radiusPrev + ', 0,' + -arc.radius}
                        fill="none"
                        stroke="#484848"
                        markerEnd="url(#arrow)"
                      />
                    )}
                  </g>
                );
              })}
              {arcSchafe.map((arc, a) => {
                return (
                  <g key={a} transform={`translate(${arc.x},${arc.y})`}>
                    <path d={arc.path} fill={arc.color} />
                    <path className="previousYear" d={arc.pathPrev} />
                    <g className="label-container">
                      <text x="0" y={marginLabel + 12} fill="black" textAnchor="middle">
                        {arc.valueTotal}
                      </text>
                    </g>

                    {arc.radiusPrev !== 0 && Math.abs(arc.radiusPrev - arc.radius) > 5 && (
                      <polyline
                        points={'0, ' + -arc.radiusPrev + ', 0,' + -arc.radius}
                        fill="none"
                        stroke="#484848"
                        markerEnd="url(#arrow)"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      )}
      <div className="description">
        <div className="title">
          <h4>
            Entwicklung der Anzahl an Rindern, Schweinen und Schafen in <span>{locationLabel}</span>{' '}
            über die Jahre {firstYear} bis {lastYear}.
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Land;
