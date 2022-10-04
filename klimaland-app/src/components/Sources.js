import React from 'react';
import { useState } from 'react';

import closeCard from '../img/buttons/close.svg';

const Sources = () => {
  const [showSources, setshowSources] = useState(false);

  return (
    <div className="sources-container">
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
        <div className="sources-text">
          <h3>Quellen und Methodik</h3>
          <p>
            Die Daten für dieses Projekt stammen zum größten Teil aus öffentlich verfügbaren
            Quellen, außer Daten aus der Umfrage "Mobilität in Deutschland" 2017, sowie die GERICS
            Klimaausblicke.{' '}
          </p>
          <p>
            In folgendem Artikel beschreiben wir genauer unsere Herangehensweise zur Recherche und
            Auswahl der passenden Daten: <a href="taz.de/klima">taz.de</a>
          </p>
          <div className="sources-linklist">
            <h4>Energie</h4>
            <p>
              Industrie: 
              <a href="https://www.regionalstatistik.de/genesis/online">
                Statistische Ämter des Bundes und der Länder - 43531-01-02-4
              </a>
              , 2020.
            </p>
            <p>
              Primärenergie: 
              <a href="https://www.lak-energiebilanzen.de">LAK Energiebilanzen</a>, 2019 und{' '}
              <a
                href="
https://ag-energiebilanzen.de/daten-und-fakten/auswertungstabellen/"
              >
                AG Energiebilanzen
              </a>
              , 2021.
            </p>
            <h4>Landwirtschaft</h4>
            <p>
              Tierhaltung: 
              <a href="https://www.regionalstatistik.de/genesis/online">
                Statistische Ämter des Bundes und der Länder
              </a>
              , 2020.
            </p>
            <p>
              Tiere pro Fläche: 
              <a href="https://www.regionalstatistik.de/genesis/online">
                Statistische Ämter des Bundes und der Länder
              </a>
              , 2020.
              <br />
            </p>
            <h4>Abfall</h4>
            <p>
              Organische Abfälle: 
              <a href="https://www.regionalstatistik.de/genesis/online">
                Statistische Ämter des Bundes und der Länder
              </a>
              , 2020.
            </p>
            <h4>Mobilität</h4>
            <p>
              PkW-Dichte: 
              <a href="https://www.regionalstatistik.de/genesis/online">
                Statistische Ämter des Bundes und der Länder - 46251-02-01 - KBA
              </a>
              , 2021.
            </p>
            <p>
              Transportmittel: 
              <a href="http://www.mobilitaet-in-deutschland.de/publikationen2017.html">
                Mobilität in Deutschland (MiD)
              </a>
              , 2017.
            </p>
            <h4>Gebäude</h4>
            <p>
              Heizenergie: 
              <a href="https://www.regionalstatistik.de/genesis/online">
                Statistische Ämter des Bundes und der Länder - 31121-06-01-4
              </a>
              , 2020.
            </p>
            <p>
              Energieeffizienz: 
              <a href="https://www.co2online.de/">CO2-online</a>, 2022.
            </p>
            <h4>Weitere Links</h4>
            <p>
              <a href="https://uclab.fh-potsdam.de/">Urban Complexity Lab FH Potsdam</a>
              <br />
              <a href="https://taz.de/klima">Klima taz</a>
              <br />
              <a href="https://github.com/uclab-potsdam/klimataz/">Zur Umfrage zu dem Projekt</a>
            </p>
          </div>
          <button
            className="button close"
            onClick={() => {
              showSources ? setshowSources(false) : setshowSources(true);
            }}
          >
            <img src={closeCard} className="button img" alt="close-button-img" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sources;
