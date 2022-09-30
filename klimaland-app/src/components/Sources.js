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
            Single iFrames are sized based on the use case. The size of the container determines in
            which way the visualization is shown to the user and prevent weird things (e.g.,
            overlapping squares, misplaced labels and so on). The overall app is built with Nuxt so
            it is possible to reference single pages automatically generated on build.
          </p>
          <h4>Energie</h4>
          <h5>Industrie</h5>
          <p>
            <a href="https://www.destatis.de/DE/Presse/Pressemitteilungen/2020/04/PD20_152_435.html">
              Statistisches Bundesamt (Destatis)
            </a>
            , 2020.
          </p>
          <h5>Primärenergie</h5>
          <p>
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
          <h5>Tierhaltung</h5>
          <p>
            <a href="https://www.regionalstatistik.de/genesis/online">
              Statistische Ämter des Bundes und der Länder
            </a>
            , 2020.
          </p>
          <h5>Tiere pro Fläche</h5>
          <p>
            <a href="https://www.regionalstatistik.de/genesis/online">
              Statistische Ämter des Bundes und der Länder
            </a>
            , 2020.
          </p>
          <h4>Abfall</h4>
          <h5>Organische Abfälle</h5>
          <p>
            <a href="https://www.regionalstatistik.de/genesis/online">
              Statistische Ämter des Bundes und der Länder
            </a>
            , 2020.
          </p>
          <h4>Mobilität</h4>
          <h5>PkW-Dichte</h5>
          <p>
            <a href="https://www.regionalstatistik.de/genesis/online">
              Statistische Ämter des Bundes und der Länder - 46251-02-01 - KBA
            </a>
            , 2021.
          </p>
          <h5>Transportmittel</h5>
          <p>
            <a href="http://www.mobilitaet-in-deutschland.de/publikationen2017.html">
              Mobilität in Deutschland (MiD)
            </a>
            , 2017.
          </p>

          <h4>Gebäude</h4>
          <h5>Heizenergie</h5>
          <p>
            <a href="https://www.regionalstatistik.de/genesis/online">
              Statistische Ämter des Bundes und der Länder
            </a>
            , 2020.
          </p>
          <h5>Energieeffizienz</h5>
          <p>
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
