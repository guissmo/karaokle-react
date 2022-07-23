/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { forwardRef, useState } from "react";
import WordsDisplay from "./WordsDisplay";
import "./css/input-box.css";

function InputBox(
  {
    placeholder,
    onBlur,
    timeToWrite,
    gameResults,
    gameState,
    wordArray,
    maxLength,
    revealAnswer,
  },
  ref
) {
  const hiddenStyle = { width: 0, height: 0, overflow: "hidden" };
  const [inputIsFocused, setInputIsFocused] = useState(false);

  let inputShouldBeVisible = inputIsFocused && timeToWrite && !gameResults;

  return (
    <div>
      <div style={inputShouldBeVisible ? {} : hiddenStyle}>
        <input
          ref={ref}
          className={`noplp-input-box input-lyric`}
          placeholder={placeholder}
          onFocus={() => setInputIsFocused(true)}
          onBlur={() => {
            setInputIsFocused(false);
            onBlur();
          }}
          onKeyDown={(e) => handleKeyPress(e)}
        />
      </div>
      <div
        style={
          inputShouldBeVisible
            ? { display: "none" }
            : timeToWrite || gameResults
            ? {}
            : { opacity: 0.3 }
        }
        className={`noplp-input-box input-lyric`}
        onClick={() => {
          if (timeToWrite) {
            ref.current.focus();
          }
        }}
      >
        {gameState === "running" ? (
          <WordsDisplay
            wordArray={wordArray}
            maxLength={maxLength}
            colors={
              gameResults
                ? revealAnswer
                  ? gameResults.result.map(() => "#08ff00")
                  : gameResults.result.map((x) => {
                      if (x.correct) {
                        return "#08ff00";
                      } else {
                        return "#ee0000";
                      }
                    })
                : []
            }
          />
        ) : (
          "\xa0"
        )}
      </div>
    </div>
  );

  function handleKeyPress(e) {
    if (e.keyCode === 13) {
      e.target.blur();
      //Write you validation logic here
    }
  }
}

export default forwardRef(InputBox);
