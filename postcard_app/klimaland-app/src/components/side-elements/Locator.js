import React from "react";
import { geoPath, geoMercator } from 'd3-geo';
import LandkreiseOutline from "../../data/kreise.json";

const Locator = ({ lk }) => {
    let currentFeature
    // to do: responsive w and h for chart
    const projection = geoMercator().fitSize([180, 180], LandkreiseOutline)
    const geoGenerator = geoPath().projection(projection)

    LandkreiseOutline.features.forEach(f => {
        if (+lk.value === +f.properties.ARS || lk.value === +f.properties.SN_L) {
            currentFeature = f
        }
    })

    // 
    const translatedProj = geoMercator().fitSize([150, 150], LandkreiseOutline).scale(1).translate([0, 0]);
    const geoTranslated = geoPath().projection(translatedProj)
    const b = geoTranslated.bounds(currentFeature)
    const s = .95 / Math.max((b[1][0] - b[0][0]) / 150, (b[1][1] - b[0][1]) / 150)
    const t = [(200 - s * (b[1][0] + b[0][0])) / 2, (200 - s * (b[1][1] + b[0][1])) / 2];
    translatedProj.translate(t).scale(s);


    const singleShapes = LandkreiseOutline.features.map(d => {

        // currentFeature = 
        return {
            path: geoGenerator(d),
            translatedPath: geoTranslated(d),
            lk: d.properties.ARS,
            bl: d.properties.SN_L,
            visible: +lk.value === +d.properties.ARS || +lk.value === +d.properties.SN_L
                ? true
                : false
        }
    })

    return (
        <div className="locator-container">
            <div className="locator-zoom">
                <div className="locator-zoom-inner">
                    <svg width="200" height="200">
                        {singleShapes.map(function (el, e) {
                            return (
                                <path
                                    d={el.translatedPath}
                                    key={e}
                                    id={el.lk}
                                    className={`landkreis ${el.bl} ${el.visible ? "visible" : "hidden"}`}
                                />)
                        })}
                    </svg>
                </div>
            </div>
            <div className="locator-background">
                <svg width="180" height="180">
                    {singleShapes.map(function (el, e) {
                        return (
                            <path
                                d={el.path}
                                key={e}
                                id={el.lk}
                                className={`landkreis ${el.bl} ${el.visible ? "visible" : "hidden"}`}
                            />)
                    })}
                </svg>
            </div>
        </div>
    );
};

export default Locator;
