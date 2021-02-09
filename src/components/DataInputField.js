import React, { useState } from "react";
import "./DataInputField.css";

function DataInputField({ setHands }) {
    const [textInput, setTextInput] = useState("");

    const handleFile = (e) => {
        const content = e.target.result;

        //replace os specific line breaks
        const handString = content.replace(/\r\n|\r|\n/gm, "\n");

        const hands = handString.split("\n\n\n\n");
        hands.pop(); //remove last element (empty string)
        console.log(hands);

        setHands(hands);
    };

    const handleChangeFile = (e) => {
        let fileData = new FileReader();
        fileData.onloadend = handleFile;
        fileData.readAsText(e.target.files[0]);
    };

    const handleClick = () => {
        //replace os specific line breaks
        const handString = textInput.replace(/\r\n|\r|\n/gm, "\n");
        console.log(handString);

        const hands = handString.split("\n\n\n\n");
        if (hands.length > 1) hands.pop(); //remove last element (empty string)
        console.log(hands);

        setHands(hands);
    };

    return (
        <div>
            {" "}
            <input type="file" onChange={handleChangeFile}></input>
            <textarea
                className="dif__text-input"
                onChange={(e) => setTextInput(e.target.value)}
            ></textarea>
            <button onClick={handleClick}>Read Hand</button>
        </div>
    );
}

export default DataInputField;
