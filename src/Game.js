import React, { useEffect } from "react";
import { useState } from "react";
import { getInfoFromFile } from "./js/lyric-loader";
// import songData from "./lyrics/da-coconut-nut.lrc";
import YouTubePlayer from "./YouTubePlayer";
import { whereIsTodaysSong, whereIsSongWithIndex } from "./js/song-loader.js";
import { useParams } from "react-router-dom";

const Game = ({ language }) => {
  const [songInfo, setSongInfo] = useState(null);

  const { id } = useParams();

  useEffect(
    () =>
      async function () {
        const SONGDATA_URL =
          id === undefined
            ? await whereIsTodaysSong(language)
            : await whereIsSongWithIndex(language, Number(id));
        const songData = await fetch(SONGDATA_URL).then((response) =>
          response.text()
        );
        setSongInfo(getInfoFromFile(songData));
      },
    [language]
  );

  if (songInfo === null) return ``;
  return <YouTubePlayer songInfo={songInfo} language={language} />;
};

export default Game;
