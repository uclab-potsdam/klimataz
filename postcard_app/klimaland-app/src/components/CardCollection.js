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

  const [index, setIndex] = useState(0);
  const cards = [
    { id: "1", label: "Berlin" },
    { id: "2", label: "Hamburg" },
    { id: "3", label: "Flennsburg" },
    { id: "4", label: "München" },
  ];

  const mod = (n, m) => {
    let result = n % m;
    return result >= 0 ? result : result + m;
  };

  const nextCard = () => {
    setIndex((index + 1) % cards.length);
  };

  return (
    <div className="card-collection">
      <h2>Card Collections</h2>

      <Select
        isMulti
        defaultValue={landkreis}
        onChange={setLK}
        options={landkreise}
      />

      <h5>Du hast {landkreis.map((elem) => elem.label + " ")} ausgewählt</h5>

      <div style={{ visibility: viewComp ? "visible" : "hidden" }}>
        <Select
          defaultValue={section}
          onChange={setSection}
          options={sections}
        />

        <h5>& den Sektor {section.label}</h5>
      </div>

      <h2>Ordered overview</h2>

      <div className="card-container-ordered">
        {cards.map((item, i) => {
          let classProp = "card card-ordered";

          return (
            <Card
              key={item.id}
              classProp={classProp}
              lk={item.label}
              section="energy"
            />
          );
        })}
      </div>

      <h2>Zoomed in Carousel view</h2>
      <div className="card-container-stacked">
        <div className="carousel">
          {cards.map((item, i) => {
            const indexLeft = mod(index - 1, cards.length);
            const indexRight = mod(index + 1, cards.length);

            let classProp = "";

            if (i === index) {
              classProp = "card card-active";
            } else if (i === indexRight) {
              classProp = "card card-right";
            } else if (i === indexLeft) {
              classProp = "card card-left";
            } else {
              classProp = "card card-back";
            }

            return (
              <Card
                key={item.id}
                classProp={classProp}
                lk={item.label}
                section="energy"
              />
            );
          })}
          <Card
            key="9999"
            classProp={"card"}
            lk={"item.label"}
            section="energy"
          />
        </div>

        <div className="button-container">
          <button className="close-button">
            <img
              src={close}
              className="close-button-img"
              alt="close-button-img"
            />
          </button>

          <button className="switch-button" onClick={nextCard}>
            <img
              src={switchCard}
              className="switch-button-img"
              alt="switch-button-img"
            />
          </button>

          <button className="flip-button">
            <img src={flip} className="flip-button-img" alt="flip-button-img" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardCollection;
