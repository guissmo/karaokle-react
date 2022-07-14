import lyricLoader from "../js/lyric-loader";

const lyricStr = `
[00:00.00](Tarzan and Jane were swingin' on a vine)
[00:02.53]Candy man, candy man
[00:05.27](Sippin' from a bottle of vodka double wine)
[00:07.96]Sweet, sugar, candy man
[00:15.87]I met him out for dinner on a Friday night
[00:19.05]He really got me working up an appetite
[00:21.87]He had tattoos up and down his arm
[00:24.54]There's nothing more dangerous than a boy with charm
[00:27.34]He's a one stop shop, makes the panties drop
[00:29.90]He's a sweet talkin' sugar coated candy man
[00:32.78]A sweet talkin' sugar coated candy man
[00:41.40]He took me to the Spider club on Hollywood and Vine
[00:43.94]We drank champagne, and we danced all night
[00:46.84]We shook the paparazzi for a big surprise (a big surprise)
[00:49.68]The gossip tonight will be tommorow's headlines
[00:52.28]He's a one stop shop, makes my cherry pop
[00:54.79]He's a sweet talkin' sugar coated candy man (oh yeah)
[00:57.92]A sweet talkin' sugar coated candy man
[01:17.24]He's a one stop shop, makes my cherry pop
[01:19.81]He's a sweet talkin' sugar coated candy man (oh)
[01:22.89]A sweet talkin' sugar coated candy man
[01:30.97]Well, by now I'm getting all bothered and hot
[01:33.86]When he kissed my mouth, he really hit the spot
[01:36.66]He had lips like sugar cane, oh
[01:39.46]Good things come for boys who wait
[01:42.23](Tarzan and Jane were swingin' on a vine)
[01:44.93]Candy man, candy man
[01:47.81](Sippin' from a bottle of vodka double wine)
[01:50.46]Candy man, candy man
[01:53.36](Sweet, sugar, candy man)
[01:55.93]He's a one stop, gotcha hot, makin' all the panties drop
[01:59.05](Sweet, sugar, candy man)
[02:01.42]He's a one stop, got me hot, makin' my (uh) pop
[02:04.74](Sweet, sugar, candy man)
[02:07.06]He's a one stop, get it while it's hot, baby, don't stop
[02:10.30](Sweet, sugar)
[02:12.75]He got those lips like sugar cane
[02:15.36]Good things come for boys who wait
[02:18.07]He's a one stop shop with a real big (uh)
[02:20.88]He's a sweet talkin' sugar coated candy man
[02:23.58](Say what) a sweet talkin' sugar coated candy man
[02:26.59](Say) a sweet talkin' sugar coated candy man, woo
[02:29.51]A sweet talkin' sugar coated candy man
[02:33.25]Candy man, candy man
[02:39.15]Candy man, candy man
[02:43.34]Candy man, candy man
[02:49.29](Tarzan and Jane were swingin' on a vine
[02:51.87]Tarzan and Jane were swingin' on a vine
[02:54.47]Sippin' from a bottle of vodka double wine
[02:57.24]Sippin' from a bottle of vodka double wine
[03:00.05]Jane lost her grip and down she fell
[03:02.84]Jane lost her grip and down she fell
[03:05.53]Squared herself away as she let out a yell
[03:08.53]Squared herself away as she let out a yell)
`;

const lyricData = lyricLoader.lyricStrToArr(lyricStr);
const lyricStopData = lyricLoader.lyricStrToStopArr(lyricStr);

export default {
  lyricData,
  lyricStopData,
  lyricOffset: 0,
  videoId: "ipa0GhPZYwA",
};
