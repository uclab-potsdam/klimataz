import React, { useRef, useLayoutEffect, useState } from 'react';
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { extent } from "d3-array";
import { stack } from 'd3-shape';



const GeAvgHEating = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {

    // getting sizes of container for maps
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

    let yScale;
    let xScale;
    let barChartData;
    const classesData = [];
    const marginWidth = Math.round(dimensions.width / 25);
    const marginHeight = Math.round(dimensions.height / 10);
    const energyClasses = { "A+": 25, "A": 50, "B": 100, "C": 125, "D": 150, "E": 200, "F": 225, "G": 250 }
    const classesKeys = Object.keys(energyClasses)
    const classesColors = ["#008088", "#2C8284", "#438581", "#CE9D46", "#EDA128", "#F3954D", "#F18B63", "#E95850"]

    if (currentData !== undefined) {
        currentData.data.forEach(d => {
            if (d.year.length === 2) {
                d.year = d.year.replace(/^/, "20")
            }
        })

        const domainX = extent(currentData.data.map(d => { return +d.year }))
        yScale = scaleLinear().domain([250, 0]).range([dimensions.height, marginHeight])
        xScale = scaleLinear().domain(domainX).range([marginWidth, dimensions.width - marginWidth * 4.5])
        const colorScale = scaleOrdinal().domain(classesKeys).range(classesColors)


        const stacks = stack().keys(classesKeys)([energyClasses]);
        let prevClass = "A+"
        stacks.forEach((bar, b) => {
            const data = bar[0];
            const label = data.data[bar.key];
            const y1 = b !== 0 ? yScale(data.data[prevClass]) : 25
            const y2 = yScale(data.data[bar.key])
            classesData.push({
                klass: bar.key,
                y1,
                y2,
                yMid: b !== 0 ? dimensions.height - ((y1 + y2) / 2) + 5 : dimensions.height - y2 + (y2 / 3),
                fill: colorScale(bar.key),
                label,
                keyColor: bar.key === "A" || bar.key === "A+" ? "white" : "#484848"
            });
            prevClass = bar.key

        });


        barChartData = currentData.data.map((bar, b) => {

            let enKlass = "none"
            classesKeys.forEach((klass, k) => {
                if (k !== 0) {
                    const prevKlass = classesKeys[k - 1]

                    if (bar.value <= energyClasses[klass]
                        && bar.value > energyClasses[prevKlass]) {
                        enKlass = klass
                    }
                }
            })

            return {
                year: xScale(+bar.year),
                yearLabel: bar.year,
                valueLabel: bar.value,
                kwh: yScale(bar.value),
                fill: colorScale(enKlass),
                enKlass
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
                    <clipPath id="backgroundRect">
                        <rect
                            x={marginWidth}
                            y="0%"
                            width={dimensions.width - marginWidth * 2}
                            height={dimensions.height - marginHeight}
                            stroke="black"
                            rx="10" />
                    </clipPath>
                    <g className="clipped-container" clipPath="url(#backgroundRect)">
                        <g className="chart-axis">
                            <g className="bar-axis">
                                {
                                    classesData.map((klass, k) => {
                                        return (
                                            <g key={k}>
                                                <rect x={marginWidth} y={dimensions.height - klass.y2} width="30" height={klass.y2 - klass.y1} fill={klass.fill} />
                                                <text x={marginWidth + 15} y={klass.yMid} textAnchor="middle" fill={klass.keyColor}>{klass.klass}</text>
                                                <text x={dimensions.width - marginWidth - 5} y={klass.yMid} textAnchor="end" fill="#484848">{klass.label}</text>
                                            </g>
                                        )
                                    })
                                }
                            </g>
                            {
                                classesKeys.map((klass, k) => {
                                    return (
                                        <g key={k} transform={`translate(0, ${dimensions.height - yScale(energyClasses[klass])})`}>
                                            <line x1="0" x2={dimensions.width} y1="0" y2="0" stroke="#484848" />
                                        </g>
                                    )
                                })
                            }
                        </g>
                        <g className="chart-bars" transform={`translate(${marginWidth + 10}, 0)`}>
                            {
                                barChartData.map((bar, b) => {
                                    return (
                                        <g key={b} transform={`translate(${bar.year}, 0)`}>
                                            <rect x="0" y={dimensions.height - bar.kwh} height={bar.kwh - marginHeight} width="28" fill={bar.fill} stroke={bar.fill} fill-opacity="20%" />
                                            <rect x="0" y={dimensions.height - bar.kwh - 5} width="28" height="10" fill={bar.fill} rx="5" />
                                            {/* <text x="0" y={marginHeight * 2}>{bar.valueLabel}</text> */}
                                        </g>
                                    )
                                })
                            }
                        </g>
                        <rect
                            x={marginWidth + 0.5}
                            y="0.5"
                            width={dimensions.width - marginWidth * 2 - 1}
                            height={dimensions.height - marginHeight - 1}
                            stroke="#484848"
                            fill="none"
                            rx="10" />
                    </g>
                    <g className="non-clipped-elements">
                        {
                            barChartData.map((label, l) => {
                                return (
                                    <g key={l} transform={`translate(${marginWidth}, 0)`}>
                                        <text
                                            x={label.year}
                                            y={dimensions.height - marginHeight + 5}
                                            transform={`rotate(45, ${label.year}, ${dimensions.height - marginHeight + 20})`}>
                                            {label.yearLabel}
                                        </text>
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