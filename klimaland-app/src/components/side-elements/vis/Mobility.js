import React from "react";

const Mobility = ({ currentData, currentIndicator, currentSection }) => {

    // console.log('mounted')
    // console.log('inside mo component', currentSection, currentIndicator, currentData.data)
    return (
        <g className="mobility-chart">
            <text x="50%" y="50%" textAnchor="middle">
                Mobility
            </text>
        </g>
    );
};

export default Mobility;