import React from "react";

const Dropdown = ({ options, switchOption }) => {
  const handleChange = (event) => {
    switchOption(event.target.value);
  };

  return (
    <div>
      <select onChange={handleChange}>
        {options.map((element, i) => (
          <option value={element.value} key={i}>
            {element.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
