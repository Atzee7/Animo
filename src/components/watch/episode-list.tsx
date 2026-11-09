import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { EpisodeSummary } from "@/types/watch";

interface EpisodeListProps {
  animeId: number;
  episodes: EpisodeSummary[];
  currentEpisode: number;
}

export function EpisodeList({
  animeId,
  episodes,
  currentEpisode,
}: EpisodeListProps) {
  if (episodes.length === 0) {
    return (
      <p className="text-sm text-muted">Daftar episode belum tersedia.</p>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
      {episodes.map((episode) => {
        const active = episode.number === currentEpisode;

        return (
          <Link
            key={episode.uid}
            href={`/watch/${animeId}/${episode.number}`}
            aria-current={active ? "page" : undefined}
            title={episode.title}
            className={cn(
              "flex h-10 items-center justify-center rounded border text-sm font-semibold transition-colors",
              active
                ? "border-brand bg-brand text-brand-ink"
                : "border-border bg-surface text-muted hover:border-muted/60 hover:text-foreground",
            )}
          >
            {episode.number}
          </Link>
        );
      })}
    </div>
  );
}
