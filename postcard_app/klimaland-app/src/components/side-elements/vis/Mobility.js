import React from "react";

const Mobility = ({ ...props }) => {

    console.log(props)
    return (
        <g className="mobility-chart">
            <text x="50%" y="50%" text-anchor="middle">
                Mobility
            </text>
        </g>
    );
};

export default Mobility;