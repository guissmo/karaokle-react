import songData from "../lyrics/pipino.lrc";

function getInfoFromLine(line, offset) {
  const match = line.match(
    /\[(?<min>[0-9]+):(?<sec>[0-9]+)\.(?<csec>[0-9]+)\](?<lyr>.+)/
  );
  if (!match) {
    return null;
  }
  const { min, sec, csec, lyr } = match.groups;
  return {
    time: +min * 60 + +sec + +csec / 100 + offset,
    lyr: lyr.replace(/\[\[.+/g, ""),
  };
}

function getStopsFromLine(line, offset) {
  const match = line.match(
    /\[(?<min>[0-9]+):(?<sec>[0-9]+)\.(?<csec>[0-9]+)\](?<lyr>.+)\[\[(?<stopOffset>[-.0-9]+)\]\]/
  );
  if (!match) {
    return null;
  }
  const { min, sec, csec, lyr, stopOffset } = match.groups;
  return {
    time: +min * 60 + +sec + +csec / 100 + +stopOffset + offset,
    lyr: lyr.replace(/###/g, ""),
  };
}

function extractInfo(text) {
  const lines = text.split("\n");
  let passedDashes = false;
  let metadata = {};
  let lyricLines = [];
  for (let l of lines) {
    if (l.trim() === "---") {
      passedDashes = true;
      continue;
    }
    if (!passedDashes) {
      let [key, val] = l.split(":");
      metadata[key.trim()] = val.trim();
      if (key === "lyricOffset") metadata[key.trim()] = Number(val);
    } else {
      lyricLines.push(l.trim());
    }
  }

  return {
    metadata,
    lyricData: {
      full: lyricLines
        .map((x) => getInfoFromLine(x, metadata.lyricOffset))
        .filter((x) => x),
      gapped: lyricLines
        .filter((x) => x.includes("[["))
        .map((x) => getStopsFromLine(x, metadata.lyricOffset)),
    },
  };
}

export async function loadLyricData() {
  const text = await (await fetch(songData)).text();
  return extractInfo(text);
}
