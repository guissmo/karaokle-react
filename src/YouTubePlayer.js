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
import RoundMarkers from "./RoundMarkers";
import LyricBox from "./LyricBox";
import InputBox from "./InputBox";
import NavigationButtons from "./NavigationButtons";
import Instructions from "./Instructions";
import "./css/youtube-embed.css";
import "./css/main-layout.css";

const opts = {
  height: "240",
  width: "320",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
    controls: 0,
    modestbranding: 1,
    cc_load_policy: 0,
    disablekb: 1,
  },
};

const YouTubePlayer = ({ songInfo }) => {
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const [lyric, setLyric] = useState({
    index: -1,
    text: "",
  });
  const [revealedQuestion, setRevealedQuestion] = useState(false);
  const [timeToWrite, setTimeToWrite] = useState(false);
  const [currentRound, setCurrentRound] = useState(null);
  const [roundInfo, setRoundInfo] = useState({
    index: -1,
    time: null,
    stopTime: null,
    lyr: null,
  });
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [gameState, setGameState] = useState("not-loaded"); //not-loaded, ready-to-start, running, ended
  const [gameResults, setGameResults] = useState([]);
  const playerRef = useRef();
  const inputRef = useRef();
  const [revealAnswer, setRevealAnswer] = useState(false);

  // LOADING THE DATA FROM SONG INFO
  const {
    lyricData: { full: fullLyricData, gapped: stops },
    metadata: { title, artist, videoId, language, alternateSpellings, startAt },
  } = songInfo;
  const rounds = stops.length;

  // LYRICS / SUBTITLE UPDATE
  useInterval(
    async () => {
      let elapsed = await getCurrentTime();
      if (gameState === "running") {
        if (roundInfo.stopTime < elapsed) {
          inputRef.current.focus();
          setTimeToWrite(true);
          setRevealedQuestion(true);
          forceTimestamp(roundInfo.stopTime);
        }
      }
      const { index, text } = getCurrentLyric(songInfo, elapsed);
      setLyric({ index, text });
    },
    videoIsPlaying ? 10 : null
  );

  useInterval(async () => {
    if ((await getVideoLoadedFraction()) >= 0) setGameState("ready-to-start");
  }, gameState === "loading-video");

  const showInstructions = gameState !== "running" && gameState !== "ended";

  const controls = (
    <div>
      <RoundMarkers
        gameState={gameState}
        gameResults={gameResults}
        rounds={rounds}
        stops={stops}
        currentRound={currentRound}
        wordsToFindOnRound={wordsToFindOnRound}
      />
      <LyricBox lyric={lyric.text} />
      <InputBox
        ref={inputRef}
        currentAnswer={currentAnswer}
        onBlur={getAnswerFromInput}
        timeToWrite={!videoIsPlaying && timeToWrite}
        placeholder={`Type the next ${wordsToFindOnRound(
          currentRound
        )} words here`}
        gameResults={gameResults[currentRound]}
        maxLength={wordsToFindOnRound(currentRound)}
        wordArray={
          gameResults[currentRound] && revealAnswer
            ? gameResults[currentRound].result.map((x) =>
                x.correct ? x.userAnswer : x.correctAnswer
              )
            : currentAnswer
            ? presentableArray(currentAnswer, language)
            : []
        }
        gameState={gameState}
        revealAnswer={revealAnswer}
      />
      <NavigationButtons
        hardRewind={
          gameResults[currentRound] || gameState !== "running"
            ? null
            : () => restartRound(currentRound)
        }
        recap={
          gameResults[currentRound] || gameState !== "running"
            ? null
            : recapCurrentStop
        }
        stopIndex={roundInfo.index}
        currIndex={lyric.index}
        gameResults={gameResults[currentRound]}
        gameState={gameState}
        validate={
          revealedQuestion &&
          (roundInfo.index === lyric.index || lyric.text === roundInfo.lyr)
            ? validateAnswer
            : null
        }
        nextRound={gameResults[currentRound] ? nextRound : null}
        revealAnswer={() => setRevealAnswer(!revealAnswer)}
        answerRevealed={revealAnswer}
      />
    </div>
  );

  // RETURN STATEMENT
  return (
    <div className="mainDiv">
      {showInstructions ? (
        <Instructions
          startGame={gameState === "ready-to-start" ? startGame : null}
        />
      ) : null}
      <div id="header">
        <span className="title-artist">
          {title} ({artist})
        </span>
      </div>
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
      {gameState === "not-loaded" ? "Waiting for video to load." : controls}
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
    setGameState("loading-video");
  }

  function startGame() {
    setGameState("running");
    setGameResults([]);
    startRound(1);
  }

  function startRound(roundNumber, restart = false) {
    setRevealedQuestion(
      restart && wordCount(inputRef.current.value) >= wordCount(roundInfo.lyr)
    );
    setTimeToWrite(false);
    setCurrentRound(roundNumber);
    setRevealAnswer(false);
    setRoundInfo(stops[roundNumber - 1]);
    goToLastLineOfRound(roundNumber - 1);
    if (!restart) setCurrentAnswer("");
    if (!restart) inputRef.current.value = "";
    playVideo();
  }

  function restartRound(roundNumber) {
    startRound(roundNumber, true);
  }

  function goToLastLineOfRound(roundNumber) {
    const previousRoundStartTime =
      roundNumber < 1 ? startAt : stops[roundNumber - 1].time;
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

  async function getVideoLoadedFraction() {
    return playerRef.current.internalPlayer.getVideoLoadedFraction();
  }

  function forceTimestamp(timestamp) {
    seekTo(timestamp);
    pauseVideo();
  }

  function getCurrentLyric(songInfo, timestamp) {
    let newLyric = "...";
    let index = -1;
    for (let [i, lyricData] of fullLyricData.entries()) {
      const { time, lyr } = lyricData;
      if (time < timestamp) {
        index = i;
        if (lyr) newLyric = lyr;
      }
      if (gameState === "running" && roundInfo.time <= timestamp)
        newLyric = roundInfo.lyr;
    }
    return {
      index,
      text: newLyric,
    };
  }

  function goToTimestampOfArrayEntry(num) {
    if (num === undefined) num = prompt();
    if (num < 0) num = 0;
    if (num >= fullLyricData.length) num = fullLyricData - 1;
    seekTo(fullLyricData[num].time);
    playVideo();
  }

  function nextRound() {
    const newRound = currentRound + 1;
    if (newRound <= rounds) startRound(newRound);
    else endGame();
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
      correct: result.reduce((x, y) => x && y.correct, true),
    };
    setGameResults(tempArray);
  }

  function endGame() {
    setGameState("ended");
    goToLastLineOfRound(rounds);
    playVideo();
  }

  function recapCurrentStop() {
    let where = roundInfo.index - 1;
    if (where < 0) where = 0;
    if (wordCount(inputRef.current.value) < wordCount(roundInfo.lyr))
      setRevealedQuestion(false);
    goToTimestampOfArrayEntry(where);
  }
};

export default YouTubePlayer;
