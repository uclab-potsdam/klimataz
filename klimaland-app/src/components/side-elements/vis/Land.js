import React from "react";

const Land = ({ currentData, currentIndicator, currentSection }) => {

    // console.log('inside la component', currentSection, currentIndicator, currentData)
    // console.log(props)
    return (
        <div className="land-chart">
            <div>
                <div>
                    Layout
                </div>
            </div>
            <svg className="chart">
                <text x="50%" y="50%" textAnchor="middle">
                    Land
                </text>
            </svg>
        </div>
    );
};

export default Land;