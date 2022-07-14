function getInfoFromLine(line) {
  const match = line.match(
    /\[(?<min>[0-9]+):(?<sec>[0-9]+)\.(?<csec>[0-9]+)\](?<lyr>.+)/
  );
  if (!match) {
    return null;
  }
  const { min, sec, csec, lyr } = match.groups;
  return {
    time: +min * 60 + +sec + +csec / 100,
    lyr: lyr.replace(/\[\[.+/g, ""),
  };
}

function getStopsFromLine(line) {
  const match = line.match(
    /\[(?<min>[0-9]+):(?<sec>[0-9]+)\.(?<csec>[0-9]+)\](?<lyr>.+)\[\[(?<stopOffset>[-.0-9]+)\]\]/
  );
  if (!match) {
    return null;
  }
  const { min, sec, csec, lyr, stopOffset } = match.groups;
  return {
    time: +min * 60 + +sec + +csec / 100 + +stopOffset,
    lyr: lyr.replace(/###/g, ""),
  };
}

function lyricStrToArr(lyricStr) {
  return lyricStr
    .split(/\r?\n/)
    .map(getInfoFromLine)
    .filter((x) => x);
}

function lyricStrToStopArr(lyricStr) {
  return lyricStr
    .split(/\r?\n/)
    .filter((x) => x.includes("[["))
    .map(getStopsFromLine);
}

export default {
  lyricStrToArr,
  lyricStrToStopArr,
};
