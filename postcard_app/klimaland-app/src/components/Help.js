import React, { Component } from 'react'
import close from "../img/buttons/close.png";

export default class Help extends Component {
   constructor(props) {
      super(props)
      this.state = {
         inFocus: false
      }

      this.handleHelpFocus = this.updateFocus.bind(this, true);
      this.handleHelpNotFocus = this.updateFocus.bind(this, false);
   }

   componentDidMount() {
      this.setState({ inFocus: false })
   }

   updateFocus(focus) {
      this.setState({ inFocus: focus })
   }

   render() {
      return (
         <div>
            {!this.state.inFocus &&
               <div className="help" onClick={this.handleHelpFocus}>
                  <h4>How to use the postcards</h4>
               </div>}
            {this.state.inFocus &&
               <div className='help help-postcard'>
                  <h4>How to use the postcards</h4>

                  Hier ist eine Erklärung über die Postkarten und das gesamte Projekt
                  <button className="button close" onClick={this.handleHelpNotFocus}>
                     <img src={close} className="button img" alt="close-button-img" />
                  </button>

               </div>}
         </div>
      )
   }
}
