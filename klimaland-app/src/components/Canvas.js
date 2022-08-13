import LayoutManager from './LayoutManager';

//data
import DropDownControls from '../data/selector-controls.json';
import { isInt } from './helperFunc';

const Canvas = () => {
  //load data from selector json
  let landkreiseData = DropDownControls.landkreise;
  let sectionsData = DropDownControls.indicators;

  let defaultSections = ['En', 'Mo', 'Ab', 'La', 'Ge'];
  let defaultPick = [
    { lk: { value: '0', label: 'Deutschland' }, section: 'Mo' },
    { lk: { value: '0', label: 'Deutschland' }, section: 'En' },
    { lk: { value: '0', label: 'Deutschland' }, section: 'La' },
    { lk: { value: '0', label: 'Deutschland' }, section: 'Ab' },
    { lk: { value: '0', label: 'Deutschland' }, section: 'Ge' },
  ];

  // get parameters from iframe
  let getParamValue = function (paramName) {
    var url = window.location.search.substring(1); //get rid of "?" in querystring
    var qArray = url.split('&'); //get key-value pairs
    for (var i = 0; i < qArray.length; i++) {
      var pArr = qArray[i].split('='); //split key and value
      if (pArr[0] === paramName)
        //  console.log(pArr[1]);
        return pArr[1]; //return value
    }
  };

  /**
   * checks validity of iframe values
   * generates editors pick depending on iframe values
   * return default pick if values are not valid
   * @returns editors pick in the format {lk:{value:"",label:""},section:""} depending on iframe
   */
  const getCheckedEditorsPick = function () {
    //TODO:
    //here you can later pipe in the iframe params, I don't know how to do that
    //for example, you could call getParamValue inside of this function
    //something like this:
    //let ags = getParamValue('param1');
    //let sections = getParamValue('param2');
    //let ui = getParamValue('param3');

    //I add the values we need to check here manually here for testing purposes.
    let ags = [1, 12, 3];
    let sections = ['En'];
    let ui = true;

    //TODO: check if getParamValue returns something undefined
    //TODO: set default values if one of the paramters is undefined

    let checkedPick = [];

    if (ui === undefined || typeof variable !== 'boolean') {
      ui = true;
    }

    //if landkreise are undefined (== no parameter), return default
    if (ags === undefined || ags.length === 0) {
      //TODO: still keep UI param
      return defaultPick;
    }

    if (sections === undefined) {
      sections = defaultSections;
    }

    //SINGLE POSTCARD VIEW
    //if landkreise is one and section is one, set UI to false
    if (ags.length === 1 && sections.length === 1) {
      //console.log('SINGLE POSTCARD VIEW');
      //TODO: keep UI param
      ui = false;

      try {
        let name = getLandkreisLabel(ags[0]);
        let section = checkSection(sections[0]);
        checkedPick.push({
          lk: { value: ags[0], label: name },
          section: section,
        });
        if (checkedPick.length !== 0) {
          return checkedPick;
        }
      } catch (error) {
        console.log(error);
        return defaultPick; //if selected landkreis or section not valid in thumbnail view, return default Pick
      }
    }

    //LK VIEW
    if (ags.length === 1 && sections.length !== 1) {
      //console.log('LK VIEW');
      //TODO: keep UI param
      sections = defaultSections;
      let ort = ags[0];
      try {
        let name = getLandkreisLabel(ort);
        sections.forEach((sec) => {
          checkedPick.push({
            lk: { value: ort, label: name },
            section: sec,
          });
        });
        if (checkedPick.length !== 0) {
          return checkedPick;
        }
      } catch (error) {
        console.log(error);
        return defaultPick; //if selected landkreis not valid in LK view, return default Pick
      }
    }

    //COMPARISON VIEW
    if (ags.length > 1) {
      //console.log('COMPARISON VIEW');
      //TODO: keep UI param

      //if more than 3 landkreise, only keep the first three
      if (ags.length > 3) {
        ags = ags.slice(0, 3);
      }

      //if no section specified, use default sections
      if (sections === undefined) {
        sections = defaultSections;
      }

      //if one of the sections is not valid, use dault secitons

      if (sections.length >= 1) {
        sections.forEach((sec) => {
          try {
            checkSection(sec);
          } catch (error) {
            sections = defaultSections;
            //NICE TO HAVE: keep valid sections, remove sections that throw an error
          }
        });
      }

      //if section list empty (or empty now after checking), use default sections
      if (sections.length === 0) {
        sections = defaultSections;
      }

      //add one postcard for each ags
      ags.forEach((ort) => {
        try {
          let name = getLandkreisLabel(ort);
          let section = checkSection(sections[0]);
          checkedPick.push({
            lk: { value: ort, label: name },
            section: section,
          });
        } catch (error) {
          console.log(error);
        }
      });

      if (checkedPick.length === 0) {
        return defaultPick;
      }
      return checkedPick;
    }
    //TODO: set UI as context
    //https://reactjs.org/docs/context.html

    //if this did not return anything yet
    //RETURN DEFAULT
    return defaultPick;
  };

  /**
   * return Name of Landkreis from AGS using the data from dropdowncontrols
   * @param {*} ags to check and to get name from
   * @returns name of the landkreis if landkreis exists
   *@throws error if ags not in our landkries data
   */
  const getLandkreisLabel = function (ags) {
    if (ags === undefined || !isInt(ags)) {
      throw new Error('IframeError: Selected Landkreis is not Valid');
    }
    let lk = landkreiseData.find((x) => x.value === ags);
    if (lk === undefined || lk.label === undefined) {
      throw new Error('IframeError: Selected Landkreis is not Valid');
    }
    return landkreiseData.find((x) => x.value === ags).label;
  };

  /**
   * checks if section is not undefined and if our list of all section includes this section
   * @param {*} section to check
   * @returns section if everything is fine with section
   * @throws
   */
  let checkSection = function (section) {
    if (section === undefined || !defaultSections.includes(section)) {
      throw new Error('Selected Section is not valid');
    }
    return section;
  };

  // let areaPick1 = getParamValue('param1');
  // let areaPick2 = getParamValue('param2');
  // let areaPick3 = getParamValue('param3');

  return (
    <div className="indicators-iframe">
      {/* <h1>Climate Protection Indicators</h1> */}
      <LayoutManager
        editorspick={getCheckedEditorsPick()}
        landkreiseData={landkreiseData}
        sectionsData={sectionsData} //TODO: only give specific section options if specified here and in comparisonview
      />
    </div>
  );
};

export default Canvas;
