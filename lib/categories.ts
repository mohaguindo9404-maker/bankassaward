export interface Candidate {
  id: string
  name: string
  alias?: string
  image: string
  bio: string
  achievements?: string[]
  songCount?: number
  candidateSong?: string
  audioFile?: string
}

export interface Category {
  id: string
  name: string
  subtitle: string
  candidates: Candidate[]
  special: boolean
  isLeadershipPrize: boolean
  preAssignedWinner?: string
  preAssignedWinnerBio?: string
  preAssignedWinnerImage?: string
  preAssignedWinnerAchievements?: string[]
  preAssignedWinnerTribute?: string
}

export const CATEGORIES: Category[] = [
  {
    id: "trophee-leadership",
    name: "Prix d'Honneur Leadership",
    subtitle: "Réservé à Kass - Révéler à la fin du vote",
    candidates: [],
    special: true,
    isLeadershipPrize: true,
    preAssignedWinner: "Kassim Guindo",
    preAssignedWinnerImage: "/kassim-guindo-portrait-leadership.jpg",
    preAssignedWinnerBio:
      "Kassim Guindo, figure emblématique de Bankass, demeure une légende vivante dans le cœur de tous ceux qui l'ont connu. Visionnaire et leader naturel, il a consacré sa vie à l'émancipation de sa communauté, croyant fermement que chaque jeune de Bankass portait en lui les graines de la grandeur. Son parcours, marqué par une détermination sans faille et une générosité infinie, a inspiré des générations entières. Qu'il soit parmi nous ou qu'il veille sur nous depuis les étoiles, son héritage reste immortel.",
    preAssignedWinnerAchievements: [
      "Fondateur du mouvement Winner Boys",
      "Mentor de centaines de jeunes de Bankass",
      "Pionnier du développement communautaire local",
      "Symbole d'espoir et de résilience pour toute une génération",
      "Bâtisseur de ponts entre tradition et modernité",
    ],
    preAssignedWinnerTribute: `
      À toi, Kassim,

      Tu es de ceux dont on ne sait jamais vraiment s'ils sont partis ou s'ils sont simplement passés dans une autre dimension de l'existence. Car comment pourrait-on dire qu'un homme comme toi a disparu, quand chaque rue de Bankass porte encore l'écho de tes pas, quand chaque jeune que tu as guidé continue de porter ta flamme ?

      Tu nous as appris que le leadership n'est pas une question de titre, mais de cœur. Que la vraie richesse se mesure non pas à ce que l'on possède, mais à ce que l'on donne. Tu as été le père que beaucoup n'ont jamais eu, le frère sur qui l'on pouvait compter, l'ami qui ne jugeait jamais.

      Les Winner Boys, cette famille que tu as créée, continue de grandir. Chaque succès que nous célébrons ce soir, chaque prix que nous décernons, porte ton empreinte invisible mais indélébile.

      Si tu es là-haut, sache que nous pensons à toi chaque jour.
      Si tu es quelque part ici-bas, sache que nous te cherchons encore.
      Où que tu sois, sache que tu es aimé, honoré, et jamais oublié.

      Ce trophée porte ton nom. Cette cérémonie célèbre ta mémoire. Cet héritage est le tien.

      Avec tout notre amour et notre gratitude éternelle,
      La famille Bankass Awards et les Winner Boys
    `,
  },
  {
    id: "revelation",
    name: "Révélation de l'Année",
    subtitle: "Découverte du nouveau talent qui a marqué l'année",
    candidates: [
      {
        id: "rev-1",
        name: "Bakary Sangaré",
        alias: "Baka",
        image: "/african-man-artist-portrait-young.jpg",
        bio: "Jeune artiste émergent de Bankass, son style unique mélange tradition et modernité.",
        achievements: [
          "Premier concert solo à Bamako",
          "100 000 vues sur YouTube",
          "Artiste local de l'année 2024",
        ],
        songCount: 5,
        candidateSong: "Bankass Revolution"
      },
      {
        id: "rev-2",
        name: "Aminata Dicko",
        alias: "Mina",
        image: "/african-woman-singer-portrait-rising.jpg",
        bio: "Voix douce mais puissante, elle chante l'espoir et la résilience de la jeunesse malienne.",
        achievements: [
          "Premier album en production",
          "Collaboration avec Oumou Sangaré",
          "Révélation du Festival au Désert",
        ],
        songCount: 8,
        candidateSong: "Espoir"
      },
    ],
    special: false,
    isLeadershipPrize: false,
  },
  {
    id: "meilleure-chanson",
    name: "Meilleure Chanson de l'Année",
    subtitle: "Le titre qui a marqué les esprits cette année",
    candidates: [
      {
        id: "mc-1",
        name: "Oumou Sangaré",
        alias: "La Dame de Mopti",
        image: "/music-album-cover-gold-artistic.jpg",
        bio: "Titre phénomène ayant battu tous les records de streaming, devenu un hymne générationnel.",
        achievements: ["1 milliard de streams", "Disque de diamant", "Chanson de la décennie"],
        songCount: 12,
        candidateSong: "Djadja"
      },
      {
        id: "mc-2",
        name: "Fatoumata Diawara",
        alias: "Fatou",
        image: "/music-album-cover-african-artistic.jpg",
        bio: "Chanson engagée célébrant la paix et l'unité au Mali, mêlant sonorités traditionnelles.",
        achievements: ["Prix de la meilleure chanson africaine", "Message de paix", "Clip primé"],
        songCount: 15,
        candidateSong: "Kouma"
      },
    ],
    special: false,
    isLeadershipPrize: false,
  },
  {
    id: "meilleur-artiste",
    name: "Meilleur Artiste de l'Année",
    subtitle: "Récompenser l'excellence artistique et l'impact culturel",
    candidates: [
      {
        id: "ma-1",
        name: "Rokia Traoré",
        alias: "La Voix d'Or",
        image: "/african-woman-musician-portrait-artistic.jpg",
        bio: "Chanteuse, guitariste et compositrice malienne, figure majeure de la musique africaine contemporaine.",
        achievements: [
          "Victoire de la Musique",
          "Collaboration internationale",
          "Directrice artistique du Festival au Désert",
        ],
        songCount: 45,
        candidateSong: "Mali Sadio"
      },
      {
        id: "ma-2",
        name: "Aya Nakamura",
        alias: "La Reine du Pop Urbaine",
        image: "/african-woman-singer-portrait-glamour.jpg",
        bio: "Chanteuse franco-malienne, artiste francophone la plus écoutée au monde.",
        achievements: ["Album de diamant", "NRJ Music Award", "Artiste francophone #1 mondial"],
        songCount: 32,
        candidateSong: "Djadja"
      },
    ],
    special: false,
    isLeadershipPrize: false,
  },
]
