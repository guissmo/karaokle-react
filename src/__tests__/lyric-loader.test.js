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
  console.log(__testables.getInfoFromLineViaRegex(array[1]));
  expect(
    __testables.getInfoFromLineViaRegex(array[0]) ===
      {
        min: "01",
        sec: "10",
        csec: "96",
        lyr: "Basta't huwag mang-agaw ng pipino ng iba",
      }
  );
  expect(
    __testables.getInfoFromLineViaRegex(array[1]) ===
      {
        min: "00",
        sec: "41",
        csec: "09",
        lyr: "Lahat kami",
        stopOffset: "1",
        theRest: "ay natatakam###",
      }
  );
});
