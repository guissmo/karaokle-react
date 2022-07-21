import React from "react";
import "./css/lyric-box.css";

function LyricBox({ lyric }) {
  return (
    <div className={`noplp-box lyric`}>{lyric ? lyric : "\xa0"}</div>
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

export default LyricBox;
