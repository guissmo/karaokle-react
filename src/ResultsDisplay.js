import React from "react";

function ResultsDisplay({ result }) {
  return result.map((x) => {
    if (x.correct) {
      return <span style={{ color: "green" }}>{x.userAnswer}</span>;
    } else {
      return <span style={{ color: "red" }}>{x.userAnswer}</span>;
    }
  });
}

export default ResultsDisplay;
