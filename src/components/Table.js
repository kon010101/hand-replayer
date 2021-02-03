import React, { useState, useEffect } from "react";
import Card from "./Card";
import Player from "./Player";
import Player2 from "./Player2";
import "./Table.css";
import Controls from "./Controls";
import { buttonPositions } from "../settings/positions";
import { PREFLOP, FLOP, TURN, RIVER, SHOWDOWN } from "../settings/constants";

function Table({ gParsedHands }) {
  //states
  const [players, setPlayers] = useState([
    { playerName: "player1", stacksize: 12, position: 1 },
    { playerName: "player2", stacksize: 9, position: 2 },
    { playerName: "player3", stacksize: 4, position: 3 },
    { playerName: "player4", stacksize: 4.6, position: 4 },
    { playerName: "player5", stacksize: 9.2, position: 5 },
    { playerName: "player6", stacksize: 11.48, position: 6 },
    { playerName: "player7", stacksize: 4.6, position: 4 },
    { playerName: "player8", stacksize: 9.2, position: 5 },
    { playerName: "player9", stacksize: 11.48, position: 6 },
  ]);

  const [parsedHands, setPasedHands] = useState([]);
  const [handCounter, setHandCounter] = useState(0);
  const [actions, setActions] = useState([]);
  const [street, setStreet] = useState(PREFLOP);
  const [currActionTypes, setCurrActionTypes] = useState([]);

  const resetActions = (handCount) => {
    console.log("RESET ACTIONS");
    const newActions = [
      {
        numOfActions: parsedHands[handCount].actions[PREFLOP].actions.length,
        currAction: 0,
      },
      {
        numOfActions: parsedHands[handCount].actions[FLOP].actions.length,
        currAction: 0,
      },
      {
        numOfActions: parsedHands[handCount].actions[TURN].actions.length,
        currAction: 0,
      },
      {
        numOfActions: parsedHands[handCount].actions[RIVER].actions.length,
        currAction: 0,
      },
      {
        numOfActions: parsedHands[handCount].actions[SHOWDOWN].actions.length,
        currAction: 0,
      },
    ];
    setActions(newActions);
    setStreet(PREFLOP);
  };

  //import Data on load
  useEffect(() => {
    //read new actions
    if (parsedHands.length > 0) {
      resetActions(handCounter);
    }
    setPasedHands(gParsedHands);
  }, [parsedHands]);

  //return table elements belonging to players
  const getPlayers = () => {
    console.log("get players");
    if (!parsedHands || parsedHands.length === 0 || actions.length === 0)
      return "";
    const btnNo = parsedHands[handCounter].table.button;
    return parsedHands[handCounter].seats.map((seat, idx) => {
      return (
        <>
          <div className="table__dealerBtn" style={buttonPositions[btnNo - 1]}>
            <span>D</span>
          </div>
          <Player
            className="player"
            seat={seat}
            hand={parsedHands[handCounter]}
            actions={actions}
            street={street}
            currActionTypes={currActionTypes}
            setCurrActionTypes={setCurrActionTypes}
          />
        </>
      );
    });

    //################''DEBUg ############################
    // return players.map((plr, idx) => {
    //   return (
    //     <>
    //       <div className="table__dealerBtn" style={buttonPositions[8]}>
    //         <span>D</span>
    //       </div>
    //       <Player2 className="player" player={plr} idx={idx} />
    //     </>
    //   );
    // });
    //'''''''''################################
  };

  // TODO: when just flop data is there, show flop as well when click on turn, clean this function up
  const getBoardcards = () => {
    if (!parsedHands || parsedHands.length === 0 || actions.length === 0)
      return "";
    let result = <></>;
    if (street === PREFLOP) return result;
    if (parsedHands[handCounter].board !== undefined) {
      if (street === FLOP)
        result = (
          <>
            <Card cardString={parsedHands[handCounter].board.card1} />
            <Card cardString={parsedHands[handCounter].board.card2} />
            <Card cardString={parsedHands[handCounter].board.card3} />
          </>
        );
      if (street === TURN)
        result = (
          <>
            <Card cardString={parsedHands[handCounter].board.card1} />
            <Card cardString={parsedHands[handCounter].board.card2} />
            <Card cardString={parsedHands[handCounter].board.card3} />
            <Card cardString={parsedHands[handCounter].board.card4} />
          </>
        );
      if (street === RIVER || street === SHOWDOWN)
        result = (
          <>
            <Card cardString={parsedHands[handCounter].board.card1} />
            <Card cardString={parsedHands[handCounter].board.card2} />
            <Card cardString={parsedHands[handCounter].board.card3} />
            <Card cardString={parsedHands[handCounter].board.card4} />
            <Card cardString={parsedHands[handCounter].board.card5} />
          </>
        );
    }
    return result;
  };

  const displayPot = () => {
    if (!parsedHands || parsedHands.length === 0 || actions.length === 0)
      return "";
    return parsedHands.length > 0
      ? parsedHands[handCounter].actions[street].actions[
          actions[street].currAction
        ].potSize
      : "";
  };

  console.log(parsedHands);

  return (
    <div className="table">
      <div className="table-container">
        <div className="table__field"></div>
        {getPlayers()}
        <div className="table__pot">Pot: {displayPot()}$ </div>
        <div className="table__board">{getBoardcards()}</div>
      </div>

      <Controls
        street={street}
        setStreet={setStreet}
        actions={actions}
        setActions={setActions}
        hand={parsedHands[handCounter]}
        handCounter={handCounter}
        setHandCounter={setHandCounter}
        resetActions={resetActions}
        parsedHands={parsedHands}
      />
    </div>
  );
}

export default Table;
