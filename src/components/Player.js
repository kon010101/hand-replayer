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

  const getActionType = () => {
    const type = currActionTypes[seat.player]
      ? currActionTypes[seat.player].type
      : "";
    return type;
  };

  console.log("currrr", currActionTypes);
  //TODO: pass in the current action and work with that - so you dont need to iterate so much
  return (
    <div className="player" style={playerPositions[seat.seatno - 1]}>
      <div className="player__cards">{showCards()}</div>
      <div className="player-container">
        {seat.player !== hand?.hero ? `Player ${seat.seatno}` : "Hero"}
        <br></br>
        {currActionTypes[seat.player]
          ? currActionTypes[seat.player].stackSize
          : seat.chips}
        <span class="table__bets" style={tableBetPositions[seat.seatno - 1]}>
          {currActionTypes[seat.player] && currActionTypes[seat.player].amount}
        </span>
        <div
          className="player__action"
          style={{
            backgroundColor:
              getActionType() === "raise" || getActionType() === "bet"
                ? "red"
                : getActionType() === "call"
                ? "green"
                : getActionType() === "fold"
                ? "blue"
                : getActionType() === "show"
                ? "orange"
                : getActionType() === "check"
                ? "brown"
                : getActionType() === "collect"
                ? "lightgreen"
                : "rgb(64, 103, 142)",
          }}
        >
          {getActionType()}
        </div>
      </div>
    </div>
  );
}

export default Player;
