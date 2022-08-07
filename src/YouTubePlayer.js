import React from "react";
import YouTube from "react-youtube";
import { useState, useRef, useContext } from "react";
import useInterval from "use-interval";
import {
  wordCount,
  compareAnswers,
  presentableString,
  wordArrFromString,
} from "./js/word-counter";
import RoundMarkers from "./RoundMarkers";
import LyricBox from "./LyricBox";
import InputBox from "./InputBox";
import NavigationButtons from "./NavigationButtons";
import Instructions from "./Instructions";
import PausedModal from "./PausedModal";
import ResultsModal from "./ResultsModal";
import "./css/youtube-embed.css";
import "./css/main-layout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import LanguageContext from "./LanguageContext";

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
    origin: "https://localhost:3000",
  },
};

const YouTubePlayer = ({ songInfo }) => {
  const langDeets = useContext(LanguageContext);

  // LYRIC BOX
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const [lyric, setLyric] = useState({
    index: -1,
    text: "",
  });

  // GAME STATE
  const [gameState, setGameState] = useState("not-loaded"); //not-loaded, ready-to-start, running, ended
  const [gameResults, setGameResults] = useState([]);
  const [showResultsModal, setShowResultsModal] = useState(true);
  const [gotOutOfFocus, setGotOutOfFocus] = useState(false);

  // ROUND INFORMATION
  const [currentRound, setCurrentRound] = useState(null);
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const [isCurrentlyTyping, setIsCurrentlyTyping] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [initialsActivated, setInitialsActivated] = useState(false);

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
      if (
        !(!process.env.NODE_ENV || process.env.NODE_ENV === "development") &&
        gameState === "running" &&
        !document.hasFocus()
      ) {
        setGotOutOfFocus(true);
        pauseVideo();
      }
      let elapsed = await getCurrentTime();
      if (gameState === "running") {
        if (getRoundInfo().stopTime < elapsed) {
          inputRef.current.focus();
          setWaitingForAnswer(true);
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

  let showInstructions = gameState !== "running" && gameState !== "ended";
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
    showInstructions = false;
  const showPauseScreen = gameState === "running" && gotOutOfFocus;

  const controls = (
    <div>
      <RoundMarkers
        gameState={gameState}
        gameResults={gameResults}
        numberOfRounds={numberOfRounds}
        stops={stops}
        currentRound={currentRound}
        recapRound={recapRound}
        wordsToFindOnRound={(x) => wordsToFindOnRound(x, language)}
      />
      <LyricBox lyric={lyric.text} />
      <InputBox
        ref={inputRef}
        initialsActivated={initialsActivated}
        language={language}
        userAnswer={userAnswer}
        currentRound={currentRound}
        currentlyTypingHook={[isCurrentlyTyping, setIsCurrentlyTyping]}
        updateAnswerDisplay={updateAnswerDisplay}
        waitingForAnswer={!videoIsPlaying && waitingForAnswer}
        gameResults={gameResults[currentRound] ? gameResults : null}
        maxLength={wordsToFindOnRound(currentRound, language)}
        gameState={gameState}
        revealAnswer={revealAnswer}
        answerArray={
          gameState === "running"
            ? wordArrFromString(getRoundInfo().answer, language)
            : null
        }
      />
      <NavigationButtons
        initialsActivated={initialsActivated}
        setInitialsActivated={setInitialsActivated}
        goToLastLineOfRound={goToLastLineOfRound}
        playVideo={playVideo}
        pauseVideo={pauseVideo}
        toggleShowResultsModal={() => setShowResultsModal(!showResultsModal)}
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
      <p style={{ paddingBottom: "15px", opacity: 0.4 }}>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <font style={{ marginLeft: "15px" }}>{langDeets.otherLanguages}</font>
        </Link>
      </p>
      {showInstructions ? (
        <Instructions
          startGame={gameState === "ready-to-start" ? startGame : null}
        />
      ) : null}
      {showPauseScreen ? <PausedModal resumeGame={resumeGame} /> : null}
      {gameState === "ended" && showResultsModal ? (
        <ResultsModal
          gameResults={gameResults}
          stops={stops}
          fullLyricData={fullLyricData}
          metadata={{ title, artist }}
          closeResultsModal={() => setShowResultsModal(false)}
          language={language}
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
      {!process.env.NODE_ENV || process.env.NODE_ENV === "development" ? (
        <div>
          <button onClick={nextRound}>nextRound</button>
          <button onClick={endGame}>endGame</button>
          <button onClick={() => setInitialsActivated(true)}>
            activateInitials
          </button>
        </div>
      ) : null}
    </div>
  );

  function wordsToFindOnRound(roundNumber, language) {
    if (roundNumber <= 0 || roundNumber > numberOfRounds) return 0;
    return wordCount(stops[roundNumber - 1].answer, language);
  }

  function updateAnswerDisplay() {
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

  function resumeGame() {
    setGotOutOfFocus(false);
    playVideo();
  }

  function startRound(roundNumber, restart = false) {
    setWaitingForAnswer(false);
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

  // function goToLastLineOfRoundAndPlay(roundNumber) {
  //   goToLastLineOfRound(roundNumber);
  //   playVideo();
  // }
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
    setInitialsActivated(false);
    if (newRound <= numberOfRounds) startRound(newRound);
    else endGame();
  }

  function validateAnswer() {
    setWaitingForAnswer(false);
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
      initialsActivated: initialsActivated,
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
    goToTimestampOfArrayEntry(where);
  }

  function recapRound(roundNumber) {
    let where = getRoundInfo(roundNumber).index - 1;
    if (where < 0) where = 0;
    goToTimestampOfArrayEntry(where);
  }

  function getRoundInfo(roundNumber = currentRound) {
    let ret = {
      index: -1,
      time: null,
      stopTime: null,
      lyr: null,
    };
    if (1 <= roundNumber && roundNumber <= numberOfRounds)
      ret = stops[roundNumber - 1];
    return ret;
  }
};

export default YouTubePlayer;
