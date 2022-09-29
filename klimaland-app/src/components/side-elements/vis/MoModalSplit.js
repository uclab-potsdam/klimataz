import React, { useRef, useLayoutEffect, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { line, stack } from 'd3-shape';
import { formatNumber, useCardSize } from '../../../helpers/helperFunc';

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

  window.mobileCheck = function () {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw(n|u)|c55\/|capi|ccwa|cdm|cell|chtm|cldc|cmd|co(mp|nd)|craw|da(it|ll|ng)|dbte|dcs|devi|dica|dmob|do(c|p)o|ds(12|d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(|_)|g1 u|g560|gene|gf5|gmo|go(\.w|od)|gr(ad|un)|haie|hcit|hd(m|p|t)|hei|hi(pt|ta)|hp( i|ip)|hsc|ht(c(| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i(20|go|ma)|i230|iac( ||\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|[a-w])|libw|lynx|m1w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|mcr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|([1-8]|c))|phil|pire|pl(ay|uc)|pn2|po(ck|rt|se)|prox|psio|ptg|qaa|qc(07|12|21|32|60|[2-7]|i)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h|oo|p)|sdk\/|se(c(|0|1)|47|mc|nd|ri)|sgh|shar|sie(|m)|sk0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h|v|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl|tdg|tel(i|m)|tim|tmo|to(pl|sh)|ts(70|m|m3|m5)|tx9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };

  let averageKmDistance;
  let plotAvgData = [];
  let plotPercData = [];
  let defaultYear = 2017;
  const width = dimensions.width;
  const height = dimensions.height;
  const isMobile = width <= 350 && window.mobileCheck(window);
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
      <div className="visualization-container" ref={targetRef}>
        <svg className="chart">
          <g className="paths-avg-trip">
            {
              <g className="paths">
                {plotAvgData.map((trip, t) => {
                  return (
                    <g
                      transform={`translate(0, ${(t + 0.7) * tabletThreshold})`}
                      key={t}
                      className={trip.mode}
                    >
                      <g className="axis">
                        <text x={marginWidth} y="-18" fill={colors[t]}>
                          {trip.mode}
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
              % der Trips
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
