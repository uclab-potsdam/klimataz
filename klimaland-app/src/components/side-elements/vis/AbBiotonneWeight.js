import React, { useRef, useLayoutEffect, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { extent, max, min } from 'd3-array';
import { pie, arc } from 'd3';

const Waste = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {
   const targetRef = useRef();
   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
   const [piesAreActive, setPies] = useState(false);

   useLayoutEffect(() => {
      if (targetRef.current) {
         setDimensions({
            width: targetRef.current.offsetWidth,
            height: targetRef.current.offsetHeight,
         });
      }
   }, []);

   //handle click events on controller to show pie
   let activatePies = function (e) {
      if (currentData !== undefined) {
         if (!piesAreActive) {
            setPies(true);
         } else {
            setPies(false);
         }
      }
   };

   //set default value to avoid errors
   let lastYear = '?';
   let lastValue = '?';
   const chartData = [];
   let xScale;
   let yScale;
   let yAxis = [];
   let yAxisValues;
   let yAxisLabels;
   const width = dimensions.width;
   const height = dimensions.height;
   let rotationX = width <= 300 ? 8 : 10
   const marginWidth = Math.round(dimensions.width / 10);
   const marginHeight = Math.round(dimensions.height / 10);
   const radius = isThumbnail ? Math.ceil(width / 50) : Math.ceil(width / 80);

   if (currentData !== undefined) {
      const lastDataPoint = currentData.data.slice(-1);
      lastYear = lastDataPoint[0]['year'];
      lastValue = `${(lastDataPoint[0]['value'] / 1000).toFixed(2)}`;

      const domainY = [0, max(currentData.data.map((d) => d.value))];
      const domainX = extent(currentData.data.map((d) => +d.year));
      xScale = scaleLinear()
         .domain(domainX)
         .range([marginWidth, width - marginWidth]);
      yScale = scaleLinear().domain(domainY).range([height, marginHeight]).nice();

      yAxisValues = yScale.ticks(10);
      yAxis = yAxisValues.map((d) => yScale(d));
      yAxisLabels = yAxisValues.map((d, i) => {
         if (i === yAxisValues.length - 1) {
            return `${d / 1000} Mln Thonnes`;
         }
         return d / 1000;
      });

      const onlySumData = currentData.data.filter((el) => el.column === 'sum');
      const minSumValue = min(onlySumData.map((d) => d.value));
      const maxSumValue = max(onlySumData.map((d) => d.value));

      const pieConst = pie().value((d) => d);

      onlySumData.forEach((d) => {
         if (d.column === 'sum') {
            const currentDataPoint = {};
            currentDataPoint.value = d.value;
            currentDataPoint.year = +d.year;
            currentDataPoint.yearClass = +d.year % 2 === 0 ? 'even-year' : 'odd-year'

            // data for optional pies
            const elWithSameYear = currentData.data.filter((el) => +el.year === +d.year);
            const biotonneSameYear = elWithSameYear.find((el) => el.column === 'biotonne');
            const biotonne = biotonneSameYear.value;
            const gartenSameYear = elWithSameYear.find((el) => el.column === 'gartenPark');
            const garten = gartenSameYear.value;

            const pieIds = [biotonneSameYear.column, gartenSameYear.column];
            const pieEls = pieConst([biotonne, garten]);

            const pieShape = pieEls.map((d, i) => {
               const pie = arc()
                  .innerRadius(radius + 5)
                  .outerRadius(radius + 12)
                  .startAngle(d.startAngle)
                  .endAngle(d.endAngle);

               return {
                  id: pieIds[i],
                  path: pie(d),
               };
            });

            currentDataPoint.x = xScale(+d.year);
            currentDataPoint.y = yScale(d.value);
            currentDataPoint.pie = pieShape;
            currentDataPoint.class = 'mean';

            if (minSumValue === d.value) {
               currentDataPoint.class = 'minimum';
            } else if (maxSumValue === d.value) {
               currentDataPoint.class = 'max';
            }

            chartData.push(currentDataPoint)
         }
      })


   }

   return (
      <div className={`biotonne-weight horizontal-bottom-layout ${isThumbnail ? 'is-thumbnail' : ''}`}>
         <div className="visualization-container" ref={targetRef}>
            <svg className="chart" width="100%" height="100%">
               <defs>
                  <linearGradient id="MyGradient">
                     <stop offset="50%" stopColor="#e6c9a2" />
                     <stop offset="100%" stopColor="#ffe8c9" />
                  </linearGradient>
               </defs>
               <g className="y-axis">
                  {
                     yAxis.map(function (d, i) {
                        return (
                           <g transform={`translate(0, ${d})`} key={i}>
                              <line x1="0" x2={width} y1="0" y2="0" stroke="black" />
                              <text x="10" y="-5" textAnchor="start">{yAxisLabels[i]}</text>
                           </g>
                        )
                     })
                  }
               </g>
               {
                  chartData.map(function (d, i) {
                     return (
                        <g transform={`translate(${d.x}, ${d.y})`} key={i} className={`year-el ${d.class}`}>
                           <line x1="0" x2="0" y1="0" y2={height - d.y} />
                           <circle cx="0" cy="0" r={radius} />
                           <text
                              className={d.yearClass}
                              x="5"
                              y={height - d.y - 5}
                              transform={`rotate(-90, ${rotationX}, ${height - d.y - rotationX})`}>
                              {d.year}
                           </text>
                           <g className={`pie ${piesAreActive && !isThumbnail ? 'show-pies' : ''}`}>
                              {
                                 d.pie.map(function (pie, p) {
                                    return (
                                       <path d={pie.path} className={pie.id} key={p} />
                                    )
                                 })
                              }
                           </g>
                        </g>
                     )
                  })
               }
               <g className="controls-container">
                  <g transform={`translate(${width / 2 + marginWidth}, ${marginHeight / 2})`}>
                     <g className={`legend ${piesAreActive ? 'show-legend' : ''}`}>
                        <circle className="biotonne" cx="0" cy="0" r={radius} />
                        <text x={radius + 5} y={radius / 2}>Biotonne</text>
                        <circle className="gartenPark" cx="100" cy="0" r={radius} />
                        <text x={radius + 105} y={radius / 2}>Gartenabfall</text>
                     </g>
                     <g className="pie-controller" onClick={activatePies}>
                        <rect className="controller-bg" x="205" y={-(20 / 2)} width="40" height="20" rx="10" />
                        <rect x={piesAreActive ? 225 : 205} y={-(20 / 2)} width="20" height="20" rx="10" fill="#FFF9F1" stroke="#484848" />
                        <g transform="translate(255, -10)">
                           <path d="M18.5955 19.2306L18.95 19.5833L19.3027 19.2288C21.3505 17.1703 22.5 14.385 22.5 11.4812C22.5 5.41539 17.5836 0.499023 11.5178 0.499023V0.999023H11.0178V4.37493V4.87493H11.5178C13.2643 4.87493 14.9402 5.56693 16.1784 6.79878C18.7643 9.37216 18.7738 13.5557 16.2003 16.1418L15.8476 16.4962L16.202 16.8489L18.5955 19.2306Z" fill="#FFF9F1" stroke="#484848" />
                           <path d="M3.73475 3.73523C-0.54497 8.0344 -0.527275 14.988 3.7718 19.266C8.07099 23.5457 15.0247 23.528 19.3026 19.2288L19.6553 18.8744L19.3008 18.5217L16.9073 16.14L16.5529 15.7873L16.2002 16.1418C14.9607 17.3876 13.2754 18.0875 11.5178 18.0875C7.86944 18.0875 4.9115 15.1296 4.9115 11.4812C4.9115 7.83287 7.86944 4.87493 11.5178 4.87493H12.0178V4.37493V0.999023V0.499023H11.5178C8.59645 0.499023 5.79516 1.66258 3.73475 3.73523ZM3.73475 3.73523L4.0891 4.08798L3.73449 3.73549C3.73458 3.7354 3.73466 3.73532 3.73475 3.73523Z" fill="#FFF9F1" stroke="#424242" />
                        </g>
                     </g>
                  </g>
               </g>
            </svg>
         </div>
         <div className="description">
            < div className="title" >
               <h3>
                  Im Jahr <span>{lastYear}</span> wurden in <span>{lkData}</span> <span>{lastValue}</span> Milliarden Tonnen
                  organische Abfälle korrekt in der Biotonne oder als Gartenabfälle entsorgt XXXX und damit Co2-Emissionen verringert.
               </h3>
            </div>
         </div >
      </div >
   );
};

export default Waste;
