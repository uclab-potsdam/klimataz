import React from "react";

const Energy = ({ currentData, currentIndicator, currentSection, lkData }) => {

    let lastYear;
    let lastValue

    if (currentData !== undefined) {
        const lastDataPoint = currentData.data.slice(-1)
        lastYear = lastDataPoint[0]["year"]
        lastValue = lastDataPoint[0]["value"]
    }

    return (
        <div className="primary-energy horizontal-bottom-layout">
            <svg className="chart">
                <text x="50%" y="50%" textAnchor="middle">
                    Energy
                </text>
            </svg>
            <div className="description">
                <div className="title">
                    <h3>Der Primärenergieverbrauch in <span>{lkData}</span> besteht <span>{lastYear}</span> zu <span>{lastValue}%</span> aus erneuerbaren Energieträgern</h3>
                </div>
            </div>
        </div>
    );
};

export default Energy;