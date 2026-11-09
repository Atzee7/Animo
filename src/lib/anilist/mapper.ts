import type {
  AnimeDetail,
  AnimeFormat,
  AnimeStatus,
  AnimeSummary,
} from "@/types/anime";
import { stripHtml } from "@/lib/utils/format";
import type { AniListMedia } from "./types";

function mapFormat(format: string | null | undefined): AnimeFormat | null {
  return (format as AnimeFormat | null | undefined) ?? null;
}

function mapStatus(status: string | null | undefined): AnimeStatus | null {
  return (status as AnimeStatus | null | undefined) ?? null;
}

export function mapMedia(media: AniListMedia): AnimeSummary {
  return {
    id: media.id,
    title: media.title.english ?? media.title.romaji,
    titleEnglish: media.title.english ?? null,
    titleNative: media.title.native ?? null,
    coverImage:
      media.coverImage.extraLarge ?? media.coverImage.large ?? "",
    bannerImage: media.bannerImage ?? null,
    format: mapFormat(media.format),
    status: mapStatus(media.status),
    seasonYear: media.seasonYear ?? null,
    episodes: media.episodes ?? null,
    averageScore: media.averageScore ?? null,
    genres: media.genres ?? [],
    description: stripHtml(media.description) || null,
    nextAiringEpisode: media.nextAiringEpisode ?? null,
  };
}

export function mapMediaDetail(media: AniListMedia): AnimeDetail {
  const recommendations = (media.recommendations?.nodes ?? [])
    .map((node) => node.mediaRecommendation)
    .filter((item): item is AniListMedia => Boolean(item))
    .map(mapMedia);

  return {
    ...mapMedia(media),
    duration: media.duration ?? null,
    studios: media.studios?.nodes.map((studio) => studio.name) ?? [],
    trailer: media.trailer ?? null,
    recommendations,
  };
}
