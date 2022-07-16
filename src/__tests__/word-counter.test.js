/**
 * @jest-environment jsdom
 */

import { expect, test } from "@jest/globals";
import { wordCount, wordArrFromString } from "../js/word-counter";

test("wordCount - FR", () => {
  const arr = [
    "Je m'présente, je m'appelle Henri",
    "J'ai vu un arc-en-ciel",
    "Puis après je f*rai des galas",
  ];
  expect(wordCount(arr[0], "FR")).toBe(7);
  expect(wordCount(arr[1], "FR")).toBe(5);
  expect(wordCount(arr[2], "FR")).toBe(6);
});

test("wordArrFromString - FR", () => {
  const arr = [
    "Je m'présente, je m'appelle Henri",
    "J'ai vu un arc-en-ciel",
    "Puis après je f'rai des galas",
    "La. La? La! La, la (la)",
    "C'est t'a m'a s'arroser j'ai j'suis l'amour",
  ];
  expect(wordArrFromString(arr[0], "FR")).toStrictEqual([
    "Je",
    "m'",
    "présente",
    "je",
    "m'",
    "appelle",
    "Henri",
  ]);
  expect(wordArrFromString(arr[1], "FR")).toStrictEqual([
    "J'",
    "ai",
    "vu",
    "un",
    "arc-en-ciel",
  ]);
  expect(wordArrFromString(arr[2], "FR")).toStrictEqual([
    "Puis",
    "après",
    "je",
    "f'rai",
    "des",
    "galas",
  ]);
  expect(wordArrFromString(arr[3], "FR")).toStrictEqual([
    "La",
    "La",
    "La",
    "La",
    "la",
    "la",
  ]);
  expect(wordArrFromString(arr[4], "FR")).toStrictEqual([
    "C'",
    "est",
    "t'",
    "a",
    "m'",
    "a",
    "s'",
    "arroser",
    "j'",
    "ai",
    "j'",
    "suis",
    "l'",
    "amour",
  ]);
});

test("wordCount - TL", () => {
  const arr = [
    "Ded na ded talaga ako sa mga pakembot-kembot mo",
    "Basta't 'wag s'yang hawakan 'pag galit",
  ];
  expect(wordCount(arr[0], "TL")).toBe(9);
  expect(wordCount(arr[1], "TL")).toBe(6);
});

test("wordArrFromString - TL", () => {
  const arr = [
    "Ded na ded talaga ako sa mga pakembot-kembot mo",
    "Basta't 'wag s'yang hawakan 'pag galit",
  ];
  expect(wordArrFromString(arr[0], "TL")).toStrictEqual([
    "Ded",
    "na",
    "ded",
    "talaga",
    "ako",
    "sa",
    "mga",
    "pakembot-kembot",
    "mo",
  ]);
  expect(wordArrFromString(arr[1], "TL")).toStrictEqual([
    "Basta't",
    "'wag",
    "s'yang",
    "hawakan",
    "'pag",
    "galit",
  ]);
});
