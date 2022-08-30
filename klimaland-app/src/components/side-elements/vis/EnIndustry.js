import React, { useRef, useLayoutEffect, useState } from 'react';
// import { max } from 'd3-array';
// import { scaleLinear } from 'd3-scale';

const EnIndustry = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {

    return (
        <div className={`energy-industry vertical-layout ${isThumbnail ? 'is-thumbnail' : ''}`}>
            <div className="description">
                <div className="title">
                    <h3>
                        <span>{lkData}</span>:
                        Title
                    </h3>
                </div>
            </div>
            <div className="visualization-container">
                <svg className="chart">
                    <text x="50%" y="50%">Energy Industry</text>
                </svg>
            </div>
        </div >
    );
};

export default EnIndustry;
