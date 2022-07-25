const SUPPORTED_LANGUAGES = ["EN", "TL"];

export const LYRICS_URL = `https://guissmo.com/karaokle-data`;

async function getSongListOfLanguage(lang) {
  const { songArray: songList } = await fetch(
    `${LYRICS_URL}/index_${lang}.json`
  ).then((response) => response.json());
  return songList;
}

export async function whereIsTodaysSong(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) return null;
  const dailyCounter = Math.floor(Date.now() / 86400000) - 19198;
  return whereIsSongWithIndex(lang, dailyCounter);
}

export async function whereIsSongWithIndex(lang, index) {
  const songList = await getSongListOfLanguage(lang);
  return `${LYRICS_URL}/${lang.toLowerCase()}/${songList[index]}.lrc`;
}
