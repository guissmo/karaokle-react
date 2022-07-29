import { createContext } from "react";

export const languages = {
  EN: {
    words: "WORDS",
    otherLanguages: "OTHER LANGUAGES",
    placeholder: {
      before: "TYPE THE NEXT",
      after: "WORDS HERE",
    },
    instructions: {
      header: "HOW TO PLAY KARAOKE?",
      loading: "LOADING GAME...",
      start: "START GAME!",
      details: [
        {
          header: "LISTEN",
          details: [
            "When you start the game, the song will start playing.",
            "Listen to it, and sing along if you like!",
          ],
        },
        {
          header: "TYPE",
          details: [
            "When the music stops, then it's your turn!",
            "Fill in the next few words, as indicated on the box.",
          ],
        },
        {
          header: "LOCK IN",
          details: [
            "Click or tap outside the answer box to preview your answer.",
            "Once you've seen the preview, hit the CHECK button!",
          ],
        },
        {
          header: "SHARE",
          details: [
            "Tap the PLAY button again for the next round.",
            "The game consists of several rounds.",
            "Don't forget to share your results with your friends!",
          ],
        },
      ],
    },
    results: {
      header: "GOOD JOB, WHAT NOW?",
      share: {
        header: "SHARE",
        details:
          "Share your results and see if your friends can beat or match your score! Click the button:",
        copy: "COPY",
        copied: "COPIED RESULTS!",
        afterCopy: "...then PASTE your results on social media.",
      },
      review: {
        header: "REVIEW",
        details: "Have a second look at your answers.",
      },
      comeBack: {
        header: "COME BACK",
        details: "Come back tomorrow for a new song!",
      },
      returnToGame: "RETURN TO GAME",
      tryItOut: "Try it out!",
      hashtags: "#karaokle #dontforgetthelyrics #wordle",
    },
  },
  TL: {
    words: "NA SALITA",
    otherLanguages: "IBANG MGA WIKA",
    placeholder: {
      before: "ITYPE ANG",
      after: "NA SUSUNOD NA SALITA RITO",
    },
    instructions: {
      header: "PAANO MAGLARO NG KARAOKLE?",
      loading: "NAGLOLOAD PA...",
      start: "UMPISAHAN",
      details: [
        {
          header: "MAKINIG",
          details: [
            "Pag-umpisa ng laro, may kantang tutugtog.",
            "Pakinggan ito at makikanta kung gusto mo.",
          ],
        },
        {
          header: "MAGTYPE",
          details: [
            "Titigil ang kanta. Ikaw ang bahala sa susunod na lyrics.",
            "I-type ang susunod na mga salita. Nakasulat sa kahon kung ilan ang kailangan.",
          ],
        },
        {
          header: "IKASA ANG SAGOT",
          details: [
            "Magclick o magtap sa labas ng answer box para i-preview ang iyong sagot.",
            "Kapag ok na lahat, pindutin ang CHECK para ikasa ang sagot.",
          ],
        },
        {
          header: "ISHARE",
          details: [
            "Pindutin muli ang PLAY button para sa susunod na round.",
            "May ilang round sa Karaokle.",
            "Huwag kalimutang i-share ang resulta mo pagkatapos!",
          ],
        },
      ],
    },
    results: {
      header: "MAHUSAY! ANO'NG SUSUNOD?",
      share: {
        header: "ISHARE",
        details:
          "I-share ang iyong mga resulta at tingnan kung kayang tapatan ng mga kaibigan mo ang iyong score! I-tap ang COPY button:",
        copy: "I-COPY ANG RESULTA",
        copied: "NACOPY NA ANG RESULTA!",
        afterCopy: "...tapos i-PASTE mo ang results mo sa social media!",
      },
      review: {
        header: "IREVIEW",
        details: "Tingnan muli ang iyong mga sagot.",
      },
      comeBack: {
        header: "BUMALIK",
        details: "Bumalik ka bukas para sa bagong kanta!",
      },
      returnToGame: "BUMALIK SA LARO",
      tryItOut: "Nasubukan mo na bang magKaraoke? Punta lang sa: ",
      hashtags: "#karaokle #karaoke #wordle #karaokechallenge",
    },
  },
  FR: {
    words: "MOTS",
    otherLanguages: "AUTRES LANGUES",
    placeholder: {
      before: "TAPEZ LES",
      after: "MOTS SUIVANTS ICI",
    },
    instructions: {
      header: "COMMENT JOUER LE KARAOKLE?",
      loading: "CHARGEMENT DU JEU...",
      start: "COMMENCER!",
      details: [
        {
          header: "ÉCOUTER",
          details: [
            "Lorsque vous démarrez le jeu, la musique démarre.",
            "Écoutez et chantez si vous voulez.",
          ],
        },
        {
          header: "TAPER",
          details: [
            "La chanson s'arrêtera. C'est à vous de compléter les paroles.",
            "Tapez les mots suivants. Il est écrit dans la case comment est nécessaire.",
          ],
        },
        {
          header: "BLOQUER",
          details: [
            "Cliquez ou appuyez en dehors de la zone de réponse pour prévisualiser votre réponse.",
            "Après vérification, appuyez sur la COCHE pour bloquer les paroles.",
          ],
        },
        {
          header: "PARTAGER",
          details: [
            "Appuyez à nouveau sur PLAY pour le tour suivant.",
            "Il y a plusieurs tours dans Karaokle.",
            "N'oubliez pas de partager ensuite !",
          ],
        },
      ],
    },
    results: {
      header: "BIEN JOUÉ! ET ALORS?",
      share: {
        header: "PARTAGER",
        details:
          "Partagez vos résultats et voyez si vos amis peuvent égaler votre score. Cliquez ici pour copier vos résultats :",
        copy: "COPIER",
        copied: "COPIÉ!",
        afterCopy: "...puis COLLEZ vos résultats dans les réseaux sociaux",
      },
      review: {
        header: "REVOIR",
        details: "Revoir vos reponses.",
      },
      comeBack: {
        header: "REVENIR",
        details: "Revenez demain pour une nouvelle chanson !",
      },
      returnToGame: "RETOUR AU JEU",
      tryItOut: "Essaye le Karaokle! Allez sur ce lien: ",
      hashtags: "#karaokle #noplp #wordle",
    },
  },
};

const LanguageContext = createContext(languages.EN);

export default LanguageContext;
