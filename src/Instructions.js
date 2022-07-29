import React, { useContext } from "react";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa1, fa2, fa3, fa4 } from "@fortawesome/free-solid-svg-icons";
import "./css/instructions.css";
import LanguageContext from "./LanguageContext";

const fa = [fa1, fa2, fa3, fa4];

const Instructions = ({ startGame }) => {
  const langDeets = useContext(LanguageContext);
  return (
    <Modal>
      <div className="dialog-box">
        <h1>{langDeets.instructions.header}</h1>

        {langDeets.instructions.details.map((x, i) => {
          return (
            <div key={i}>
              <h2>
                <FontAwesomeIcon icon={fa[i]} /> {x.header}
              </h2>
              <p>
                {x.details.map((y, j) => {
                  return (
                    <span key={`${i}_${j}`}>
                      {y}
                      <br />
                    </span>
                  );
                })}
              </p>
            </div>
          );
        })}
        <div style={{ display: "flex", width: "100%", alignItems: "middle" }}>
          <button
            className={`startGame ${startGame ? null : "loading"}`}
            onClick={startGame ? startGame : null}
          >
            {startGame
              ? langDeets.instructions.start
              : langDeets.instructions.loading}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Instructions;
