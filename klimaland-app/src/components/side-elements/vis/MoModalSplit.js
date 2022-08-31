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
    const marginWidth = Math.round(dimensions.width / 20)
    const rightMarginWidth = Math.round(dimensions.width - dimensions.width / 3)
    const orderOfModes = ['Fuß', 'Fahrrad', 'ÖPV', 'Mitfahrer', 'Fahrer']
    let yScale;

    // console.log(lkData, currentData)

    if (currentData.data !== undefined) {
        averageKmDistance = currentData.data.filter(d => d.column.includes('average') && +d.year === defaultYear)
        console.log(averageKmDistance)
        const longestAvgRoute = max(averageKmDistance.map(d => d.value))
        const maxYValue = Math.floor(longestAvgRoute / 10)
        const xScale = scaleLinear().domain([0, 10]).range([marginWidth, rightMarginWidth])
        yScale = scaleLinear().domain([0, maxYValue]).range([0, dimensions.height / 15])
        const lineConstructor = line().x(d => xScale(d[0])).y(d => yScale(d[1]))

        averageKmDistance.forEach((mode, m) => {
            const element = {}
            const nameOfMode = mode.column.split("_").pop()
            element.mode = nameOfMode.replace(/[{()}]/g, '')
            element.label = mode.value.toFixed(2)
            element.values = [[0, 0]]
            const valueMagnitude = Math.floor(mode.value / 10)
            const difference = mode.value - valueMagnitude * 10

            if (valueMagnitude > 1) {
                let columnIndex = 0
                for (let index = 1; index <= valueMagnitude; index++) {
                    element.values[index] = [10, columnIndex]
                    if (index % 2 !== 0) {
                        columnIndex = columnIndex + 1
                    }
                }

                if (difference > 0) {
                    element.values.push([difference, columnIndex])
                }

            } else {
                element.values.push([mode.value, 0])
            }

            element.path = lineConstructor(element.values)
            plotAvgData.push(element)
        })

        plotAvgData.sort((a, b) => orderOfModes.indexOf(a.mode) - orderOfModes.indexOf(b.mode));
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
                    {
                        plotAvgData.map((trip, t) => {
                            return (
                                <g transform={`translate(0, ${(t + 0.5) * 60})`} key={t} className={trip.mode}>
                                    <text x={marginWidth} y="-8">{trip.mode}</text>
                                    <path d={trip.path} stroke="black" fill="none" stroke-width="5" />
                                </g>
                            )
                        })
                    }
                </svg>
            </div>
        </div >
    );
};

export default MoModalSplit;
