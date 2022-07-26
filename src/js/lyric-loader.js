import { LANG_PARAMS } from "./word-counter";

function getFullLyricDataFromLine(line, offset = 0, index) {
  const { min, sec, csec, lyr } = getInfoFromLineViaRegex(line, true);
  return {
    index,
    time: getTimestamp(min, sec, csec, offset),
    lyr: lyr.replaceAll("###", ""),
  };
}

function getStopDataFromLine(line, offset = 0, index) {
  const { min, sec, csec, lyr, stopOffset } = getInfoFromLineViaRegex(line);
  return {
    index,
    time: getTimestamp(min, sec, csec, offset),
    stopTime: getTimestamp(min, sec, csec, offset, stopOffset),
    lyr: lyr.replace(/(\[\[|###).+/g, ""),
  };
}

function handleAlternateSpellings(val, lang) {
  let ret = {};
  const PARAMS = LANG_PARAMS[lang];
  for (let v of val.split(" ")) {
    const words = v.split("|");
    const normalizedCorrectWord = PARAMS.correctionNormalizer(words[0], lang);
    ret[normalizedCorrectWord] = [];
    for (let w of words.slice(1)) {
      ret[normalizedCorrectWord].push(w);
    }
  }
  return ret;
}

function getMetadataFromLine(l, lang) {
  let [key, val] = l.split(":").map((x) => x.trim());
  const ret = {};
  if (key === "lyricOffset" || key === "startAt") val = Number(val);
  if (key === "alternateSpellings") {
    val = handleAlternateSpellings(val, lang);
  }
  ret[key] = val;
  return ret;
}

function getMetadataAndRawLinesFromFile(text) {
  const lines = text.split("\n");
  let passedDashes = false;
  let metadata = {
    lyricOffset: 0,
    alternateSpellings: {},
    startAt: 0,
  }; // default values
  let lyricLines = [];
  for (let l of lines) {
    if (l.trim() === "---") {
      passedDashes = true;
      continue;
    }
    if (!passedDashes) {
      metadata = Object.assign(
        metadata,
        getMetadataFromLine(l, metadata.language)
      );
    } else {
      lyricLines.push(l.trim());
    }
  }
  if (!metadata.videoId) throw "no videoId found";
  if (!metadata.lyricOffset)
    metadata = Object.assign(metadata, {
      lyricOffset: 0,
    });
  return { metadata, lyricLines };
}

export function getInfoFromFile(text) {
  const { metadata, lyricLines } = getMetadataAndRawLinesFromFile(text);

  const noTimestamps = lyricLines
    .map((x) => String(getTimestampViaRegex(x)[1]))
    .reduce((x, y) => `${x.trim()} ${y.trim()}`);

  const fullLyricData = lyricLines.map((x, i) =>
    getFullLyricDataFromLine(x, metadata.lyricOffset, i)
  );

  const roundData = lyricLines
    .map((x, i) => [x, i])
    .filter(([x]) => x.includes("[["))
    .map(([x, i]) => getStopDataFromLine(x, metadata.lyricOffset, i));
  const answers = noTimestamps.matchAll(/\]\][^#]+(?=###)/g);
  let i = 0;
  for (let answer of answers) {
    roundData[i] = {
      ...roundData[i],
      answer: answer[0].replaceAll(/\]\]/g, ""),
    };
    i++;
  }

  return {
    metadata,
    lyricData: {
      full: fullLyricData,
      gapped: roundData,
    },
  };
}

function getTimestamp(min, sec, csec, ...offsets) {
  const totalOffset = offsets.map((x) => Number(x)).reduce((x, y) => x + y, 0);
  return +min * 60 + +sec + +csec / 100 + totalOffset;
}

function getTimestampViaRegex(line) {
  const match = line.match(
    /^\[(?<min>[0-9]+):(?<sec>[0-9]+)\.(?<csec>[0-9]+)\]/
  );
  return [
    {
      min: Number(match.groups.min),
      sec: Number(match.groups.sec),
      csec: Number(match.groups.csec),
    },
    line.replace(match[0], ""),
  ];
}

function getInfoFromLineViaRegex(line, clean = false) {
  const [timeDic, text] = getTimestampViaRegex(line);

  const match = text.match(
    /(?<lyr>.+)\[\[(?<stopOffset>[-.0-9]+)\]\](?<theRest>.*)/
  );

  if (match === null) {
    return {
      ...timeDic,
      lyr: text,
    };
  }

  const { lyr, theRest } = match.groups;
  if (!clean) {
    return {
      ...timeDic,
      ...match.groups,
      lyr: lyr.trim(),
    };
  }

  return {
    ...timeDic,
    lyr: lyr + theRest,
  };
}

/////////////

export async function loadLyricData(songData) {
  const text = await (await fetch(songData)).text();
  return getInfoFromFile(text);
}

export let __testables = {};
if (process.env["NODE_ENV"] === "test")
  __testables = {
    getFullLyricDataFromLine,
    getStopDataFromLine,
    getMetadataAndRawLinesFromFile,
    getInfoFromFile,
    getTimestamp,
    getTimestampViaRegex,
    getInfoFromLineViaRegex,
    handleAlternateSpellings,
  };
