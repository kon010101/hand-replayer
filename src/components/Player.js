import React, { useState, useEffect } from "react";
import "./Player.css";
import { playerPositions } from "../settings/positions";
import Card from "./Card";
import { PREFLOP, FLOP, TURN, RIVER } from "../settings/constants";
import { tableBetPositions } from "../settings/positions";

function Player({
  seat,
  hand,
  actions,
  street,
  currActionTypes,
  setCurrActionTypes,
}) {
  const [currentAction, setCurrentAction] = useState("");
  const [currentBetSize, setCurrentBetSize] = useState("");

  const displayAction = () => {
    if (currActionTypes.length < hand.table.maxseats) {
      setCurrActionTypes(
        ...currActionTypes,
        hand.actions[street].actions.filter(
          (item, index) => index === actions[street].currAction
        )
      );
    }
  };

  useEffect(() => {
    setCurrentAction(displayAction());
    setCurrentBetSize(displayBetsize());
  }, [actions]);

  const displayBetsize = () => {
    return hand.actions[street].actions
      .filter((item, index) => index <= actions[street].currAction)
      .map((action) => {
        if (action.player === seat.player) {
          return action.type === "raise"
            ? action.raiseTo
            : action.type === "collect"
            ? action.potSize
            : action.amount;
        }
      });
  };

  const showCards = () => {
    let cardString1 = "back";
    let cardString2 = "back";
    if (seat.player === hand.hero) {
      cardString1 = hand.holecards.card1;
      cardString2 = hand.holecards.card2;
    }
    hand.showdown.forEach((el) => {
      if (el.type === "show" && el.player === seat.player) {
        cardString1 = el.card1;
        cardString2 = el.card2;
      }
    });

    return (
      <>
        <div className="player__card1">
          <Card cardString={cardString1} />
        </div>
        <div className="player__card2">
          <Card cardString={cardString2} className="player__card2" />
        </div>
      </>
    );
  };

  return (
    <div className="player" style={playerPositions[seat.seatno - 1]}>
      <div className="player__cards">{showCards()}</div>
      <div className="player-container">
        {seat.player}
        <br></br>
        {seat.chips}
        <span class="table__bets" style={tableBetPositions[seat.seatno - 1]}>
          {currentBetSize}
        </span>
        <div className="player__action">{currentAction}</div>
      </div>
    </div>
  );
}

export default Player;
