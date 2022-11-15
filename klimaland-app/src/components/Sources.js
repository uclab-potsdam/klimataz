import React, { useState, useRef } from 'react';
import { useOutsideAlerter } from '../helpers/helperFunc';

import closeCard from '../img/buttons/close.svg';

const Sources = () => {
  const [showSources, setshowSources] = useState(false);

  const close = function () {
    setshowSources(false);
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, close);

  return (
    <div ref={wrapperRef} className={`sources-container ${showSources ? 'open' : ''}`}>
      <button
        className="sources-button"
        onClick={() => {
          showSources ? setshowSources(false) : setshowSources(true);
        }}
      >
        <h2 className="info-i">i</h2>
      </button>
      <div className="info-text-label">
        <h6>Quellen & Methodik</h6>
      </div>
      {showSources && (
        <div className="sources-text-container">
          <button className="button close" onClick={close}>
            <img src={closeCard} className="button img img-close" alt="close-button-img" />
          </button>
          <div className="sources-text">
            <h3>Quellen und Methodik</h3>
            <p>
              Wo stehen wir beim Klimaschutz in Deutschland? Mit welchen Werten lässt sich auf
              lokaler Ebene messen, wo es schon Fortschritte gibt – und wo noch zu wenig? Dieses
              Projekt sendet Postkarten aus einem Land im Wandel. Sie zeigen Daten dazu, wie jeder
              einzelne deutsche Landkreis beim Klimaschutz in den fünf wichtigsten Bereichen
              dasteht.
            </p>
            <p>
              Die Daten für dieses Projekt stammen zum größten Teil aus öffentlich verfügbaren
              Quellen, außer Daten aus der Umfrage "Mobilität in Deutschland" 2017, sowie die GERICS
              Klimaausblicke.{' '}
            </p>
            <p>
              Jede Postkarte zeigt mit einem Stempel, ob der Landkreis in diesem Bereich im
              schlechtesten, mittleren oder besten Drittel aller Kreise liegt. Die Einordnung
              vergleicht dabei nur die Landkreise untereinander - auch ein Landkreis im besten
              Drittel muss also möglicherweise noch mehr fürs Klima tun.
            </p>
            <p>
              In folgendem Artikel beschreiben wir genauer unsere Herangehensweise zur Recherche und
              Auswahl der passenden Daten:{' '}
              <a target="_blank" rel="noreferrer" href="https://www.taz.de/klima">
                taz.de
              </a>
            </p>
            <a target="_blank" rel="noreferrer" href="https://forms.gle/B6dguRvQvC3y6AGi8">
              <div className="umfrage-logo-container"></div>{' '}
            </a>
            <br />
            <div className="sources-linklist">
              <h4>Energie</h4>
              <p>
                Energieverbrauch in der Industrie:
                <br />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.regionalstatistik.de/genesis/online?operation=find&suchanweisung_language=de&query=43531-01-02-4"
                >
                  Statistische Ämter des Bundes und der Länder
                </a>
                <br />
                Code: 43531-01-02-4, 2020.
              </p>
              <p>
                Primärenergieverbrauch:
                <br />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="http://www.lak-energiebilanzen.de/energiebilanzen/"
                >
                  LAK Energiebilanzen
                </a>
                , 2019 und{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="
https://ag-energiebilanzen.de/daten-und-fakten/auswertungstabellen/"
                >
                  AG Energiebilanzen
                </a>
                , 2021.
              </p>
              <h4>Landwirtschaft</h4>
              <p>
                Tierhaltung und Zahl der Tiere:
                <br />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.regionalstatistik.de/genesis/online?operation=find&suchanweisung_language=de&query=41141-03-01-4-B"
                >
                  Statistische Ämter des Bundes und der Länder
                </a>
                <br />
                Code: 41141-03-01-4-B, 2020.
              </p>
              <p>
                Tiere pro Fläche:
                <br />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.statistischebibliothek.de/mir/receive/DESerie_mods_00000027"
                >
                  Statistische Ämter des Bundes und der Länder
                </a>
                , 2020.
                <br />
              </p>
              <h4>Abfall</h4>
              <p>
                Organische Abfälle:
                <br />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.regionalstatistik.de/genesis//online?operation=table&code=32121-01-02-4-B&bypass=true&levelindex=0&levelid=1658850132846"
                >
                  Statistische Ämter des Bundes und der Länder
                </a>
                <br />
                Code: 32121-01-02-4-B, 2020.
              </p>
              <h4>Mobilität</h4>
              <p>
                PkW-Dichte:
                <br />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.regionalstatistik.de/genesis/online?operation=find&suchanweisung_language=de&query=46251"
                >
                  Statistische Ämter des Bundes und der Länder
                </a>
                <br />
                Code: 46251-02-01-4 und 46251-01-02-4, 2021.
              </p>
              <p>
                Transportmittel:
                <br />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="http://www.mobilitaet-in-deutschland.de/publikationen2017.html"
                >
                  Mobilität in Deutschland (MiD)
                </a>
                , 2017.
              </p>
              <h4>Gebäude</h4>
              <p>
                Heizenergie:
                <br />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.regionalstatistik.de/genesis//online?operation=table&code=31121-06-01-4&bypass=true&levelindex=0&levelid=1668093295978"
                >
                  Statistische Ämter des Bundes und der Länder
                </a>
                <br />
                Code: 31121-06-01-4, 2020.
              </p>
              <p>
                Energieeffizienz:
                <br />
                <a target="_blank" rel="noreferrer" href="https://www.co2online.de/">
                  CO2-online
                </a>
                , 2022.
              </p>
              <h4>Weitere Links</h4>

              <a target="_blank" rel="noreferrer" href="https://www.taz.de/">
                <div className="taz-logo-container"></div>
              </a>
              <a target="_blank" rel="noreferrer" href="https://uclab.fh-potsdam.de/">
                <div className="fhp-logo-container"></div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sources;
