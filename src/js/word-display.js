export function keepUserAnswerIfCorrect(x) {
  return x.correct ? x.userAnswer : x.correctAnswer;
}

export function getColorArray(x) {
  return x.correct ? "#08ff00" : "#ee0000";
}
