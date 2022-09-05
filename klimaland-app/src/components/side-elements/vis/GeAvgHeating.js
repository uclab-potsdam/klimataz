import React, { useRef, useLayoutEffect, useState } from 'react';


const GeAvgHEating = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {

    // getting sizes of container for maps
    const targetRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [currentId, setCurrentId] = useState('');

    useLayoutEffect(() => {
        if (targetRef.current) {
            setDimensions({
                width: targetRef.current.offsetWidth,
                height: targetRef.current.offsetHeight,
            });
        }
    }, []);

    if (currentData !== undefined) {
    }

    return (
        <div className={`avg-heating ${isThumbnail ? 'is-thumbnail' : ''}`}>
            <div className="description">
                <div className="title">
                    <h3>Wie hoch ist der Enrgieverbrauch zum Heizen?</h3>
                </div>
            </div>
            <div className="visualization-container" ref={targetRef}>
                <svg className="chart">

                </svg>
            </div>
        </div >
    );
};

export default GeAvgHEating;