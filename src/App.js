import "./App.css";
import DataInputField from "./components/DataInputField";
import React, { useState, useEffect } from "react";
import HandList from "./components/HandList";
import HandList2 from "./components/HandList2";
import Table from "./components/Table";
import { input } from "./example/data2";
import LoadingModal from "./components/LoadingModal";

const { parseHand, parseHands, extractHands, canParse } = require("hhp");

function App() {
    const [loading, setLoading] = useState(true);
    const [gParsedHands, setGparsedHands] = useState([]);
    const [selectedHands, setSelectedHands] = useState([]);
    const [hands, setHands] = useState([]);

    //import Data on load
    useEffect(() => {
        setLoading(true);
        //split the file apart, and seperate the hands - if more than 1 hand
        //replace windows version and potential other versions of linebreak with \n

        // const modifiedInput = input.replace(/\r\n|\r|\n/gm, "\n");
        // //save input to array of hands
        // const hands = modifiedInput.split("\n\n\n\n");
        // if (!hands[hands.length]) hands.pop(); //remove last element (empty string)

        const parsed = hands.map((hand) =>
            canParse(hand) ? parseHand(hand) : {}
        );
        console.log(parsed);
        setGparsedHands(parsed);

        setLoading(false);
    }, [hands]);

    return (
        <div className="App">
            {loading ? (
                "LOAADING"
            ) : (
                <>
                    <DataInputField setHands={setHands} />
                    {!loading && <Table selectedHands={selectedHands} />}
                    <HandList2
                        gParsedHands={gParsedHands}
                        setSelectedHands={setSelectedHands}
                    />
                </>
            )}
        </div>
    );
}

export default App;
