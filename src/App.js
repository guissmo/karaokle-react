import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useState, StrictMode } from "react";
import { getInfoFromFile } from "./js/lyric-loader";
// import songData from "./lyrics/da-coconut-nut.lrc";
import YouTubePlayer from "./YouTubePlayer";

const App = () => {
  const [songInfo, setSongInfo] = useState(null);
  // const [isLoadingSongInfo, setIsLoadingSongInfo] = useState(false);

  // useInterval(
  //   async function () {
  //     if (songInfo === null && !isLoadingSongInfo) {
  //       const songData = await fetch(
  //         `https://guissmo.com/tmp/lyrics/bahay-kubo.lrc`
  //       ).then((response) => response.text());
  //       console.log(songData);
  //       setSongInfo(await loadLyricData(songData)); // TODO: Be able to change the file from outside via Node?
  //       setIsLoadingSongInfo(false);
  //     }
  //   },
  //   songInfo === null ? 100 : null
  // );

  useEffect(
    () =>
      async function () {
        const songData = await fetch(
          `https://guissmo.com/tmp/lyrics/misis-fely-nimfa-ang-pangalan.lrc`
        ).then((response) => response.text());
        setSongInfo(getInfoFromFile(songData));
        // setIsLoadingSongInfo(false);
      },
    []
  );

  if (songInfo === null) return ``; //`songInfo null ${isLoadingSongInfo}`;
  return <YouTubePlayer songInfo={songInfo} />;
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
