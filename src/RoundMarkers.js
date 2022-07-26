import React from "react";
import RoundMarker from "./RoundMarker";
import "./css/round-markers.css";

function RoundMarkers({
  numberOfRounds,
  currentRound,
  stops,
  wordsToFindOnRound,
  gameResults,
  gameState,
  recapRound,
}) {
  return (
    <div className="round-markers">
      {Array.from(Array(numberOfRounds).keys()).map((x) => (
        <RoundMarker
          key={x + 1}
          round={x + 1}
          recapRound={recapRound}
          current={gameState === "running" ? x + 1 === currentRound : false}
          done={x + 1 < currentRound || gameState === "ended"}
          numberOfWords={stops ? wordsToFindOnRound(x + 1) : 0}
          result={gameResults[x + 1]}
        />
      ))}
    </div>
  );
}

export default RoundMarkers;
