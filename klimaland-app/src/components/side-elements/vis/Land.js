import React from "react";

const Land = ({ currentData, currentIndicator, currentSection }) => {

    // console.log('inside la component', currentSection, currentIndicator, currentData)
    // console.log(props)
    return (
        <g className="Land-chart">
            <text x="50%" y="50%" textAnchor="middle">
                Land
            </text>
        </g>
    );
};

export default Land;