import React from "react";

const MoCarDensity = ({ currentData, currentIndicator, currentSection, lkData }) => {

    let totalCars = "?";
    let hybridCars = "?";
    console.log(currentData)
    if (currentData !== undefined) {
        const lastDataPoint = currentData.data.find(d => d.column === "Insgesamt" && +d.year === 2020)
        const rawValue = lastDataPoint.value / 10
        totalCars = Math.round(rawValue)
    }

    return (
        <div className="car-density vertical-layout">
            <div className="description">
                <div className="title">
                    <h3>
                        <span>{lkData}</span>: Auf 100 Einwohner besitzen <span className="first-value">{totalCars}</span> ein Auto. <span className="second-value">{hybridCars}</span> davon sind Hybrid oder Elektro.
                    </h3>
                </div>
                <div className="legend">

                </div>
            </div>
            <svg className="chart">
                <text x="50%" y="50%" textAnchor="middle">
                    Mobility
                </text>
            </svg>
        </div>
    );
};

export default MoCarDensity;