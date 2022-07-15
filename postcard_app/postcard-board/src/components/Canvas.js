import React, { useState } from "react";
import Card from "./Card";

const Canvas = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  console.log(selectedIndex);

  const check = (index) => setSelectedIndex(index);

  return (
    <div className="canvas">
      <Card />
      <Card />
      <Card />

      {/* <input
        className="slider"
        type="radio"
        name="slider"
        id="card1"
        checked={selectedIndex === 0}
        onClick={() => check(0)}
      />
      <input
        className="slider"
        type="radio"
        name="slider"
        id="card2"
        checked={selectedIndex === 1}
        onClick={() => check(1)}
      />
      <input
        className="slider"
        type="radio"
        name="slider"
        id="card3"
        checked={selectedIndex === 2}
        onClick={() => check(2)}
      />
      <label htmlFor="card1" id="slide1">
        <p>1</p>
        <img
          className="cardelement"
          src="https://picsum.photos/200/200"
          height="100%"
          width="100%"
        />
      </label>
      <label htmlFor="card2" id="slide2">
        <p>2</p>
        <img
          className="cardelement"
          src="https://picsum.photos/200/300"
          height="100%"
          width="100%"
        />
      </label>
      <label htmlFor="card3" id="slide3">
        <p>3</p>
        <img
          className="cardelement"
          src="https://picsum.photos/300/300"
          height="100%"
          width="100%"
        />
      </label> */}
    </div>
  );
};

export default Canvas;
