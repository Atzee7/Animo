import type { AnimeFormat, AnimeStatus, AnimeSummary } from "@/types/anime";

const statusLabels: Record<AnimeStatus, string> = {
  FINISHED: "Tamat",
  RELEASING: "Ongoing",
  NOT_YET_RELEASED: "Belum rilis",
  CANCELLED: "Dibatalkan",
  HIATUS: "Hiatus",
};

const formatLabels: Record<AnimeFormat, string> = {
  TV: "TV",
  TV_SHORT: "TV Short",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music",
};

export function stripHtml(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatScore(score: number | null | undefined): string {
  if (score == null) return "—";
  return (score / 10).toFixed(1);
}

export function formatStatus(status: AnimeStatus | null | undefined): string {
  return status ? statusLabels[status] : "—";
}

export function formatFormat(format: AnimeFormat | null | undefined): string {
  return format ? formatLabels[format] : "—";
}

export function formatYear(year: number | null | undefined): string {
  return year ? String(year) : "—";
}

export function formatEpisodeCount(count: number | null | undefined): string {
  if (!count) return "? eps";
  return `${count} eps`;
}

export function formatCardMeta(anime: AnimeSummary): string {
  const year = anime.seasonYear ? String(anime.seasonYear) : "—";

  if (anime.status === "RELEASING") {
    return `${year}, ongoing`;
  }

  if (anime.episodes) {
    return `${year}, ${anime.episodes} episodes`;
  }

  return `${year}, ${formatFormat(anime.format).toLowerCase()}`;
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }

  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}
