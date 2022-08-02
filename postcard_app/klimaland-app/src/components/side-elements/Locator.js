import React from "react";
import { geoPath, geoMercator } from 'd3-geo';
import LandkreiseOutline from "../../data/kreise.json";

const Locator = ({ lk }) => {
    console.log(lk)
    let currentFeature
    // to do: responsive w and h for chart
    const projection = geoMercator().fitSize([200, 200], LandkreiseOutline)
    const geoGenerator = geoPath().projection(projection)
    const singleShapes = LandkreiseOutline.features.map(d => {
        if (+lk.value === +d.properties.ARS || lk.value === +d.properties.SN_L) {
            currentFeature = d
            console.log(d)
        }
        // currentFeature = 
        return {
            path: geoGenerator(d),
            lk: d.properties.ARS,
            bl: d.properties.SN_L,
            visible: +lk.value === +d.properties.ARS || +lk.value === +d.properties.SN_L
                ? true
                : false
        }
    })

    const translatedProj = geoMercator().fitSize([200, 200], LandkreiseOutline).scale(1).translate([0, 0]);
    const geoTranslated = geoPath().projection(translatedProj)
    const b = geoTranslated.bounds(currentFeature)
    console.log(b)
    const s = .95 / Math.max((b[1][0] - b[0][0]) / 200, (b[1][1] - b[0][1]) / 200)
    const t = [(200 - s * (b[1][0] + b[0][0])) / 2, (200 - s * (b[1][1] + b[0][1])) / 2];



    // translatedProj.scale(s)
    //translatedProj.center([9.492340839830577, 54.82231817725908]);
    translatedProj.translate(t).scale(s);
    // translatedProj.scale(s);
    console.log(s)
    const translatedMap = geoTranslated(LandkreiseOutline)


    // const zoomedPath = geoTranslated(LandkreiseOutline)

    return (
        <div className="locator-container">
            {/* to do: create zoom in for lk details */}
            <div className="locator-zoom">
                <svg width="200" height="200">
                    <path d={translatedMap} />
                </svg>
            </div>
            <div className="locator-background">
                <svg width="200" height="200">
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
