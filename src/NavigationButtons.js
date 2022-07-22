import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardFast,
  faBackward,
  faForward,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const NavigationButtons = ({
  hardRewind,
  recap,
  currIndex,
  stopIndex,
  validate,
  nextRound,
  gameResultsBoolean,
}) => {
  return (
    <div style={{ display: "flex", maxWidth: 600, gap: 10 }}>
      <button onClick={hardRewind} style={{ flex: 1 }}>
        <FontAwesomeIcon icon={faBackwardFast} />
      </button>
      <button onClick={recap} style={{ flex: 1 }}>
        <FontAwesomeIcon
          icon={stopIndex - 1 <= currIndex ? faBackward : faForward}
        />
      </button>
      <span style={{ display: "flex", flex: 3, gap: 10 }}>
        {!gameResultsBoolean ? (
          <button onClick={validate} style={{ flex: 1 }}>
            <FontAwesomeIcon icon={faCheck} />{" "}
            {validate ? "VALIDATE" : "DISABLED"}
          </button>
        ) : (
          <button onClick={nextRound} style={{ flex: 1 }}>
            <FontAwesomeIcon icon={faCheck} />{" "}
            {nextRound ? "NEXT ROUND" : "DISABLED"}
          </button>
        )}
      </span>
    </div>
  );
};

export default NavigationButtons;
