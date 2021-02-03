const {
    getAmount
  , hasAmount
} = require('./actions')

function stacksFromSeats(seats) {
  const stacks = new Map()
  for (const seat of seats) {
    stacks.set(seat.player, seat.chips)
  }
  return stacks
}

function processActions(stacks, actions, potSize) {
  if (actions == null || actions.length === 0) return
  let newActions = [];
  for (const a of actions) {
    let amount = 0;
    if (hasAmount(a)) amount = getAmount(a)

    const previousStack = stacks.get(a.player)
    // console.log(previousStack)
    const stack = previousStack - amount
    stacks.set(a.player, stack)

    a.stackSize = stack === undefined ? previousStack : stack
    potSize += amount;
    a.potSize = potSize;

    newActions = [...actions, a]
  }
  return potSize
}

function doPostprocessing(hand) {
  const { seats, posts, preflop, flop, turn, river } = hand

  //for every action set current stacksize for player, set pot, push to correct actionarray
  let potSize = 0;

  const stacks = stacksFromSeats(seats)
  potSize = processActions(stacks, posts, potSize)
  potSize = processActions(stacks, preflop, potSize)
  potSize = processActions(stacks, flop, potSize)
  potSize = processActions(stacks, turn, potSize)
  potSize = processActions(stacks, river, potSize)

  hand.actions = [{street: "post", actions: posts}, {street: "preflop", actions: preflop}, {street: "flop", actions: flop}, {street: "turn", actions: turn}, {street: "river", actions: river}, ]

}

module.exports = { doPostprocessing }