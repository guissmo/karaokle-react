import React from "react";
import RoundMarker from "./RoundMarker";
import "./css/round-markers.css";

function RoundMarkers({
  rounds,
  currentRound,
  stops,
  wordsToFindOnRound,
  gameResults,
  gameState,
}) {
  return (
    <div className="round-markers">
      {Array.from(Array(rounds).keys()).map((x) => (
        <RoundMarker
          key={x + 1}
          round={x + 1}
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
