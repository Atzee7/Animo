import type { AnimeSummary } from "@/types/anime";

export interface FeaturedItem {
  anime: AnimeSummary;
  episode: number;
  badges: string[];
  /** CSS object-position for the banner crop (mobile shows a narrow slice). */
  imagePosition?: string;
}

export const featuredItems: FeaturedItem[] = [
  {
    anime: {
      id: 195604,
      title: "BLACK CLOVER SEASON 2",
      titleEnglish: "Black Clover Season 2",
      titleNative: "ブラッククローバー 第2シーズン",
      coverImage: "/images/black-clover-poster.jpg",
      bannerImage: "/images/hero-black-clover-hd.jpg",
      format: "TV",
      status: "RELEASING",
      seasonYear: 2026,
      episodes: 26,
      averageScore: 87,
      genres: ["Action", "Adventure", "Comedy", "Fantasy"],
      description:
        "As tyranny engulfs the Clover Kingdom, Asta and the Magic Knights launch a desperate raid on the Spade Kingdom to rescue their squad captains from the Dark Triad.",
      nextAiringEpisode: null,
    },
    episode: 6,
    badges: ["Airing", "Top Airing"],
  },
  {
    anime: {
      id: 182255,
      title: "FRIEREN: BEYOND JOURNEY'S END SEASON 2",
      titleEnglish: "Frieren: Beyond Journey's End Season 2",
      titleNative: "葬送のフリーレン 第2期",
      coverImage: "/images/frieren-s2-poster.jpg",
      bannerImage: "/images/hero-frieren-s2-hd.jpg",
      format: "TV",
      status: "FINISHED",
      seasonYear: 2026,
      episodes: 10,
      averageScore: 87,
      genres: ["Adventure", "Drama", "Fantasy"],
      description:
        "After the First-Class Mage Exam, Frieren, Stark, and Fern press on into the dangerous Northern Plateau on their way to Aureole, where new adversaries force the party to confront who they have become.",
      nextAiringEpisode: null,
    },
    episode: 10,
    badges: ["Tamat", "Top Rated"],
  },
  {
    anime: {
      id: 21,
      title: "ONE PIECE",
      titleEnglish: "One Piece",
      titleNative: "ONE PIECE",
      coverImage: "/images/one-piece-poster.jpg",
      bannerImage: "/images/hero-one-piece-hd.jpg",
      format: "TV",
      status: "RELEASING",
      seasonYear: 1999,
      episodes: null,
      averageScore: 87,
      genres: ["Action", "Adventure", "Comedy", "Fantasy"],
      description:
        "Monkey D. Luffy and his crew sail the Grand Line in search of the legendary One Piece, chasing the title of Pirate King across a world of pirates and marines.",
      nextAiringEpisode: null,
    },
    episode: 1132,
    badges: ["Airing", "Top Airing"],
  },
];

export const featuredAnime = featuredItems[0].anime;

