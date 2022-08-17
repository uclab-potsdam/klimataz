import React from "react";

const Buildings = ({ currentData, currentIndicator, currentSection }) => {

    // console.log('inside la component', currentSection, currentIndicator, currentData)
    // console.log(props)
    return (
        <div className="buildings-chart">
            <div>
                <div>
                    Layout
                </div>
            </div>
            <svg className="chart">
                <text x="50%" y="50%" textAnchor="middle">
                    Buildings
                </text>
            </svg>
        </div>
    );
};

export default Buildings;