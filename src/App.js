import React from "react";
import { createRoot } from "react-dom/client";
import { useState, StrictMode } from "react";
import { loadLyricData } from "./js/lyric-loader";
import songData from "./lyrics/i-want-it-that-way.lrc";
import YouTubePlayer from "./YouTubePlayer";
import useInterval from "use-interval";

const App = () => {
  const [songInfo, setSongInfo] = useState(null);
  const [isLoadingSongInfo, setIsLoadingSongInfo] = useState(false);

  useInterval(
    async function () {
      if (songInfo === null && !isLoadingSongInfo) {
        setIsLoadingSongInfo(true);
        setSongInfo(await loadLyricData(songData)); // TODO: Be able to change the file from outside via Node?
        setIsLoadingSongInfo(false);
      }
    },
    songInfo === null ? 100 : null
  );

  if (songInfo === null) return `songInfo null ${isLoadingSongInfo}`;
  return <YouTubePlayer songInfo={songInfo} />;
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
