import React from "react";
import Modal from "./Modal";
import WordsDisplay from "./WordsDisplay";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { fa1, fa2, fa3, fa4 } from "@fortawesome/free-solid-svg-icons";
import "./css/instructions.css";

const ResultsModal = ({ gameResults }) => {
  return (
    <div className="dialog-box">
      Thank you for playing.
      {gameResults.map((gameResultArrayEntry) => {
        //   let result = [
        //     {
        //       correct: false,
        //       correctAnswer: "DEFAULT RESULT",
        //       userAnswer: "DID NOT ANSWER",
        //     },
        // //   ];
        // const correctAnswerComponent = gameResultArrayEntry.result.map((x) => {
        //   return <font key={x.key}>{x.correctAnswer} </font>;
        // });
        // const userAnswerComponent = gameResultArrayEntry.result.map((x) => {
        //   return (
        //     <font key={x.key}>
        //       {x.userAnswer ? x.userAnswer : <u>{BLANK}</u>}{" "}
        //     </font>
        //   );
        // });
        const correctWordArray = gameResultArrayEntry.result.map(
          (x) => x.correctAnswer
        );
        const userWordArray = gameResultArrayEntry.result.map(
          (x) => x.userAnswer
        );
        const tempColors = ["black", "black", "black", "black", "black"];

        return (
          <WordsDisplay
            key={gameResultArrayEntry.key}
            wordArray={userWordArray}
            maxLength={correctWordArray.length}
            colors={tempColors}
          />
        );
      })}
    </div>
  );
};

export default ResultsModal;
