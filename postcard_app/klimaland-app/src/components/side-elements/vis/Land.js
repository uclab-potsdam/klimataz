import React from 'react';

const Land = ({ ...props }) => {
  // console.log(props)
  return (
    <g className="Land-chart">
      <text x="50%" y="50%" textAnchor="middle">
        Landwirtschaft
      </text>
      <text x="50%" y="60%" textAnchor="middle">
        {props.lk.label}
      </text>
    </g>
  );
};

export default Land;
