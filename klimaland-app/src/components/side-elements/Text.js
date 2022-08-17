import React from "react";

const Text = ({ lk, section, activeSide }) => {
    return (
        <div className="text-inner-container">
            <div className="section-title">
                <h2>Es geht hier um {section}.</h2>
            </div>
            <div className="section-text">
                {/* <h4>Grüsse aus {lk.label}, mit der id {lk.value}!</h4> */}
                <p>
                    Seite {activeSide}. Hallo!
                    Ich schicke dir Grüße aus dem schönen Landkreis {lk.label} in Brandenburg!
                    Momentan wird es hier an 7,7 Tagen im Jahr über 30 Grad, aber wenn wir so
                    weitermachen, werden es Mitte des Jahrhunderts schon 9 sein. 30 Prozent
                    mehr! Wir könnten etwas dagegen tun, zum Beispiel im Bereich Verkehr.
                    Im Barnim gibt XY Autos pro 100 Einwohner, damit liegt der Landkreis
                    was den Autobesitz angeht im Vergleich im adjektiv Drittel. In Brandenburg
                    werden nur XY Prozent der Arbeitswege mit Fahrrad, öffentlichem Verkehr
                    oder zu Fuß erledigt. Um die Erderhitzung zu stoppen, müssen die Emissionen
                    im Verkehr bei null sein. Schaffen wir das?
                    Viele Grüße!
                </p>
            </div>
        </div>
    );
};

export default Text;
