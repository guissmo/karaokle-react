import React, { useState } from "react";
import Modal from "./Modal";
import WordsDisplay from "./WordsDisplay";
import { getColorArray } from "./js/word-display";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  fa1,
  fa2,
  fa3,
  faCheck,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import "./css/instructions.css";

const emojiRed = String.fromCodePoint(0x1f7e5);
const emojiGreen = String.fromCodePoint(0x1f7e9);

function copyResultsToClipboard(
  setCopied,
  gameResults,
  { title, artist },
  language
) {
  let ret = "";

  ret += `\uD83C\uDFB6 Karaokle:\n`;
  ret += `\uD83C\uDFBC ${title} - ${artist}`;
  ret += gameResults
    .map((gameResultArrayEntry) => {
      if (!gameResultArrayEntry) return null;
      const roundIcon = gameResultArrayEntry.correct ? emojiGreen : emojiRed;
      const wordsToEmoji = gameResultArrayEntry.result
        .map((x) => (x.correct ? emojiGreen : emojiRed))
        .join("");
      return `${roundIcon} ${gameResultArrayEntry.key}: ${wordsToEmoji}`;
    })
    .join("\n");
  ret += `\n`;
  ret += `Try it out at https://karaokle.guissmo.com/${language.toLowerCase()}\n`;
  navigator.clipboard.writeText(ret);
  setCopied(true);
  setTimeout(() => {
    setCopied(false);
  }, 10000);
}

const ResultsModal = ({
  gameResults,
  stops,
  language,
  closeResultsModal,
  metadata: { title, artist },
}) => {
  const [roundBeingViewed, setRoundBeingViewed] = useState(1);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [copied, setCopied] = useState(false);

  // gameResults = [
  //   undefined,
  //   {
  //     key: 1,
  //     result: [
  //       { correct: true, correctAnswer: "no", userAnswer: "no" },
  //       { correct: true, correctAnswer: "sympathy", userAnswer: "sympathy" },
  //     ],
  //     correct: true,
  //   },
  //   {
  //     key: 2,
  //     result: [
  //       { correct: false, correctAnswer: "my", userAnswer: "the" },
  //       { correct: true, correctAnswer: "trigger", userAnswer: "trigger" },
  //       { correct: true, correctAnswer: "now", userAnswer: "now" },
  //       { correct: false, correctAnswer: "he's", userAnswer: "he" },
  //       { correct: true, correctAnswer: "dead", userAnswer: "dead" },
  //     ],
  //     correct: false,
  //   },
  //   {
  //     key: 3,
  //     result: [
  //       { correct: true, correctAnswer: "will", userAnswer: "will" },
  //       { correct: true, correctAnswer: "you", userAnswer: "you" },
  //       { correct: true, correctAnswer: "do", userAnswer: "do" },
  //       { correct: true, correctAnswer: "the", userAnswer: "the" },
  //       { correct: false, correctAnswer: "Fandango?", userAnswer: "mango" },
  //     ],
  //     correct: false,
  //   },
  //   {
  //     key: 4,
  //     result: [
  //       { correct: true, correctAnswer: "from", userAnswer: "from" },
  //       { correct: true, correctAnswer: "a", userAnswer: "a" },
  //       { correct: true, correctAnswer: "poor", userAnswer: "poor" },
  //       { correct: true, correctAnswer: "family", userAnswer: "fam" },
  //     ],
  //     correct: true,
  //   },
  //   {
  //     key: 5,
  //     result: [
  //       { correct: true, correctAnswer: "me", userAnswer: "me" },
  //       { correct: true, correctAnswer: "and", userAnswer: "and" },
  //       { correct: true, correctAnswer: "leave", userAnswer: "leave" },
  //       { correct: true, correctAnswer: "me", userAnswer: "me" },
  //       { correct: true, correctAnswer: "to", userAnswer: "to" },
  //       { correct: true, correctAnswer: "die?", userAnswer: "die" },
  //     ],
  //     correct: true,
  //   },
  // ];

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
          score! Click the button:
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() =>
                copyResultsToClipboard(
                  setCopied,
                  gameResults,
                  {
                    title,
                    artist,
                  },
                  language
                )
              }
              className="copy-button"
            >
              {copied ? "COPIED!" : "COPY"}
            </button>{" "}
          </div>
        </p>
        <p style={{ textAlign: "center" }}>
          <font color="white">
            {copied ? "...then PASTE your results on social media." : "\xa0"}
          </font>
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
        <h2>
          <FontAwesomeIcon icon={fa3} /> COME BACK
        </h2>
        <p>Come back tomorrow for a new song!</p>
        <div style={{ textAlign: "center", padding: 15 }}>
          <button onClick={closeResultsModal} className="copy-button">
            RETURN TO GAME
          </button>
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