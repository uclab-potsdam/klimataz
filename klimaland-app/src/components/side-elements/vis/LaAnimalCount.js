import React, { useRef, useLayoutEffect, useState } from 'react';
import { arc } from 'd3';
import { max } from 'd3-array';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { uniq } from 'lodash';
import { formatNumber } from '../../../helpers/helperFunc';

const Land = ({ currentData, currentIndicator, currentSection, locationLabel, isThumbnail }) => {
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
  const isMobile = dimensions.width <= 450 && window.mobileCheck(window);
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
    dataSchweine.map((data, d) => {
      arcSchweine.push(dataAnimal(data, d, dataSchweine));
    });
    dataRinder.map((data, d) => {
      arcRinder.push(dataAnimal(data, d, dataRinder));
    });
    dataSchafe.map((data, d) => {
      arcSchafe.push(dataAnimal(data, d, dataSchafe));
    });
  }

  return (
    <div className={`animal-count horizontal-bottom-layout ${isThumbnail ? 'is-thumbnail' : ''}`}>
      {currentData !== undefined && currentData.data !== undefined && (
        <div className="visualization-container" ref={targetRef}>
          <svg className="chart" width="100%" height="100%">
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
                  als im Vergleich zur vorherigen Zählung
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
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      )}
      <div className="description">
        <div className="title">
          <h3>
            Entwicklung der Anzahl an Rindern, Schweinen und Schafen in {locationLabel} über die
            Jahre {firstYear} bis {lastYear}.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Land;
