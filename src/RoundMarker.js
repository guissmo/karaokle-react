import React from "react";

function RoundMarker({ round, result, current, numberOfWords }) {
  return (
    <div>
      Round {round} is{" "}
      {current
        ? `the current round and needs ${numberOfWords} words`
        : result
        ? `done`
        : `not done and needs ${numberOfWords} words`}
      .
    </div>
  );
}

export default RoundMarker;
