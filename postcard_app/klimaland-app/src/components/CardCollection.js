import { Component } from "react";
import {mod} from "./helper.js"

//components
import Card from "./Card";

//data (same for all cards, so imported here)
import Data from '../data/data-inprogress.json'

export default class CardCollection extends Component {
  constructor(props) {
    super(props);
    this.state = { cards: [],
      windowSize: {
        width:0, 
        height:0 
      }};
    this.data = Data;
    this.handleClickOnCard = this.handleClickOnCard.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  handleClickOnCard() {
    this.props.switchToPostcardView();
  }

  updateWindowDimensions() {
    this.setState({windowSize:{width:window.innerWidth,height:window.innerHeight}})
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
            lk={element.lk}
            section={element.section}
            key={i}
            classProp={classProp}
            isThumbnail={false}
            isTopCard={isTopCard}
            windowSize={this.state.windowSize}
            localData={this.data[element.lk.value]}
          />
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

      list = this.props.cardSelection.map((element, i) => (
        <Card
          lk={element.lk}
          section={element.section}
          key={i}
          classProp={classProp}
          clickOnCard={this.handleClickOnCard}
          isThumbnail={true}
          windowSize={this.state.windowSize}
          localData={this.data[element.lk.value]}
        />
      ));
    }

    this.setState({ cards: list });
    // console.log(list);
  }

  //modulo helper function
  mod(n, m) {
    let result = n % m;
    return result >= 0 ? result : result + m;
  }

  componentDidMount(){
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
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
        <h5>View Mode: {this.props.mode}, LK:  {this.props.cardSelection.map((elem) => elem.lk.label + " " + elem.section + " | ")}</h5>
        {this.props.mode === "comparison" && !this.props.postcardView && (
          <div className="card-container stacked"> {this.state.cards} </div>
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
