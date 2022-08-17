import React from "react";

const Energy = ({ currentData, currentIndicator, currentSection }) => {

    // console.log('inside la component', currentSection, currentIndicator, currentData)
    // console.log(props)
    return (
        <div className="energy-chart">
            <div>
                <div>
                    Layout
                </div>
            </div>
            <svg className="chart">
                <text x="50%" y="50%" textAnchor="middle">
                    Energy
                </text>
            </svg>
        </div>
    );
};

export default Energy;