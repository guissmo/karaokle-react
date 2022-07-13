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

const YouTubePlayer = () => {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const playerRef = useRef();

  useInterval(
    async () => {
      const elapsed = await playerRef.current.internalPlayer.getCurrentTime();
      setElapsed(elapsed);
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
        videoId="2g811Eo7K8U"
        opts={opts}
        onPlay={onPlay}
        onPause={onPause}
      />
      {elapsed}
    </div>
  );
};

export default YouTubePlayer;
