import Card from "./Card";
import Select from "react-select";
import { useState } from "react";

const CardCollection = () => {
  const sections = [
    {
      label: "Mobilität",
      value: "mobility",
    },
    {
      label: "Gebäude",
      value: "buildings",
    },
    {
      label: "Energie",
      value: "energy",
    },
    {
      label: "Landwirtschaft",
      value: "agriculture",
    },
    {
      label: "Abfallentsorgung",
      value: "waste",
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

  const [section, setSection] = useState([]);
  const [landkreis, setLK] = useState([]);
  let viewComp = false;

  if (landkreis.length > 1) {
    viewComp = true;
  } else {
    viewComp = false;
  }

  return (
    <div className="CardCollection">
      <h2>Card Collections</h2>

      <Select
        isMulti
        defaultValue={landkreis}
        onChange={setLK}
        options={landkreise}
      />

      <h5>{landkreis.map((elem) => elem.label)}</h5>

      <div style={{ visibility: viewComp ? "visible" : "hidden" }}>
        <Select
          defaultValue={section}
          onChange={setSection}
          options={sections}
        />

        <h5>{section.label}</h5>
      </div>

      <Card />
    </div>
  );
};

export default CardCollection;
