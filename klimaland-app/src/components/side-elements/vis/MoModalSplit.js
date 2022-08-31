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
    const xTicks = [];
    let defaultYear = 2017;
    const referenceXTicks = [...Array.from(Array(11)).keys()];
    const marginWidth = Math.round(dimensions.width / 20)
    const rightMarginWidth = Math.round(dimensions.width - dimensions.width / 3)
    const orderOfModes = ['Fuß', 'Fahrrad', 'ÖPV', 'Mitfahrer', 'Fahrer']
    const colors = ['#3762FB', '#2A4D9C', '#5F88C6', '#FFD0D0', '#FF7B7B']
    let yScale;
    let xScale;
    let xScaleReverse;

    if (currentData.data !== undefined) {
        averageKmDistance = currentData.data.filter(d => d.column.includes('average') && +d.year === defaultYear)
        const longestAvgRoute = max(averageKmDistance.map(d => d.value))
        const maxYValue = Math.floor(longestAvgRoute / 10)
        xScale = scaleLinear().domain([0, 10]).range([marginWidth, rightMarginWidth])
        xScaleReverse = scaleLinear().domain([10, 0]).range([marginWidth, rightMarginWidth])
        yScale = scaleLinear().domain([0, 5]).range([0, dimensions.height / 5])

        averageKmDistance.forEach((mode, m) => {
            const element = {}
            const nameOfMode = mode.column.split("_").pop()
            element.mode = nameOfMode.replace(/[{()}]/g, '')
            element.label = mode.value.toFixed(2) + 'km'

            // depending on size of value start at zero (for > 10) or with value (< 10)
            const startValue = 0.1
            const values = mode.value > 10 ? [] : [[0, 0]]
            let difference = mode.value > 10 ? 0 : mode.value

            // for elements bigger than 10 loops over and push coordinates
            let tot = mode.value
            let rowIndex = 0
            let i = 10

            while (i < tot) {
                difference = tot - i
                // if it's even rows goes from left to right
                if (rowIndex % 2 === 0) {
                    values.push(
                        [0, rowIndex],
                        [10, rowIndex],
                        [10, rowIndex + 1]
                    )
                } else {
                    // if it's odd rows goes from right to left
                    values.push(
                        [10, rowIndex],
                        [startValue, rowIndex],
                        [startValue, rowIndex + 1]
                    )
                }

                rowIndex = rowIndex + 1
                i += 10
            }

            // constructor is created on the fly to reverse scale
            const lineConstructor = line()
                .x(d => (d[0] !== startValue && d[0] !== 0) && d[0] < 10 && rowIndex > 0
                    ? xScaleReverse(d[0])
                    : xScale(d[0]))
                .y(d => yScale(d[1]))

            // pushing last element with difference value, 
            //in items < 10 this should be = tot
            const lastCoor = [difference, rowIndex]
            values.push(lastCoor)
            // create path
            element.path = lineConstructor(values)

            // accessory elements
            const isReverse = lastCoor[0] !== 0 && lastCoor[0] < 10 && rowIndex > 0
            element.labelX = isReverse
                ? xScaleReverse(lastCoor[0])
                : xScale(lastCoor[0])
            element.labelY = yScale(lastCoor[1])

            const ticks = [...Array.from(Array(Math.round(mode.value))).keys()]
            let iTick = 0
            element.ticks = ticks.map(tick => {
                iTick = iTick + 10
                return {
                    x: tick !== 0 && lastCoor[0] < 10 && tick > rowIndex * 10 ?
                        xScaleReverse(tick - rowIndex * 10)
                        : xScale(tick),
                    y: tick > 10 ? yScale(String(iTick)[0]) : yScale(0)
                }
            })
            plotAvgData.push(element)
        })

        plotAvgData.sort((a, b) => orderOfModes.indexOf(a.mode) - orderOfModes.indexOf(b.mode));
    }

    return (
        <div className={`modal-split ${isThumbnail ? 'is-thumbnail' : ''}`}>
            <div className="description">
                <div className="title">
                    <h3>
                        Mit was und wie weit fahren Menschen
                        in <span>{lkData}</span> zur Arbeit?
                    </h3>
                </div>
            </div>
            <div className="visualization-container" ref={targetRef}>
                <svg className="chart">
                    <g className="paths-avg-trip">
                        <g className="paths">
                            {
                                plotAvgData.map((trip, t) => {
                                    return (
                                        <g
                                            transform={`translate(0, ${(t + 0.5) * 60})`}
                                            key={t}
                                            className={trip.mode}
                                        >
                                            <g className="axis">
                                                <text x={marginWidth} y="-8">{trip.mode}</text>
                                                {
                                                    referenceXTicks.map((tick, t) => {
                                                        return (
                                                            <g transform={`translate(${xScale(tick)}, 0)`}>
                                                                <line x1="0" x2="0" y1="0" y2="5" stroke="black" />
                                                            </g>
                                                        )
                                                    })
                                                }
                                            </g>
                                            <g className="paths">
                                                <path
                                                    d={trip.path}
                                                    stroke={colors[t]}
                                                    fill="none"
                                                    stroke-width="10"
                                                />
                                                <g
                                                    className="avgkm-marker"
                                                    transform={`translate(${trip.labelX}, ${trip.labelY + 5})`}
                                                >
                                                    <text x="5" y="-20">{trip.label}</text>
                                                    <line
                                                        x1="0"
                                                        x2="0"
                                                        y1="0"
                                                        y2="-30"
                                                        stroke="black"
                                                    />
                                                </g>
                                                <g className="mappedAxis">
                                                    {
                                                        trip.ticks.map((tick, t) => {
                                                            return (
                                                                <g>
                                                                    <g transform={`translate(${tick.x}, ${tick.y})`} key="t">
                                                                        <line x1="0" x2="0" y1="-5" y2="5" stroke="black" />
                                                                    </g>
                                                                </g>
                                                            )
                                                        })
                                                    }
                                                </g>
                                            </g>
                                        </g>
                                    )
                                })
                            }
                        </g>
                    </g>
                </svg>
            </div>
        </div >
    );
};

export default MoModalSplit;
