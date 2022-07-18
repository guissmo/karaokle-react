import React from "react";
import YouTube from "react-youtube";
import { useState, useRef, useEffect } from "react";
import useInterval from "use-interval";
import {
  wordCount,
  compareAnswers,
  presentableString,
} from "./js/word-counter";

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
    controls: 0,
  },
};

const YouTubePlayer = ({ songInfo }) => {
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const [lyric, setLyric] = useState("");
  const [currentRound, setCurrentRound] = useState(null);
  const [roundInfo, setRoundInfo] = useState({
    time: null,
    stopTime: null,
    lyr: null,
  });
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [gameState, setGameState] = useState("not-loaded"); //not-loaded, ready-to-start running, ended
  const [score, setScore] = useState(0);
  const playerRef = useRef();
  const inputRef = useRef();

  const {
    lyricData: { gapped },
    metadata: { videoId },
  } = songInfo;

  const stops = gapped;
  const rounds = stops.length;

  useEffect(() => {
    setRoundInfo(gapped[currentRound - 1]);
  }, [gapped, currentRound]);

  useInterval(
    async () => {
      let elapsed = await getCurrentTime();
      if (roundInfo.stopTime < elapsed) forceTimestamp(roundInfo.stopTime);
      const { lyric } = getCurrentLyric(songInfo, elapsed);
      setLyric(lyric);
    },
    videoIsPlaying ? 10 : null
  );

  return (
    <div>
      <YouTube
        ref={playerRef}
        videoId={videoId}
        opts={opts}
        onPlay={onPlay}
        onPause={onPause}
        onReady={onReady}
      />
      {gameState === "not-loaded" ? null : (
        <div>
          <button onClick={startGame}>startGame</button>
          <button onClick={playVideo}>playVideo</button>
          <button onClick={previousRound}>previousRound</button>
          <button onClick={nextRound}>nextRound</button>
          <button onClick={goToTimestampOfArrayEntry}>
            goToTimestampOfArrayEntry
          </button>
          <button onClick={() => seekRelativeToCurrentStop(-2)}>
            seekRelativeToCurrentStop
          </button>
          <button onClick={() => recapCurrentStop(-5)}>recapCurrentStop</button>
          {lyric} ({wordCount(lyric)})
          <br />
          <input ref={inputRef} onBlur={getAnswerFromInput}></input>
          <button onClick={validateAnswer}>Validate</button>
          {currentAnswer}
          <br />
          <b>Score:</b> {score}
          <br />
          <b>Answer:</b>
          {roundInfo ? roundInfo.answer : null}(
          {roundInfo && roundInfo.answer ? wordCount(roundInfo.answer) : null})
        </div>
      )}
    </div>
  );

  function getAnswerFromInput() {
    setCurrentAnswer(presentableString(inputRef.current.value, "FR"));
  }

  function onPlay() {
    setVideoIsPlaying(true);
    if (gameState === "ready-to-start") startGame();
  }

  function onPause() {
    setVideoIsPlaying(false);
  }

  function onReady() {
    setGameState("ready-to-start");
  }

  function startGame() {
    setScore(0);
    startRound(1);
    setGameState("running");
  }

  function startRound(roundNumber) {
    setCurrentRound(roundNumber);
    setRoundInfo(gapped[currentRound - 1]);
    const previousRoundStartTime =
      roundNumber <= 1 ? 0 : gapped[roundNumber - 1 - 1].time;
    seekTo(previousRoundStartTime);
    playVideo();
  }

  async function getCurrentTime() {
    return await playerRef.current.internalPlayer.getCurrentTime();
  }

  function seekTo(timestamp) {
    return playerRef.current.internalPlayer.seekTo(timestamp);
  }

  function playVideo() {
    return playerRef.current.internalPlayer.playVideo();
  }

  function pauseVideo() {
    return playerRef.current.internalPlayer.pauseVideo();
  }

  function forceTimestamp(timestamp) {
    seekTo(timestamp);
    pauseVideo();
  }

  function getCurrentLyric(songInfo, timestamp) {
    let newLyric = "";
    let index = -1;
    let {
      lyricData: { full: fullLyricData },
    } = songInfo;
    for (let [i, lyricData] of fullLyricData.entries()) {
      const { time, lyr } = lyricData;
      if (time < timestamp) {
        index = i;
        newLyric = lyr;
      }
      if (roundInfo.time <= timestamp) newLyric = roundInfo.lyr;
    }
    return {
      index,
      lyric: newLyric,
    };
  }

  function goToTimestampOfArrayEntry(num) {
    num = prompt();
    let {
      lyricData: { full: fullLyricData },
    } = songInfo;
    if (num < 0) num = 0;
    if (num >= fullLyricData.length) num = fullLyricData - 1;
    seekTo(fullLyricData[num].time);
    playVideo();
  }

  function previousRound() {
    const newRound = currentRound - 1;
    if (0 < newRound) startRound(newRound);
  }

  function nextRound() {
    const newRound = currentRound + 1;
    if (newRound <= rounds) startRound(newRound);
  }

  function seekRelativeToCurrentStop(offset) {
    seekTo(roundInfo.stopTime + offset);
  }

  function validateAnswer() {
    return compareAnswers(roundInfo.answer, inputRef.current.value, "FR");
  }

  function recapCurrentStop(offset) {
    seekRelativeToCurrentStop(offset);
    playVideo();
  }
};

export default YouTubePlayer;
