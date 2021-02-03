import './App.css';
import DataInputField from './components/DataInputField';
import React, {useState, useEffect} from 'react'
import HandList from './components/HandList';
import Table from './components/Table'
import { input } from "./example/data2";

const { parseHand, parseHands, extractHands, canParse } = require("hhp");

function App() {
  const [loading, setLoading] = useState(true);
  const [gParsedHands, setGparsedHands] = useState([]);


  //import Data on load
  useEffect(() => {
    setLoading(true);
    //split the file apart, and seperate the hands - if more than 1 hand
    //replace windows version and potential other versions of linebreak with \n
    const modifiedInput = input.replace(/\r\n|\r|\n/gm, "\n");
    //save input to array of hands
    const hands = modifiedInput.split("\n\n\n\n");
    if (!hands[hands.length]) hands.pop(); //remove last element (empty string)

    const parsed = hands.map((hand) => (canParse(hand) ? parseHand(hand) : {}));
    setGparsedHands(parsed);

    setLoading(false);
  }, []);

  return (
    <div className="App">
      <DataInputField />
      {!loading && <Table gParsedHands={gParsedHands}/>}
      <HandList />
    </div>
  );
}

export default App;
