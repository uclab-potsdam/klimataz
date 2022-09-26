import React, { Component } from 'react';

import { geoPath, geoMercator } from 'd3-geo';
import LandkreiseOutline from '../../data/kreise-simpler.json';
import bundeslaenderOutline from '../../data/bundeslaender.json';
import { setStateAsync } from '../../helpers/helperFunc';

export default class Locator extends Component {
  constructor(props) {
    super(props);

    this.targetRef = React.createRef();

    this.state = {
      dimensions: {
        width: 0,
        height: 0,
      },
      loading: false,
      singleShapes: [],
      zoomPointerPath: [],
    };
  }

  async componentDidMount() {
    let width = 100;
    let height = 100;
    const currentMap = +this.props.lk.value < 20 ? bundeslaenderOutline : LandkreiseOutline;

    if (this.targetRef.current) {
      await setStateAsync(this, {
        dimensions: {
          width: this.targetRef.current.offsetWidth,
          height: this.targetRef.current.offsetHeight,
        },
      });
    }

    width = this.state.dimensions.width;
    height = this.state.dimensions.height;
    // const zoomWidth = width / 2
    const zoomHeight = width / 2;

    // projection for main map
    const projection = geoMercator().fitSize([width, height], currentMap);
    const geoGenerator = geoPath().projection(projection);
    let currentFeature;
    let currentPath;

    currentMap.features.forEach((f) => {
      if (
        (+this.props.lk.value === +f.properties.ARS ||
          this.props.lk.value === +f.properties.SN_L) &&
        !f.properties.GEN.includes('(Bodensee)') &&
        f.properties.GF >= 9
      ) {
        currentFeature = f;
        currentPath = geoGenerator(f);
      }
    });

    // translate and rescale for zoom map
    const translatedProj = geoMercator()
      .fitSize([zoomHeight, zoomHeight], currentMap)
      .scale(1)
      .translate([0, 0]);
    const geoTranslated = geoPath().projection(translatedProj);
    const b = geoTranslated.bounds(currentFeature);
    const s = 0.95 / Math.max((b[1][0] - b[0][0]) / zoomHeight, (b[1][1] - b[0][1]) / zoomHeight);
    const t = [(height - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    translatedProj.translate(t).scale(s);

    // create arrow for pointer
    const currentZoomCentroid = geoGenerator.centroid(currentFeature);
    const zoomPointerPathTemp = `M ${currentZoomCentroid[0]},${currentZoomCentroid[1] + 1}
    C ${currentZoomCentroid[0] + 10},${currentZoomCentroid[1] + 10} 
    ${currentZoomCentroid[0] + 1}, ${height / 2} 2,${height / 2}  
    L 2, ${height / 2}`;

    // prepare single shapes for background map
    const singleShapesTemp = currentMap.features.map((d) => {
      // every transformation is made in here, an array of prepared data is returned
      return {
        path: geoGenerator(d),
        translatedPath: geoTranslated(d),
        lk: d.properties.ARS,
        bl: d.properties.SN_L,
        visible:
          +this.props.lk.value === +d.properties.ARS ||
          +this.props.lk.value === +d.properties.SN_L ||
          +this.props.lk.value === 0
            ? true
            : false,
      };
    });

    this.setState({ singleShapes: singleShapesTemp, zoomPointerPath: zoomPointerPathTemp });
  }

  render() {
    return (
      <div className="locator-container">
        {!this.state.loading && (
          <div className="locator-zoom" ref={this.targetRef}>
            <div className="locator-zoom-inner">
              {+this.props.lk.value !== 0 && (
                <svg width={this.state.dimensions.width} height={this.state.dimensions.width}>
                  <clipPath id="myClip">
                    <circle cx="50%" cy="50%" r="50%" stroke="black" />
                  </clipPath>
                  <g clipPath="url(#myClip)" href="#map">
                    {this.state.singleShapes.map(function (el, e) {
                      return (
                        <path
                          d={el.translatedPath}
                          key={e}
                          id="map"
                          className={`landkreis ${el.lk} ${el.bl} ${
                            el.visible ? 'visible' : 'hidden'
                          }`}
                        />
                      );
                    })}
                    <circle cx="50%" cy="50%" r="49.5%" stroke="#484848" fill="none"></circle>
                  </g>
                </svg>
              )}
            </div>
          </div>
        )}
        <div className="locator-background">
          <svg width={this.state.dimensions.width} height={this.state.dimensions.height}>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="0"
                refY="3.5"
                orient="auto"
              >
                <path d="M 6,0 L 1,3.5 L 6,6" fill="none" stroke="black" />
              </marker>
            </defs>
            <g className="map-paths">
              {/* Shapes are rendered starting from the data using .map method, no d3 logic */}
              {this.state.singleShapes.map(function (el, e) {
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
            {+this.props.lk.value !== 0 && (
              <g className="zoom-pointer">
                <path d={this.state.zoomPointerPath} markerEnd="url(#arrowhead)" />
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }
}
