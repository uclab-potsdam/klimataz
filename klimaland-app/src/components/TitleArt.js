import React from 'react';

const TitleArt = ({ landkreisLabel }) => {
    return (
        <div className="word-art-title">
            <h4 className="gruss-thumb" />
            <h2 className="wordart main additional-0">{landkreisLabel}</h2>
            {/* <h2 className="wordart additional-1">{landkreisLabel}</h2>
            <h2 className="wordart additional-2">{landkreisLabel}</h2>
            <h2 className="wordart additional-3">{landkreisLabel}</h2>
            <h2 className="wordart additional-3">{landkreisLabel}</h2> */}
        </div>
    )
};

export default TitleArt;
