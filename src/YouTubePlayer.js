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

  const stops = songInfo.lyricData.gapped;

  let currentRound = 1;
  let currentStop = stops[currentRound - 1].time;

  useInterval(
    async () => {
      let elapsed = await playerRef.current.internalPlayer.getCurrentTime();
      if (currentStop < elapsed) {
        elapsed = currentStop;
        playerRef.current.internalPlayer.seekTo(currentStop);
        playerRef.current.internalPlayer.pauseVideo();
      }

      let newLyric = "";
      for (let lyricData of songInfo.lyricData.full) {
        if (lyricData.time + +songInfo.metadata.lyricOffset < elapsed)
          newLyric = lyricData.lyr;
      }
      setLyric(newLyric);
    },
    isRunning ? 100 : null
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
        videoId={songInfo.metadata.videoId}
        opts={opts}
        onPlay={onPlay}
        onPause={onPause}
      />
      {lyric}
    </div>
  );
};

export default YouTubePlayer;
