import { Component } from "react";
import { mod } from "./helperFunc.js";

//components
import Card from "./Card";
import Side from "./Side";

//data (same for all cards, so imported here)
import Data from "../data/data-inprogress.json";
import LayoutControls from "../data/layout-controls-inprogress.json";

export default class CardCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      windowSize: {
        width: 0,
        height: 0,
      },
    };
    this.data = Data;
    this.layoutControls = LayoutControls;

    //  console.log(LayoutControls);
    this.handleClickOnCard = this.handleClickOnCard.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  handleClickOnCard(e, lk, section) {
    this.props.switchToPostcardView(lk, section);
  }

  updateWindowDimensions() {
    this.setState({
      windowSize: { width: window.innerWidth, height: window.innerHeight },
    });
    this.generateCards();
  }

  //generate card objects dynamically depending on mode
  //called by componentDidUpdate
  //TODO: open card that was clicked, not only the first one
  generateCards() {
    let list;
    let classProp;

    if (this.props.postcardView) {
      list = this.props.cardSelection.map((element, i) => {
        const indexLeft = mod(
          this.props.activeCard - 1,
          this.props.cardSelection.length
        );
        const indexRight = mod(
          this.props.activeCard + 1,
          this.props.cardSelection.length
        );

        let classProp = "";

        let isTopCard = false;

        if (i === this.props.activeCard) {
          //store if card is currently on top for rendering viz effectively
          classProp = "card card-active";
          isTopCard = true;
        } else if (i === indexRight) {
          classProp = "card card-right";
        } else if (i === indexLeft) {
          classProp = "card card-left";
        } else {
          classProp = "card card-back";
        }

        return (
          <Card
            key={i}
            classProp={classProp}
            isThumbnail={false}
            sides={this.layoutControls[element.section].params}
          >
            <Side
              lk={element.lk}
              isThumbnail={false}
              isTopCard={isTopCard}
              section={element.section}
              windowSize={this.state.windowSize}
              localData={this.data[element.lk.value]}
              layoutControls={this.layoutControls[element.section].params}
            />
          </Card>
        );
      });

      //   console.log("postcardview cards generated", list);
    } else {
      if (this.props.mode === "comparison") {
        classProp = "card card-ordered";
      } else if (this.props.mode === "lk") {
        classProp = "card card-ordered";
      } else if (this.props.mode === "shuffle") {
        //todo: editors pick / shuffle mode
        classProp = "card card-ordered";
      }

      list = this.props.cardSelection.map((element, i) => {
        let localData = this.data[element.lk.value];
        //use BL data for not regional data
        for (const [key, value] of Object.entries(localData[element.section])) {
          //if data not regional
          if (!value.regional && value.data == undefined) {
            //get  bundesland data
            let BLdata = this.data[localData.bundesland][element.section][key];
            //store bundesland data at indicator of landkreis
            localData[element.section][key] = BLdata;
          }
        }
        //TODO: show somewhere, that this data is not on Landkreis Level as indicated by regional:false

        return (
          <Card
            key={i}
            classProp={classProp}
            isThumbnail={true}
            sides={this.layoutControls[element.section].params}
          >
            <Side
              lk={element.lk}
              section={element.section}
              windowSize={this.state.windowSize}
              isThumbnail={true}
              localData={localData}
              clickOnCard={this.handleClickOnCard}
              layoutControls={this.layoutControls[element.section].params}
            />
          </Card>
        );
      });
    }

    this.setState({ cards: list });
    // console.log(list);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.cardSelection !== prevProps.cardSelection ||
      this.props.postcardView !== prevProps.postcardView ||
      this.props.activeCard !== prevProps.activeCard
    ) {
      //   console.log("props did update");
      this.generateCards();
    }
  }

  render() {
    return (
      <div className="card-collection">
        <h5 className="debug">
          Debug: {this.props.mode}, LK:{" "}
          {this.props.cardSelection.map(
            (elem) => elem.lk.label + " " + elem.section + " | "
          )}
        </h5>
        {this.props.mode === "comparison" && !this.props.postcardView && (
          <div>
            <div className="card-container stacked"> {this.state.cards} </div>
          </div>
        )}
        {this.props.mode === "lk" && !this.props.postcardView && (
          <div>
            <div className="card-container messy">{this.state.cards}</div>
          </div>
        )}
        {this.props.mode === "shuffle" && !this.props.postcardView && (
          <div>
            <div className="card-container shuffle">{this.state.cards}</div>
          </div>
        )}
        {this.props.postcardView && (
          <div className="carousel-container">
            <div className="card-container carousel">{this.state.cards}</div>
          </div>
        )}
      </div>
    );
  }
}
