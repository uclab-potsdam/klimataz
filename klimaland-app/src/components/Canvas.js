import { useState, useEffect } from 'react';
import LayoutManager from './LayoutManager';

//data
import DropDownControls from '../data/selector-controls.json';
import { isInt } from './helperFunc';

const Canvas = () => {
  //load data from selector json
  let landkreiseData = DropDownControls.landkreise;
  let sectionsData = DropDownControls.indicators;

  const [sectionOptions, setSectionOptions] = useState(sectionsData);

  let defaultSections = sectionsData.map((el) => {
    return el.value;
  });

  let defaultPick = sectionsData.map((el) => ({
    lk: { value: '0', label: 'Deutschland' },
    section: { value: el.value, label: el.label },
    ui: { value: true },
    view: { value: 0, label: 'default' },
  }));

  const [editorsPick, setEditorsPick] = useState(defaultPick);

  useEffect(() => {
    getCheckedEditorsPick();
  }, []); // only runs once at the beginning

  // get parameters from iframe <iframe src="http://postcardapp.de/?ags-1001-2-11&indicator-Mo&ui-true">
  const getParamValue = function (parameter) {
    const url = window.location.search.substring(1); //get rid of "?" in querystring ags-1001-2-11&indicator-Mo&ui-true
    const splitParams = url.split('&'); //get key-value pairs

    for (let i = 0; i < splitParams.length; i++) {
      const splitKeyVal = splitParams[i].split('-'); //split key and value ['ags', '1001', '2', '11']

      if (splitKeyVal[0] === parameter) {
        splitKeyVal.shift(); // through out the parameter as first value in array
        return splitKeyVal; //return array of values
      }
    }
  };

  /**
   * checks validity of iframe values
   * generates editors pick depending on iframe values
   * return default pick if values are not valid
   * @returns editors pick in the format {ags:{value:"",label:""},section:{value:"",label:""}} depending on iframe
   */
  const getCheckedEditorsPick = function () {
    // -------- PULL DATA (AGS,SELECTION,UI) FROM IFRAME with getParamValue() -------
    // -------- AGS --------
    let lk = getParamValue('ags');
    let ags = [];

    //if landkreise are undefined (== no parameter), use default
    if (lk === undefined || lk.length === 0) {
      ags = 0;
      // return;
    } else {
      ags = lk.map(Number); // convert to number from string
    }

    // -------- SECTIONS --------
    let sectionPick = getParamValue('indicator');
    let sections = [];

    if (sectionPick === undefined) {
      sections = defaultSections;
    } else {
      sections = sectionPick;
    }

    //  -------- UI --------
    let definedUI = getParamValue('ui');
    let uiVis = true;
    // if ui getParamValue returns something undefined
    // set ui to true otherwise hand over iframe value
    if (definedUI === undefined) {
      uiVis = true;
    } else {
      if (definedUI[0] === 'true') uiVis = true;
      if (definedUI[0] === 'false') uiVis = false;
    }

    // -------- SET EDITORS PICK FOR EACH VIEW -------
    let checkedPick = [];

    //first set to default to be safe, overwrite later if we have other valid options
    // -------- MAIN/DEFAULT VIEW -------
    setEditorsPick(defaultPick);

    if (ags === 0 && sections.length === 0) {
      console.log('MAIN/DEFAULT VIEW');

      let mainPick = [];
      try {
        mainPick = sectionsData.map((el) => ({
          lk: { value: '0', label: 'Deutschland' },
          section: { value: el.value, label: el.label },
          ui: { value: uiVis },
          view: { value: 0, label: 'mainView' },
        }));
        if (mainPick.length !== 0) {
          setEditorsPick(mainPick);
        }
      } catch (error) {
        console.log(error);
        setEditorsPick(mainPick);
        return; //if selected landkreis or section not valid in thumbnail view, set default Pick and stop function
      }
    }

    // -------- SINGLE POSTCARD VIEW -------
    if (ags.length === 1 && sections.length === 1) {
      console.log('SINGLE POSTCARD VIEW');
      //TODO: keep UI param
      uiVis = false;

      try {
        let name = getCheckedLandkreisLabel(ags[0]);
        let sectionLabel = getCheckedSectionLabel(sections[0]);
        checkedPick.push({
          lk: { value: ags[0], label: name },
          section: { value: sections[0], label: sectionLabel },
          ui: { value: uiVis },
          view: { value: 3, label: 'singlePCview' },
        });
        if (checkedPick.length !== 0) {
          setEditorsPick(checkedPick);
        }
      } catch (error) {
        console.log(error);
        setEditorsPick(defaultPick);
        return; //if selected landkreis or section not valid in thumbnail view, set default Pick and stop function
      }
    }

    // -------- LK VIEW --------
    if (ags.length === 1 && sections.length !== 1) {
      console.log('LK VIEW');
      //TODO: keep UI param
      sections = defaultSections;
      let ort = ags[0];
      try {
        let name = getCheckedLandkreisLabel(ort);
        sections.forEach((sec) => {
          let sectionLabel = getCheckedSectionLabel(sec);
          checkedPick.push({
            lk: { value: ort, label: name },
            section: { value: sec, label: sectionLabel },
            ui: { value: uiVis },
            view: { value: 1, label: 'lkview' },
          });
        });
        if (checkedPick.length !== 0) {
          setEditorsPick(checkedPick);
        }
      } catch (error) {
        console.log(error);
        setEditorsPick(defaultPick);
        return; //if selected landkreis not valid in LK view, set default Pick and stop function
      }
    }

    // -------- COMPARISON VIEW --------
    if (ags.length > 1) {
      console.log('COMPARISON VIEW');
      //TODO: keep UI param

      //if more than 3 landkreise, only keep the first three
      if (ags.length > 3) {
        ags = ags.slice(0, 3);
      }

      //if no section specified, use default sections
      if (sections === undefined) {
        sections = defaultSections;
      }

      //if one of the sections is not valid, use default sections

      if (sections.length >= 1) {
        sections.forEach((sec) => {
          try {
            getCheckedSectionLabel(sec);
          } catch (error) {
            sections = defaultSections;
            //TODO (NICE TO HAVE): keep valid sections, remove sections that throw an error
          }
        });
      }

      //if section list empty (or empty now after checking), use default sections
      if (sections.length === 0) {
        sections = defaultSections;
      }

      //limit options for sections dropdown to sections decided by editor in comparison view
      let comparisonOptions = sections.map((item) => ({
        value: item,
        label: getCheckedSectionLabel(item),
      }));

      //add one postcard for each ags
      ags.forEach((ort) => {
        try {
          let name = getCheckedLandkreisLabel(ort);
          let sectionLabel = getCheckedSectionLabel(sections[0]);
          checkedPick.push({
            lk: { value: ort, label: name },
            section: { value: sections[0], label: sectionLabel },
            ui: { value: uiVis },
            view: { value: 2, label: 'compview' },
          });
        } catch (error) {
          console.log(error);
        }
      });

      if (checkedPick.length !== 0) {
        setEditorsPick(checkedPick);
        setSectionOptions(comparisonOptions);
      }
    }
  };

  /**
   * Function to get "Label" from a "Value" in Data with the format [{value:"",label:""},...]
   * would return "Energie" for "En" or "Flensburg" for AGS 1001.
   * @param {} value id we want the label from (AGS or "En"/"Mo"/...)
   * @param {*} data data to search label in (dropdowncontrols)
   * @throws error if value not in data
   * @returns label of this value
   */
  const getLabelFromData = function (value, data) {
    let item = data.find((x) => x.value === value);
    if (item === undefined || item.label === undefined) {
      throw new Error('IframeError: Selected Landkreis or Section is not Valid');
    }
    return data.find((x) => x.value === value).label;
  };

  /**
   * return Name of Landkreis from AGS using the data from dropdowncontrols and checks validity of section
   * @param {*} ags to check and to get name from
   * @returns name of the landkreis if landkreis exists
   * @throws error if ags not valid
   */
  const getCheckedLandkreisLabel = function (ags) {
    if (ags === undefined || !isInt(ags)) {
      throw new Error('IframeError: Selected Landkreis is not Valid');
    }
    return getLabelFromData(ags, landkreiseData);
  };

  /**
   * return SectionLabel  using the data from dropdowncontrols and
   * checks if section is not undefined and if our list of all section includes this section
   * @param {*} section to check
   * @returns section if everything is fine with section
   * @throws error if section not valid
   */
  let getCheckedSectionLabel = function (section) {
    if (section === undefined || !defaultSections.includes(section)) {
      throw new Error('Selected Section is not valid');
    }
    return getLabelFromData(section, sectionsData);
  };

  return (
    <div className="indicators-iframe">
      <LayoutManager
        editorspick={editorsPick}
        landkreiseData={landkreiseData}
        sectionsData={sectionOptions}
      />
    </div>
  );
};

export default Canvas;
