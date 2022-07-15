import songData from "../lyrics/pipino.lrc";

function getFullLyricDataFromLine(line, offset) {
  const { min, sec, csec, lyr } = getInfoFromLineViaRegex(line);
  return {
    time: getTimestamp(min, sec, csec, offset),
    lyr: lyr,
  };
}

function getStopDataFromLine(line, offset) {
  const { min, sec, csec, lyr, stopOffset } = getInfoFromLineViaRegex(
    line,
    false
  );
  return {
    time: getTimestamp(min, sec, csec, offset, stopOffset),
    stopTime: getTimestamp(min, sec, csec, offset, stopOffset),
    lyr: lyr, //.replace(/\[\[.+/g, ""),
  };
}

function getInfoFromFile(text) {
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
      full: lyricLines.map((x) =>
        getFullLyricDataFromLine(x, metadata.lyricOffset)
      ),
      gapped: lyricLines
        .filter((x) => x.includes("[["))
        .map((x) => getStopDataFromLine(x, metadata.lyricOffset)),
    },
  };
}

function getTimestamp(min, sec, csec, ...offsets) {
  const totalOffset = offsets.map((x) => Number(x)).reduce((x, y) => x + y);
  return +min * 60 + +sec + +csec / 100 + totalOffset;
}

function getInfoFromLineViaRegex(line, full = true) {
  {
    const match = line.match(
      /\[(?<min>[0-9]+):(?<sec>[0-9]+)\.(?<csec>[0-9]+)\](?<lyr>.+)\[\[(?<stopOffset>[-.0-9]+)\]\](?<theRest>.+)/
    );
    if (match !== null) {
      const { min, sec, csec, lyr, theRest } = match.groups;
      if (full) {
        return {
          min,
          sec,
          csec,
          lyr: lyr + theRest,
        };
      }
      return match.groups;
    }
  }
  {
    const match = line.match(
      /\[(?<min>[0-9]+):(?<sec>[0-9]+)\.(?<csec>[0-9]+)\](?<lyr>.+)/
    );
    if (match !== null) {
      return match.groups;
    }
  }
}

//

export async function loadLyricData() {
  const text = await (await fetch(songData)).text();
  return getInfoFromFile(text);
}
