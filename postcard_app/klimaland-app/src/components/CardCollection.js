import Card from "./Card";
import Dropdown from "./Dropdown";
import { useState } from "react";
import Select from "react-select";

import makeAnimated from "react-select/animated";

const CardCollection = () => {
  const sections = [
    {
      label: "Mobilität",
      key: "mobility",
    },
    {
      label: "Gebäude",
      key: "buildings",
    },
    {
      label: "Energie",
      key: "energy",
    },
    {
      label: "Landwirtschaft",
      key: "agriculture",
    },
    {
      label: "Abfallentsorgung",
      key: "waste",
    },
  ];

  const landkreise = [
    {
      label: "Flennsburg",
      value: "1011",
    },
    {
      label: "Hamburg",
      value: "2",
    },
    {
      label: "Berlin",
      value: "11",
    },
  ];

  const [section, setSection] = useState();

  const [landkreis, setLandkreis] = useState(0);

  const animatedComponents = makeAnimated();

  return (
    <div className="CardCollection">
      <h2>Card Collections</h2>

      <Dropdown options={landkreise} switchOption={setLandkreis} />
      <h5>{landkreis}</h5>

      <Dropdown options={sections} switchOption={setSection} />
      <h5>{section}</h5>

      <Select components={animatedComponents} isMulti options={landkreise} />

      <Card />
    </div>
  );
};

export default CardCollection;
