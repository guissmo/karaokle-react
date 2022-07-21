/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { forwardRef, useState } from "react";
import "./css/input-box.css";

function InputBox({ currentAnswer, onBlur, children }, ref) {
  const hiddenStyle = { width: 0, height: 0, overflow: "hidden" };
  const [inputIsVisible, setInputIsVisible] = useState(false);
  return (
    <div>
      <div style={inputIsVisible ? {} : hiddenStyle}>
        <input
          ref={ref}
          className={`noplp-input-box input-lyric`}
          placeholder={currentAnswer}
          onFocus={() => setInputIsVisible(true)}
          onBlur={() => {
            setInputIsVisible(false);
            onBlur();
          }}
          onKeyDown={(e) => handleKeyPress(e)}
        />
      </div>
      <div
        style={inputIsVisible ? { display: "none" } : {}}
        className={`noplp-input-box input-lyric`}
        onClick={() => ref.current.focus()}
      >
        {children}
      </div>
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

  function handleKeyPress(e) {
    if (e.keyCode === 13) {
      e.target.blur();
      //Write you validation logic here
    }
  }
}

export default forwardRef(InputBox);
