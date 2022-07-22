import React from "react";
import YouTube from "react-youtube";
import { useState, useRef } from "react";
import useInterval from "use-interval";
import {
  wordCount,
  compareAnswers,
  presentableString,
  presentableArray,
} from "./js/word-counter";
import ResultsDisplay from "./ResultsDisplay";
import RoundMarkers from "./RoundMarkers";
import LyricBox from "./LyricBox";
import InputBox from "./InputBox";
import "./css/youtube-embed.css";

const opts = {
  height: "240",
  width: "320",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
    controls: 0,
    modestbranding: 1,
    cc_load_policy: 0,
    disablekb: 1,
  },
};

const YouTubePlayer = ({ songInfo }) => {
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const [lyric, setLyric] = useState("");
  const [timeToWrite, setTimeToWrite] = useState(false);
  const [currentRound, setCurrentRound] = useState(null);
  const [roundInfo, setRoundInfo] = useState({
    time: null,
    stopTime: null,
    lyr: null,
  });
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [gameState, setGameState] = useState("not-loaded"); //not-loaded, ready-to-start, running, ended
  const [score, setScore] = useState(0);
  const [gameResults, setGameResults] = useState([]);
  const playerRef = useRef();
  const inputRef = useRef();

  const {
    lyricData: { gapped: stops },
    metadata: { videoId, language, alternateSpellings },
  } = songInfo;
  const rounds = stops.length;

  useInterval(
    async () => {
      let elapsed = await getCurrentTime();
      if (gameState === "running") {
        if (roundInfo.stopTime < elapsed) {
          inputRef.current.focus();
          setTimeToWrite(true);
          forceTimestamp(roundInfo.stopTime);
        }
      }
      const { lyric } = getCurrentLyric(songInfo, elapsed);
      setLyric(lyric);
    },
    videoIsPlaying ? 10 : null
  );

  return (
    <div style={{ display: "block" }}>
      <div style={{ maxWidth: 600 }}>
        <YouTube
          ref={playerRef}
          videoId={videoId}
          className="video-container"
          opts={opts}
          onPlay={onPlay}
          onPause={onPause}
          onReady={onReady}
        />
      </div>
      {gameState === "not-loaded" ? (
        "Waiting for video to load."
      ) : (
        <div>
          <RoundMarkers
            gameResults={gameResults}
            rounds={rounds}
            stops={stops}
            currentRound={currentRound}
            wordsToFindOnRound={wordsToFindOnRound}
          />
          <LyricBox lyric={lyric} />
          <InputBox
            ref={inputRef}
            currentAnswer={currentAnswer}
            onBlur={getAnswerFromInput}
            timeToWrite={!videoIsPlaying && timeToWrite}
            placeholder={"Start typing your answer"}
            gameResults={gameResults[currentRound]}
            maxLength={wordsToFindOnRound(currentRound)}
            wordArray={
              currentAnswer ? presentableArray(currentAnswer, language) : []
            }
            gameState={gameState}
          />
          {gameState}
          <br />
          <button onClick={startGame}>startGame</button>
          {/* <button onClick={playVideo}>playVideo</button> */}
          <button onClick={previousRound}>previousRound</button>
          <button onClick={nextRound}>nextRound</button>
          <button onClick={nextRoundIfValidated}>nextRoundIfValidated</button>
          <button onClick={goToTimestampOfArrayEntry}>
            goToTimestampOfArrayEntry
          </button>
          <button onClick={() => seekRelativeToCurrentStop(-2)}>
            seekRelativeToCurrentStop
          </button>
          <button onClick={() => recapCurrentStop(-2)}>recapCurrentStop</button>
          {lyric} ({wordCount(lyric)})
          <br />
          <button onClick={validateAnswer}>Validate</button>
          {currentAnswer}
          <br />
          <b>Score:</b> {score} : {roundInfo ? roundInfo.stopTime : null}
          <br />
          {gameResults.map((x) => (
            <ResultsDisplay key={x.key} round={x.key} result={x.result} />
          ))}
        </div>
      )}
    </div>
  );

  function wordsToFindOnRound(roundNumber) {
    if (roundNumber <= 0 || roundNumber > rounds) return 0;
    return wordCount(stops[roundNumber - 1].answer);
  }

  function getAnswerFromInput() {
    setCurrentAnswer(presentableString(inputRef.current.value, language));
  }

  function onPlay() {
    console.log("onPlay");
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
    setGameState("running");
    startRound(1);
  }

  function startRound(roundNumber) {
    setTimeToWrite(false);
    setCurrentRound(roundNumber);
    setRoundInfo(stops[roundNumber - 1]);
    goToLastLineOfRound(roundNumber - 1);
    setCurrentAnswer("");
    inputRef.current.value = "";
    playVideo();
  }

  function goToLastLineOfRound(roundNumber) {
    const previousRoundStartTime =
      roundNumber < 1 ? 0 : stops[roundNumber - 1].time;
    seekTo(previousRoundStartTime);
  }

  async function getCurrentTime() {
    return await playerRef.current.internalPlayer.getCurrentTime();
  }

  function seekTo(timestamp) {
    return playerRef.current.internalPlayer.seekTo(timestamp);
  }

  function playVideo() {
    console.log("playVideo");
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
    let newLyric = "...";
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
      if (gameState === "running" && roundInfo.time <= timestamp)
        newLyric = roundInfo.lyr;
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
    else endGame();
  }

  function nextRoundIfValidated() {
    if (gameResults[currentRound]) {
      nextRound();
    }
  }

  async function seekRelativeToCurrentStop(offset) {
    console.log("seekRelativeToCurrentStop");
    setTimeToWrite(false);
    seekTo(roundInfo.stopTime + offset);
  }

  function validateAnswer() {
    setTimeToWrite(false);
    const result = compareAnswers(
      roundInfo.answer,
      inputRef.current.value,
      language,
      alternateSpellings
    );
    let tempArray = gameResults.slice();
    tempArray[currentRound] = {
      key: currentRound,
      result,
    };
    setGameResults(tempArray);
    console.log(result);
    if (result.reduce((x, y) => x && y.correct, true)) {
      setScore(score + 1);
    }
  }

  function endGame() {
    setGameState("ended");
    goToLastLineOfRound(5);
    playVideo();
  }

  function recapCurrentStop(offset) {
    seekRelativeToCurrentStop(offset);
    playVideo();
  }
};

export default YouTubePlayer;
