import React, { useRef, useLayoutEffect, useState } from 'react';
// import { max } from 'd3-array';
// import { scaleLinear } from 'd3-scale';

const MoModalSplit = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {

    if (currentData.dat !== undefined) {

    }

    return (
        <div className={`modal-split ${isThumbnail ? 'is-thumbnail' : ''}`}>
            <div className="description">
                <div className="title">
                    <h3>
                        Mit was und wie weit fahren Menschen in <span>{lkData}</span> zur Arbeit?
                    </h3>
                </div>
            </div>
            <div className="visualization-container">
                <svg className="chart">
                    <text x="50%" y="50%">Modal Split</text>
                </svg>
            </div>
        </div >
    );
};

export default MoModalSplit;
