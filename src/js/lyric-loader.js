function getInfoFromLine(line) {
  const match = line.match(
    /\[(?<min>[0-9]+):(?<sec>[0-9]+)\.(?<csec>[0-9]+)\](?<lyr>.+)/
  );
  if (!match) {
    return null;
  }
  const { min, sec, csec, lyr } = match.groups;
  console.log(+min, +sec, +csec);
  return {
    time: +min * 60 + +sec + +csec / 100,
    lyr,
  };
}

export default function lyricStrToArr(lyricStr) {
  return lyricStr
    .split(/\r?\n/)
    .filter((x) => x)
    .map(getInfoFromLine);
}
