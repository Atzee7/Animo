import type { EpisodeStream, EpisodeSummary } from "@/types/watch";
import { parseEpisodeNumber } from "@/lib/utils/episode";
import type {
  AnimeParadiseEpisode,
  AnimeParadiseStreamData,
  AnimeParadiseSubtitle,
} from "./types";

const STREAM_BASE = "https://stream.animeparadise.moe/m3u8";

const languageByLabel: Record<string, string> = {
  english: "en",
  indonesian: "id",
  italian: "it",
  portuguese: "pt",
  spanish: "es",
  french: "fr",
  german: "de",
  japanese: "ja",
};

function subtitleLanguage(label: string): string {
  return languageByLabel[label.toLowerCase()] ?? label.slice(0, 2).toLowerCase();
}

export function buildHlsUrl(streamLink: string): string {
  return `${STREAM_BASE}?url=${encodeURIComponent(streamLink)}`;
}

export function mapAnimeParadiseEpisode(
  episode: AnimeParadiseEpisode,
): EpisodeSummary {
  return {
    uid: episode.uid,
    number: parseEpisodeNumber(episode.number),
    title: episode.title,
    image: episode.image || null,
  };
}

function mapSubtitles(
  subtitles: AnimeParadiseSubtitle[] | undefined,
): EpisodeStream["subtitles"] {
  return (subtitles ?? [])
    .filter((subtitle) => subtitle.type === "vtt")
    .map((subtitle, index) => ({
      label: subtitle.label,
      src: subtitle.src,
      lang: subtitleLanguage(subtitle.label),
      default: index === 0,
    }));
}

export function mapAnimeParadiseStream(
  data: AnimeParadiseStreamData,
): EpisodeStream {
  const episode = data.episode;

  if (!episode.streamLink) {
    throw new Error("Episode ini tidak memiliki tautan stream.");
  }

  const intro = episode.skipData?.intro;
  const outro = episode.skipData?.outro;

  return {
    hlsUrl: buildHlsUrl(episode.streamLink),
    subtitles: mapSubtitles(episode.subData),
    intro:
      intro && intro.end > intro.start
        ? { start: intro.start, end: intro.end }
        : null,
    outro:
      outro && outro.end > outro.start
        ? { start: outro.start, end: outro.end }
        : null,
  };
}
