"use client";

import Image from "next/image";
import Link from "next/link";
import { useHistory } from "@/hooks/use-history";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatDuration } from "@/lib/utils/format";
import type { HistoryEntry } from "@/types/watch";

interface ContinueWatchingRailProps {
  fallback?: HistoryEntry[];
}

export function ContinueWatchingRail({
  fallback = [],
}: ContinueWatchingRailProps) {
  const { history } = useHistory();
  const entries = (history.length > 0 ? history : fallback).slice(0, 4);

  if (entries.length === 0) return null;

  return (
    <section>
      <SectionHeading
        title="Lanjutkan Menonton"
        href="/history"
        linkLabel="Riwayat"
      />
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-6">
        {entries.map((entry) => {
          const percent =
            entry.durationSeconds > 0
              ? Math.min(
                  100,
                  Math.round(
                    (entry.progressSeconds / entry.durationSeconds) * 100,
                  ),
                )
              : 0;

          return (
            <Link
              key={entry.animeId}
              href={`/anime/${entry.animeId}?episode=${entry.episodeNumber}`}
              className="group relative block aspect-video w-[260px] shrink-0 snap-start overflow-hidden rounded-card bg-surface-raised sm:w-auto"
            >
              {entry.coverImage ? (
                <Image
                  src={entry.coverImage}
                  alt={entry.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 318px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : null}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

              <span className="absolute left-2.5 top-2.5 rounded bg-brand px-2 py-1 text-[10px] font-semibold leading-none text-brand-ink">
                Ep {entry.episodeNumber}
              </span>

              <div className="absolute inset-x-3 bottom-[18px]">
                <h3 className="line-clamp-1 text-[13px] font-semibold text-white">
                  {entry.title}
                </h3>
                <p className="mt-1 text-[10px] text-soft">
                  {formatDuration(entry.progressSeconds)} /{" "}
                  {formatDuration(entry.durationSeconds)}
                </p>
                <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/25">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
