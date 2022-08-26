import React, { useRef, useLayoutEffect, useState } from 'react';
import { scaleLinear } from "d3-scale";
import { extent, max, min } from "d3-array"
import { pie, arc } from 'd3';


const Waste = ({ currentData, currentIndicator, currentSection, lkData }) => {

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

   //set default value to avoid errors
   let lastYear = "?";
   let lastValue = "?";
   const chartData = [];
   let pieShapes;
   let xScale;
   let yScale;
   let yAxis;
   let yAxisValues;
   let yAxisLabels;
   const width = dimensions.width;
   const height = dimensions.height;
   const marginWidth = Math.round(dimensions.width / 10);
   const marginHeight = Math.round(dimensions.height / 10);

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

            const pieEls = pieConst([biotonne, garten])
            console.log(biotonne)
            const pieShape = pieEls.map(d => {
               const pie = arc()
                  .innerRadius(9)
                  .outerRadius(15)
                  .startAngle(d.startAngle)
                  .endAngle(d.endAngle)
               return pie(d)
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

      // const pieData = currentData.data.filter(el => el.column !== "sum")

      // console.log('pie data', pieShapes)
   }

   return (
      <div className="biotonne-weight horizontal-bottom-layout">
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
                        <g transform={`translate(${d.x}, ${d.y})`} key={i} className={d.class}>
                           <circle cx="0" cy="0" r="5" />
                           <text
                              x="5"
                              y={height - d.y - 5}
                              transform={`rotate(-90, 10, ${height - d.y - 10})`}>
                              {d.year}
                           </text>
                           <line x1="0" x2="0" y1="0" y2={height - d.y} />
                           <g>
                              {
                                 d.pie.map(function (pie, p) {
                                    return (
                                       <path d={pie} />
                                    )
                                 })
                              }
                           </g>
                        </g>
                     )
                  })
               }
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