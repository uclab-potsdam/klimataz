import React from "react";
import { scaleLog } from "d3-scale";
import { extent, max } from "d3-array"


const Waste = ({ currentData, currentIndicator, currentSection, lkData }) => {

   //set default value to avoid errors
   let lastYear = "?";
   let lastValue = "?";

   if (currentData !== undefined) {
      const lastDataPoint = currentData.data.slice(-1)
      lastYear = lastDataPoint[0]["year"]
      lastValue = lastDataPoint[0]["value"]

      const domainY = [0, max(currentData.data.map(d => d.value))]
      const domainX = extent(currentData.data.map(d => +d.year))
      currentData.data.forEach(d => {
         // console.log(d)
      })
      // console.log()
   }

   // console.log(currentData)

   return (
      <div className="biotonne-weight horizontal-bottom-layout">
         <svg className="chart">
            <text x="50%" y="50%" textAnchor="middle">
               Waste
            </text>
         </svg>
         <div className="description">
            <div className="title">
               <h3>
                  <span>{lastYear}</span> wurden in <span>{lkData}</span> <span>{lastValue}</span> Thousand tonnen organische Abfälle
                  aus der <span className="first-value">Biotonne</span> und <span className="second-value">Garten- und Parkabfällen</span> entsorgt
               </h3>
            </div>
         </div>
      </div>
   );
};

export default Waste;