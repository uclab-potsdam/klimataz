import React from "react";
import { max } from "d3-array";

const MoCarDensity = ({ currentData, currentIndicator, currentSection, lkData }) => {

    //set default value to avoid errors
    let totalCars = "?";
    let hybridCars = "?";



    if (currentData !== undefined) {
        const lastYear = max(currentData.data.map(d => +d.year))
        const lastDataPoint = currentData.data.find(d => d.column === "Gesamt" && +d.year === lastYear)
        const lastDataPointHy = currentData.data.find(d => d.column === "Hybrid" && +d.year === lastYear)
        const lastDataPointEl = currentData.data.find(d => d.column === "Elektro" && +d.year === lastYear)
        const rawValue = lastDataPoint.value / 10
        const sumGreenCars = (lastDataPointHy.value + lastDataPointEl.value) / 10
        totalCars = Math.round(rawValue)
        hybridCars = Math.round(sumGreenCars)
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