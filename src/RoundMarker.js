import React from "react";
import "./css/round-marker.css";

function RoundMarker({ current, numberOfWords }) {
  return (
    <div className={`round-marker ${current ? " current" : null}`}>
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
