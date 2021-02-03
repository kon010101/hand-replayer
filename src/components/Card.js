import React from "react";
import "./Card.css";

function Card({ cardString }) {
  return (
    <>
      {cardString && (
        <div
          className="card"
          style={{
            backgroundImage:
              cardString !== "Ad"
                ? `url(${
                    process.env.PUBLIC_URL +
                    "/card_images/" +
                    cardString.toUpperCase() +
                    ".jpg"
                  })`
                : `url(${process.env.PUBLIC_URL + "/card_images/AceDia.jpg"}`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      )}
    </>
  );
}

export default Card;
