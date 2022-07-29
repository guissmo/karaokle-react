/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./css/round-marker.css";
import LanguageContext from "./LanguageContext";

function RoundMarker({
  numberOfWords,
  result,
  current,
  done,
  round,
  recapRound,
}) {
  const langDeets = useContext(LanguageContext);
  let myStyle = {};

  if ((done || current) && result && result.correct) {
    myStyle = { backgroundColor: "rgb(81, 203, 32)" };
  } else {
    myStyle = { backgroundColor: "rgb(240, 101, 67)" };
  }
  if (!done && !current) {
    myStyle = { backgroundColor: "gray" };
  }
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className={`round-marker ${current ? " current" : null} ${
        (done || current) && result ? " clickable" : null
      }`}
      style={result === undefined ? {} : myStyle}
      onClick={(done || current) && result ? () => recapRound(round) : null}
    >
      {current ? (
        `${numberOfWords} ${langDeets.words}`
      ) : (done || current) && result ? (
        result.correct ? (
          <FontAwesomeIcon icon={faCheck} />
        ) : (
          <FontAwesomeIcon icon={faXmark} />
        )
      ) : (
        `\xa0`
      )}
    </div>
    // <div className="">
    //   Round {round} is{" "}
    //   {current
    //     ? `the current round and needs ${numberOfWords} words`
    //     : result
    //     ? `done`
    //     : `not done and needs ${numberOfWords} words`}
    //   .
    // </div>
  );
}

export default RoundMarker;
