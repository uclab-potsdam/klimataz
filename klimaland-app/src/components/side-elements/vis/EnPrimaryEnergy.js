import React, { useRef, useLayoutEffect, useState } from 'react';
import { stack, stackOffsetSilhouette, stackOrderAscending, curveCatmullRom, area } from 'd3-shape';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { uniq } from 'lodash';
import { max, extent } from 'd3-array';

const Energy = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {
  const colorArray = [
    '#E14552', // Steinkohle
    '#732b20', // Braunkohle
    '#FF9B7B', // Mineralöle und Mineralöl produkte
    '#FFD5C8', // Gase
    '#007F87', // Gesamt Erneuerbare Energieträger
    '#2A4D9C', // Stromaustauschsaldo
    '#FFBE53', // Kernenergie
    '#a8a8a8', // Andere Energieträger
  ];

  const labelArray = [
    'Steinkohle',
    'Braunkohle',
    'Mineralöle',
    'Gase',
    'Erneuerbare Energien',
    'Stromaustauschsaldo',
    'Kernenergie',
    'Sonstige',
  ];

  // , 'Kernenergie', 'Andere Energieträger']
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
  const paddingHeight = 15;
  let xAxisElements = [];
  let streamEle = [];
  let scaleCategory = function () {
    return undefined;
  };
  let mapLabel = function () {
    return undefined;
  };
  let lastYear = '?';
  let percRenewables = 0;

  if (currentData !== undefined) {
    // parameters for description text
    const lastDataPoint = currentData.data.slice(-1);
    lastYear = lastDataPoint[0]['year'];
    percRenewables = lastDataPoint[0].value !== null ? lastDataPoint[0].value.toFixed(1) : 0;

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
        category !== 'Biomasse 1)' &&
        category !== 'Sonstige erneuerbare Energien 2)'
      );
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
    const yScale = scaleLinear()
      .domain(domainY)
      .range([dimensions.height - paddingHeight, marginHeight])
      .nice();

    // map source to color
    scaleCategory = scaleOrdinal().domain(uniqueEnergySourceFiltered).range(colorArray);

    mapLabel = (d) => {
      const labelIndex = uniqueEnergySourceFiltered.indexOf(d);
      return labelArray[labelIndex];
    };

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
      const label = mapLabel(stream.key);
      return {
        id: stream.key,
        fill: scaleCategory(stream.key),
        path: areaGen(stream),
        xPos: xScale(stream[21].data.year),
        yPos: yScale(stream[21][0] - (stream[21][0] - stream[21][1]) / 2),
        height: yScale(stream[21][0] - stream[21][1]),
        width: label.length,
      };
    });
  }

  return (
    <div className={`primary-energy horizontal-bottom-layout ${isThumbnail ? 'is-thumbnail' : ''}`}>
      <div className="visualization-container" ref={targetRef}>
        <svg className="chart" width="100%" height="100%">
          <g className="axis">
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
                    <text x="-18" y={marginHeight + 15} textAnchor="middle">
                      {axis.label}
                    </text>
                  </g>
                );
              } else {
                return null;
              }
            })}
          </g>
          <g className="stream">
            {streamEle.map((stream, s) => {
              return (
                <g key={s}>
                  <path d={stream.path} stroke="black" strokeWidth="0.75" fill={stream.fill} />
                  {stream.height > 210 && (
                    <g>
                      <rect
                        className="marker-label"
                        x={stream.xPos - stream.width * 2}
                        y={stream.yPos - 8}
                        width={stream.width * 8}
                        height="16"
                        fill="white"
                        stroke="black"
                      />
                      <text
                        className="marker-label"
                        x={stream.xPos - stream.width}
                        y={stream.yPos + 4}
                        fill="black"
                      >
                        {mapLabel(stream.id)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <div className="description">
        <div className="title">
          <h3>
            Der Energieverbrauch in {lkData} basiert im Jahr <span>{lastYear}</span> zu{' '}
            <span> {percRenewables}%</span> auf{' '}
            <span className="second-value"> erneuerbaren Energien</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Energy;
