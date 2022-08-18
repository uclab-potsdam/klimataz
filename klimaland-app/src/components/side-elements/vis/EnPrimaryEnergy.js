import React from "react";

const Energy = ({ currentData, currentIndicator, currentSection }) => {

    // console.log('inside la component', currentSection, currentIndicator, currentData)
    // console.log(props)
    return (
        <div className="primary-energy horizontal-bottom-layout">
            <svg className="chart">
                <text x="50%" y="50%" textAnchor="middle">
                    Energy
                </text>
            </svg>
            <div className="description">
                <div className="title">
                    <h3>Der Primärenergieverbrauch in Berlin besteht 2020 zu 6,11 % aus erneuerbaren Energieträgern</h3>
                </div>
            </div>
        </div>
    );
};

export default Energy;