const FR_PARAMS = {
  preprocess: (x) => {
    return x.replaceAll(/(?<l>s'|m'|t'|c'|j'|l')/gi, `$<l> `);
  },
  wordSpacers: /[ ]/,
  wordReplacers: (word) => word.replaceAll(/[.,?!()]/g, ""),
};

const TL_PARAMS = {
  preprocess: (x) => x,
  wordSpacers: /[ ]/,
  wordReplacers: (word) => word.replaceAll(/[.,?!()]/g, ""),
};

const EN_PARAMS = {
  wordSpacers: " ",
};

const LANG_PARAMS = {
  FR: FR_PARAMS,
  EN: EN_PARAMS,
  TL: TL_PARAMS,
};

export function wordArrFromString(str, lang) {
  const PARAMS = LANG_PARAMS[lang];
  return PARAMS.preprocess(str)
    .split(PARAMS.wordSpacers)
    .map(PARAMS.wordReplacers);
}

export function wordCount(str, lang = "EN") {
  return wordArrFromString(str, lang).length;
}
