import React, { useRef, useLayoutEffect, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { line, stack } from 'd3-shape';

const MoModalSplit = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {
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

  let averageKmDistance;
  let plotAvgData = [];
  let plotPercData = [];
  let defaultYear = 2017;
  // let maxYValue = null;
  const referenceXTicks = [...Array.from(Array(11)).keys()];
  const marginWidth = Math.round(dimensions.width / 20);
  // const maxRangeHeight = Math.round(dimensions.height / 10);
  const marginHeight = dimensions.height - dimensions.height / 8;
  const rightMarginWidth = Math.round(dimensions.width - dimensions.width / 4);
  const orderOfModes = ['Fuß', 'Fahrrad', 'ÖPV', 'Mitfahrer', 'Fahrer'];
  const colors = ['#3762FB', '#5F88C6', '#2A4D9C', '#FFD0D0', '#FF7B7B'];
  let yScale;
  let xScale;
  let xScaleReverse;
  let yBarScale;

  if (currentData.data !== undefined) {
    averageKmDistance = currentData.data.filter(
      (d) => d.column.includes('average') && +d.year === defaultYear
    );
    // const longestAvgRoute = max(averageKmDistance.map((d) => (d.value !== null ? d.value : null)));
    // maxYValue = Math.floor(longestAvgRoute / 10);

    xScale = scaleLinear().domain([0, 10]).range([marginWidth, rightMarginWidth]);
    xScaleReverse = scaleLinear().domain([10, 0]).range([marginWidth, rightMarginWidth]);
    yScale = scaleLinear()
      .domain([0, 5])
      .range([0, dimensions.height / 4.5]);

    averageKmDistance.forEach((mode, m) => {
      const element = {};
      const nameOfMode = mode.column.split('_').pop();
      element.mode = nameOfMode.replace(/[{()}]/g, '');
      element.label = mode.value.toFixed(2) + 'km';

      // depending on size of value start at zero (for > 10) or with value (< 10)
      const startValue = 0.1;
      const values = mode.value > 10 ? [] : [[0, 0]];
      let difference = mode.value > 10 ? 0 : mode.value;

      // for elements bigger than 10 loops over and push coordinates
      let tot = mode.value;
      let rowIndex = 0;
      let i = 10;

      while (i < tot) {
        difference = tot - i;
        // if it's even rows goes from left to right
        if (rowIndex % 2 === 0) {
          values.push([0, rowIndex], [10, rowIndex], [10, rowIndex + 1]);
        } else {
          // if it's odd rows goes from right to left
          values.push([10, rowIndex], [startValue, rowIndex], [startValue, rowIndex + 1]);
        }

        rowIndex = rowIndex + 1;
        i += 10;
      }

      const checkDataPosition = function (x) {
        return x !== startValue && x !== 0 && x < 10 && rowIndex > 0 && rowIndex % 2 !== 0
          ? true
          : false;
      };

      // constructor is created on the fly to reverse scale
      const lineConstructor = line()
        .x((d) => (checkDataPosition(d[0]) ? xScaleReverse(d[0]) : xScale(d[0])))
        .y((d) => yScale(d[1]));

      // pushing last element with difference value,
      //in items < 10 this should be = tot
      const lastCoor = [difference, rowIndex];
      values.push(lastCoor);
      // create path
      element.path = lineConstructor(values);

      // accessory elements
      // const isReverse = lastCoor[0] !== 0 && lastCoor[0] < 5 && rowIndex > 0
      element.labelX = checkDataPosition(lastCoor[0])
        ? xScaleReverse(lastCoor[0])
        : xScale(lastCoor[0]);
      element.labelY = yScale(lastCoor[1]);

      const ticksIterations = [...Array.from(Array(rowIndex + 1)).keys()];
      const ticks = [...Array.from(Array(10)).keys()];
      const allTicks = [];

      ticksIterations.forEach((d) => {
        const realTicks = ticks.map((tick) => {
          return {
            x: xScale(tick),
            y: yScale(d),
          };
        });

        allTicks.push(realTicks);
      });

      element.ticks = allTicks.flat();
      plotAvgData.push(element);
    });

    plotAvgData.sort((a, b) => orderOfModes.indexOf(a.mode) - orderOfModes.indexOf(b.mode));

    // code for right-side % bar
    const percentageNumOfTrips = currentData.data.filter(
      (d) => d.column.includes('tripcount_percentage') && +d.year === defaultYear
    );
    // To Do: fix problem with scale for bar
    yBarScale = scaleLinear().domain([0, 100]).range([10, marginHeight]);

    const element = {};

    percentageNumOfTrips.forEach((trip, t) => {
      const nameOfMode = trip.column.split('_').pop();
      const mode = nameOfMode.replace(/[{()}]/g, '');
      if (mode !== 'sum') {
        element[mode] = trip.value;
      }
    });

    const stacks = stack().keys(orderOfModes)([element]);
    plotPercData = stacks.map((bar, b) => {
      const data = bar[0];

      const label = data.data[bar.key].toFixed(2);
      return {
        mode: bar.key,
        fill: colors[b],
        y1: yBarScale(data[0]),
        y2: yBarScale(data[1]),
        label,
      };
    });
  }

  return (
    <div className={`modal-split ${isThumbnail ? 'is-thumbnail' : ''}`}>
      <div className="description">
        <div className="title">
          <h3>
            Mit was und wie weit fahren Menschen in <span>{lkData}</span> zur Arbeit?
          </h3>
        </div>
      </div>
      <div className="visualization-container" ref={targetRef}>
        <svg className="chart">
          <g className="paths-avg-trip">
            {
              <g className="paths">
                <g className="main-x-axis" transform={`translate(${xScale(0)}, ${marginHeight})`}>
                  <line x1="0" x2={xScale(9.5)} y1="0" y2="0" />
                  <text x="0" y="15">
                    average Km
                  </text>
                </g>
                {plotAvgData.map((trip, t) => {
                  return (
                    <g transform={`translate(0, ${(t + 0.5) * 65})`} key={t} className={trip.mode}>
                      <g className="axis">
                        <text x={marginWidth} y="-18" fill={colors[t]}>
                          {trip.mode}
                        </text>
                        {referenceXTicks.map((tick, t) => {
                          return (
                            <g transform={`translate(${xScale(tick)}, 0)`}>
                              <line x1="0" x2="0" y1="0" y2="5" />
                            </g>
                          );
                        })}
                      </g>
                      <g className="paths">
                        <path d={trip.path} stroke={colors[t]} fill="none" strokeWidth="10" />
                        <g
                          className="avgkm-marker"
                          transform={`translate(${trip.labelX}, ${trip.labelY + 5})`}
                        >
                          <text x="5" y={-(trip.labelY + 2 * 10)} fill={colors[t]}>
                            {trip.label}
                          </text>
                          <line x1="0" x2="0" y1="0" y2={-(trip.labelY + 2 * 10)} />
                        </g>
                        <g className="mapped-axis">
                          {trip.ticks.map((tick, t) => {
                            return (
                              <g key={t}>
                                <g transform={`translate(${tick.x}, ${tick.y})`}>
                                  <line x1="0" x2="0" y1="-5" y2="5" />
                                </g>
                              </g>
                            );
                          })}
                        </g>
                      </g>
                    </g>
                  );
                })}
              </g>
            }
          </g>
          <g
            className="bar-percentage-trip"
            transform={`translate(${rightMarginWidth + marginWidth * 2}, 0)`}
          >
            <text x="10" y={marginHeight + 15} textAnchor="end">
              % der Trips
            </text>
            {plotPercData.map((trip, t) => {
              return (
                <g transform={`translate(0, ${trip.y1})`} key={t}>
                  <text x="15" y="13" fill={trip.fill}>
                    {trip.label}
                  </text>
                  <rect width="10" height={trip.y2 - trip.y1} x="0" y="0" fill={trip.fill} />
                  <line x1="0" x2="30" y1="0" y2="0" />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default MoModalSplit;
