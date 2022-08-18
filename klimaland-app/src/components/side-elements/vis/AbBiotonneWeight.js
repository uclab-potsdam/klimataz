import React from "react";

const Waste = ({ currentData, currentIndicator, currentSection }) => {

   // console.log('inside was component', currentSection, currentIndicator, currentData)
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
                  2020 wurden in Schweinfurt 22.327 tonnen organische Abfälle
                  aus der Biotonne und Garten- und Parkabfällen entsorgt
               </h3>
            </div>
         </div>
      </div>
   );
};

export default Waste;