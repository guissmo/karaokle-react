export function wordInitial(word) {
  const wordMatch = word.match(
    /^([^A-Za-z\u00C0-\u024F\u1E00-\u1EFF0-9]*[A-Za-z\u00C0-\u024F\u1E00-\u1EFF0-9][^A-Z\u00C0-\u024F\u1E00-\u1EFFa-z0-9]*)(.*)/
  );
  return {
    initial: wordMatch[1],
    theRest: wordMatch[2],
  };
}

export function keepUserAnswerIfCorrect(x) {
  return x.correct ? x.userAnswer : x.correctAnswer;
}

export function getColorArray(x) {
  return x.correct ? "#08ff00" : "#ee0000";
}
