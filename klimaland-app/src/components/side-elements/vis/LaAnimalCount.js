import React from "react";

const Land = ({ currentData, currentIndicator, currentSection, lkData }) => {

    return (
        <div className="animal-count horizontal-top-layout">
            <div className="description">
                <div className="title">
                    <h3>Wie hoch ist die Viehzahl per Fläche in Großvieheinheit (GV) pro Hektar?</h3>
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