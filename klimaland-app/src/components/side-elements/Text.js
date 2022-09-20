import React from "react";
import parse from 'html-react-parser';
// eslint-disable-next-line import/no-webpack-loader-syntax


const Text = ({ lk, section, data, sectionFullName }) => {

    const agsText = data.filter(d => { return +d.AGS === lk.value })

    const activeCardText = agsText.map((text, t) => {
        const thirdKey = sectionFullName[section].en + '_third'
        const textKey = sectionFullName[section].en + '_postcard'

        console.log(thirdKey, textKey)
        return {
            gerics: text.gerics_text,
            ranking: text[thirdKey],
            text: text[textKey]
        }
    })


    return (
        <div className="text-inner-container">
            <div className="section-title">
                <h2>{sectionFullName[section].de}</h2>
            </div>
            {(data.length !== 0 && <div className="section-text">
                <p>
                    {parse(activeCardText[0].text)}
                </p>
            </div>)}
        </div>
    );
};

export default Text;
