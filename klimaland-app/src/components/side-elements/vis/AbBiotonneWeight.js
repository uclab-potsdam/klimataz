import React from "react";
import { scaleLinear } from "d3-scale";
import { extent, max } from "d3-array"


const Waste = ({ currentData, currentIndicator, currentSection, lkData }) => {

   //set default value to avoid errors
   let lastYear = "?";
   let lastValue = "?";
   const chartData = [];
   let xScale;
   let yScale;

   if (currentData !== undefined) {
      const lastDataPoint = currentData.data.slice(-1)
      lastYear = lastDataPoint[0]["year"]
      lastValue = lastDataPoint[0]["value"]

      // to do: change  range to dynamic sizes
      const domainY = [0, max(currentData.data.map(d => d.value))]
      const domainX = extent(currentData.data.map(d => +d.year))
      xScale = scaleLinear().domain(domainX).range([10, 650])
      yScale = scaleLinear().domain(domainY).range([300, 0])

      currentData.data.forEach(d => {
         if (d.column === "sum") {
            const currentDataPoint = {}
            currentDataPoint.value = d.value
            currentDataPoint.year = +d.year

            // data for optional pies
            const elWithSameYear = currentData.data.filter(el => +el.year === +d.year)
            const biotonneSameYear = elWithSameYear.find(el => el.column === "biotonne")
            currentDataPoint.biotonne = biotonneSameYear.value
            const gartenSameYear = elWithSameYear.find(el => el.column === "biotonne")
            currentDataPoint.garten = gartenSameYear.value

            currentDataPoint.x = xScale(+d.year)
            currentDataPoint.y = yScale(d.value)

            chartData.push(currentDataPoint)
         }
      })
   }

   return (
      <div className="biotonne-weight horizontal-bottom-layout">
         <svg className="chart" width="100%" height="100%">
            <text x="50%" y="50%" textAnchor="middle">
               Waste
            </text>
            {
               chartData.map(function (d, i) {
                  return (
                     <g transform={`translate(${d.x}, ${d.y})`} key={i}>
                        <circle cx="0" cy="0" r="5" />
                        <text>{d.value}, {d.year}</text>
                     </g>
                  )
               })
            }
         </svg>
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