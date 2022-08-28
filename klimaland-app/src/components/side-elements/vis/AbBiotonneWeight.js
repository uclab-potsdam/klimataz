import React, { useRef, useLayoutEffect, useState } from 'react';
import { scaleLinear } from "d3-scale";
import { extent, max, min } from "d3-array"
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
            setPies(true)
         } else {
            setPies(false)
         }
      }
   }

   //set default value to avoid errors
   let lastYear = "?";
   let lastValue = "?";
   const chartData = [];
   let xScale;
   let yScale;
   let yAxis;
   let yAxisValues;
   let yAxisLabels;
   const width = dimensions.width;
   const height = dimensions.height;
   const marginWidth = Math.round(dimensions.width / 10);
   const marginHeight = Math.round(dimensions.height / 10);
   const radius = isThumbnail ? Math.ceil(width / 80) : Math.ceil(width / 100);

   if (currentData !== undefined) {
      const lastDataPoint = currentData.data.slice(-1)
      lastYear = lastDataPoint[0]["year"]
      lastValue = lastDataPoint[0]["value"]

      const domainY = [0, max(currentData.data.map(d => d.value))]
      const domainX = extent(currentData.data.map(d => +d.year))
      xScale = scaleLinear().domain(domainX).range([marginWidth, width - marginWidth])
      yScale = scaleLinear().domain(domainY).range([height, marginHeight]).nice()

      yAxisValues = yScale.ticks(10).filter(d => d !== 0);
      yAxis = yAxisValues.map(d => yScale(d))
      yAxisLabels = yAxisValues.map(d => {
         var length = Math.log(d) * Math.LOG10E + 1 | 0;
         //not sure
         // if (length <= 6) {
         //    return `${d / 10000} Hun/To`
         // }
         return `${d / 1000000} Mln/To`
      })

      const onlySumData = currentData.data.filter(el => el.column === "sum")
      const minSumValue = min(onlySumData.map(d => d.value))
      const maxSumValue = max(onlySumData.map(d => d.value))

      const pieConst = pie().value(d => d);

      onlySumData.forEach(d => {
         if (d.column === "sum") {
            const currentDataPoint = {}
            currentDataPoint.value = d.value
            currentDataPoint.year = +d.year

            // data for optional pies
            const elWithSameYear = currentData.data.filter(el => +el.year === +d.year)
            const biotonneSameYear = elWithSameYear.find(el => el.column === "biotonne")
            const biotonne = biotonneSameYear.value
            const gartenSameYear = elWithSameYear.find(el => el.column === "gartenPark")
            const garten = gartenSameYear.value

            const pieIds = [biotonneSameYear.column, gartenSameYear.column]
            const pieEls = pieConst([biotonne, garten])

            const pieShape = pieEls.map((d, i) => {
               const pie = arc()
                  .innerRadius(radius + 5)
                  .outerRadius(radius + 12)
                  .startAngle(d.startAngle)
                  .endAngle(d.endAngle)

               return {
                  id: pieIds[i],
                  path: pie(d)
               }
            })

            currentDataPoint.x = xScale(+d.year)
            currentDataPoint.y = yScale(d.value)
            currentDataPoint.pie = pieShape
            currentDataPoint.class = 'mean'

            if (minSumValue === d.value) {
               currentDataPoint.class = 'minimum'
            } else if (maxSumValue === d.value) {
               currentDataPoint.class = 'max'
            }

            chartData.push(currentDataPoint)
         }
      })


   }

   return (
      <div className={`biotonne-weight horizontal-bottom-layout ${isThumbnail ? 'is-thumbnail' : ''}`}>
         <div className="visualization-container" ref={targetRef}>
            <svg className="chart" width="100%" height="100%">
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
                              x="5"
                              y={height - d.y - 5}
                              transform={`rotate(-90, 10, ${height - d.y - 10})`}>
                              {d.year}
                           </text>
                           <g className={`pie ${piesAreActive ? 'show-pies' : ''}`}>
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
                  <g transform={`translate(${width / 2 + marginWidth * 1.5}, ${marginHeight / 2})`}>
                     <g className={`legend ${piesAreActive ? 'show-legend' : ''}`}>
                        <circle cx="0" cy="0" r={radius} fill="#1A8579" />
                        <text x={radius + 5} y={radius / 2}>Biotonne</text>
                        <circle cx="100" cy="0" r={radius} fill="#f6a119" />
                        <text x={radius + 105} y={radius / 2}>Gartenabfall</text>
                     </g>
                     <g className="pie-controller" onClick={activatePies}>
                        <rect x="205" y={-(20 / 2)} width="40" height="20" rx="10" fill="#ffe8c9" stroke="#484848" />
                        <rect x={piesAreActive ? 225 : 205} y={-(20 / 2)} width="20" height="20" rx="10" fill="#484848" />
                     </g>
                  </g>
               </g>
            </svg>
         </div>
         <div className="description">
            < div className="title" >
               <h3>
                  <span>{lastYear}</span> wurden in <span>{lkData}</span> <span>{lastValue}</span> Thousand tonnen organische Abfälle
                  aus der <span className="first-value">Biotonne</span> und <span className="second-value">Garten- und Parkabfällen</span> entsorgt
               </h3>
            </div>
         </div >
      </div >
   );
};

export default Waste;