import React, { useState } from "react";
import Modal from "./Modal";
import WordsDisplay from "./WordsDisplay";
import { getColorArray } from "./js/word-display";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  fa1,
  fa2,
  faCheck,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import "./css/instructions.css";

const ResultsModal = ({ gameResults, stops }) => {
  const [roundBeingViewed, setRoundBeingViewed] = useState(1);
  const [revealAnswer, setRevealAnswer] = useState(false);

  gameResults = [
    undefined,
    {
      key: 1,
      result: [
        { correct: true, correctAnswer: "no", userAnswer: "no" },
        { correct: true, correctAnswer: "sympathy", userAnswer: "sympathy" },
      ],
      correct: true,
    },
    {
      key: 2,
      result: [
        { correct: false, correctAnswer: "my", userAnswer: "the" },
        { correct: true, correctAnswer: "trigger", userAnswer: "trigger" },
        { correct: true, correctAnswer: "now", userAnswer: "now" },
        { correct: false, correctAnswer: "he's", userAnswer: "he" },
        { correct: true, correctAnswer: "dead", userAnswer: "dead" },
      ],
      correct: false,
    },
    {
      key: 3,
      result: [
        { correct: true, correctAnswer: "will", userAnswer: "will" },
        { correct: true, correctAnswer: "you", userAnswer: "you" },
        { correct: true, correctAnswer: "do", userAnswer: "do" },
        { correct: true, correctAnswer: "the", userAnswer: "the" },
        { correct: false, correctAnswer: "Fandango?", userAnswer: "mango" },
      ],
      correct: false,
    },
    {
      key: 4,
      result: [
        { correct: true, correctAnswer: "from", userAnswer: "from" },
        { correct: true, correctAnswer: "a", userAnswer: "a" },
        { correct: true, correctAnswer: "poor", userAnswer: "poor" },
        { correct: true, correctAnswer: "family", userAnswer: "fam" },
      ],
      correct: true,
    },
    {
      key: 5,
      result: [
        { correct: true, correctAnswer: "me", userAnswer: "me" },
        { correct: true, correctAnswer: "and", userAnswer: "and" },
        { correct: true, correctAnswer: "leave", userAnswer: "leave" },
        { correct: true, correctAnswer: "me", userAnswer: "me" },
        { correct: true, correctAnswer: "to", userAnswer: "to" },
        { correct: true, correctAnswer: "die?", userAnswer: "die" },
      ],
      correct: true,
    },
  ];

  const userWordArray = gameResults[roundBeingViewed].result.map(
    (x) => x.userAnswer
  );
  const correctWordArray = gameResults[roundBeingViewed].result.map(
    (x) => x.correctAnswer
  );
  const tempColors = gameResults[roundBeingViewed].result.map(getColorArray);

  return (
    <Modal>
      <div className="dialog-box">
        GOOD JOB! WHAT NOW?
        <h2>
          <FontAwesomeIcon icon={fa1} /> SHARE
        </h2>
        <p>
          Share your results and see if your friends can beat or match your
          score!
        </p>
        <h2>
          <FontAwesomeIcon icon={fa2} /> REVIEW
        </h2>
        <p>Have a second look at your answers.</p>
        <div id="review-buttons">
          {gameResults.map((x) => {
            if (x === undefined) return null;
            return (
              <button
                key={x.key}
                onClick={() => setRoundBeingViewed(x.key)}
                className={`review tab ${
                  x.key === roundBeingViewed ? null : "review-unselected"
                } ${x.correct ? "correct-tab" : "wrong-tab"}`}
              >
                {x.key}
              </button>
            );
          })}
        </div>
        <div id="review-zone" className="tab">
          {stops ? stops[roundBeingViewed - 1].lyr : null}
          <div className={`noplp-box lyric smaller-noplp-box`}>
            {
              <WordsDisplay
                wordArray={
                  revealAnswer && !gameResults[roundBeingViewed].correct
                    ? correctWordArray
                    : userWordArray
                }
                maxLength={correctWordArray.length}
                colorArray={
                  revealAnswer
                    ? Array(correctWordArray.length).fill("#08ff00")
                    : tempColors
                }
              />
            }
          </div>
          <br />
          <div>
            <button
              onClick={
                gameResults[roundBeingViewed].correct
                  ? null
                  : () => setRevealAnswer(!revealAnswer)
              }
              className="mag-button"
              style={{
                color: gameResults[roundBeingViewed].correct
                  ? "white"
                  : revealAnswer
                  ? "#ee0000"
                  : "#08ff00",
              }}
            >
              <FontAwesomeIcon
                icon={
                  gameResults[roundBeingViewed].correct
                    ? faCheck
                    : faMagnifyingGlass
                }
              />
            </button>
          </div>
        </div>
        {/* {gameResults.map((gameResultArrayEntry) => {
          const correctWordArray = gameResultArrayEntry.result.map(
            (x) => x.correctAnswer
          );
          const userWordArray = gameResultArrayEntry.result.map(
            (x) => x.userAnswer
          );
          const tempColors = gameResultArrayEntry.result.map(getColorArray);

          return (
            <WordsDisplay
              key={gameResultArrayEntry.key}
              wordArray={userWordArray}
              maxLength={correctWordArray.length}
              colorArray={tempColors}
            />
          );
        })} */}
      </div>
    </Modal>
  );
};

export default ResultsModal;
