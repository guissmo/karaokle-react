const FR_PARAMS = {
  preprocess: (x) => {
    return x.replaceAll(/(?<l>s'|m'|t'|c'|j'|l')/gi, `$<l> `);
  },
  wordSpacers: /[ ]+/,
  correctionNormalizer: (word) =>
    word
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replaceAll(/[^A-Za-z0-9\- ']/g, "")
      .toUpperCase(),
};

const TL_PARAMS = {
  preprocess: (x) => x,
  wordSpacers: /[ ]+/,
  wordReplacers: (word) => word.replaceAll(/[.,?!()]/g, ""),
  correctionNormalizer: (word) =>
    word
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replaceAll(/[^A-Za-z0-9 ]/g, "")
      .toUpperCase(),
};

const EN_PARAMS = {
  preprocess: (x) => x,
  wordSpacers: /[ ]+/,
  wordReplacers: (x) => x,
};

const LANG_PARAMS = {
  FR: FR_PARAMS,
  EN: EN_PARAMS,
  TL: TL_PARAMS,
};

function wordPresentationNormalizer(word) {
  return word.replaceAll(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9\- '']/g, "");
}

export function compareAnswers(correctString, userString, lang) {
  const correctArray = wordArrFromString(correctString, lang);
  const userArray = wordArrFromString(userString, lang);
  let resultArray = [];
  for (let [i, correctWord] of correctArray.entries()) {
    resultArray.push(wordComparison(correctWord, userArray[i], lang));
  }
  return resultArray;
}

export function wordComparison(correctWord, userWord, lang) {
  const PARAMS = LANG_PARAMS[lang];
  return {
    correct:
      userWord !== undefined &&
      PARAMS.correctionNormalizer(correctWord) ===
        PARAMS.correctionNormalizer(userWord),
    userAnswer:
      userWord === undefined ? null : wordPresentationNormalizer(userWord),
  };
}

export function wordArrFromString(str, lang) {
  const PARAMS = LANG_PARAMS[lang];
  return PARAMS.preprocess(str).trim().split(PARAMS.wordSpacers);
}

export function wordCount(str, lang = "EN") {
  return wordArrFromString(str, lang).length;
}
