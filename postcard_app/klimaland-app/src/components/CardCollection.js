import { Component } from 'react'

//components
import Card from "./Card";


export default class CardCollection extends Component {

    constructor(props) {
        super(props);
        this.state = { cards: [] };
        this.handleClickOnCard = this.handleClickOnCard.bind(this)
    }

    handleClickOnCard() {
        this.props.switchToPostcardView();
    }

    //generate card objects dynamically depending on mode
    //called by componentDidUpdate
    generateCards() {
        let list;
        let classProp;

        console.log("generate cards")

        if (this.props.postcardView) {
            list = this.props.cardSelection.map((element, i) => {
                const indexLeft = this.mod(this.props.activeCard - 1, this.props.cardSelection.length);
                const indexRight = this.mod(this.props.activeCard + 1, this.props.cardSelection.length);

                let classProp = "";

                console.log(this.props.activeCard)

                if (i === this.props.activeCard) {
                    classProp = "card card-active";
                } else if (i === indexRight) {
                    classProp = "card card-right";
                } else if (i === indexLeft) {
                    classProp = "card card-left";
                } else {
                    classProp = "card card-back";
                }

                console.log(classProp)

                return <Card lk={element.lk} section={element.section} key={i} classProp={classProp} isThumbnail={false} />
            });

            console.log("postcardview cards generated", list)
        }
        else {
            if (this.props.mode === "comparison") {
                classProp = "card card-ordered"
            }

            else if (this.props.mode === "lk") {
                classProp = "card card-ordered"
            }

            else if (this.props.mode === "shuffle") {
                //todo: editors pick / shuffle mode
                classProp = "card card-ordered"
            }


            list = this.props.cardSelection.map((element, i) =>
                <Card lk={element.lk} section={element.section} key={i} classProp={classProp} clickOnCard={this.handleClickOnCard} isThumbnail={true} />
            );
        }

        this.setState({ cards: list })
        console.log(list)
    }

    //modulo helper function
    mod(n, m) {
        let result = n % m;
        return result >= 0 ? result : result + m;
    };

    //react hook when props are changing
    componentDidUpdate(prevProps) {
        //generate new cards
        if (this.props.cardSelection !== prevProps.cardSelection ||
            this.props.postcardView !== prevProps.postcardView ||
            this.props.activeCard !== prevProps.activeCard) {
            console.log("props did update")
            this.generateCards();
        }
    }

    componentDidMount(){
        this.generateCards();
    }

    //TODO: solve duplicated code for not postcardView (maybe nested conditional rendering??)
    render() {
        return (
            <div className="card-collection">

                {this.props.mode === "comparison" && !this.props.postcardView && <div className="card-container">  {this.state.cards} </div>}
                {this.props.mode === "lk" && !this.props.postcardView && <div className="card-container">  {this.state.cards} </div>}
                {this.props.mode === "shuffle" && !this.props.postcardView && <div className="card-container">  {this.state.cards} </div>}
                {this.props.postcardView && <div className="card-container">
                    <div className="carousel">
                        {this.state.cards}
                        {/* <Card
                        key="9999"
                        classProp={"card"}
                        lk={"item.label"}
                        section="energy"
                    /> */}
                    </div>
                </div>}
            </div>
        )
    }
}
