import Card from "./Card";
import Select from "react-select";
import { useState } from "react";
import flip from "../img/buttons/flip.png";
import switchCard from "../img/buttons/switch.png";
import shuffle from "../img/buttons/shuffle.png";
import close from "../img/buttons/close.png";

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
    <div className="card-collection">
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

      <div className="card-container">
        <Card lk="berlin" section="energy" />
        <Card lk="hamburg" section="mobility" />
        <Card lk="stuttgart" section="buildings" />
        <button onClick={console.log("close")}>
          <img
            src={close}
            className="close-button-img"
            alt="close-button-img"
          />
        </button>
        <button onClick={console.log("flip")}>
          <img src={flip} className="flip-button-img" alt="flip-button-img" />
        </button>
        <button onClick={console.log("switch")}>
          <img
            src={switchCard}
            className="switch-button-img"
            alt="switch-button-img"
          />
        </button>
        <button onClick={console.log("shuffle")}>
          <img
            src={shuffle}
            className="shuffle-button-img"
            alt="shuffle-button-img"
          />
        </button>
      </div>
    </div>
  );
};

export default CardCollection;
