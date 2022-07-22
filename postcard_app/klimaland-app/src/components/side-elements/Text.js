import React from "react";

const Text = ({ lk, section, activeSide }) => {
    return (
        <div className="text-container">
            <h3>Grüsse aus {lk.label}, mit der id {lk.value}!</h3>
            <h4>Es geht hier um {section}.</h4>
            <p>Seite {activeSide}</p>        
        </div>
    );
};

export default Text;
