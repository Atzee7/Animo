import "server-only";

import { animeParadiseOverrides } from "./overrides";
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

export interface AnimeParadiseMatchInput {
  id: number;
  title: string;
  titleEnglish?: string | null;
  titleNative?: string | null;
  seasonYear?: number | null;
  episodes?: number | null;
}

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(?:season|part|cour)\s*\d+\b/g, " ")
    .replace(/\b\d+(?:st|nd|rd|th)\s+season\b/g, " ")
    .replace(/\bs\d+\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripSeasonSuffix(value: string): string {
  return value
    .replace(/\b(?:season|part|cour)\s*\d+\b/gi, "")
    .replace(/\b\d+(?:st|nd|rd|th)\s+season\b/gi, "")
    .replace(/\bs\d+\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildTitleCandidates(
  titles: Array<string | null | undefined>,
): string[] {
  const candidates = new Set<string>();

  for (const raw of titles) {
    const title = raw?.trim();
    if (!title) continue;

    candidates.add(title);
    const base = stripSeasonSuffix(title);
    if (base && base !== title) candidates.add(base);
  }

  return [...candidates].slice(0, 5);
}

function candidateTitles(candidate: AnimeParadiseAnime): string[] {
  return [
    candidate.title,
    candidate.alternativeTitle?.english,
    candidate.alternativeTitle?.romaji,
    candidate.alternativeTitle?.native,
  ].filter((title): title is string => Boolean(title));
}

function scoreCandidate(
  candidate: AnimeParadiseAnime,
  titles: string[],
  year?: number | null,
  episodes?: number | null,
): number {
  const normalizedInputs = titles
    .map(normalizeTitle)
    .filter((title): title is string => Boolean(title));
  const normalizedCandidateTitles = candidateTitles(candidate)
    .map(normalizeTitle)
    .filter((title): title is string => Boolean(title));

  let titleScore = 0;

  for (const candidateTitle of normalizedCandidateTitles) {
    for (const input of normalizedInputs) {
      if (candidateTitle === input) {
        titleScore = Math.max(titleScore, 12);
      } else if (candidateTitle.startsWith(input)) {
        titleScore = Math.max(titleScore, 8);
      } else if (candidateTitle.includes(input)) {
        titleScore = Math.max(titleScore, 6);
      }
    }
  }

  let score = titleScore;

  if (year && candidate.animeSeason?.year === year) score += 3;
  if (year && candidate.startDate?.startsWith(String(year))) score += 1;

  const candidateEpisodes = candidate.episodeCount ?? candidate.episodes;
  if (episodes && candidateEpisodes === episodes) score += 2;

  return score;
}

function rankCandidates(
  candidates: AnimeParadiseAnime[],
  titles: string[],
  year?: number | null,
  episodes?: number | null,
) {
  return candidates
    .map((candidate) => ({
      candidate,
      score: scoreCandidate(candidate, titles, year, episodes),
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * AniList and AnimeParadise use different IDs. This resolves the best match
 * using manual overrides first, then title variants + year + episode count.
 */
export async function resolveAnimeParadiseMatch(
  anime: AnimeParadiseMatchInput,
): Promise<AnimeParadiseAnime | null> {
  const overrideId = animeParadiseOverrides[anime.id];
  if (overrideId) {
    return { _id: overrideId, title: anime.title };
  }

  const titles = buildTitleCandidates([
    anime.title,
    anime.titleEnglish,
    anime.titleNative,
  ]);

  if (titles.length === 0) return null;

  const found = new Map<string, AnimeParadiseAnime>();
  let ranked: Array<{ candidate: AnimeParadiseAnime; score: number }> = [];

  for (const query of titles) {
    const results = await searchAnimeParadise(query).catch(() => []);

    for (const candidate of results) {
      found.set(candidate._id, candidate);
    }

    ranked = rankCandidates(
      [...found.values()],
      titles,
      anime.seasonYear,
      anime.episodes,
    );

    if (ranked[0] && ranked[0].score >= 12) break;
  }

  const best = ranked[0];
  if (best && best.score >= 5) return best.candidate;

  if (found.size === 1) {
    return [...found.values()][0];
  }

  return null;
}
