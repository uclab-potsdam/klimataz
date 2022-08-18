import React from "react";

const List = () => {
    return (
        <div className="list-inner-container">
            <div className="list-similar-container">
                <h5>Similar</h5>
                <ul>
                    <ol>München</ol>
                    <ol>Barnim</ol>
                    <ol>Hamburg</ol>
                    <ol>Freiburg</ol>
                    <ol>Köln (Landkreis)</ol>
                </ul>
            </div>
            <div className="list-dissimilar-container">
                <h5>Different</h5>
                <ul>
                    <ol>Thüringen (Bundesland)</ol>
                    <ol>Schweinfurt</ol>
                    <ol>this name is really long</ol>
                    <ol>Berlin (Stadt)</ol>
                </ul>
            </div>
        </div>
    );
};

export default List;
