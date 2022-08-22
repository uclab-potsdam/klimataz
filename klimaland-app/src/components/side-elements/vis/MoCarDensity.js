import React, { useRef, useLayoutEffect, useState } from 'react';
import { max } from 'd3-array';
import { scaleLinear } from 'd3-scale';

const MoCarDensity = ({ currentData, currentIndicator, currentSection, lkData, isThumbnail }) => {
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

    //set default value to avoid errors
    let totalCars = 0;
    let hybridCars = 0;
    const carSquares = []
    let xScale;
    let yScale;
    let rectWidth;


    if (currentData !== undefined) {
        // Data for rendered text
        const lastYear = max(currentData.data.map(d => +d.year))
        const lastDataPoint = currentData.data.find(d => d.column === "Gesamt" && +d.year === lastYear)
        const lastDataPointHy = currentData.data.find(d => d.column === "Hybrid" && +d.year === lastYear)
        const lastDataPointEl = currentData.data.find(d => d.column === "Elektro" && +d.year === lastYear)
        const rawValue = lastDataPoint.value / 10
        const sumGreenCars = (lastDataPointHy.value + lastDataPointEl.value) / 10
        totalCars = Math.round(rawValue)
        hybridCars = Math.round(sumGreenCars)

        const biggestTotalCars = Math.max(totalCars, 100)

        // creating matrix of squares based on number of cars
        let rowThreshold = 10
        let rowNum = 0
        let columnNum = 0
        for (let index = 0; index < biggestTotalCars; index++) {

            const currentSquare = {}
            currentSquare.ownsCar = false
            currentSquare.isHybrid = false
            if (index <= 100) {
                if (index >= rowThreshold) {
                    rowThreshold = rowThreshold + 10
                    rowNum = rowNum + 1
                    columnNum = 0
                }

                if (index <= totalCars) {
                    currentSquare.ownsCar = true
                }

                if (index < hybridCars) {
                    currentSquare.isHybrid = true
                }

                currentSquare.row = rowNum
                currentSquare.column = columnNum
                columnNum = columnNum + 1

            } else {
                currentSquare.row = rowNum
                currentSquare.column = columnNum
                columnNum = columnNum + 1
                currentSquare.ownsCar = true
                currentSquare.isExcess = true
            }

            carSquares.push(currentSquare)
        }

        //scales and margins, using d3 as utility
        const marginWidth = Math.ceil(dimensions.width / 5)
        const marginHeight = Math.ceil(dimensions.height / 5)

        rectWidth = Math.ceil((dimensions.width - (marginWidth * 2)) / 10)
        xScale = scaleLinear()
            .domain([0, max(carSquares.map(d => d.row))])
            .range([marginWidth - 50, dimensions.width - marginWidth - 10])
        yScale = scaleLinear()
            .domain([0, max(carSquares.map(d => d.column))])
            .range([marginHeight - 50, dimensions.height - marginHeight + 10])

    }

    return (
        <div className={`car-density vertical-layout ${isThumbnail ? 'is-thumbnail' : ''}`}>
            <div className="description">
                <div className="title">
                    <h3>
                        <span>{lkData}</span>:
                        Auf 100 Einwohner besitzen <span className="first-value">{totalCars}</span> ein
                        Auto. <span className="second-value">{hybridCars}</span> davon sind Hybrid oder Elektro.
                    </h3>
                </div>
                <div className="legend">
                </div>
            </div>
            <div className="visualization-container" ref={targetRef}>
                <svg className="chart">
                    <g transform={isThumbnail ? 'translate(-10, 0)' : "translate(-25, 0)"}>
                        <g className="grid">
                            {
                                carSquares.map(function (sq, s) {
                                    return (
                                        <g
                                            className="without-car"
                                            transform={`translate(${xScale(sq.row)}, ${yScale(sq.column)})`}
                                        >
                                            <rect
                                                key={s}
                                                width={rectWidth}
                                                height={rectWidth}
                                                x="0"
                                                y="0"
                                            />
                                        </g>
                                    )
                                })
                            }
                        </g>
                        <g class="gridded-data">

                            {
                                carSquares.map(function (sq, s) {
                                    if (sq.isHybrid) {
                                        return (
                                            <g
                                                className="hybrid-cars"
                                                transform={`translate(${xScale(sq.row)}, ${yScale(sq.column)})`}
                                            >
                                                <rect
                                                    key={s + 'hascars'}
                                                    width={rectWidth}
                                                    height={rectWidth}
                                                    fill="#F6A219"
                                                    x="-5"
                                                    y="-5"
                                                />
                                            </g>
                                        )
                                    };

                                    if (sq.ownsCar) {
                                        return (
                                            <g
                                                className="owns-car"
                                                transform={`translate(${xScale(sq.row)}, ${yScale(sq.column)})`}
                                            >
                                                <rect
                                                    key={s + 'hybrid'}
                                                    width={rectWidth}
                                                    height={rectWidth}
                                                    fill="#E87780"
                                                    x="-5"
                                                    y="-5"
                                                />
                                            </g>
                                        )
                                    }
                                })
                            }
                        </g>
                    </g>
                </svg>
            </div>
        </div >
    );
};

export default MoCarDensity;
