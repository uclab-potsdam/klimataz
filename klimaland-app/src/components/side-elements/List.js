import React, { useContext } from 'react';
import { UIContext } from '../UIContext';

const List = ({ lk, data, similarAgs, section, handleClickOnList, ranking }) => {
  const agsRanking = data[section]['third'].substring(0, data[section]['third'].indexOf(' '));

  const uiVis = useContext(UIContext);

  /**
   * when someone clicked on a list item, pass this to parent
   * @param {} ags AGS of name in the list
   */
  function clickOnList(ags, name) {
    lk = { value: parseInt(ags), label: name };
    handleClickOnList(lk);
  }

  return (
    <div className="list-inner-container">
      <div className={`list-similar-container ${agsRanking}`}>
        {lk.value !== 0 && ranking !== '' && <h5>Im {data[section]['third']} wie:</h5>}
        {(lk.value === 0 || ranking == '') && <h5>Schaue dir auch an:</h5>}
        <ul>
          {similarAgs.map((ags, a) => {
            return (
              <ol
                className={`ui-${uiVis}`}
                key={a}
                onClick={() => {
                  if (!uiVis) return;
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
