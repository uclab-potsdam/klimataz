import React, { useRef, useLayoutEffect, useState } from 'react';
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { extent } from "d3-array";
import { stack } from 'd3-shape';



const GeAvgHEating = ({ currentData, currentIndicator, currentSection, locationLabel, isThumbnail }) => {

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

    window.mobileCheck = function () {
        let check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    let yScale;
    let xScale;
    let barChartData;
    const classesData = [];
    const width = dimensions.width;
    const height = dimensions.height;
    const isMobile = width <= 350 && window.mobileCheck(window)
    const barsSize = isMobile ? width / 50 : width / 40
    const mobileThreshold = isMobile ? 25 : 0
    const marginWidth = Math.round(width / 25);
    const marginHeight = Math.round(height / 10);
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
        yScale = scaleLinear().domain([250, 0]).range([height, marginHeight])
        xScale = scaleLinear().domain(domainX).range([marginWidth + mobileThreshold, width - (marginWidth * 4.5 + (mobileThreshold / 2))])
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
                yMid: b !== 0 ? height - ((y1 + y2) / 2) + 5 : height - y2 + (y2 / 3),
                fill: colorScale(bar.key),
                label,
                keyColor: bar.key === "A"
                    || bar.key === "A+"
                    || bar.key === "B"
                    ? "white" : "#484848"
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
            <div className="visualization-container" ref={targetRef}>
                <svg className="chart" transform="translate(0, 20)">
                    <clipPath id="backgroundRect">
                        <rect
                            x={marginWidth}
                            y="0%"
                            width={width - marginWidth * 2}
                            height={height - marginHeight}
                            stroke="black"
                            rx="10" />
                    </clipPath>
                    <g
                        className="clipped-container"
                        clipPath="url(#backgroundRect)"
                    >
                        <g className="chart-axis">
                            <g className="bar-axis">
                                {
                                    classesData.map((klass, k) => {
                                        return (
                                            <g key={k}>
                                                <rect x={marginWidth} y={height - klass.y2} width="30" height={klass.y2 - klass.y1} fill={klass.fill} />
                                                <text x={marginWidth + 15} y={klass.yMid} textAnchor="middle" fill={klass.keyColor}>{klass.klass}</text>
                                                <text x={width - marginWidth - 5} y={height - klass.y2 + 15} textAnchor="end" fill="#484848">{klass.label}</text>
                                            </g>
                                        )
                                    })
                                }
                            </g>
                            {
                                classesKeys.map((klass, k) => {
                                    return (
                                        <g key={k} transform={`translate(0, ${height - yScale(energyClasses[klass])})`}>
                                            <line x1="0" x2={width} y1="0" y2="0" stroke="#484848" />
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
                                            <rect x="0.5" y={height - bar.kwh} height={bar.kwh - marginHeight} width={barsSize - 1} fill={bar.fill} stroke={bar.fill} fillOpacity="20%" />
                                            <rect x="0" y={height - bar.kwh - 5} width={barsSize} height="10" fill={bar.fill} rx="5" />
                                            {/* <text x="0" y={marginHeight * 2}>{bar.valueLabel}</text> */}
                                        </g>
                                    )
                                })
                            }
                        </g>
                        <rect
                            x={marginWidth + 0.5}
                            y="0.5"
                            width={width - marginWidth * 2 - 1}
                            height={height - marginHeight - 1}
                            stroke="#484848"
                            fill="none"
                            rx="10" />
                    </g>
                    <g className="non-clipped-elements">
                        {
                            barChartData.map((label, l) => {
                                return (
                                    <g key={l} transform={`translate(${label.year + 20}, 0)`}>
                                        <text
                                            x="0"
                                            y={height - marginHeight + 10}
                                            textAnchor="middle"
                                            transform={isMobile ? `rotate(90, 0, ${(height - marginHeight) + 15})` : ''}
                                        >
                                            {label.yearLabel}
                                        </text>
                                    </g>
                                )
                            })
                        }
                    </g>
                </svg>
            </div>
            <div className="description">
                <div className="title">
                    <h3>Wie hoch ist der Energieverbrauch beim Heizen in {locationLabel}?</h3>
                </div>
            </div>
        </div >
    );
};

export default GeAvgHEating;