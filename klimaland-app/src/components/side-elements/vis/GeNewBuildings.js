import React, { useRef, useLayoutEffect, useState } from 'react';
import { percentage, firstToUppercase } from '../../helperFunc';
import { uniq } from 'lodash';
import { max, extent, mean, sum } from 'd3-array';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { line } from 'd3-shape';

const Buildings = ({
  currentData,
  currentIndicator,
  currentSection,
  locationLabel,
  isThumbnail,
}) => {
  // getting sizes of container for maps
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [currentId, setCurrentId] = useState('Renewables');

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      });
    }
  }, []);

  window.mobileCheck = function () {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };

  // inital variables
  let uniqueEnergyTypes = [];
  let lineElements = [];
  let axisElements = [];
  let yAxisValues = [];
  let yAxis = [];
  let numberOfBuildings = 0;
  let selectedEnergy = 0;
  const isMobile = dimensions.width <= 350 && window.mobileCheck(window);
  let scaleCategory = function () {
    return undefined;
  };
  const marginHeight = Math.ceil(dimensions.width / 10);
  const marginWidth = Math.ceil(dimensions.height / 10);

  //clean labels to create classes
  const cleanKlassString = function (label) {
    let cleanedKlassString = label
    if (label.includes('/') && !label.includes(' ')) {
      cleanedKlassString = cleanedKlassString.split('/')[1]
    } else if (label.includes('(')) {
      cleanedKlassString = cleanedKlassString.split(' ')[0]
    } else if (label.includes(' ') && !label.includes('(')) {
      cleanedKlassString = cleanedKlassString.split(' ')[1]
    }

    return cleanedKlassString
  }

  //handle click on legend to change label
  let changeId = function (id) {
    if (currentData !== undefined) {
      setCurrentId(id);
    }
  };

  if (currentData !== undefined) {
    // arrays
    const energyData = currentData.data.filter((d) => { return d.column !== 'Number_buil' })
    energyData.forEach((d) => (d.column = firstToUppercase(d.column)));

    const uniqueYears = uniq(energyData.map((d) => +d.year));
    const allBuildings = energyData.map((d) => d.value);
    const existingEnergies = energyData.filter((d) => d.value !== null);
    const existingEnergiesLY = existingEnergies.filter((d) => +d.year === max(uniqueYears))
    selectedEnergy = existingEnergiesLY.filter((d) => d.column === currentId)

    uniqueEnergyTypes = uniq(existingEnergies.map((d) => d.column)).sort(
      (a, b) => a.localeCompare(b));
    numberOfBuildings = Math.round(mean(allBuildings));

    // Selects higher element in dataset
    if (currentId === '') {
      setCurrentId(uniqueEnergyTypes[0]);
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
      let typeKlass = type.toLowerCase()

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
          label: `${d.value.toFixed(1)} %`,
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
          <h3>Wie wird in Neubauten geheizt?</h3>
        </div>
        <div className={`${cleanKlassString(currentId.toLowerCase())} caption`}>
          <p>
            Durchschnittlich werden in {locationLabel} pro Jahr <span>{numberOfBuildings}</span>{' '}
            neue Wohnungen oder Häuser fertiggestellt.
            Zu <span className="energy-number">{selectedEnergy[0].value.toFixed(1)}%</span> wird davon mit{' '}
            <span className="energy-number">{firstToUppercase(currentId)}</span> geheizt.
          </p>
        </div>
        <div className="legend">
          <div className="legend-inner">
            <div className="legend-elements-container">
              {uniqueEnergyTypes.map((type, t) => {
                return (
                  <div key={t} onClick={() => changeId(type)} className="legend-element">
                    <div
                      className={`element-color ${cleanKlassString(type.toLowerCase())}`}
                    />
                    <p x="15" y="10" className={type === currentId ? 'selected' : ''}>
                      {firstToUppercase(type)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {currentData.data !== undefined && (
        <div className="visualization-container" ref={targetRef}>
          <svg className="chart">
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
                  <g key={l} className={`${line.klassName} ${line.type} line`}>
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
                          className={`year-marker ${en.klassName} ${en.id === currentId ? 'default' : 'optional'}`}
                        >
                          <circle cx="0" cy="0" r="3" />
                          <g transform="translate(5, 0)">
                            <rect
                              className="marker-label"
                              x={a === axis.length - 1 ? -40 : -2}
                              y="-25"
                              width="45"
                              height="20"
                              fill="white"
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
        </div>)}
    </div>
  );
};

export default Buildings;
