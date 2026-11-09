"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/use-history";
import { resolveEpisodeStream } from "@/lib/animeparadise/browser";
import type { EpisodeStream, EpisodeSummary } from "@/types/watch";
import { EpisodeList } from "./episode-list";
import { EpisodeNav } from "./episode-nav";
import { VideoPlayer } from "./video-player";

interface WatchViewProps {
  animeId: number;
  animeTitle: string;
  coverImage: string | null;
  episodeNumber: number;
  episodeTitle: string | null;
  episodes: EpisodeSummary[];
  origin: string;
  uid: string;
}

export function WatchView({
  animeId,
  animeTitle,
  coverImage,
  episodeNumber,
  episodeTitle,
  episodes,
  origin,
  uid,
}: WatchViewProps) {
  const router = useRouter();
  const { upsertHistory } = useHistory();
  const lastSavedRef = useRef(0);
  const [stream, setStream] = useState<EpisodeStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    lastSavedRef.current = 0;
  }, [uid]);

  const handleProgress = useCallback(
    (currentTime: number, duration: number) => {
      const now = Date.now();
      if (now - lastSavedRef.current < 5000) return;

      lastSavedRef.current = now;
      upsertHistory({
        animeId,
        title: animeTitle,
        coverImage: coverImage ?? "",
        episodeNumber,
        episodeUid: uid,
        animeParadiseId: origin,
        progressSeconds: Math.floor(currentTime),
        durationSeconds: Math.floor(duration),
        updatedAt: now,
      });
    },
    [
      animeId,
      animeTitle,
      coverImage,
      episodeNumber,
      uid,
      origin,
      upsertHistory,
    ],
  );

  useEffect(() => {
    let cancelled = false;
    setStream(null);
    setError(null);

    resolveEpisodeStream(uid, origin)
      .then((value) => {
        if (!cancelled) setStream(value);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Gagal memuat stream episode.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [uid, origin, retryToken]);

  const currentIndex = episodes.findIndex(
    (episode) => episode.number === episodeNumber,
  );
  const prevEpisode =
    currentIndex > 0 ? episodes[currentIndex - 1]?.number ?? null : null;
  const nextEpisode =
    currentIndex >= 0 && currentIndex < episodes.length - 1
      ? episodes[currentIndex + 1]?.number ?? null
      : null;

  const handleEnded = () => {
    if (nextEpisode) {
      router.push(`/watch/${animeId}/${nextEpisode}`);
    }
  };

  return (
    <div className="container-page py-6">
      <Link
        href={`/anime/${animeId}?episode=${episodeNumber}`}
        className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-muted transition-colors hover:text-brand"
      >
        <ChevronLeft className="size-3.5" aria-hidden />
        Kembali ke detail anime
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <VideoPlayer
            src={stream?.hlsUrl ?? null}
            poster={coverImage}
            subtitles={stream?.subtitles}
            errorMessage={error}
            autoPlay
            onEnded={handleEnded}
            onProgress={handleProgress}
          />

          {error ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-card border border-coral/30 bg-coral/10 px-4 py-3">
              <p className="text-sm text-coral">{error}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRetryToken((value) => value + 1)}
              >
                <RotateCcw className="size-3.5" aria-hidden />
                Coba lagi
              </Button>
            </div>
          ) : null}

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Episode {episodeNumber}
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
              {episodeTitle || `Episode ${episodeNumber}`}
            </h1>
            <p className="mt-1 text-sm text-muted">{animeTitle}</p>
          </div>

          <div className="mt-6">
            <EpisodeNav
              animeId={animeId}
              prevEpisode={prevEpisode}
              nextEpisode={nextEpisode}
            />
          </div>
        </div>

        <aside className="rounded-card border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold">Daftar episode</h2>
            <span className="text-[11px] text-muted">
              {episodes.length} episode
            </span>
          </div>
          <div className="mt-4 max-h-[620px] overflow-y-auto pr-1">
            <EpisodeList
              animeId={animeId}
              episodes={episodes}
              currentEpisode={episodeNumber}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
