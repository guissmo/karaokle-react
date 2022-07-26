import React, { useEffect } from "react";
import { useState } from "react";
import { getInfoFromFile } from "./js/lyric-loader";
import YouTubePlayer from "./YouTubePlayer";
import { whereIsTodaysSong, whereIsSongWithIndex } from "./js/song-loader.js";
import { useParams } from "react-router-dom";

const Game = ({ language }) => {
  const [songInfo, setSongInfo] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    async function getSongInfo(id, language) {
      let SONGDATA_URL;
      if (id === undefined) {
        SONGDATA_URL = await whereIsTodaysSong(language);
      } else {
        SONGDATA_URL = await whereIsSongWithIndex(language, Number(id));
      }
      const songData = await fetch(SONGDATA_URL).then((response) =>
        response.text()
      );
      setSongInfo(getInfoFromFile(songData));
    }
    getSongInfo(id, language).catch(console.error);
  }, [id, language]);

  if (songInfo === null) return `Loading.`;
  return <YouTubePlayer songInfo={songInfo} language={language} />;
};

export default Game;
