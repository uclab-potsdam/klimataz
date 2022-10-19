import React, { useRef, useLayoutEffect, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { line, stack } from 'd3-shape';
import { formatNumber, useCardSize, mobileCheck } from '../../../helpers/helperFunc';
import { ReactComponent as Fahrer } from '../../../img/legends/modalsplit/fahrer.svg';
import { ReactComponent as Mitfahrer } from '../../../img/legends/modalsplit/mitfahrer.svg';
import { ReactComponent as Fuß } from '../../../img/legends/modalsplit/fuss.svg';
import { ReactComponent as Fahrrad } from '../../../img/legends/modalsplit/fahrrad.svg';
import { ReactComponent as ÖPV } from '../../../img/legends/modalsplit/oepv.svg';

const MoModalSplit = ({
  currentData,
  currentIndicator,
  currentSection,
  locationLabel,
  isThumbnail,
  cardNumber,
}) => {
  const targetRef = useRef();
  const dimensions = useCardSize(targetRef, cardNumber);

  let averageKmDistance;
  let plotAvgData = [];
  let plotPercData = [];
  let defaultYear = 2017;
  const width = dimensions.width;
  const height = dimensions.height;
  const isMobile = width <= 350 && mobileCheck(window);
  const mobileThreshold = isMobile ? 10 : 4;
  const tabletThreshold = width >= 600 && width <= 750 ? 55 : 65;
  // let maxYValue = null;
  const referenceXTicks = [...Array.from(Array(11)).keys()];
  const marginWidth = Math.round(width / 20);
  // const maxRangeHeight = Math.round(height / 10);
  const marginHeight = height - height / 8;
  const rightMarginWidth = Math.round(width - width / mobileThreshold);
  const orderOfModes = ['Fuß', 'Fahrrad', 'ÖPV', 'Mitfahrer', 'Fahrer'];
  const colors = ['#3762FB', '#5F88C6', '#2A4D9C', '#FFD0D0', '#FF7B7B'];
  let yScale;
  let xScale;
  let xScaleReverse;
  let yBarScale;

  const icons = {
    Fahrer: Fahrer,
    Fuß: Fuß,
    ÖPV: ÖPV,
    Mitfahrer: Mitfahrer,
    Fahrrad: Fahrrad,
  };

  const getLegendName = function (name) {
    if (name === 'Fuß') return 'Zu Fuß';
    if (name === 'Fahrrad') return 'Mit dem Rad';
    if (name === 'ÖPV') return 'Mit dem ÖPNV';
    if (name === 'Fahrer') return 'Als Mitfahrer*in';
    else if (name === 'Mitfahrer') return 'Als Mitfahrer*in';
    return name;
  };

  const getIconWidth = function (name) {
    if (name === 'Fuß') return 15;
    if (name === 'Fahrrad') return 20;
    if (name === 'ÖPV') return 20;
    if (name === 'Fahrer') return 36;
    if (name === 'Mitfahrer') return 36;
    return 30;
  };

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
      .range([0, height / 4.5]);

    averageKmDistance.forEach((mode, m) => {
      const element = {};
      const nameOfMode = mode.column.split('_').pop();
      element.mode = nameOfMode.replace(/[{()}]/g, '');
      element.label = formatNumber(mode.value.toFixed(2)) + ' km';

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
      element.markerX = element.labelX;
      element.labelY = yScale(lastCoor[1]);

      //solve overlaps with legend title
      const legendWidth =
        marginWidth + getIconWidth(element.mode) + getLegendName(element.mode).length * 5 + 10;
      if (element.labelX < legendWidth) {
        element.labelX += legendWidth - element.labelX + 10;
      }

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
      <div className="visualization-container" ref={targetRef}>
        <svg className="mobility-modalsplit chart">
          <g className="paths-avg-trip">
            {
              <g className="paths">
                {plotAvgData.map((trip, t) => {
                  const ModeIcon = icons[trip.mode];
                  return (
                    <g
                      transform={`translate(0, ${(t + 0.7) * tabletThreshold})`}
                      key={t}
                      className={trip.mode}
                    >
                      <g className="axis">
                        <ModeIcon x={marginWidth} stroke={colors[t]} />
                        <text
                          x={marginWidth + getIconWidth(trip.mode) + 10}
                          y="-18"
                          fill={colors[t]}
                        >
                          {getLegendName(trip.mode)}
                        </text>
                        {referenceXTicks.map((tick, t) => {
                          return (
                            <g transform={`translate(${xScale(tick)}, 0)`} key={t}>
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
                        </g>
                        <g
                          className="avgkm-marker"
                          transform={`translate(${trip.markerX}, ${trip.labelY + 5})`}
                        >
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
            transform={`translate(${rightMarginWidth + marginWidth * 2}, 10)`}
          >
            <text x="10" y={marginHeight + 15} textAnchor="middle">
              Anteil der Trips
            </text>
            {plotPercData.map((trip, t) => {
              return (
                <g transform={`translate(0, ${trip.y1})`} key={t}>
                  <text x="35" y="5" fill={trip.fill}>
                    {formatNumber(trip.label)} %
                  </text>
                  <rect width="10" height={trip.y2 - trip.y1} x="0" y="0" fill={trip.fill} />
                  <line x1="0" x2="30" y1="0" y2="0" />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <div className="description">
        <div className="title">
          <h4>
            Mit was und wie weit fahren Menschen in <span>{locationLabel}</span> zur Arbeit?
          </h4>
        </div>
      </div>
    </div>
  );
};

export default MoModalSplit;
