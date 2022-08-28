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

    let lineElements = [];
    let axisElements = [];
    let yAxisValues = [];
    let yAxis = [];
    let scaleCategory = function () { return undefined }
    const marginHeight = Math.ceil(dimensions.width / 10)
    const marginWidth = Math.ceil(dimensions.height / 10)

    if (currentData !== undefined) {
        // arrays
        const uniqueEnergyTypes = uniq(currentData.data.map(d => d.column))
        const uniqueYears = uniq(currentData.data.map(d => +d.year))
        const colorArray = ['#FF7B7B', '#A80D35', '#3762FB', '#2A4D9C', '#5F88C6', '#5DCCD3', '#F6A219']

        // constructors and scales
        let totalValue = 0
        currentData.data.forEach(d => {
            if (+d.year === 2020) {
                totalValue = totalValue + d.value
            }
        })

        // console.log(totalValue)
        const domainY = [0, percentage(totalValue, totalValue)]
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
            const currentYearData = currentData.data.filter(d => +d.year === axis)

            currentYearData.forEach(d => {
                energyMarkers.push(
                    {
                        y: yScale(percentage(d.value, totalValue)),
                        label: `${percentage(d.value, totalValue)} %`,
                        id: d.column
                    })
            })

            return {
                label: axis,
                taPosition: a === uniqueYears.length - 1 ? 'end' : 'start',
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
            </div>
            <div className="visualization-container" ref={targetRef}>
                <svg className="chart">
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
                                                    <circle
                                                        className="year-marker"
                                                        key={e}
                                                        cx="0"
                                                        cy={en.y}
                                                        r="3"
                                                        fill={scaleCategory(en.id)}
                                                    />
                                                )
                                            })
                                        }
                                    </g>
                                )
                            })
                        }
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
                </svg>
            </div>
        </div >
    );
};

export default Buildings;