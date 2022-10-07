function _1(md) {
  return md`
# Data Aggregation for taz klima prj
  `;
}

function _2(md) {
  return md`
### Selectors Control sheet
  `;
}

function _3(md) {
  return md`
Loading data
  `;
}

function _PopLand(FileAttachment) {
  return FileAttachment('12411-0015@1.csv').csv();
}

function _PopBundeslaender(FileAttachment) {
  return FileAttachment('12411-0010_flat@1.csv').csv();
}

function _PopGermany(PopLand, PopBundeslaender) {
  return PopLand.concat(PopBundeslaender);
}

function _kreise_geocoordinates(FileAttachment) {
  return FileAttachment('kreise_geocoordinates.csv').csv();
}

function _blCoords(FileAttachment) {
  return FileAttachment('bl-coords.csv').csv();
}

function _germanyCoords(blCoords, kreise_geocoordinates) {
  return blCoords.concat(kreise_geocoordinates);
}

function _10(md) {
  return md`
Overview of population data for LKs and BLs
  `;
}

function _table(Inputs, PopGermany) {
  return Inputs.table(PopGermany);
}

function _12(md) {
  return md`
Init empty object and fill it with landkreise data (filter out some landkreise that have changed since 2008). Merging also of coordinates pairs from full germanyCoords dataset. Keys to this dict are landkreise and bundeslander ARS ids, which remain consistent across official datasets.
  `;
}

function _names(PopGermany) {
  return PopGermany.map((d) => d['1_Auspraegung_Label']);
}

function _wordInString() {
  return (s, word) => new RegExp('\\b' + word + '\\b', 'i').test(s);
}

function _landkreise(PopGermany, PopBundeslaender, names, wordInString, germanyCoords) {
  let temp = new Array();

  PopGermany.forEach((d) => {
    const id = d['1_Auspraegung_Code'];
    const population = +d['BEVSTD__Bevoelkerungsstand__Anzahl'];
    const BlCodes = PopBundeslaender.map((c) => c['1_Auspraegung_Code']);
    const CurrentBL = id.substring(0, 2);
    const coordinates = [];
    let name = d['1_Auspraegung_Label'];
    let nameAddition = '';

    //remove Landkreise of Berlin, Hamburg, Bremen
    if (['Berlin kreisfreie Stadt', 'Hamburg kreisfreie Stadt'].includes(name)) {
      console.log('skip', name);
      return; //skip this loop
    }
    //check if beginning of name is twice in dataset
    let lk = name.split(' ')[0];
    if (
      names.filter((res) => wordInString(res, lk) && !res.includes('(bis') && !res.includes('-'))
        .length > 1 &&
      lk !== 'Bad' &&
      lk !== 'Frankfurt' &&
      lk !== 'Brandenburg' &&
      lk !== 'Neustadt'
    ) {
      console.log(
        lk,
        names.filter((res) => wordInString(res, lk))
      );
      if (name.includes('Landkreis')) {
        nameAddition = '(Landkreis)';
      } else if (name.includes('kreisfreie Stadt')) {
        nameAddition = '(kreisfreie Stadt)';
      } else {
        console.log(names.filter((res) => res.includes(lk) && !res.includes('(bis')));
      }
    }

    // iterate over coordinates table to get name and pairs
    germanyCoords.forEach((el) => {
      if (el.ARS === id) {
        name = el.GEN;
        coordinates.push(+el.xcoord);
        coordinates.push(+el.ycoord);
      }
    });

    name = name.replace('�', 'ü');

    console.log(name);

    // if the landkreis still exists gets the last pop data point for 2021 and creates key/value pair
    if (!Number.isNaN(population)) {
      temp.push({
        value: +id,
        label: name,
        nameAddition: nameAddition,
        population,
        // each LK gets also a BL code for reference
        bundesland: +BlCodes.find((bl) => CurrentBL === bl),
        coordinates,
      });
    }
  });
  return temp;
}

function _16(landkreise) {
  return landkreise.push({
    value: 0,
    label: 'Deutschland',
    nameAddition: '',
    population: 83240000,
    // each LK gets also a BL code for reference
    bundesland: 0,
    coordinates: [10.4, 51],
  });
}

function _17(md) {
  return md`
Create simple array for indicators
  `;
}

function _indicators() {
  return [
    { value: 'En', label: 'Energie' },
    { value: 'Mo', label: 'Mobilität' },
    { value: 'Ab', label: 'Abfall' },
    { value: 'La', label: 'Landwirtschaft' },
    { value: 'Ge', label: 'Gebäude' },
  ];
}

function _selectors_controls() {
  return new Object();
}

function _20(selectors_controls, landkreise) {
  return (selectors_controls['landkreise'] = landkreise);
}

function _21(selectors_controls, indicators) {
  return (selectors_controls['indicators'] = indicators);
}

function _22(md) {
  return md`
Merging together indicators and landkreise control fields for selectors, the json below can be downloaded
  `;
}

function _23(selectors_controls) {
  return selectors_controls;
}

function _24(md) {
  return md`
---
  `;
}

function _25(md) {
  return md`
### Layout Control Sheet
  `;
}

function _26(md) {
  return md`
Layout combinations are expressed in this matrix. By adding arrays to the parent array it is possible to increase the number of combinations, hence cards' sides. By adding parameters it is possible to specify particular conditions for the visible side.
  `;
}

function _27(md) {
  return md`
| name        | value                                                                    | type |
| ----------- | ------------------------------------------------------------------------ | ---- |
| order       | describes the order in which the layout should be shown ordering hiccups | Int  |
| vis/text    | if true shows the visualization, if fals shows text                      | Bool |
| indicator   | describes which data should be imported in the layout                    | Int  |
| locator map | if true shows the map                                                    | Bool |
  `;
}

function _layout_combinations() {
  return [
    // order, vis/text, indicator, locator map
    [1, true, 1, false],
    [2, false, 1, true],
    [3, true, 2, false],
  ];
}

function _layouts_container() {
  return new Object();
}

function _30(indicators, layout_combinations, layouts_container) {
  return indicators.forEach((ind) => {
    const params = [];
    //const shortLabel = ind.substring(0,2)
    const shortLabel = ind.value;

    for (let index = 0; index < layout_combinations.length; ++index) {
      params.push({
        combo: layout_combinations[index],
      });
    }

    layouts_container[shortLabel] = {
      params,
    };
  });
}

function _31(md) {
  return md`
The Object dict are the short-hand for each indicator. This can be easily extracted as a substring from selectors-control.json and passed as a parameter to access the correct layout for the card at any given point.
  `;
}

function _32(layouts_container) {
  return layouts_container;
}

function _33(md) {
  return md`
---
  `;
}

function _34(md) {
  return md`
### Data Sheet
  `;
}

function _35(md) {
  return md`
This is only a dummy skeleton for testing out the final data structure, still to do:
  `;
}

function _36(md) {
  return md`
1. Create pipeline to fetch snippets of data for each location and indicator
2. Define a hierarchy for indicators
3. Create dynamic labels to differentiate datasets
4. Check if regional data ara available for each landkreis to store it as a parameter
  `;
}

function _ind_keys(layouts_container) {
  return Object.keys(layouts_container);
}

function _lk_keys(landkreise) {
  return Object.keys(landkreise);
}

function _39(ind_keys, lk_keys) {
  return ind_keys.length * 3 * lk_keys.length;
}

function _data() {
  return new Object();
}

function _41(ind_keys, lk_keys, landkreise, data) {
  return ind_keys.forEach((ind) => {
    const landkreisData = new Object();

    lk_keys.forEach((lk) => {
      const id = landkreise[lk].id;

      // For now we create an additional object with an empty data array
      // TO DO: create pipeline to iterate over and fetch matching data snippets for each indicato
      const data = new Object();
      // TO DO: formulate dynamic sublabel that takes into account which indicator we are showing
      const sublabel = ind;
      data[sublabel] = {
        benchmark: 100,
        data: [],
        unit: '1000/t',
        // For now we assume that only two-digits location are not regional
        // TO DO: check for each indicator if regional dataset exists and use it as a condition for this par
        regional: id.toString().length > 2 ? true : false,
      };

      landkreisData[lk] = {
        id,
        // is it low or high level?
        score: 5,
        data,
      };
    });

    data[ind] = landkreisData;
  });
}

function _42(data) {
  return data;
}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() {
    return this.url;
  }
  const fileAttachments = new Map([
    [
      'kreise_geocoordinates.csv',
      {
        url: new URL(
          './files/1ead7dd40bc8ba252dcd2eb31a9b5a8327968b9448c62421fc832cf2b754b7c2276e6d612b51a5344779376df341e211075b0a95b2d73de2488360099e1115cb.csv',
          import.meta.url
        ),
        mimeType: 'text/csv',
        toString,
      },
    ],
    [
      'bl-coords.csv',
      {
        url: new URL(
          './files/422028f7c54a1fad033494a53beeea1fdfa4126b00317486a52af85df3ae3e64f1ca46c1b221a33a10ab258c1e3593dd80a4b3dd81d4224dd1be7b2ab4c757cb.csv',
          import.meta.url
        ),
        mimeType: 'text/csv',
        toString,
      },
    ],
    [
      '12411-0015@1.csv',
      {
        url: new URL(
          './files/623d45cedde3a3e8913e5cd5f63d718c6869f3205d0f21d8997412d6664e6064b7a4ff0788e7fe062303931a8ab40379877092382cad5e124752e882cd46228c.csv',
          import.meta.url
        ),
        mimeType: 'text/csv',
        toString,
      },
    ],
    [
      '12411-0010_flat@1.csv',
      {
        url: new URL(
          './files/6db81143bcd5eb89ffe6382fc48c30d9042b9cd79c8190a834f6d6dec777088768289cc889d0415b668457734f9f90bcb2ea47783082f51735d0bdafda09db48.csv',
          import.meta.url
        ),
        mimeType: 'text/csv',
        toString,
      },
    ],
  ]);
  main.builtin(
    'FileAttachment',
    runtime.fileAttachments((name) => fileAttachments.get(name))
  );
  main.variable(observer()).define(['md'], _1);
  main.variable(observer()).define(['md'], _2);
  main.variable(observer()).define(['md'], _3);
  main.variable(observer('PopLand')).define('PopLand', ['FileAttachment'], _PopLand);
  main
    .variable(observer('PopBundeslaender'))
    .define('PopBundeslaender', ['FileAttachment'], _PopBundeslaender);
  main
    .variable(observer('PopGermany'))
    .define('PopGermany', ['PopLand', 'PopBundeslaender'], _PopGermany);
  main
    .variable(observer('kreise_geocoordinates'))
    .define('kreise_geocoordinates', ['FileAttachment'], _kreise_geocoordinates);
  main.variable(observer('blCoords')).define('blCoords', ['FileAttachment'], _blCoords);
  main
    .variable(observer('germanyCoords'))
    .define('germanyCoords', ['blCoords', 'kreise_geocoordinates'], _germanyCoords);
  main.variable(observer()).define(['md'], _10);
  main.variable(observer('viewof table')).define('viewof table', ['Inputs', 'PopGermany'], _table);
  main
    .variable(observer('table'))
    .define('table', ['Generators', 'viewof table'], (G, _) => G.input(_));
  main.variable(observer()).define(['md'], _12);
  main.variable(observer('names')).define('names', ['PopGermany'], _names);
  main.variable(observer('wordInString')).define('wordInString', _wordInString);
  main
    .variable(observer('landkreise'))
    .define(
      'landkreise',
      ['PopGermany', 'PopBundeslaender', 'names', 'wordInString', 'germanyCoords'],
      _landkreise
    );
  main.variable(observer()).define(['landkreise'], _16);
  main.variable(observer()).define(['md'], _17);
  main.variable(observer('indicators')).define('indicators', _indicators);
  main.variable(observer('selectors_controls')).define('selectors_controls', _selectors_controls);
  main.variable(observer()).define(['selectors_controls', 'landkreise'], _20);
  main.variable(observer()).define(['selectors_controls', 'indicators'], _21);
  main.variable(observer()).define(['md'], _22);
  main.variable(observer()).define(['selectors_controls'], _23);
  main.variable(observer()).define(['md'], _24);
  main.variable(observer()).define(['md'], _25);
  main.variable(observer()).define(['md'], _26);
  main.variable(observer()).define(['md'], _27);
  main
    .variable(observer('layout_combinations'))
    .define('layout_combinations', _layout_combinations);
  main.variable(observer('layouts_container')).define('layouts_container', _layouts_container);
  main.variable(observer()).define(['indicators', 'layout_combinations', 'layouts_container'], _30);
  main.variable(observer()).define(['md'], _31);
  main.variable(observer()).define(['layouts_container'], _32);
  main.variable(observer()).define(['md'], _33);
  main.variable(observer()).define(['md'], _34);
  main.variable(observer()).define(['md'], _35);
  main.variable(observer()).define(['md'], _36);
  main.variable(observer('ind_keys')).define('ind_keys', ['layouts_container'], _ind_keys);
  main.variable(observer('lk_keys')).define('lk_keys', ['landkreise'], _lk_keys);
  main.variable(observer()).define(['ind_keys', 'lk_keys'], _39);
  main.variable(observer('data')).define('data', _data);
  main.variable(observer()).define(['ind_keys', 'lk_keys', 'landkreise', 'data'], _41);
  main.variable(observer()).define(['data'], _42);
  return main;
}
