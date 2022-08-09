import React from 'react';

const Buildings = ({ ...props }) => {
  // console.log(props)
  return (
    <g className="buildings-chart">
      <text x="50%" y="50%" textAnchor="middle">
        Buildings
      </text>
      <text x="50%" y="60%" textAnchor="middle">
        {props.lk.label}
      </text>
    </g>
  );
};

export default Buildings;
