import React from "react";

const Buildings = ({ currentData, currentIndicator, currentSection }) => {

    // console.log('inside la component', currentSection, currentIndicator, currentData)
    // console.log(props)
    return (
        <div className="newbuildings-energy">
            <div className="description">
                <div className="title">
                    <h3>Welche primären Heiz-energien werden in neuen Wohneinheiten installiert?</h3>
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