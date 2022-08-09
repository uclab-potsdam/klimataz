import React from 'react';

const Mobility = ({ ...props }) => {
  // console.log(props)
  return (
    <g className="mobility-chart">
      <text x="50%" y="50%" textAnchor="middle">
        Mobility
      </text>
      <text x="50%" y="60%" textAnchor="middle">
        {props.lk.label}
      </text>
    </g>
  );
};

export default Mobility;
