import React from "react";

const List = ({ lk, data, section, sectionFullName }) => {
    const agsCurrentCard = data.filter(d => { return +d.AGS === lk.value })
    const thirdKey = sectionFullName[section].en + '_third'

    // pulling similar lks (within the bl)
    const similarAgs = data.filter(d => {
        return lk.value !== 0 ? d[thirdKey] === agsCurrentCard[0][thirdKey]
            // && d.AGS.substring(0, 2) === agsCurrentCard[0].AGS.substring(0, 2)
            && +d.AGS !== lk.value : +d.AGS !== lk.value
    })

    // shuffle the array
    const shuffled = similarAgs.sort(() => 0.5 - Math.random());
    // get 10 random location
    const randomSample = shuffled.slice(0, 10);
    const agsRanking = agsCurrentCard[0][thirdKey].substring(0, agsCurrentCard[0][thirdKey].indexOf(' '))

    return (
        <div className="list-inner-container">
            <div className={`list-similar-container ${agsRanking}`}>
                {lk.value !== 0 && <h5>{agsCurrentCard[0][thirdKey]} wie:</h5>}
                {lk.value === 0 && <h5>Check out also:</h5>}
                <ul>
                    {
                        randomSample.map((ags, a) => {
                            return (
                                <ol key={a}>
                                    {ags.Name}
                                </ol>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    );
};

export default List;
