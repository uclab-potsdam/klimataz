import React, { useRef, useLayoutEffect, useState } from 'react';
import { scaleLinear } from "d3-scale";
import { extent, min } from "d3-array";



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

    let yScale;
    let xScale;
    let barChartData;
    const marginWidth = Math.round(dimensions.width / 10);
    const marginHeight = Math.round(dimensions.height / 10);
    const energyClasses = { "A+": 25, "A": 50, "B": 100, "C": 125, "D": 150, "E": 200, "F": 225, "G": 250 }
    const classesKeys = Object.keys(energyClasses)

    if (currentData !== undefined) {
        currentData.data.forEach(d => {
            if (d.year.length === 2) {
                d.year = d.year.replace(/^/, "20")
            }
        })

        // const domainY = min(currentData.data.map(d => { return d.value }))
        const domainX = extent(currentData.data.map(d => { return +d.year }))
        yScale = scaleLinear().domain([0, 250]).range([marginHeight, dimensions.height - marginHeight]).nice()
        xScale = scaleLinear().domain(domainX).range([marginWidth, dimensions.width - marginWidth])


        barChartData = currentData.data.map((bar, b) => {
            return {
                year: xScale(+bar.year),
                yearLabel: bar.year,
                valueLabel: bar.value,
                kwh: yScale(bar.value)
            }
        })
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
                    <g>
                        {
                            barChartData.map((bar, b) => {
                                return (
                                    <g key={b}>
                                        <rect x={bar.year} y={bar.kwh} height={dimensions.height - bar.kwh} width="20" />
                                        <text x={bar.year} y="10">{bar.valueLabel}</text>
                                    </g>
                                )
                            })
                        }
                    </g>
                    <g className="chart-axis">
                        {
                            classesKeys.map((klass, k) => {
                                return (
                                    <g key={k} transform={`translate(0, ${dimensions.height - yScale(energyClasses[klass])})`}>
                                        <line x1={marginWidth} x2={dimensions.width - marginWidth} y1="0" y2="0" stroke="black" />
                                        <text x="10" y="0">{klass}</text>
                                    </g>
                                )
                            })
                        }
                    </g>
                </svg>
            </div>
        </div >
    );
};

export default GeAvgHEating;