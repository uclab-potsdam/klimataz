import React, { useRef, useLayoutEffect, useState } from 'react';
import { geoPath, geoMercator } from 'd3-geo';
import LandkreiseOutline from '../../data/kreise-simpler.json';
import bundeslaenderOutline from '../../data/bundeslaender.json';

const Locator = ({ lk }) => {
  let width = 100
  let height = 100

  const currentMap = +lk.value < 20 ? bundeslaenderOutline : LandkreiseOutline

  // getting sizes of container for maps
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight
      });
    }
  }, []);

  width = dimensions.width
  height = dimensions.height
  const zoomWidth = width / 2
  const zoomHeight = height / 2

  // projection for main map
  const projection = geoMercator().fitSize([width, height], currentMap);
  const geoGenerator = geoPath().projection(projection);
  let currentFeature;
  let currentPath;

  currentMap.features.forEach((f) => {
    if (+lk.value === +f.properties.ARS || lk.value === +f.properties.SN_L) {
      currentFeature = f;
      currentPath = geoGenerator(f);
    }
  });

  // translate and rescale for zoom map
  const translatedProj = geoMercator()
    .fitSize([zoomWidth, zoomHeight], currentMap)
    .scale(1)
    .translate([0, 0]);
  const geoTranslated = geoPath().projection(translatedProj);
  const b = geoTranslated.bounds(currentFeature);
  const s = 0.95 / Math.max((b[1][0] - b[0][0]) / zoomWidth, (b[1][1] - b[0][1]) / zoomHeight);
  const t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
  translatedProj.translate(t).scale(s);

  // create arrow for pointer
  const currentZoomCentroid = geoGenerator.centroid(currentFeature)
  const zoomPointerPath = `M ${currentZoomCentroid[0]},${currentZoomCentroid[1] + 1}
    C ${currentZoomCentroid[0] + 10},${currentZoomCentroid[1] + 10} 
    ${currentZoomCentroid[0] + 10}, ${width / 2} 0,${width / 2}  
    L 0, ${width / 2}`

  // prepare single shapes for background map
  const singleShapes = currentMap.features.map((d) => {
    // every transformation is made in here, an array of prepared data is returned
    return {
      path: geoGenerator(d),
      translatedPath: geoTranslated(d),
      lk: d.properties.ARS,
      bl: d.properties.SN_L,
      visible: +lk.value === +d.properties.ARS
        || +lk.value === +d.properties.SN_L
        || +lk.value === 0
        ? true
        : false,
    };
  });

  return (
    <div className="locator-container">
      <div className="locator-zoom" ref={targetRef}>
        <div className="locator-zoom-inner">
          {
            +lk.value !== 0 && <svg width={width} height={height}>
              <clipPath id="myClip">
                <circle cx="50%" cy="50%" r="50%" stroke="black" />
              </clipPath>
              <g clipPath="url(#myClip)" href="#map">
                {singleShapes.map(function (el, e) {
                  return (
                    <path
                      d={el.translatedPath}
                      key={e}
                      id="map"
                      className={`landkreis ${el.lk} ${el.bl} ${el.visible ? 'visible' : 'hidden'}`}
                    />
                  );
                })}
                <circle cx="50%" cy="50%" r="49.5%" stroke="#484848" fill="none"></circle>
              </g>
            </svg>
          }
        </div>
      </div>
      <div className="locator-background">
        <svg width={width} height={height}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7"
              refX="0" refY="3.5" orient="auto">
              <path d="M 6,0 L 1,3.5 L 6,6" fill="none" stroke="black" />
            </marker>
          </defs>
          <g className="map-paths">
            {/* Shapes are rendered starting from the data using .map method, no d3 logic */}
            {singleShapes.map(function (el, e) {
              return (
                <path
                  d={el.path}
                  key={e}
                  id={el.lk}
                  className={`landkreis ${el.bl} ${el.visible ? 'visible' : 'hidden'}`}
                />
              );
            })}
          </g>
          {+lk.value !== 0 && <g className="zoom-pointer">
            <path d={zoomPointerPath} markerEnd="url(#arrowhead)" />
          </g>}
        </svg>
      </div>
    </div>
  );
};

export default Locator;
