import songData from "../lyrics/pipino.lrc";

function getFullLyricDataFromLine(line, offset) {
  const { min, sec, csec, lyr } = getInfoFromLineViaRegex(line, true);
  return {
    time: getTimestamp(min, sec, csec, offset),
    lyr: lyr,
  };
}

function getStopDataFromLine(line, offset) {
  const { min, sec, csec, lyr, stopOffset } = getInfoFromLineViaRegex(line);
  return {
    time: getTimestamp(min, sec, csec, offset),
    stopTime: getTimestamp(min, sec, csec, offset, stopOffset),
    lyr: lyr.replace(/(\[\[|###).+/g, ""),
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

  const noTimestamps = lyricLines
    .map((x) => String(getTimestampViaRegex(x)[1]))
    .reduce((x, y) => `${x.trim()} ${y.trim()}`);
  console.log(noTimestamps);

  const fullLyricData = lyricLines.map((x) =>
    getFullLyricDataFromLine(x, metadata.lyricOffset)
  );

  const roundData = lyricLines
    .filter((x) => x.includes("[["))
    .map((x) => getStopDataFromLine(x, metadata.lyricOffset));
  const answers = noTimestamps.matchAll(/(?<=\]\])[^#]+(?=###)/g);
  let i = 0;
  for (let answer of answers) {
    roundData[i] = {
      ...roundData[i],
      answer: answer[0],
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
  return [match.groups, line.replace(match[0], "")];
}

function getInfoFromLineViaRegex(line, clean = false) {
  const [timeDic, text] = getTimestampViaRegex(line);

  const match = text.match(
    /(?<lyr>.+)\[\[(?<stopOffset>[-.0-9]+)\]\](?<theRest>.+)/
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

export async function loadLyricData() {
  const text = await (await fetch(songData)).text();
  return getInfoFromFile(text);
}

// export let __testables = {};
// if (process.env["NODE_DEV"] == "TEST") __testables = { hi: "hi" };
