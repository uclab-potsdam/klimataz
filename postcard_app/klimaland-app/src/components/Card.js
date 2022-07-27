import React from "react";
import { useState, useEffect } from "react";

import flip from "../img/buttons/flip.png";
import { mod } from "./helper";

const Card = ({ classProp, sides, isThumbnail, isTopCard, children }) => {

   const [activeSide, setActiveSide] = useState(0);
   const [flipped, setFlipped] = useState(0);

   //TODO: flip first, after that switch the content on the side
   //maybe with gsap??

   useEffect(() => {
      const currentVal = flipped ? false : true;
      setFlipped(currentVal);
   }, [activeSide]);


   const sideWithProps = function (rotation) {
      return React.Children.map(children, child => {
         // Checking isValidElement is the safe way and avoids a typescript
         // error too.
         if (React.isValidElement(child)) {
            return React.cloneElement(child, { activeSide: mod(activeSide, sides.length),style:rotation});
         }
         return child;
      })
   };


   const renderSide = function (cardSide) {
      let rotation;
      if (cardSide === "card-front") {
         rotation = { transform: "rotateY(" + activeSide * 180 - 180 + "deg)" }
      }
      else if (cardSide === "card-back") {
         rotation = { transform: "rotateY(" + activeSide * 180 + "deg)" }
      }
      else { //card-preview
         rotation = {}
         console.log("card class for rotation is not set")
      }

      return (
         <div className={cardSide}>
            {sideWithProps(rotation)}
            <button
               className="button flip"
               onClick={() => {
                  setActiveSide(activeSide + 1);
               }}
            >
               <img src={flip} className="button img" alt="flip-button-img" />
            </button>
         </div>
      );
   }

   return (

      <div className={classProp}>
         {isThumbnail && (
            <div className="card-preview">
               {sideWithProps({})}
            </div>
         )}
         {!isThumbnail && (
            <div
               className={`side-container ${flipped ? "flip" : ""}`}
               style={{
                  transform: "rotateY(" + activeSide * 180 + "deg)",
               }}
            >
               {renderSide("card-front")}
               {renderSide("card-back")}
            </div>
         )}
      </div>
   );
};

export default Card;
