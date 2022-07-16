/**
 * @jest-environment jsdom
 */

import { expect, test } from "@jest/globals";
import { __testables } from "../js/lyric-loader";

test("getInfoFromLineViaRegex1", () => {
  const array = [
    `[01:10.96]Basta't huwag mang-agaw ng pipino ng iba`,
    `[00:41.09]Lahat kami [[1]]ay natatakam###`,
  ];
  expect(__testables.getInfoFromLineViaRegex(array[0])).toStrictEqual({
    min: 1,
    sec: 10,
    csec: 96,
    lyr: "Basta't huwag mang-agaw ng pipino ng iba",
  });
  expect(__testables.getInfoFromLineViaRegex(array[1])).toStrictEqual({
    min: 0,
    sec: 41,
    csec: 9,
    lyr: "Lahat kami",
    stopOffset: "1",
    theRest: "ay natatakam###",
  });
});

test("getFullLyricDataFromLine without offset", () => {
  const array = [
    `[01:10.96]Basta't huwag mang-agaw ng pipino ng iba`,
    `[00:41.09]Lahat kami [[1]]ay natatakam###`,
  ];
  expect(__testables.getFullLyricDataFromLine(array[0])).toStrictEqual({
    time: 70.96,
    lyr: "Basta't huwag mang-agaw ng pipino ng iba",
  });
  expect(__testables.getFullLyricDataFromLine(array[1])).toStrictEqual({
    time: 41.09,
    lyr: "Lahat kami ay natatakam",
  });
});

test("getFullLyricDataFromLine with offset with offset", () => {
  const array = [
    `[01:10.96]Basta't huwag mang-agaw ng pipino ng iba`,
    `[00:41.09]Lahat kami [[1]]ay natatakam###`,
  ];
  expect(__testables.getFullLyricDataFromLine(array[0], -0.69)).toStrictEqual({
    time: 70.27,
    lyr: "Basta't huwag mang-agaw ng pipino ng iba",
  });
  expect(__testables.getFullLyricDataFromLine(array[1], 2)).toStrictEqual({
    time: 43.09,
    lyr: "Lahat kami ay natatakam",
  });
});

test("getStopDataFromLine with offset", () => {
  const array = [
    `[01:10.96]Basta't huwag mang-agaw ng pipino ng iba`,
    `[00:41.09]Lahat kami [[1]]ay natatakam###`,
  ];
  expect(__testables.getStopDataFromLine(array[0], -0.69)).toStrictEqual({
    time: 70.27,
    stopTime: NaN,
    lyr: "Basta't huwag mang-agaw ng pipino ng iba",
  });
  expect(__testables.getStopDataFromLine(array[1], 2)).toStrictEqual({
    time: 43.09,
    stopTime: 44.09,
    lyr: "Lahat kami",
  });
});

test("getStopDataFromLine without offset", () => {
  const array = [
    `[01:10.96]Basta't huwag mang-agaw ng pipino ng iba`,
    `[00:41.09]Lahat kami [[1]]ay natatakam###`,
  ];
  expect(__testables.getStopDataFromLine(array[0])).toStrictEqual({
    time: 70.96,
    stopTime: NaN,
    lyr: "Basta't huwag mang-agaw ng pipino ng iba",
  });
  expect(__testables.getStopDataFromLine(array[1])).toStrictEqual({
    time: 41.09,
    stopTime: 42.09,
    lyr: "Lahat kami",
  });
});

test("getMetadataAndRawLinesFromFile", () => {
  const array = [
    `lyricOffset: -4
videoId: pZxBNJM_er8
---
[00:04.73]Oy sambayang pipino
[00:08.67]Ready na ba kayo`,
    ``,
  ];
  expect(__testables.getMetadataAndRawLinesFromFile(array[0])).toStrictEqual({
    lyricLines: ["[00:04.73]Oy sambayang pipino", "[00:08.67]Ready na ba kayo"],
    metadata: {
      lyricOffset: -4,
      videoId: "pZxBNJM_er8",
    },
  });
});

test("getInfoFromFile", () => {
  const array = [
    `lyricOffset: -4
videoId: pZxBNJM_er8
---
[00:04.73]Oy sambayang pipino
[00:08.67]Ready na [[1]]ba kayo###`,
    ``,
  ];
  const answer = __testables.getInfoFromFile(array[0]);
  expect(answer.lyricData.full[0].lyr).toBe("Oy sambayang pipino");
  expect(answer.lyricData.full[0].time).toBeCloseTo(0.73);
  expect(answer.lyricData.full[1].lyr).toBe("Ready na ba kayo");
  expect(answer.lyricData.full[1].time).toBeCloseTo(4.67);
  expect(answer.lyricData.gapped[0].lyr).toBe("Ready na");
  expect(answer.lyricData.gapped[0].answer).toBe("ba kayo");
  expect(answer.lyricData.gapped[0].time).toBeCloseTo(4.67);
  expect(answer.lyricData.gapped[0].stopTime).toBeCloseTo(5.67);
});
