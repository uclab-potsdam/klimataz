import React, { Component } from 'react';

import { geoPath, geoMercator } from 'd3-geo';
import LandkreiseOutline from '../../data/kreise-simpler.json';
import bundeslaenderOutline from '../../data/bundeslaender.json';
import { getRanking, getTotalLKName, setStateAsync } from '../../helpers/helperFunc';
import { UIContext } from '../UIContext';
import DropDownControls from '../../data/selector-controls.json';

export default class Locator extends Component {
  static contextType = UIContext;

  constructor(props) {
    super(props);

    this.targetRef = React.createRef();

    this.state = {
      dimensions: {
        width: 100,
        height: 100,
      },
      loading: false,
      singleShapes: [],
      zoomPointerPath: [],
      currentMap: [],
      geoGenerator: [],
      zoomHeight: 0,
    };
    this.landkreise = DropDownControls.landkreise;
    this.handleClickOnMap = this.handleClickOnMap.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  async changeCurrentMap() {
    const currentMap = +this.props.lk.value < 20 ? bundeslaenderOutline : LandkreiseOutline;

    const width = this.state.dimensions.width;
    const height = this.state.dimensions.height;
    // const zoomWidth = width / 2
    const zoomHeight = width / 2;

    // projection for main map
    const projection = geoMercator().fitSize([width, height], currentMap);
    const geoGenerator = geoPath().projection(projection);

    return setStateAsync(this, {
      currentMap: currentMap,
      zoomHeight: zoomHeight,
      geoGenerator: geoGenerator,
    });
  }

  async generateMap() {
    let currentFeature;
    //let currentPath;
    const width = this.state.dimensions.width;
    const height = this.state.dimensions.height;

    this.state.currentMap.features.forEach((f) => {
      if (
        (+this.props.lk.value === +f.properties.ARS ||
          this.props.lk.value === +f.properties.SN_L) &&
        !f.properties.GEN.includes('(Bodensee)') &&
        f.properties.GF >= 9
      ) {
        currentFeature = f;
        //currentPath = this.state.geoGenerator(f);
      }
    });

    // translate and rescale for zoom map
    const translatedProj = geoMercator()
      .fitSize([this.state.zoomHeight, this.state.zoomHeight], this.state.currentMap)
      .scale(1)
      .translate([0, 0]);
    const geoTranslated = geoPath().projection(translatedProj);
    const b = geoTranslated.bounds(currentFeature);
    const s =
      0.95 /
      Math.max(
        (b[1][0] - b[0][0]) / this.state.zoomHeight,
        (b[1][1] - b[0][1]) / this.state.zoomHeight
      );
    const t = [(width - s * (b[1][0] + b[0][0])) / 2, (width - s * (b[1][1] + b[0][1])) / 2];
    translatedProj.translate(t).scale(s);

    // create arrow for pointer
    const currentZoomCentroid = this.state.geoGenerator.centroid(currentFeature);
    const zoomPointerPathTemp = `M ${currentZoomCentroid[0]},${currentZoomCentroid[1] + 1}
    C ${currentZoomCentroid[0] + 10},${currentZoomCentroid[1] + 10} 
    ${currentZoomCentroid[0] + 1}, ${height / 2} 2,${height / 2}  
    L 2, ${height / 2}`;

    // prepare single shapes for background map
    const singleShapesTemp = this.state.currentMap.features.map((d) => {
      // every transformation is made in here, an array of prepared data is returned
      return {
        path: this.state.geoGenerator(d),
        translatedPath: geoTranslated(d),
        lk: d.properties.ARS,
        bl: d.properties.SN_L,
        ranking: getRanking(parseInt(d.properties.ARS), this.props.section),
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

  async updateDimensions() {
    if (this.targetRef.current) {
      return await setStateAsync(this, {
        dimensions: {
          width: this.targetRef.current.offsetWidth,
          height: this.targetRef.current.offsetHeight,
        },
      });
    }
  }

  async componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    await this.updateDimensions()
      .then(() => {
        return this.changeCurrentMap();
      })
      .then(() => {
        this.generateMap();
      });
  }

  async componentDidUpdate(prevProps) {
    if (this.props.lk !== prevProps.lk) {
      //update dimensions
      this.updateDimensions();
      if (this.props.lk < 18 && prevProps.lk < 18) {
        //stay on BL map
        this.generateMap();
      } else if (this.props.lk > 18 && prevProps.lk > 18) {
        //stay on LK map
        this.generateMap();
      } else {
        //change from LK map to BL map (and the other way around)
        await this.changeCurrentMap().then(() => {
          this.generateMap();
        });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  handleClickOnMap(ags) {
    //return if ui vis = false
    if (!this.context) {
      return;
    }
    //find lk in list of landkreise
    let chosenLK = this.landkreise.find((d) => d.value === ags);
    if (chosenLK !== undefined) {
      const lk = { value: ags, label: getTotalLKName(chosenLK) };
      this.props.handleClickOnMap(lk);
      getRanking(ags, this.props.section);
    }
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
                          className={`landkreis ${el.lk} ${el.bl} ${el.visible ? 'visible' : 'hidden'
                            } ${el.ranking} ui-${this.context}`}
                          onClick={this.handleClickOnMap.bind(this, parseInt(el.lk))}
                        />
                      );
                    }, this)}
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
                    className={`landkreis ${el.bl} ${el.visible ? 'visible' : 'hidden'} ${el.ranking
                      } ui-${this.context}`}
                    onClick={this.handleClickOnMap.bind(this, parseInt(el.lk))}
                  />
                );
              }, this)}
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
