import React from "react";
import YouTube from "react-youtube";
import { useState, useRef } from "react";
import useInterval from "use-interval";

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
    controls: 0,
  },
};

const YouTubePlayer = ({ songInfo }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [lyric, setLyric] = useState("");
  const playerRef = useRef();

  let {
    lyricData: { gapped },
    metadata: { videoId },
  } = songInfo;

  const stops = gapped;

  let currentRound = 1;
  let currentStop = stops[currentRound - 1].time;

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
      metadata: { lyricOffset },
    } = songInfo;
    for (let lyricData of fullLyricData) {
      const { time, lyr } = lyricData;
      if (time + lyricOffset < timestamp) newLyric = lyr;
    }
    return newLyric;
  }
};

export default YouTubePlayer;
