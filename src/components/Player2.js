import React, { useState } from "react";
import "./Player.css";
import { playerPositions } from "../settings/positions";
import Card from "./Card";
import { PREFLOP, FLOP, TURN, RIVER } from "../settings/constants";
import { tableBetPositions } from "../settings/positions";

function Player({ player, idx }) {
  const [currentAction, setCurrentAction] = useState("");

  return (
    <div className="player" style={playerPositions[idx]}>
      <div className="player__cards">
        <div className="player__card1">
          <Card cardString="JsJd" />
        </div>
        <div className="player__card2">
          <Card cardString="AhAs" className="player__card2" />
        </div>
      </div>
      <div className="player-container">
        {player.playerName}
        <br></br>
        {player.stacksize}
        <span class="table__bets" style={tableBetPositions[idx]}>
          {"17$"}
        </span>
        <div className="player__action">FOLD</div>
      </div>
    </div>
  );
}

export default Player;
