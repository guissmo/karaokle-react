import lyricStrToArr from "../js/lyric-loader";

const lyricStr = `
[00:04.73]Oy sambayang pipino
[00:08.67]Ready na ba kayo
[00:11.16]A one a two a three a four
[00:13.15]Gusto kong hawakan ang pipino pipino pipino
[00:20.67]Gusto kong kainin ang pipino pipino pipino
[00:29.61]Palaman sa burger
[00:31.87]Pulutan ng drinker
[00:33.38]Pamalit sa lover
[00:35.20]Pag ikaw ay loner
[00:37.30]Sawsawan sa kwek-kwek squidball at kikiam
[00:41.09]Lahat kami ay natatakam
[00:45.17]Yum yum yum yum
[00:47.00]Gusto kong hawakan ang pipino (oh)
[00:50.70]Pipino pipino (ay)
[00:54.50]Gusto kong kainin ang pipino (ah)
[00:58.26]Pipino pipino (o isa pa ha)
[01:04.00]Ito ay berde at mamasa-masa
[01:07.24]Madaling kainin lalo na paghiwa
[01:10.96]Basta't huwag mang-agaw ng pipino ng iba
[01:14.91]Sa akin lang ang pipino (o put baka maupuan ko yan)
[01:20.90]Gusto kong hawakan ang pipino (ah)
[01:24.60]Pipino pipino (wow)
[01:28.20]Gusto kong kainin ang pipino (ah)
[01:32.19]Pipino pipino
[01:35.84]Pipino
[01:39.38]Ang pipino
[01:43.02]Ang pipi (wa)
[01:45.21]No Pipino (o no ang sinabi ko hindi mo a)
`;

const lyricData = lyricStrToArr(lyricStr);

export default {
  lyricData,
  lyricOffset: -4,
  videoId: "pZxBNJM_er8",
};
