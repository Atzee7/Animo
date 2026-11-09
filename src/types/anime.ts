export type AnimeFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC";

export type AnimeStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export type AnimeSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export interface NextAiringEpisode {
  episode: number;
  airingAt: number;
  timeUntilAiring: number;
}

export interface AnimeSummary {
  id: number;
  title: string;
  titleEnglish: string | null;
  titleNative: string | null;
  coverImage: string;
  bannerImage: string | null;
  format: AnimeFormat | null;
  status: AnimeStatus | null;
  seasonYear: number | null;
  episodes: number | null;
  averageScore: number | null;
  genres: string[];
  description: string | null;
  nextAiringEpisode: NextAiringEpisode | null;
}

export interface AnimeDetail extends AnimeSummary {
  duration: number | null;
  studios: string[];
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
  } | null;
  recommendations: AnimeSummary[];
}

export interface AiringEpisode {
  anime: AnimeSummary;
  episode: number;
  airingAt: number;
}
