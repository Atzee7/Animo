export interface AnimeParadiseSubtitle {
  src: string;
  label: string;
  type: "ass" | "vtt" | string;
}

export interface AnimeParadiseSkipData {
  intro?: {
    start: number;
    end: number;
  };
  outro?: {
    start: number;
    end: number;
  };
}

export interface AnimeParadiseEpisode {
  _id: string;
  image: string;
  title: string;
  uid: string;
  number: string;
  origin: string;
  views?: number;
  subData?: AnimeParadiseSubtitle[];
  summary?: string;
  streamLink?: string;
  thumbnail?: string;
  skipData?: AnimeParadiseSkipData;
}

export interface AnimeParadiseAnime {
  _id: string;
  title: string;
  link?: string;
  episodes?: number;
  episodeCount?: number;
  rate?: string;
  genres?: string[];
  ageRating?: string;
  animeSeason?: {
    season: string;
    year: number;
  };
  posterImage?: {
    large?: string;
    medium?: string;
    small?: string;
    original?: string;
  };
  coverImage?: {
    large?: string;
    small?: string;
    original?: string;
  };
  startDate?: string;
  alternativeTitle?: {
    english?: string;
    native?: string;
    romaji?: string;
  };
}

export interface AnimeParadisePagination {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export interface AnimeParadiseResponse<T> {
  success: boolean;
  error?: string | null;
  data: T;
  pagination?: AnimeParadisePagination;
}

export interface AnimeParadiseStreamData {
  episode: AnimeParadiseEpisode;
  episodeList: AnimeParadiseEpisode[];
  animeData: AnimeParadiseAnime;
}

export type AnimeParadiseSearchResponse = AnimeParadiseResponse<
  AnimeParadiseAnime[]
>;

export type AnimeParadiseEpisodeListResponse = AnimeParadiseResponse<
  AnimeParadiseEpisode[]
>;

export type AnimeParadiseStreamResponse =
  AnimeParadiseResponse<AnimeParadiseStreamData>;
