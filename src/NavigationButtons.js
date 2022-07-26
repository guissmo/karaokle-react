import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardFast,
  faBackward,
  faForward,
  faPlay,
  faMagnifyingGlass,
  faSquarePollVertical,
  faCheck,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import "./css/navigation-buttons.css";

const NavigationButtons = ({
  goToLastLineOfRound,
  hardRewind,
  playVideo,
  pauseVideo,
  recap,
  currIndex,
  stopIndex,
  validate,
  nextRound,
  gameState,
  revealAnswer,
  answerRevealed,
  gameResults,
  toggleShowResultsModal,
}) => {
  let leftNavigation = [];

  if (gameState === "ended") {
    leftNavigation.push(
      <button onClick={() => goToLastLineOfRound(0)}>
        <FontAwesomeIcon icon={faBackwardFast} />
      </button>
    );
  } else {
    leftNavigation.push(
      <button onClick={hardRewind} disabled={gameResults || !hardRewind}>
        <FontAwesomeIcon icon={faBackwardFast} />
      </button>
    );
  }
  leftNavigation.push(
    <button onClick={recap} disabled={gameResults || !hardRewind}>
      <FontAwesomeIcon
        icon={stopIndex - 1 <= currIndex ? faBackward : faForward}
      />
    </button>
  );

  let rightNavigation = [];
  if (!gameResults) {
    rightNavigation.push(
      <button
        key="validate"
        id="validate"
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
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          key="revealAnswer"
          className={`secondary ${answerRevealed ? "revealed" : "unrevealed"}`}
          onClick={revealAnswer}
          disabled={!revealAnswer || gameState !== "running"}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />{" "}
        </button>
      );
    }
    if (gameState === "ended") {
      rightNavigation.push(
        <button
          key="playVideo"
          id="results"
          className="primary"
          onClick={() => playVideo()}
        >
          <FontAwesomeIcon icon={faPlay} />{" "}
        </button>
      );
      rightNavigation.push(
        <button
          key="pauseVideo"
          id="results"
          className="primary"
          onClick={() => pauseVideo()}
        >
          <FontAwesomeIcon icon={faPause} />{" "}
        </button>
      );
      rightNavigation.push(
        <button
          key="toggleResults"
          id="results"
          className="secondary"
          onClick={() => toggleShowResultsModal()}
        >
          <FontAwesomeIcon icon={faSquarePollVertical} />{" "}
        </button>
      );
    } else {
      rightNavigation.push(
        <button
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={gameResults.correct}
          key="nextRound"
          id="next-round"
          className="primary"
          onClick={nextRound}
          disabled={!nextRound || gameState === "ended"}
        >
          <FontAwesomeIcon icon={faPlay} />{" "}
        </button>
      );
    }
  }
  return (
    <div id="nav-buttons-container">
      <div id="nav-buttons">
        {leftNavigation}
        <span style={{ display: "flex", flex: 3, gap: "10px" }}>
          {rightNavigation.map((x) => x)}
        </span>
      </div>
    </div>
  );
};

export default NavigationButtons;
