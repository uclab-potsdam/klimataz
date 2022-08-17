import React, { useRef, useLayoutEffect, useState } from 'react';
import { geoPath, geoMercator } from 'd3-geo';
import LandkreiseOutline from '../../data/kreise.json';

const Locator = ({ lk }) => {
  let width = 100
  let height = 100

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
  const projection = geoMercator().fitSize([width, height], LandkreiseOutline);
  const geoGenerator = geoPath().projection(projection);
  let currentFeature;
  let currentPath;

  LandkreiseOutline.features.forEach((f) => {
    if (+lk.value === +f.properties.ARS || lk.value === +f.properties.SN_L) {
      currentFeature = f;
      currentPath = geoGenerator(f);
    }
  });

  // translate and rescale for zoom map
  const translatedProj = geoMercator()
    .fitSize([zoomWidth, zoomHeight], LandkreiseOutline)
    .scale(1)
    .translate([0, 0]);
  const geoTranslated = geoPath().projection(translatedProj);
  const b = geoTranslated.bounds(currentFeature);
  const s = 0.95 / Math.max((b[1][0] - b[0][0]) / zoomWidth, (b[1][1] - b[0][1]) / zoomHeight);
  const t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
  translatedProj.translate(t).scale(s);

  // create arrow for pointer
  const currentZoomCentroid = geoGenerator.centroid(currentFeature)
  const zoomPointerPath = `M ${currentZoomCentroid} 
    C ${currentZoomCentroid[0] + 10},${currentZoomCentroid[1] + 10} ${currentZoomCentroid[0] + 10}, ${width / 2} 0,${width / 2}  
    L 0, ${width / 2}`

  // prepare single shapes for background map
  const singleShapes = LandkreiseOutline.features.map((d) => {
    return {
      path: geoGenerator(d),
      translatedPath: geoTranslated(d),
      lk: d.properties.ARS,
      bl: d.properties.SN_L,
      visible: +lk.value === +d.properties.ARS || +lk.value === +d.properties.SN_L ? true : false,
    };
  });

  return (
    <div className="locator-container">
      <div className="locator-zoom" ref={targetRef}>
        <div className="locator-zoom-inner">
          <svg width={width} height={height}>
            {singleShapes.map(function (el, e) {
              return (
                <path
                  d={el.translatedPath}
                  key={e}
                  id={el.lk}
                  className={`landkreis ${el.bl} ${el.visible ? 'visible' : 'hidden'}`}
                />
              );
            })}
          </svg>
        </div>
      </div>
      <div className="locator-background">
        <svg width={width} height={height}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7"
              refX="0" refY="3.5" orient="auto">
              <polygon points="10 0, 10 7, 0 3.5" />
            </marker>
          </defs>
          <g class="map-paths">
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
          <g className="zoom-pointer">
            <path d={zoomPointerPath} markerEnd="url(#arrowhead)" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Locator;
