import "server-only";

import type {
  AnimeParadiseAnime,
  AnimeParadiseEpisode,
  AnimeParadiseEpisodeListResponse,
  AnimeParadiseResponse,
  AnimeParadiseSearchResponse,
} from "./types";

const AP_API = "https://api.animeparadise.moe";

export class AnimeParadiseError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "AnimeParadiseError";
  }
}

async function request<T>(
  path: string,
  revalidate: number,
): Promise<T> {
  const response = await fetch(`${AP_API}${path}`, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate },
  });

  if (!response.ok) {
    throw new AnimeParadiseError(
      `AnimeParadise request failed with HTTP ${response.status}`,
      response.status,
    );
  }

  const payload = (await response.json()) as AnimeParadiseResponse<T>;

  if (!payload.success) {
    throw new AnimeParadiseError(
      payload.error || "AnimeParadise returned an error",
      response.status,
    );
  }

  return payload.data;
}

export async function searchAnimeParadise(
  query: string,
): Promise<AnimeParadiseAnime[]> {
  const term = query.trim();
  if (!term) return [];

  const data = await request<AnimeParadiseSearchResponse["data"]>(
    `/search?q=${encodeURIComponent(term)}`,
    3600,
  );

  return Array.isArray(data) ? data : [];
}

export async function getAnimeParadiseEpisodes(
  animeId: string,
): Promise<AnimeParadiseEpisode[]> {
  const data = await request<AnimeParadiseEpisodeListResponse["data"]>(
    `/anime/${encodeURIComponent(animeId)}/episode`,
    300,
  );

  return Array.isArray(data) ? data : [];
}

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(season|part|cour)\s*\d+\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreCandidate(
  candidate: AnimeParadiseAnime,
  title: string,
  year?: number | null,
): number {
  const normalizedTitle = normalizeTitle(title);
  const normalizedCandidate = normalizeTitle(candidate.title);
  const alternative = normalizeTitle(
    candidate.alternativeTitle?.english ??
      candidate.alternativeTitle?.romaji ??
      "",
  );

  let score = 0;

  if (normalizedCandidate === normalizedTitle) score += 10;
  else if (normalizedCandidate.startsWith(normalizedTitle)) score += 7;
  else if (normalizedCandidate.includes(normalizedTitle)) score += 5;
  else if (alternative === normalizedTitle) score += 9;
  else if (alternative.includes(normalizedTitle)) score += 4;

  if (year && candidate.animeSeason?.year === year) score += 3;
  if (candidate.startDate?.startsWith(String(year))) score += 1;

  return score;
}

/**
 * AniList and AnimeParadise use different IDs. This resolves the best
 * AnimeParadise match from the AniList title (and optional year).
 */
export async function resolveAnimeParadiseMatch(
  title: string,
  year?: number | null,
): Promise<AnimeParadiseAnime | null> {
  const results = await searchAnimeParadise(title);
  if (results.length === 0) return null;

  const ranked = results
    .map((candidate) => ({
      candidate,
      score: scoreCandidate(candidate, title, year),
    }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.candidate ?? results[0];
}
