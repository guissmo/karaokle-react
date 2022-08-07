/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { forwardRef, useContext } from "react";
import WordsDisplay, { LANK } from "./WordsDisplay";
import { presentableArray } from "./js/word-counter";
import {
  keepUserAnswerIfCorrect,
  getColorArray,
  wordInitial,
} from "./js/word-display";
import "./css/input-box.css";
import LanguageContext from "./LanguageContext";

function InputBox(
  {
    currentlyTypingHook: [isCurrentlyTyping, setIsCurrentlyTyping],
    currentRound,
    updateAnswerDisplay,
    userAnswer,
    language,
    waitingForAnswer,
    gameResults,
    gameState,
    maxLength,
    revealAnswer,
    initialsActivated,
    answerArray,
  },
  ref
) {
  const roundIsDone = gameResults && gameResults[currentRound];
  const langDeets = useContext(LanguageContext);

  let wordArray = [];
  let colorArray = [];
  if (roundIsDone && revealAnswer) {
    wordArray = gameResults[currentRound].result.map(keepUserAnswerIfCorrect);
    colorArray = gameResults[currentRound].result.map(() => "#08ff00");
  } else {
    if (userAnswer) wordArray = presentableArray(userAnswer, language);
    if (roundIsDone)
      colorArray = gameResults[currentRound].result.map(getColorArray);
  }

  let inputShouldBeVisible =
    isCurrentlyTyping && waitingForAnswer && !gameResults;

  let fakeInputDivExtraClasses = ``;
  if (waitingForAnswer) fakeInputDivExtraClasses += "editable-text ";
  if (inputShouldBeVisible)
    fakeInputDivExtraClasses += "fake-input-div-hidden ";
  if (!waitingForAnswer && !gameResults)
    fakeInputDivExtraClasses += "fake-input-div-transparent ";
  if (gameState !== "running")
    fakeInputDivExtraClasses += "fake-input-div-transparent ";

  return (
    <div>
      <div
        className={
          inputShouldBeVisible ? "input-container" : "input-container-hidden"
        }
      >
        <input
          ref={ref}
          className={`noplp-input-box input-lyric`}
          placeholder={
            initialsActivated
              ? answerArray
                  .map((x) => {
                    const info = wordInitial(x);
                    return info.initial + (info.theRest ? LANK : "");
                  })
                  .join(" ")
              : `${langDeets.placeholder.before} ${maxLength} ${langDeets.placeholder.after}`
          }
          onFocus={() => setIsCurrentlyTyping(true)}
          onBlur={() => {
            updateAnswerDisplay();
            setIsCurrentlyTyping(false);
          }}
          onKeyPress={(e) => handleKeyPress(e)}
        />
      </div>
      <div
        className={`noplp-input-box input-lyric ${fakeInputDivExtraClasses}`}
        onClick={waitingForAnswer ? () => ref.current.focus() : null}
      >
        {gameState === "running" ? (
          <WordsDisplay
            wordArray={wordArray}
            maxLength={maxLength}
            colorArray={colorArray}
            initialsActivated={initialsActivated}
            colorInitials={gameResults ? false : "rgb(193,255,0)"}
            answerArray={answerArray}
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
