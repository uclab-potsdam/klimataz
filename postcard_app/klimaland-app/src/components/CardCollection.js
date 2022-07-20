import { Component } from "react";
import {mod} from "./helper.js"

//components
import Card from "./Card";

export default class CardCollection extends Component {
  constructor(props) {
    super(props);
    this.state = { cards: [] };
    this.handleClickOnCard = this.handleClickOnCard.bind(this);
  }

  handleClickOnCard() {
    this.props.switchToPostcardView();
  }

  //generate card objects dynamically depending on mode
  //called by componentDidUpdate
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

        // console.log(this.props.activeCard);

        if (i === this.props.activeCard) {
          classProp = "card card-active";
        } else if (i === indexRight) {
          classProp = "card card-right";
        } else if (i === indexLeft) {
          classProp = "card card-left";
        } else {
          classProp = "card card-back";
        }

        // console.log(classProp);

        return (
          <Card
            lk={element.lk}
            section={element.section}
            key={i}
            classProp={classProp}
            isThumbnail={false}
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
          <div className="card-container carousel">{this.state.cards}</div>
        )}
      </div>
    );
  }
}
