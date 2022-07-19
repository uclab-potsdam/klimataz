import React from "react";
import {geoPath, geoMercator} from 'd3-geo';
import LandkreiseOutline from "../../data/kreise.json";

const Locator = ({lk}) => {
    // to do: responsive w and h for chart
    const projection = geoMercator().fitSize([200, 200], LandkreiseOutline)
    const geoGenerator = geoPath().projection(projection)

    const singleShapes = LandkreiseOutline.features.map(d => {
        return {
            path: geoGenerator(d),
            lk: d.properties.ARS,
            bl: d.properties.SN_L,
            visible: lk.value === +d.properties.ARS || lk.value === +d.properties.SN_L
            ? true 
            : false
        }
    })

    return (
        <div className="locator-container">
            <h4>Locator</h4>
            <div className="locator-background">
                <svg width="200" height="200">
                    {singleShapes.map(function(el, e) {
                        return (
                            <path 
                                d={el.path} 
                                key={e} 
                                id={el.lk} 
                                className={`landkreis ${el.bl} ${el.visible ? "visible" : "hidden"}`}
                            />)
                    })}
                </svg>
                {/* to do: create zoom in for lk details */}
                <div className="locator-zoom">
                    <div>hello! content!</div>
                </div>
            </div>
        </div>
    );
};

export default Locator;
