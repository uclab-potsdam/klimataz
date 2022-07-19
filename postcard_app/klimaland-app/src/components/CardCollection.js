import { Component } from 'react'

//components
import Card from "./Card";

//images
import flip from "../img/buttons/flip.png";
import switchCard from "../img/buttons/switch.png";
//import shuffle from "../img/buttons/shuffle.png";
import close from "../img/buttons/close.png";

export default class CardCollection extends Component {

    constructor(props){
        super(props);
        this.state = {activeCard: 0,cards:[]};
    }

    handleClickOnCard(){
        console.log("handle click now")
        this.props.switchToPostcardView();
    }

    //generate card objects dynamically depending on mode
    generateCards(){
        let list;
        let classProp;

        console.log("generate cards")

        if (this.props.postcardView){
            list = this.props.cardSelection.map((element,i) => {                
                const indexLeft = this.mod(this.state.activeCard - 1, this.props.cardSelection.length);
                const indexRight =this.mod(this.state.activeCard + 1, this.props.cardSelection.length);
    
                let classProp = "";
    
                if (i === this.state.activeCard) {
                    classProp = "card card-active";
                } else if (i === indexRight) {
                    classProp = "card card-right";
                } else if (i === indexLeft) {
                    classProp = "card card-left";
                } else {
                    classProp = "card card-back";
                }

                return <Card lk={element.lk} section={element.section} key={i} classProp={classProp}/>
            });

            console.log("postcardview cards generated")
        }

        else if (this.props.mode === "comparison") {
            classProp = "card card-ordered"
        }

        else if (this.props.mode === "lk") {
            classProp = "card card-ordered"
        }

        else if (this.props.mode === "shuffle"){
            //todo: editors pick / shuffle mode
            classProp = "card card-ordered"
        }

        list = this.props.cardSelection.map((element,i) =>
            <Card lk={element.lk} section={element.section} key={i} classProp={classProp} clickOnCard={this.handleClickOnCard}/>
        );

        this.setState({cards:list})
        console.log(list)
    }

    //const [activeCard, setActiveCard] = useState(0);

    //modulo helper function
    mod(n,m){
        let result = n % m;
        return result >= 0 ? result : result + m;
    };

    //switch to next card in postcard view
    nextCard() {
        let newActiveCard = (this.state.activeCard + 1) % this.state.cards.length
        this.setState({activeCard: newActiveCard});
        //setActiveCard((activeCard + 1) % cards().length);
    };

    componentDidUpdate(prevProps){
        if (this.props.cardSelection !== prevProps.cardSelection) {
            this.generateCards();
        }
    }

    render() {
        return (
            <div className="card-collection">
            
            {/* <div className="card-container" >
                {cards()}
            </div> */}
            {this.props.mode === "comparison" && !this.props.postcardView && <div className="card-container">  {this.state.cards} </div>}
            {this.props.mode === "lk" && !this.props.postcardView && <div className="card-container">  {this.state.cards} </div>}
            {/* {mode() === "shuffle" &&!postcardView && cards()} */}
            {this.props.postcardView && <div className="card-container">
                <div className="carousel">
                    {this.state.cards}
                    <Card
                        key="9999"
                        classProp={"card"}
                        lk={"item.label"}
                        section="energy"
                    />
                </div>
            </div>}

            <div className="button-container">
                <button className="close-button">
                    <img
                        src={close}
                        className="close-button-img"
                        alt="close-button-img"
                    />
                </button>

                <button className="switch-button" onClick={this.nextCard}>
                    <img
                        src={switchCard}
                        className="switch-button-img"
                        alt="switch-button-img"
                    />
                </button>

                <button className="flip-button">
                    <img src={flip} className="flip-button-img" alt="flip-button-img" />
                </button>
            </div>
        </div>
        )
    }
}
