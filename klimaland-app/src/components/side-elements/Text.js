import React from 'react';
import parse from 'html-react-parser';
// eslint-disable-next-line import/no-webpack-loader-syntax

const Text = ({ sectionName, data, section }) => {
  return (
    <div className="text-inner-container">
      <div className="section-title">
        <h2>{sectionName}</h2>
      </div>
      {data.length !== 0 && <div className="section-text">{parse(data[section]['postcard'])}</div>}
    </div>
  );
};

export default Text;
