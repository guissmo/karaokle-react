import React from "react";
import "./css/input-box.css";
import { wordInitial } from "./js/word-display";

export const BLANK = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
export const LANK = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";

function WordsDisplay({
  wordArray,
  maxLength,
  colorArray,
  initialsActivated = false,
  colorInitials = true,
  answerArray = null,
}) {
  if (maxLength <= 0) return `${wordArray} ${maxLength} \xa0`;
  const integers = Array.from(Array(maxLength).fill(0).keys());
  if (initialsActivated) {
    const ret = integers.map((i) => {
      if (wordArray[i]) {
        const wordInitialInfo = wordInitial(wordArray[i]);
        const wordInitialInfoOfAnswerArray = wordInitial(answerArray[i]);
        if (
          wordInitialInfo.initial.toUpperCase() ===
          wordInitialInfoOfAnswerArray.initial.toUpperCase()
        ) {
          return (
            <>
              <font
                key={i}
                style={
                  colorInitials
                    ? { color: colorInitials }
                    : { color: colorArray[i] }
                }
              >
                {wordInitialInfo.initial}
              </font>
              <font key={i} style={colorArray ? { color: colorArray[i] } : {}}>
                {wordInitialInfo.theRest}{" "}
              </font>
            </>
          );
        }
        return (
          <font key={i} style={colorArray ? { color: colorArray[i] } : {}}>
            {wordArray[i]}{" "}
          </font>
        );
      } else {
        const wordInitialInfo = wordInitial(answerArray[i]);
        return (
          <>
            <font
              key={i}
              style={
                colorInitials
                  ? { color: colorInitials }
                  : { color: colorArray[i] }
              }
            >
              {wordInitialInfo.initial}
            </font>
            <font
              key={i + 1000}
              style={colorInitials ? null : { color: colorArray[i] }}
            >
              {wordInitialInfo.theRest ? <u>{LANK}</u> : null}
            </font>{" "}
          </>
        );
      }
    });
    return <div>{ret}</div>;
  }
  return (
    <div>
      {integers.map((i) =>
        wordArray[i] ? (
          <font key={i} style={colorArray ? { color: colorArray[i] } : {}}>
            {wordArray[i]}{" "}
          </font>
        ) : (
          <font key={i} style={colorArray ? { color: colorArray[i] } : {}}>
            <u>{BLANK}</u>{" "}
          </font>
        )
      )}
    </div>
  );
}

export default WordsDisplay;
