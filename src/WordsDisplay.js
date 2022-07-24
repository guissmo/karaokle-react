import React from "react";
import "./css/input-box.css";

export const BLANK = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";

function WordsDisplay({ wordArray, maxLength, colors }) {
  if (maxLength <= 0) return `${wordArray} ${maxLength} \xa0`;
  const integers = Array.from(Array(maxLength).fill(0).keys());
  return (
    <div>
      {integers.map((i) =>
        wordArray[i] ? (
          <font key={i} style={colors ? { color: colors[i] } : {}}>
            {wordArray[i]}{" "}
          </font>
        ) : (
          <font key={i} style={colors ? { color: colors[i] } : {}}>
            <u>{BLANK}</u>{" "}
          </font>
        )
      )}
    </div>
  );
}

export default WordsDisplay;
