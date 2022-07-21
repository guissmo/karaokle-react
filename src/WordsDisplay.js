import React, { Fragment } from "react";
import "./css/input-box.css";

const BLANK = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";

function WordsDisplay({ wordArray, maxLength }) {
  if (maxLength <= 0) return `${wordArray} ${maxLength} \xa0`;
  const integers = Array.from(Array(maxLength).fill(0).keys());
  return (
    <div style={{ wordWrap: "normal" }}>
      {integers.map((i) =>
        wordArray[i] ? (
          <Fragment key={i}>{wordArray[i]} </Fragment>
        ) : (
          <Fragment key={i}>
            <u>{BLANK}</u>{" "}
          </Fragment>
        )
      )}
    </div>
  );
}

export default WordsDisplay;
