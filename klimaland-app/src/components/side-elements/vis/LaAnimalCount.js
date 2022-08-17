import React from "react";

const Land = ({ currentData, currentIndicator, currentSection }) => {

    // console.log('inside la component', currentSection, currentIndicator, currentData)
    console.log('land', currentIndicator)
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