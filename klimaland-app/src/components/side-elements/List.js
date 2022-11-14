import React, { useContext, useEffect, useState } from 'react';
import { UIContext } from '../UIContext';

const List = ({ lk, data, similarAgs, section, handleClickOnList, ranking }) => {
  const agsRanking = data[section]['third'].substring(0, data[section]['third'].indexOf(' '));
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), 500);
    return () => clearTimeout(timer);
  }, similarAgs);

  const uiVis = useContext(UIContext);

  /**
   * when someone clicked on a list item, pass this to parent
   * @param {} ags AGS of name in the list
   */
  function clickOnList(ags, name) {
    if (!active) {
      return;
    }
    setActive(false);
    lk = { value: parseInt(ags), label: name };
    handleClickOnList(lk);
  }

  return (
    <div className="list-inner-container">
      <div className={`list-similar-container ${agsRanking}`}>
        {lk.value !== 0 && ranking !== '' && <h5>auch im {data[section]['third']}:</h5>}
        {(lk.value === 0 || ranking == '') && <h5>Schaue dir auch an:</h5>}
        <ul>
          {similarAgs.map((ags, a) => {
            return (
              <ol
                className={`ui-${uiVis}`}
                key={a}
                onClick={(e) => {
                  e.preventDefault();
                  if (!uiVis || !active) return;
                  clickOnList(ags.value, ags.label);
                }}
              >
                {ags.label}
              </ol>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default List;
