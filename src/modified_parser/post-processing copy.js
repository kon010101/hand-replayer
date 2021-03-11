const {
    getAmount
  , hasAmount
} = require('./actions')

const {round} = require('mathjs')

function stacksFromSeats(seats) {
  const stacks = new Map()
  for (const seat of seats) {
    stacks.set(seat.player, seat.chips)
  }
  return stacks
}

function processActions(stacks, actions, state) {
  if (actions == null || actions.length === 0) return state.potSize
  for (const a of actions) {
    let amount = 0;
    if (hasAmount(a)) amount = getAmount(a)

    amount = amount ? amount : 0;

    const previousStack = round(stacks.get(a.player),2 )

    console.log("showwww", a.type, a.stackSize, previousStack)

    //stacksize
    if(a.type !== "collect" && a.type !== "show") {
      const stack = previousStack - amount
      stacks.set(a.player, stack)

      a.stackSize = stack === undefined ? previousStack : stack
      a.stackSize = round( a.stackSize,2 )
    } else {
      const stack = previousStack + amount
      stacks.set(a.player, stack)

      a.stackSize = stack === undefined ? previousStack : stack
      a.stackSize = round( a.stackSize,2 )
    }

    if(a.type === "sb" || a.type ==="bb") {
      state.lastBet = amount
      state.amountToCall = amount;
    }

    if(a.type === "call") {
      state.lastAction = "call"
      state.leftOver = state.amountToCall - amount
    }

    if(a.type === "raise") {
      state.lastAction = "raise"
      state.leftOver = state.amountToCall - amount
      state.amountToCall = amount-state.lastBet;
      state.lastBet = amount;
    }

    if(a.type === "bet") {
      state.lastAction = "bet"
      state.lastBet = amount
      state.amountToCall = state.lastBet;
    }

    if(a.type === "bet" || a.type === "call" || a.type === "raise" || a.type === "sb" || a.type === "bb")
    {
     if (a.player in state.winnings) {
        state.winnings[a.player] = state.winnings[a.player] - amount
        state.winnings[a.player] = round(state.winnings[a.player],2)
      } else {
        state.winnings[a.player] = 0 - amount
        state.winnings[a.player] = round(state.winnings[a.player],2)
      }
    }

    if(a.type !== "collect") {
      state.potSize = amount === undefined ? state.potSize : state.potSize + amount
      a.potSize = round(state.potSize, 2)
    } else {
      a.potSize = round(state.potSize, 2);

      let rakeVal = 0;
      if (state.lastAction !== "call") {
        rakeVal = state.potSize - state.lastBet - amount;
      } else {
        rakeVal = state.potSize - amount  - state.leftOver;
        if (rakeVal > 0) {
        //add rake
        rakeVal = round(rakeVal, 2);
        state.rake[a.player] = rakeVal
        }
      }

      state.winnings[a.player] = state.winnings[a.player] + state.potSize;
      state.winnings[a.player] = round(state.winnings[a.player], 2)
    }        
    if(a.type === "show") console.log("showwww", state.stackSize)
    // console.log(state.lastAction, state.lastBet, state.winnings, state.potSize)
  }
}

function doPostprocessing(hand) {
  const { seats, posts, preflop, flop, turn, river, showdown } = hand

  const currState = {potSize: 0, lastAction: "", lastBet: 0, amountToCall: 0, leftOver: 0, winnings: {}, rake: {}}

  const stacks = stacksFromSeats(seats)
  processActions(stacks, posts, currState)
  processActions(stacks, preflop, currState)
  processActions(stacks, flop, currState)
  processActions(stacks, turn, currState)
  processActions(stacks, river, currState)
  processActions(stacks, showdown, currState)

  hand.actions = [ {street: "preflop", actions: [...posts, ...preflop]}, {street: "flop", actions: flop}, {street: "turn", actions: turn}, {street: "river", actions: river},{street: "showdown", actions: showdown}, ]

  //find position of hero
  const sixMax = ["BTN", "SB", "BB", "UTG", "MP", "CO"];
  const fullRing = ["BTN", "SB", "BB", "UTG", "UTG+1", "UTG+2", "LJ", "HJ", "CO"];

  const position = hand.table.maxseats === 6 ? sixMax : hand.table.maxseats === 9 ? fullRing : []
  const btn = hand.seats.findIndex(s => s.seatno === hand.table.button)
  const hero = hand.seats.findIndex(s => s.player === hand.hero);

  const pos = hero - btn;
  hand.position = pos < 0 ? position[position.length + pos] : position[pos]

  //apply state vars to hand
  hand.winnings = currState.winnings
  hand.rake = currState.rake
}

module.exports = { doPostprocessing }