import React from "react";

const Waste = ({ currentData, currentIndicator, currentSection }) => {

   // console.log('inside was component', currentSection, currentIndicator, currentData)
   return (
      <g className="waste-chart">
         <text x="50%" y="50%" textAnchor="middle">
            Waste
         </text>
      </g>
   );
};

export default Waste;