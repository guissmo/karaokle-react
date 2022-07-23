import React from "react";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa1, fa2, fa3, fa4 } from "@fortawesome/free-solid-svg-icons";
import "./css/instructions.css";

const Instructions = ({ startGame }) => {
  return (
    <Modal>
      <div className="dialog-box">
        <h1>HOW TO PLAY KARAOKLE?</h1>
        <h2>
          <FontAwesomeIcon icon={fa1} /> LISTEN
        </h2>
        <p>
          {`When you start the game, the song will start playing.`}
          <br />
          {`Listen to it, and sing along if you like!`}
        </p>
        <h2>
          <FontAwesomeIcon icon={fa2} /> TYPE
        </h2>
        <p>
          {`When the music stops, then it's your turn!`}
          <br />
          {`Fill in the next few words, as indicated on the box.`}
        </p>
        <h2>
          <FontAwesomeIcon icon={fa3} /> LOCK IN
        </h2>
        <p>
          {`Click or tap outside the answer box to preview your answer.`}
          <br />
          {`Once you've seen the preview, hit the validate button!`}
        </p>
        <h2>
          <FontAwesomeIcon icon={fa4} /> SHARE
        </h2>
        <p>
          {`Tap the PLAY button for the next round.`}
          <br />
          {`The game consists of several rounds.`}
          <br />
          {`Don't forget to share your results with your friends!`}
        </p>
        <div style={{ display: "flex", width: "100%", alignItems: "middle" }}>
          <button className="startGame" onClick={startGame}>
            START GAME
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Instructions;
