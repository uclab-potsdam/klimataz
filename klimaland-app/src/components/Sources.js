import React from 'react';
import { useState } from 'react';

const Sources = () => {
  const [showSources, setshowSources] = useState(false);

  return (
    <div className="sources-container">
      <div className="sources">
        <button
          className="sources-button"
          onClick={() => {
            showSources ? setshowSources(false) : setshowSources(true);
          }}
        >
          <h2 className="info-i">i</h2>
        </button>
        {showSources && (
          <div className="sources-text">
            {console.log(showSources)}
            <h4>Quellen und Methodik</h4>
            <p>
              Single iFrames are sized based on the use case. The size of the container determines
              in which way the visualization is shown to the user and prevent weird things (e.g.,
              overlapping squares, misplaced labels and so on). The overall app is built with Nuxt
              so it is possible to reference single pages automatically generated on build. Within
              the iFrame it is possible to scroll horizontally and hover on single elements to
              explore its content. Soon it will be also possible to proceed via click (as a fallback
              in case scroll doesn't work). The general container size is already following taz
              specs.
              <a href="https://github.com/uclab-potsdam/klimataz/">
                Here's the github folder with the code
              </a>
              .
            </p>
            <p>
              Single iFrames are sized based on the use case. The size of the container determines
              in which way the visualization is shown to the user and prevent weird things (e.g.,
              overlapping squares, misplaced labels and so on). The overall app is built with Nuxt
              so it is possible to reference single pages automatically generated on build. Within
              the iFrame it is possible to scroll horizontally and hover on single elements to
              explore its content. Soon it will be also possible to proceed via click (as a fallback
              in case scroll doesn't work). The general container size is already following taz
              specs.
              <a href="https://github.com/uclab-potsdam/klimataz/">
                Here's the github folder with the code
              </a>
              .
            </p>
            <p>
              Single iFrames are sized based on the use case. The size of the container determines
              in which way the visualization is shown to the user and prevent weird things (e.g.,
              overlapping squares, misplaced labels and so on). The overall app is built with Nuxt
              so it is possible to reference single pages automatically generated on build. Within
              the iFrame it is possible to scroll horizontally and hover on single elements to
              explore its content. Soon it will be also possible to proceed via click (as a fallback
              in case scroll doesn't work). The general container size is already following taz
              specs.
              <a href="https://github.com/uclab-potsdam/klimataz/">
                Here's the github folder with the code
              </a>
              .
            </p>
            <p>
              Single iFrames are sized based on the use case. The size of the container determines
              in which way the visualization is shown to the user and prevent weird things (e.g.,
              overlapping squares, misplaced labels and so on). The overall app is built with Nuxt
              so it is possible to reference single pages automatically generated on build. Within
              the iFrame it is possible to scroll horizontally and hover on single elements to
              explore its content. Soon it will be also possible to proceed via click (as a fallback
              in case scroll doesn't work). The general container size is already following taz
              specs.
              <a href="https://github.com/uclab-potsdam/klimataz/">
                Here's the github folder with the code
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sources;
