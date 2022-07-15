import React from "react";
import "./Locator.css";
import {geoPath, geoMercator} from 'd3-geo';
import LandkreiseOutline from "../../data/kreise.json";

const Locator = () => {
    const projection = geoMercator().fitSize([200, 200], LandkreiseOutline)
    const geoGenerator = geoPath().projection(projection)

    const pathString = geoGenerator(LandkreiseOutline)
    // wip: make map react upon elements selection
    // const features = 
    return (
        <div className="Locator">
            <h4>Locator</h4>
            <svg width="200" height="200" class="locator-background">
                <path d={pathString} />
            </svg>
        </div>
    );
};

export default Locator;
