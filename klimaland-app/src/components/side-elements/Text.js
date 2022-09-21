import React from 'react';
import parse from 'html-react-parser';
// eslint-disable-next-line import/no-webpack-loader-syntax

const Text = ({ sectionName, data, thirdKey }) => {
    const activeCardText = data.map((text, t) => {
        let textKey = thirdKey.slice(0, -5);
        textKey += 'postcard';
        return {
            gerics: text.gerics_text,
            ranking: text[thirdKey],
            text: text[textKey],
        };
    });

    return (
        <div className="text-inner-container">
            <div className="section-title">
                <h2>{sectionName}</h2>
            </div>
            {data.length !== 0 && (
                <div className="section-text">
                    <p>{parse(activeCardText[0].text)}</p>
                </div>
            )}
        </div>
    );
};

export default Text;
