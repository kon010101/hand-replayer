row = { boardCards: { card1: "as", card2: "pd" } };

const newARr = Object.keys(row.boardCards).map((key, index) => {
    return row.boardCards[key];
});

console.log(newARr);
