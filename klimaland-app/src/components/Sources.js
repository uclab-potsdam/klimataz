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
          <h4>Quellen und Methodik</h4>
          <p>
            Single iFrames are sized based on the use case. The size of the container determines in
            which way the visualization is shown to the user and prevent weird things (e.g.,
            overlapping squares, misplaced labels and so on). The overall app is built with Nuxt so
            it is possible to reference single pages automatically generated on build. Within the
            iFrame it is possible to scroll horizontally and hover on single elements to explore its
            content. Soon it will be also possible to proceed via click (as a fallback in case
            scroll doesn't work). The general container size is already following taz specs.
            <a href="https://github.com/uclab-potsdam/klimataz/">
              Here's the github folder with the code
            </a>
            .
          </p>
          <h5>Landwirtschaft</h5>
          <p>
            Single iFrames are sized based on the use case. The size of the container determines in
            which way the visualization is shown to the user and prevent weird things (e.g.,
            overlapping squares, misplaced labels and so on). The overall app is built with Nuxt so
            it is possible to reference single pages automatically generated on build.
            <a href="https://github.com/uclab-potsdam/klimataz/">
              Here's the github folder with the code
            </a>
            .
          </p>
          <h5>Mobilität</h5>
          <p>
            Single iFrames are sized based on the use case. The size of the container determines in
            which way the visualization is shown to the user and prevent weird things (e.g.,
            overlapping squares, misplaced labels and so on).
            <a href="https://github.com/uclab-potsdam/klimataz/">
              Here's the github folder with the code
            </a>
            .
          </p>
          <h5>Abfall</h5>
          <p>
            Single iFrames are sized based on the use case. The size of the container determines in
            which way the visualization is shown to the user and prevent weird things (e.g.,
            overlapping squares, misplaced labels and so on). The overall app is built with Nuxt so
            it is possible to reference single pages automatically generated on build. Within the
            iFrame it is possible to scroll horizontally and hover on single elements to explore its
            content. Soon it will be also possible to proceed via click (as a fallback in case
            scroll doesn't work). The general container size is already following taz specs.
            <a href="https://github.com/uclab-potsdam/klimataz/">
              Here's the github folder with the code
            </a>
            .
          </p>
          <h5>Landwirtschaft</h5>
          <p>
            Single iFrames are sized based on the use case. The size of the container determines in
            which way the visualization is shown to the user and prevent weird things (e.g.,
            overlapping squares, misplaced labels and so on).
            <a href="https://github.com/uclab-potsdam/klimataz/">
              Here's the github folder with the code
            </a>
            .
          </p>
          <h5>Gebäude</h5>
          <p>
            Single iFrames are sized based on the use case. The size of the container determines in
            which way the visualization is shown to the user and prevent weird things (e.g.,
            overlapping squares, misplaced labels and so on). The overall app is built with Nuxt so
            it is possible to reference single pages automatically generated on build. Within the
            iFrame it is possible to scroll horizontally and hover on single elements to explore its
            content. Soon it will be also possible to proceed via click (as a fallback in case
            scroll doesn't work). The general container size is already following taz specs.
            <a href="https://github.com/uclab-potsdam/klimataz/">
              Here's the github folder with the code
            </a>
            .
          </p>
          <h5>Weitere Links</h5>
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
