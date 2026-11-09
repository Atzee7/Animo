import type { AnimeFormat } from "./anime";

export interface FavoriteEntry {
  animeId: number;
  title: string;
  coverImage: string;
  format: AnimeFormat | null;
  averageScore: number | null;
  seasonYear: number | null;
  addedAt: number;
}

export interface HistoryEntry {
  animeId: number;
  title: string;
  coverImage: string;
  episodeNumber: number;
  episodeUid: string | null;
  animeParadiseId: string | null;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: number;
}

export interface EpisodeSummary {
  uid: string;
  number: number;
  title: string;
  image: string | null;
}

export interface SubtitleTrack {
  label: string;
  src: string;
  lang: string;
  default?: boolean;
}

export interface EpisodeStream {
  hlsUrl: string;
  subtitles: SubtitleTrack[];
  intro: {
    start: number;
    end: number;
  } | null;
  outro: {
    start: number;
    end: number;
  } | null;
}
