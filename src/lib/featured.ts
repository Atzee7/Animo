import type { AnimeSummary } from "@/types/anime";
import type { HistoryEntry } from "@/types/watch";

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
      id: 97940,
      title: "BLACK CLOVER SEASON 2",
      titleEnglish: "Black Clover Season 2",
      titleNative: "ブラッククローバー 第2シーズン",
      coverImage: "/images/black-clover-poster.jpg",
      bannerImage: "/images/hero-black-clover-hd.jpg",
      format: "TV",
      status: "RELEASING",
      seasonYear: 2026,
      episodes: 6,
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
      id: 154587,
      title: "FRIEREN: BEYOND JOURNEY'S END",
      titleEnglish: "Frieren: Beyond Journey's End",
      titleNative: "葬送のフリーレン",
      coverImage: "/images/frieren-poster.jpg",
      bannerImage: "/images/hero-frieren-hd.jpg",
      format: "TV",
      status: "FINISHED",
      seasonYear: 2023,
      episodes: 28,
      averageScore: 91,
      genres: ["Adventure", "Drama", "Fantasy"],
      description:
        "After the party of heroes defeated the Demon King, the elven mage Frieren begins a journey to understand the fleeting lives of the humans she once travelled with.",
      nextAiringEpisode: null,
    },
    episode: 12,
    badges: ["Tamat", "Top Rated"],
    imagePosition: "62% 50%",
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

/**
 * Sample continue-watching cards so the first visit matches the FigCraft
 * composition. Real localStorage history takes over as soon as it exists.
 */
export const demoContinueWatching: HistoryEntry[] = [
  {
    animeId: 154587,
    title: "Frieren: Beyond Journey's End",
    coverImage: "/images/continue/frieren.jpg",
    episodeNumber: 6,
    episodeUid: null,
    animeParadiseId: null,
    progressSeconds: 754,
    durationSeconds: 1440,
    updatedAt: 4,
  },
  {
    animeId: 161645,
    title: "The Apothecary Diaries",
    coverImage: "/images/continue/apothecary.jpg",
    episodeNumber: 18,
    episodeUid: null,
    animeParadiseId: null,
    progressSeconds: 492,
    durationSeconds: 1440,
    updatedAt: 3,
  },
  {
    animeId: 21,
    title: "One Piece",
    coverImage: "/images/continue/one-piece.jpg",
    episodeNumber: 1132,
    episodeUid: null,
    animeParadiseId: null,
    progressSeconds: 845,
    durationSeconds: 1440,
    updatedAt: 2,
  },
  {
    animeId: 97940,
    title: "Black Clover Season 2",
    coverImage: "/images/continue/black-clover.jpg",
    episodeNumber: 4,
    episodeUid: null,
    animeParadiseId: null,
    progressSeconds: 200,
    durationSeconds: 1440,
    updatedAt: 1,
  },
];
