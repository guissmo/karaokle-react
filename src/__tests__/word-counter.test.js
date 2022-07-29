/**
 * @jest-environment jsdom
 */

import { expect, test } from "@jest/globals";
import { wordCount, compareAnswers, wordComparison } from "../js/word-counter";

test("wordComparison - EN", () => {
  expect(
    wordComparison("fireman", "firemen", "EN", { FIREMAN: ["firemen"] }).correct
  ).toBe(true);
  expect(
    wordComparison("f'rai", "ferai", "FR", { FRAI: ["ferai"] }).correct
  ).toBe(true);
});

test("wordCount - FR", () => {
  const arr = [
    "Je m'présente, je m'appelle Henri",
    "J'ai vu un arc-en-ciel",
    "Puis après je f*rai des galas",
    "quand le croque-mort t'emportera",
  ];
  expect(wordCount(arr[0], "FR")).toBe(7);
  expect(wordCount(arr[1], "FR")).toBe(5);
  expect(wordCount(arr[2], "FR")).toBe(6);
  expect(wordCount(arr[3], "FR")).toBe(5);
});

test("wordComparison - FR", () => {
  const arr = [
    "Je m'présente,   je m'appelle  Henri    ",
    "J'ai vu un arc-en-ciel",
    "Puis après je f'rai des galas",
    "La. La? La! La, la (la)",
    "C'est t'a m'a s'arroser j'ai j'suis l'amour",
  ];
  expect(
    compareAnswers(arr[0], "Je me presente je m'appelle Henri", "FR", {
      "M'": ["me"],
    })
  ).toMatchSnapshot();
  expect(
    compareAnswers(arr[1], "j'ai vu un arc-en-ciel", "FR")
  ).toMatchSnapshot();
  expect(
    compareAnswers(arr[2], "PUIS APRES JE FERAI DES GALAS", "FR", {
      "F'RAI": ["ferai"],
    })
  ).toMatchSnapshot();
  expect(compareAnswers(arr[3], "LA LA LA LA LA LA", "FR")).toMatchSnapshot();
  expect(
    compareAnswers(arr[4], "c'Est t'A m'A s'Arroser j'Ai j'suis l'AMOUR", "FR")
  ).toMatchSnapshot();
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
    "Nasa isip ko s'ya gabi-gabi araw-araw, aking sinta.",
  ];
  expect(
    compareAnswers(
      arr[0],
      "DED NA DED tlaaga ako sa MGA pakembotkembot mo",
      "TL"
    )
  ).toMatchSnapshot();
  expect(
    compareAnswers(arr[1], "Basta't wag syang hawakan pag galit", "TL")
  ).toMatchSnapshot();
  expect(
    compareAnswers(arr[2], "nasa isip ko siya araw-araw aking sinta", "TL")
  ).toMatchSnapshot();
});
