import React from "react";
import YouTube from "react-youtube";
import { useState, useRef, useEffect } from "react";
import useInterval from "use-interval";

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
    controls: 1,
  },
};

const YouTubePlayer = ({ songInfo }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [lyric, setLyric] = useState("");
  const [currentRound, setCurrentRound] = useState(1);
  const [currentStop, setCurrentStop] = useState(null);
  const playerRef = useRef();

  let {
    lyricData: { gapped },
    metadata: { videoId },
  } = songInfo;

  const stops = gapped;
  const rounds = stops.length;

  useEffect(() => {
    setCurrentStop(stops[currentRound - 1].time);
  }, [stops, currentRound]);

  useInterval(
    async () => {
      let elapsed = await getCurrentTime();
      if (currentStop < elapsed) forceTimestamp(currentStop);
      setLyric(currentLyric(songInfo, elapsed));
    },
    isRunning ? 25 : null
  );

  return (
    <div>
      <YouTube
        ref={playerRef}
        videoId={videoId}
        opts={opts}
        onPlay={onPlay}
        onPause={onPause}
      />
      <button onClick={previousRound}>previousRound</button>
      <button onClick={nextRound}>nextRound</button>
      <button onClick={() => seekRelativeToCurrentStop(-2)}>
        seekRelativeToCurrentStop
      </button>
      <button onClick={() => recapCurrentStop(-2)}>recapCurrentStop</button>
      {lyric}
    </div>
  );

  function onPlay() {
    setIsRunning(true);
  }

  function onPause() {
    setIsRunning(false);
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

  function currentLyric(songInfo, timestamp) {
    let newLyric = "";
    let {
      lyricData: { full: fullLyricData },
    } = songInfo;
    for (let lyricData of fullLyricData) {
      const { time, lyr } = lyricData;
      if (time < timestamp) newLyric = lyr;
    }
    return newLyric;
  }

  function previousRound() {
    const newRound = currentRound - 1;
    if (0 < newRound) setCurrentRound(newRound);
  }

  function nextRound() {
    const newRound = currentRound + 1;
    if (newRound <= rounds) setCurrentRound(newRound);
  }

  function seekRelativeToCurrentStop(offset) {
    seekTo(currentStop + offset);
  }

  function recapCurrentStop(offset) {
    seekRelativeToCurrentStop(offset);
    playVideo();
  }
};

export default YouTubePlayer;
