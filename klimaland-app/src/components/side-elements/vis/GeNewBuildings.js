import React, { useRef, useLayoutEffect, useState } from 'react';
import { percentage } from '../../helperFunc';
import { uniq } from 'lodash';
import { max, extent, range } from 'd3-array';
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { line } from 'd3-shape';

const Buildings = ({ currentData, currentIndicator, currentSection, lkData }) => {
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


    let uniqueEnergyTypes = [];
    let lineElements = [];
    let axisElements = [];
    let yAxisValues = [];
    let yAxis = [];
    let scaleCategory = function () { return undefined }
    const marginHeight = Math.ceil(dimensions.width / 10)
    const marginWidth = Math.ceil(dimensions.height / 10)

    if (currentData !== undefined) {
        // arrays
        uniqueEnergyTypes = uniq(currentData.data.map(d => d.column))
        const uniqueYears = uniq(currentData.data.map(d => +d.year))
        const colorArray = ['#FF7B7B', '#A80D35', '#3762FB', '#2A4D9C', '#5F88C6', '#5DCCD3', '#F6A219']

        // constructors and scales
        let totalValue = 0
        currentData.data.forEach(d => {
            if (+d.year === 2020) {
                totalValue = totalValue + d.value
            }
        })

        // calc variation on domain based on highest value in dataset
        const maxValue = max(currentData.data.map(d => percentage(d.value, totalValue)))
        const maxDomainVal = maxValue >= 50 ? percentage(totalValue, totalValue) : percentage(totalValue, totalValue) / 2
        const domainY = [0, maxDomainVal]
        const domainX = extent(currentData.data.map(d => +d.year))
        const xScale = scaleLinear().domain(domainX).range([marginWidth, dimensions.width - marginWidth])
        const yScale = scaleLinear().domain(domainY).range([dimensions.height - marginHeight, marginHeight])
        scaleCategory = scaleOrdinal().domain(uniqueEnergyTypes).range(colorArray)
        const createLine = line().x(d => xScale(+d.year)).y(d => yScale(percentage(d.value, totalValue)))

        yAxisValues = yScale.ticks(2);
        yAxis = yAxisValues.map(d => yScale(d));

        // iterate over array and creates line for each energy type
        lineElements = uniqueEnergyTypes.map((type, t) => {
            const currentTypeData = currentData.data.filter(d => d.column === type)

            return {
                id: type,
                stroke: scaleCategory(type),
                path: createLine(currentTypeData)
            }
        })

        axisElements = uniqueYears.map((axis, a) => {
            const energyMarkers = []
            let taPosition = 'start'
            const currentYearData = currentData.data.filter(d => +d.year === axis)

            currentYearData.forEach(d => {
                energyMarkers.push(
                    {
                        y: yScale(percentage(d.value, totalValue)),
                        label: `${percentage(d.value, totalValue).toFixed(1)} %`,
                        id: d.column
                    })
            })

            if (a === uniqueYears.length - 1) {
                taPosition = 'end'
            } else if (a !== 0) {
                taPosition = 'middle'
            }

            return {
                label: axis,
                taPosition,
                x: xScale(axis),
                energyMarkers
            }
        })
    }

    return (
        <div className="newbuildings-energy">
            <div className="description">
                <div className="title">
                    <h3>Welche primären Heiz-energien werden in neuen Wohneinheiten installiert?</h3>
                </div>
                <div className="legend">
                    <svg height="300px">
                        <g>
                            {
                                uniqueEnergyTypes.map((type, t) => {
                                    return (
                                        <g transform={`translate(10, ${(t + 1) * 20})`}>
                                            <circle cx="0" cy="5" r="3" fill={scaleCategory(type)} />
                                            <text x="10" y="10">{type}</text>
                                        </g>
                                    )
                                })
                            }
                        </g>
                    </svg>
                </div>
            </div>
            <div className="visualization-container" ref={targetRef}>
                <svg className="chart">
                    <g className="axis">
                        <g className="x-axis">
                            {
                                yAxis.map((yaxis, ya) => {
                                    return (
                                        <g key={ya} transform={`translate(0, ${yaxis})`}>
                                            <line x1={marginWidth} x2={dimensions.width - marginWidth} y1="0" y2="0"></line>
                                            <text x={marginWidth - 10} y="10" textAnchor='end'>{yAxisValues[ya]}%</text>
                                        </g>
                                    )
                                })
                            }
                        </g>
                    </g>

                    <g className="lines">
                        {
                            lineElements.map((line, l) => {
                                return (
                                    <g key={l} className={`${line.id} line`}>
                                        <path d={line.path} stroke={line.stroke} fill="none" />
                                    </g>
                                )
                            })
                        }
                    </g>
                    <g className="axis">
                        {
                            axisElements.map((axis, a) => {
                                return (
                                    <g key={a} transform={`translate(${axis.x}, 0)`}>
                                        <line x1="0" x2="0" y1={marginHeight} y2={dimensions.height - marginHeight} stroke="black" />
                                        <text x="-2" y={marginHeight - 10} textAnchor={axis.taPosition}>{axis.label}</text>
                                        {
                                            axis.energyMarkers.map((en, e) => {
                                                return (
                                                    <g key={e}>
                                                        <circle
                                                            className="year-marker"
                                                            cx="0"
                                                            cy={en.y}
                                                            r="3"
                                                            fill={scaleCategory(en.id)}
                                                        />
                                                        <text x="2" y={en.y - 5}>
                                                            {en.label}
                                                        </text>
                                                    </g>
                                                )
                                            })
                                        }
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

export default Buildings;