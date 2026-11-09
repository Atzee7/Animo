export interface AniListTitle {
  romaji: string;
  english?: string | null;
  native?: string | null;
}

export interface AniListCoverImage {
  extraLarge?: string | null;
  large?: string | null;
  medium?: string | null;
  color?: string | null;
}

export interface AniListNextAiringEpisode {
  episode: number;
  airingAt: number;
  timeUntilAiring: number;
}

export interface AniListMedia {
  id: number;
  title: AniListTitle;
  coverImage: AniListCoverImage;
  bannerImage?: string | null;
  format?: string | null;
  status?: string | null;
  seasonYear?: number | null;
  episodes?: number | null;
  averageScore?: number | null;
  genres?: string[] | null;
  description?: string | null;
  nextAiringEpisode?: AniListNextAiringEpisode | null;
  duration?: number | null;
  studios?: {
    nodes: Array<{ name: string }>;
  } | null;
  trailer?: {
    id: string;
    site: string;
    thumbnail: string;
  } | null;
  recommendations?: {
    nodes: Array<{ mediaRecommendation: AniListMedia | null }>;
  } | null;
}

export interface AniListPageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export interface AniListMediaPage {
  pageInfo: AniListPageInfo;
  media: AniListMedia[];
}

export interface AniListAiringSchedule {
  airingAt: number;
  episode: number;
  media: AniListMedia;
}

export interface AniListAiringPage {
  pageInfo: AniListPageInfo;
  airingSchedules: AniListAiringSchedule[];
}

export interface AniListResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}
