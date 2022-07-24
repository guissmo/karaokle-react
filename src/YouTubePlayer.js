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
  // LYRIC BOX
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const [lyric, setLyric] = useState({
    index: -1,
    text: "",
  });

  // GAME STATE
  const [gameState, setGameState] = useState("not-loaded"); //not-loaded, ready-to-start, running, ended
  const [gameResults, setGameResults] = useState([]);

  // ROUND INFORMATION
  const [currentRound, setCurrentRound] = useState(null);
  const [timeToWrite, setTimeToWrite] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [revealAnswer, setRevealAnswer] = useState(false);

  // REFS
  const playerRef = useRef();
  const inputRef = useRef();

  // LOADING THE DATA FROM SONG INFO
  const {
    lyricData: { full: fullLyricData, gapped: stops },
    metadata: { title, artist, videoId, language, alternateSpellings, startAt },
  } = songInfo;
  const numberOfRounds = stops.length;

  // LYRICS / SUBTITLE UPDATE
  useInterval(
    async () => {
      let elapsed = await getCurrentTime();
      if (gameState === "running") {
        if (getRoundInfo().stopTime < elapsed) {
          inputRef.current.focus();
          setTimeToWrite(true);
          setRevealedQuestion(true);
          forceTimestamp(getRoundInfo().stopTime);
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
        numberOfRounds={numberOfRounds}
        stops={stops}
        currentRound={currentRound}
        wordsToFindOnRound={wordsToFindOnRound}
      />
      <LyricBox lyric={lyric.text} />
      <InputBox
        ref={inputRef}
        userAnswer={userAnswer}
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
            : userAnswer
            ? presentableArray(userAnswer, language)
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
        stopIndex={getRoundInfo().index}
        currIndex={lyric.index}
        gameResults={gameResults[currentRound]}
        gameState={gameState}
        validate={
          !videoIsPlaying &&
          (getRoundInfo().index === lyric.index ||
            lyric.text === getRoundInfo().lyr)
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
    if (roundNumber <= 0 || roundNumber > numberOfRounds) return 0;
    return wordCount(stops[roundNumber - 1].answer);
  }

  function getAnswerFromInput() {
    setUserAnswer(presentableString(inputRef.current.value, language));
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
      restart &&
        wordCount(inputRef.current.value) >= wordCount(getRoundInfo().lyr)
    );
    setTimeToWrite(false);
    setCurrentRound(roundNumber);
    setRevealAnswer(false);
    goToLastLineOfRound(roundNumber - 1);
    if (!restart) {
      setUserAnswer("");
      inputRef.current.value = "";
    }
    playVideo();
  }

  function restartRound(roundNumber = currentRound) {
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
      if (gameState === "running" && getRoundInfo().time <= timestamp)
        newLyric = getRoundInfo().lyr;
    }
    return {
      index,
      text: newLyric,
    };
  }

  function goToTimestampOfArrayEntry(num) {
    if (num < 0) num = 0;
    if (num >= fullLyricData.length) num = fullLyricData - 1;
    seekTo(fullLyricData[num].time);
    playVideo();
  }

  function nextRound() {
    const newRound = currentRound + 1;
    if (newRound <= numberOfRounds) startRound(newRound);
    else endGame();
  }

  function validateAnswer() {
    setTimeToWrite(false);
    const result = compareAnswers(
      getRoundInfo().answer,
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
    goToLastLineOfRound(numberOfRounds);
    playVideo();
  }

  function recapCurrentStop() {
    let where = getRoundInfo().index - 1;
    if (where < 0) where = 0;
    if (wordCount(inputRef.current.value) < wordCount(getRoundInfo().lyr))
      setRevealedQuestion(false);
    goToTimestampOfArrayEntry(where);
  }

  function getRoundInfo(roundNumber = currentRound) {
    let ret = {
      index: -1,
      time: null,
      stopTime: null,
      lyr: null,
    };
    if (1 <= roundNumber && roundNumber < numberOfRounds)
      ret = stops[roundNumber - 1];
    return ret;
  }
};

export default YouTubePlayer;
