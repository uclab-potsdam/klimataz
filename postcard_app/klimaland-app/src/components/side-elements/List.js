import React from "react";

const List = () => {
    return (
        <div className="list-inner-container">
            <div className="list-similar-container">
                <h4>Similar</h4>
                <ul>
                    <ol>AAA</ol>
                    <ol>BBB</ol>
                    <ol>CCC</ol>
                </ul>
            </div>
            <div className="list-dissimilar-container">
                <h4>Different</h4>
                <ul>
                    <ol>AAA</ol>
                    <ol>BBB</ol>
                    <ol>CCC</ol>
                </ul>
            </div>
        </div>
    );
};

export default List;
