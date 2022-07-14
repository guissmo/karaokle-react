import React from "react";
import YouTube from "react-youtube";
import { useState, useRef } from "react";
import useInterval from "use-interval";
import songInfo from "./songs/candyman";

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
    controls: 0,
  },
};

const YouTubePlayer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lyric, setLyric] = useState("");
  const playerRef = useRef();

  useInterval(
    async () => {
      const elapsed = await playerRef.current.internalPlayer.getCurrentTime();
      let newLyric = "";
      for (let data of songInfo.lyricData) {
        if (data.time + songInfo.lyricOffset < elapsed) newLyric = data.lyr;
      }
      setLyric(newLyric);
    },
    isRunning ? 10 : null
  );

  function onPlay() {
    setIsRunning(true);
  }

  function onPause() {
    setIsRunning(false);
  }

  return (
    <div>
      <YouTube
        ref={playerRef}
        videoId={songInfo.videoId}
        opts={opts}
        onPlay={onPlay}
        onPause={onPause}
      />
      {lyric}
    </div>
  );
};

export default YouTubePlayer;
