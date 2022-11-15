import React, { useRef } from 'react';
import { scaleLinear } from 'd3-scale';
import { line, stack } from 'd3-shape';
import { formatNumber, useCardSize } from '../../../helpers/helperFunc';
import { ReactComponent as Fahrer } from '../../../img/legends/modalsplit/fahrer.svg';
import { ReactComponent as Mitfahrer } from '../../../img/legends/modalsplit/mitfahrer.svg';
import { ReactComponent as Fuß } from '../../../img/legends/modalsplit/fuss.svg';
import { ReactComponent as Fahrrad } from '../../../img/legends/modalsplit/fahrrad.svg';
import { ReactComponent as ÖPV } from '../../../img/legends/modalsplit/oepv.svg';

const MoModalSplit = ({ currentData, locationLabel, isThumbnail, cardNumber }) => {
  const targetRef = useRef();
  const dimensions = useCardSize(targetRef, cardNumber);

  let averageKmDistance;
  let plotAvgData = [];
  let plotPercData = [];
  let defaultYear = 2017;
  const width = dimensions.width;
  const height = dimensions.height;
  const isMobile = width <= 400;
  const marginWidth = isMobile ? Math.round(width / 10) : Math.round(width / 20);
  const orderOfModes = ['Fuß', 'Fahrrad', 'ÖPV', 'Mitfahrer', 'Fahrer'];
  const colors = ['#3762FB', '#5F88C6', '#2A4D9C', '#FFD0D0', '#FF7B7B'];
  let yScale;
  let xScale;
  let xScaleReverse;

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
    if (name === 'Fahrer') return 'Als Autofahrer*in';
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

    xScale = scaleLinear()
      .domain([0, 10])
      .range([marginWidth, width - marginWidth]);
    xScaleReverse = scaleLinear()
      .domain([10, 0])
      .range([marginWidth, width - marginWidth]);
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
        : xScale(lastCoor[0]) - 40;
      element.markerX = element.labelX;
      element.labelY = yScale(lastCoor[1]);

      const ticksIterations = [...Array.from(Array(rowIndex + 1)).keys()];
      const ticks = [...Array.from(Array(11)).keys()];
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
        yScale: yScale(b),
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
                      transform={`translate(0, ${(t + 1) * (height / 6)})`}
                      key={t}
                      className={trip.mode}
                    >
                      <g className="axis">
                        <g className="icon">
                          <ModeIcon x={marginWidth} style={{ stroke: colors[t] }} />
                        </g>
                        <g className="icon">
                          <text
                            x={marginWidth + getIconWidth(trip.mode) + 10}
                            y="-18"
                            style={{ fill: colors[t] }}
                          >
                            {getLegendName(trip.mode)}
                          </text>
                        </g>
                        <g className="no-icon">
                          <text x={marginWidth} y="-18" style={{ fill: colors[t] }}>
                            {getLegendName(trip.mode)}
                          </text>
                        </g>
                      </g>
                      <g className="paths">
                        <path d={trip.path} stroke={colors[t]} fill="none" strokeWidth="8" />
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
                        <g
                          className="avgkm-marker"
                          transform={`translate(${trip.labelX}, ${trip.labelY})`}
                        >
                          <foreignObject x="0" y="-5" width="1" height="1">
                            <div className={trip.mode} xmlns="http://www.w3.org/1999/xhtml">
                              <p>{trip.label}</p>
                            </div>
                          </foreignObject>
                        </g>
                      </g>
                    </g>
                  );
                })}
              </g>
            }
          </g>
          <g className="bar-percentage-trip" transform={`translate(${width - marginWidth}, -18)`}>
            {plotPercData.map((trip, t) => {
              return (
                <g transform={`translate(0, ${((t + 1) * height) / 6})`} key={t}>
                  <g className="bar-percentage-trip-text">
                    <text x="0" y="0" style={{ fill: trip.fill }} textAnchor="end">
                      {formatNumber(trip.label)} % aller Trips
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
          <h4>
            Mit was und wie weit fahren Menschen in{' '}
            <span className="locationLabel">{locationLabel}</span> zur Arbeit?
          </h4>
        </div>
      </div>
    </div>
  );
};

export default MoModalSplit;
