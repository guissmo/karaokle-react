/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { forwardRef } from "react";
import WordsDisplay from "./WordsDisplay";
import { presentableArray } from "./js/word-counter";
import "./css/input-box.css";

function InputBox(
  {
    currentlyTypingHook: [isCurrentlyTyping, setIsCurrentlyTyping],
    currentRound,
    onBlur,
    userAnswer,
    language,
    waitingForAnswer,
    gameResults,
    gameState,
    maxLength,
    revealAnswer,
  },
  ref
) {
  let wordArray = [];
  if (gameResults && gameResults[currentRound] && revealAnswer) {
    wordArray = gameResults[currentRound].result.map((x) =>
      x.correct ? x.userAnswer : x.correctAnswer
    );
  } else {
    if (userAnswer) wordArray = presentableArray(userAnswer, language);
  }

  const hiddenStyle = { width: 0, height: 0, overflow: "hidden" };

  let inputShouldBeVisible =
    isCurrentlyTyping && waitingForAnswer && !gameResults;

  return (
    <div>
      <div style={inputShouldBeVisible ? { textAlign: "center" } : hiddenStyle}>
        <input
          ref={ref}
          className={`noplp-input-box input-lyric`}
          placeholder={`Type the next ${maxLength} words here.`}
          onFocus={() => setIsCurrentlyTyping(true)}
          onBlur={() => {
            onBlur();
            setIsCurrentlyTyping(false);
          }}
          onKeyPress={(e) => handleKeyPress(e)}
        />
      </div>
      <div
        style={
          inputShouldBeVisible
            ? { display: "none" }
            : waitingForAnswer || gameResults
            ? {}
            : { opacity: 0.3 }
        }
        className={`noplp-input-box input-lyric ${
          waitingForAnswer ? "editable-text" : null
        }`}
        onClick={() => {
          if (waitingForAnswer) {
            ref.current.focus();
          }
        }}
      >
        {gameState === "running" ? (
          <WordsDisplay
            wordArray={wordArray}
            maxLength={maxLength}
            colors={
              gameResults && gameResults[currentRound]
                ? revealAnswer
                  ? gameResults[currentRound].result.map(() => "#08ff00")
                  : gameResults[currentRound].result.map((x) => {
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
    if (e.key === "Enter") {
      e.target.blur();
      document.getElementById("validate").focus();
    }
  }
}

export default forwardRef(InputBox);
