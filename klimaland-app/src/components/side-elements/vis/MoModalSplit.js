import React, { useRef, useLayoutEffect, useState } from 'react';
import { max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';

const MoModalSplit = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {

    const targetRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (targetRef.current) {
            setDimensions({
                width: targetRef.current.offsetWidth,
                height: targetRef.current.offsetHeight,
            });
        }
    }, []);

    let averageKmDistance;
    let plotAvgData = [];
    let defaultYear = 2017;

    console.log(lkData)

    if (currentData.data !== undefined) {
        averageKmDistance = currentData.data.filter(d => d.column.includes('average') && +d.year === defaultYear)
        const longestAvgRoute = max(averageKmDistance.map(d => d.value))
        const maxYValue = Math.floor(longestAvgRoute / 10)
        console.log(maxYValue)
        const xScale = scaleLinear().domain([0, 10]).range([0, dimensions.width])
        const yScale = scaleLinear().domain([0, maxYValue]).range([0, dimensions.height / 5])
        const xScaleReverse = scaleLinear().domain([10, 0]).range([dimensions.width, 0])

        averageKmDistance.forEach((mode, m) => {
            const element = {}
            const nameOfMode = mode.column.split("_").pop()
            element.mode = nameOfMode
            element.values = [[0, 0]]
            const valueMagnitude = Math.floor(mode.value / 10)
            const difference = mode.value - valueMagnitude * 10

            if (valueMagnitude > 1) {
                for (let index = 1; index <= valueMagnitude; index++) {
                    element.values[index] = [10, index]
                }

                if (difference > 0) {
                    element.values.push([difference, valueMagnitude])
                }
            } else {
                element.values.push([mode.value, 0])
            }
            plotAvgData.push(element)
        })

        // const lineConstructor = line().x(d => d[0]).y(d => d[1])
        // const tryOut = [[100, 10], [200, 10], [200, 20], [100, 20], [100, 30], [200, 30]]

        // example = lineConstructor(tryOut)
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
            <div className="visualization-container" ref={targetRef}>
                <svg className="chart">
                    <text x="50%" y="50%">Modal Split</text>
                </svg>
            </div>
        </div >
    );
};

export default MoModalSplit;
