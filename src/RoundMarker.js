import React from "react";
import "./css/round-marker.css";

function RoundMarker({ numberOfWords, result, current, done }) {
  let myStyle = {};

  if ((done || current) && result && result.correct) {
    myStyle = { backgroundColor: "green" };
  } else {
    myStyle = { backgroundColor: "red" };
  }
  if (!done && !current) {
    myStyle = { backgroundColor: "gray" };
  }
  return (
    <div
      className={`round-marker ${current ? " current" : null}`}
      style={result === undefined ? {} : myStyle}
    >
      {current ? `${numberOfWords} WORDS` : `\xa0`}
    </div>
    // <div className="">
    //   Round {round} is{" "}
    //   {current
    //     ? `the current round and needs ${numberOfWords} words`
    //     : result
    //     ? `done`
    //     : `not done and needs ${numberOfWords} words`}
    //   .
    // </div>
  );
}

export default RoundMarker;
