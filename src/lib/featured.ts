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

