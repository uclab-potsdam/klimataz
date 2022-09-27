import React from 'react';

const List = ({ lk, data, similarAgs, section, handleClickOnList }) => {
  const agsRanking = data[section]['third'].substring(0, data[section]['third'].indexOf(' '));

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
        {lk.value !== 0 && <h5>Im {data[section]['third']} wie:</h5>}
        {lk.value === 0 && <h5>Check out also:</h5>}
        <ul>
          {similarAgs.map((ags, a) => {
            return (
              <ol
                key={a}
                onClick={() => {
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
