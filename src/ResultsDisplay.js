import React from "react";

function ResultsDisplay({ round, result }) {
  const style = {
    paddingLeft: 10,
  };
  return (
    <div style={{ display: "block" }}>
      {round}:
      {result.map((x) => {
        if (x.correct) {
          return (
            <span style={{ ...style, color: "green" }}>{x.userAnswer}</span>
          );
        } else {
          return <span style={{ ...style, color: "red" }}>{x.userAnswer}</span>;
        }
      })}
    </div>
  );
}

export default ResultsDisplay;
