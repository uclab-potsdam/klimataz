import React from "react";

const MoCarDensity = ({ currentData, currentIndicator, currentSection }) => {
    console.log(currentData)
    return (
        <div className="car-density vertical-layout">
            <div className="description">
                <div className="title">
                    <h3>
                        Auf 100 Einwohner besitzen 42 ein Auto.
                        2 davon sind Hybrid oder Elektro
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