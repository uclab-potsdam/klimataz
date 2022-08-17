import React from "react";

const Waste = ({ currentData, currentIndicator, currentSection }) => {

   // console.log('inside was component', currentSection, currentIndicator, currentData)
   return (
      <div className="waste-chart">
         <div>
            <div>
               Layout
            </div>
         </div>
         <svg className="chart">
            <text x="50%" y="50%" textAnchor="middle">
               Waste
            </text>
         </svg>
      </div>
   );
};

export default Waste;