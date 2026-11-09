import "server-only";

import type {
  AnimeDetail,
  AnimeSeason,
  AnimeSummary,
  AiringEpisode,
} from "@/types/anime";
import type { Paginated } from "@/types/api";
import {
  ANIME_DETAIL_QUERY,
  BROWSE_ANIME_QUERY,
  POPULAR_ANIME_QUERY,
  RECENT_EPISODES_QUERY,
  SEARCH_ANIME_QUERY,
  TOP_AIRING_QUERY,
  TRENDING_ANIME_QUERY,
} from "./queries";
import { mapMedia, mapMediaDetail } from "./mapper";
import type {
  AniListAiringPage,
  AniListMedia,
  AniListMediaPage,
  AniListResponse,
} from "./types";

const ANILIST_ENDPOINT = "https://graphql.anilist.co";

export class AniListError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "AniListError";
  }
}

async function request<T>(
  query: string,
  variables: Record<string, unknown>,
  revalidate: number,
): Promise<T> {
  const response = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!response.ok) {
    throw new AniListError(
      `AniList request failed with HTTP ${response.status}`,
      response.status,
    );
  }

  const payload = (await response.json()) as AniListResponse<T>;

  if (payload.errors?.length) {
    throw new AniListError(payload.errors[0].message, response.status);
  }

  if (!payload.data) {
    throw new AniListError("AniList returned an empty response");
  }

  return payload.data;
}

export async function getTrendingAnime(perPage = 20): Promise<AnimeSummary[]> {
  const data = await request<{ Page: AniListMediaPage }>(
    TRENDING_ANIME_QUERY,
    { perPage },
    1800,
  );

  return data.Page.media.map(mapMedia);
}

export async function getTopAiring(perPage = 20): Promise<AnimeSummary[]> {
  const data = await request<{ Page: AniListMediaPage }>(
    TOP_AIRING_QUERY,
    { perPage },
    1800,
  );

  return data.Page.media.map(mapMedia);
}

export async function getPopularAnime(perPage = 20): Promise<AnimeSummary[]> {
  const data = await request<{ Page: AniListMediaPage }>(
    POPULAR_ANIME_QUERY,
    { perPage },
    3600,
  );

  return data.Page.media.map(mapMedia);
}

export async function getRecentEpisodes(perPage = 20): Promise<AiringEpisode[]> {
  const data = await request<{ Page: AniListAiringPage }>(
    RECENT_EPISODES_QUERY,
    { now: Math.floor(Date.now() / 1000), perPage },
    60,
  );

  return data.Page.airingSchedules.map((schedule) => ({
    anime: mapMedia(schedule.media),
    episode: schedule.episode,
    airingAt: schedule.airingAt,
  }));
}

export async function searchAnime(
  search: string,
  perPage = 8,
): Promise<AnimeSummary[]> {
  const term = search.trim();
  if (!term) return [];

  const data = await request<{ Page: AniListMediaPage }>(
    SEARCH_ANIME_QUERY,
    { search: term, perPage },
    300,
  );

  return data.Page.media.map(mapMedia);
}

export async function getAnimeDetail(id: number): Promise<AnimeDetail | null> {
  const data = await request<{ Media: AniListMedia | null }>(
    ANIME_DETAIL_QUERY,
    { id },
    3600,
  );

  return data.Media ? mapMediaDetail(data.Media) : null;
}

export interface BrowseAnimeParams {
  page?: number;
  perPage?: number;
  search?: string | null;
  genre?: string | null;
  season?: AnimeSeason | null;
  seasonYear?: number | null;
  format?: string | null;
  status?: string | null;
  sort?: string[];
}

export async function getBrowseAnime(
  params: BrowseAnimeParams = {},
): Promise<Paginated<AnimeSummary>> {
  const data = await request<{ Page: AniListMediaPage }>(
    BROWSE_ANIME_QUERY,
    {
      page: params.page ?? 1,
      perPage: params.perPage ?? 24,
      search: params.search ?? null,
      genre: params.genre ?? null,
      season: params.season ?? null,
      seasonYear: params.seasonYear ?? null,
      format: params.format ?? null,
      status: params.status ?? null,
      sort: params.sort ?? ["POPULARITY_DESC"],
    },
    900,
  );

  return {
    items: data.Page.media.map(mapMedia),
    page: data.Page.pageInfo.currentPage,
    total: data.Page.pageInfo.total,
    hasNextPage: data.Page.pageInfo.hasNextPage,
  };
}
