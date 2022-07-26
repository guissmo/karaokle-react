import React from "react";
import Modal from "./Modal";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPause } from "@fortawesome/free-solid-svg-icons";
import "./css/instructions.css";

const PausedModal = ({ resumeGame }) => {
  return (
    <Modal>
      <div className="dialog-box">
        <h1>
          {/* <FontAwesomeIcon icon={faPause} /> */}
          GAME PAUSED
        </h1>
        <div style={{ display: "flex", width: "100%", alignItems: "middle" }}>
          <button className={`startGame`} onClick={resumeGame}>
            {"RESUME"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PausedModal;
