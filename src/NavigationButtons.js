import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardFast,
  faBackward,
  faForward,
  faPlay,
  faMagnifyingGlass,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import "./css/navigation-buttons.css";

const NavigationButtons = ({
  hardRewind,
  recap,
  currIndex,
  stopIndex,
  validate,
  nextRound,
  gameState,
  revealAnswer,
  answerRevealed,
  gameResults,
}) => {
  let rightNavigation = [];
  if (!gameResults) {
    rightNavigation.push(
      <button
        key="validate"
        className="primary"
        onClick={validate}
        disabled={!validate}
      >
        <FontAwesomeIcon icon={faCheck} />
      </button>
    );
  } else {
    if (!gameResults.correct && gameState === "running") {
      rightNavigation.push(
        <button
          key="revealAnswer"
          className={`secondary ${answerRevealed ? "revealed" : "unrevealed"}`}
          onClick={revealAnswer}
          disabled={!revealAnswer || gameState !== "running"}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />{" "}
        </button>
      );
    }
    rightNavigation.push(
      <button
        key="nextRound"
        className="primary"
        onClick={nextRound}
        disabled={!nextRound || gameState === "ended"}
      >
        <FontAwesomeIcon icon={faPlay} />{" "}
      </button>
    );
  }
  return (
    <div id="nav-buttons-container">
      <div id="nav-buttons">
        <button onClick={hardRewind} disabled={gameResults || !hardRewind}>
          <FontAwesomeIcon icon={faBackwardFast} />
        </button>
        <button onClick={recap} disabled={gameResults || !hardRewind}>
          <FontAwesomeIcon
            icon={stopIndex - 1 <= currIndex ? faBackward : faForward}
          />
        </button>
        <span style={{ display: "flex", flex: 3, gap: 10 }}>
          {rightNavigation.map((x) => x)}
        </span>
      </div>
    </div>
  );
};

export default NavigationButtons;
