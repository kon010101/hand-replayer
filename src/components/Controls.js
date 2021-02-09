import React, { useEffect } from "react";
import "./Controls.css";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import FastForwardIcon from "@material-ui/icons/FastForward";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import { PREFLOP, FLOP, TURN, RIVER, SHOWDOWN } from "../settings/constants";

function Controls({
    street,
    setStreet,
    actions,
    setActions,
    hand,
    handCounter,
    setHandCounter,
    parsedHands,
    resetActions,
    currActionTypes,
    setCurrActionTypes,
}) {
    const initialActionObject = () => {};

    const createActionObject = (act) => {
        //create new Object for action types and bet sizes of current status
        const newObj = { ...currActionTypes };

        //read current action (player, betsize, actiontype)
        const currAction =
            actions.length > 0
                ? hand.actions[street].actions[act[street].currAction]
                : undefined;

        if (currAction) {
            const type = currAction.type;
            const amount =
                type === "raise"
                    ? currAction.raiseTo
                    : currAction.type === "collect"
                    ? currAction.potSize
                    : currAction.amount;
            const stackSize = currAction.stackSize;
            const playerName = currAction.player;

            newObj[playerName] = {
                type: type,
                amount: amount
                    ? amount
                    : currActionTypes[playerName]
                    ? currActionTypes[playerName].amount
                    : "",
                stackSize: stackSize,
            };
            setCurrActionTypes(newObj);
        }
    };

    useEffect(() => {
        createActionObject(actions);
    }, [actions]);

    const setCurrentStreet = (input) => {
        let street = input;

        if (street === SHOWDOWN) {
            setStreet(street);
            setCurrActionTypes({});
            return true;
        }
        if (input < 0 || !hand.board) return false;

        if (street === PREFLOP) {
            setStreet(street);
            setCurrActionTypes({});
            return true;
        } else if (
            street === FLOP &&
            actions[street].numOfActions > 0 &&
            Object.keys(hand.board).length >= 3
        ) {
            setStreet(street);
            setCurrActionTypes({});
            return true;
        } else if (
            street === TURN &&
            actions[street].numOfActions > 0 &&
            Object.keys(hand.board).length >= 4
        ) {
            setStreet(street);
            setCurrActionTypes({});
            return true;
        } else if (
            street === RIVER &&
            actions[street].numOfActions > 0 &&
            Object.keys(hand.board).length >= 5
        ) {
            setStreet(street);
            setCurrActionTypes({});
            return true;
        }
        return false;
    };

    const incCurrAction = () => {
        const newActions = [...actions];
        if (newActions.length < 1) return;
        if (
            newActions[street].currAction <
            newActions[street].numOfActions - 1
        ) {
            newActions[street].currAction++;
            // createActionObject(newActions);
        } else if (
            newActions[street].currAction >=
            newActions[street].numOfActions - 1
        ) {
            if (!setCurrentStreet(street + 1)) {
                if (street + 1 < SHOWDOWN) {
                    setCurrentStreet(SHOWDOWN);
                } else return;
            }
        }
        setActions(newActions);
    };

    const decCurrAction = () => {
        const newActions = [...actions];

        //if street is SHOWDOWN -> look for last played street
        if (street === SHOWDOWN) {
            let newStreet = 0;
            for (let i = 0; i < newActions.length; i++) {
                if (newActions[i].numOfActions === 0 || i === 4) {
                    newStreet = i - 1;
                    break;
                }
            }
            setStreet(newStreet);
        } else {
            if (newActions[street].currAction > 0) {
                newActions[street].currAction--;
            } else if (newActions[street].currAction === 0) {
                if (!setCurrentStreet(street - 1)) return;
            }
        }
        setActions(newActions);
    };

    console.log("actions", actions);
    return (
        <div className="controls">
            <div className="controls__hand-controls">
                <button
                    onClick={() => {
                        const newHandCount =
                            handCounter !== 0 ? handCounter - 1 : handCounter;
                        //read new actions
                        setCurrActionTypes({});
                        setHandCounter(newHandCount);
                        resetActions(newHandCount);
                    }}
                >
                    <SkipPreviousIcon />
                </button>
                <div className="controls__hand-display">{`Hand ${
                    handCounter + 1
                } / ${parsedHands.length}`}</div>
                <button
                    onClick={() => {
                        const newHandCount =
                            handCounter < parsedHands.length - 1
                                ? handCounter + 1
                                : handCounter;
                        //read new actions
                        setCurrActionTypes({});
                        setHandCounter(newHandCount);
                        resetActions(newHandCount);
                    }}
                >
                    <SkipNextIcon />
                </button>
            </div>
            <div className="controls__action-controls">
                <div className="controls__main">
                    <button className="controls__main-btn">
                        <PlayArrowIcon />
                    </button>
                    <button className="controls__main-btn">
                        <PauseIcon />
                    </button>
                    <button className="controls__main-btn">
                        <SkipPreviousIcon />
                    </button>
                    <button
                        className="controls__main-btn"
                        onClick={decCurrAction}
                    >
                        <FastRewindIcon />
                    </button>
                    <button
                        className="controls__main-btn"
                        onClick={incCurrAction}
                    >
                        <FastForwardIcon />
                    </button>
                    <button className="controls__main-btn">
                        <SkipNextIcon />
                    </button>
                </div>
                <div className="controls__streetButtons">
                    <button
                        className="controls__streetButtons-btn"
                        onClick={() => setCurrentStreet(1)}
                    >
                        FLOP
                    </button>
                    <button
                        className="controls__streetButtons-btn"
                        onClick={() => setCurrentStreet(2)}
                    >
                        TURN
                    </button>
                    <button
                        className="controls__streetButtons-btn"
                        onClick={() => setCurrentStreet(3)}
                    >
                        RIVER
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Controls;
